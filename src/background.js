"use strict";

import { List, Set } from 'immutable'

import { getStorage, setStorage } from './async-utils.js'
import { downloadOrders, downloadAllOrderIds }  from './orders-download-utils.js'
import countries, { countryById } from './countries.js'
import * as reducerUtils from './reducer-utils.js'
import * as UUID from 'uuid-js';

function sendDownloadStatus(percent, isError, error) {
  chrome.runtime.sendMessage({
    type: "download-status",
    isError: isError,
    percent: percent,
    error: error
  })
}

chrome.runtime.onInstalled.addListener(function () {
  // chrome.storage.sync.set({ color: '#3aa757' }, function () {
  //   //      new chrome.declarativeContent.ShowPageAction();
  //   console.log("The color is green.");
  // });
});

var createdTabId = -1;
var athorization = false;

function isTabOpened() {
  return createdTabId != -1
}

function openOrActivate(url) {
  if(isTabOpened()) {
    chrome.tabs.update(createdTabId, {
      active: true,
      url: url
    })
  } else {
    chrome.tabs.create({ url: url }, tab => {
      createdTabId = tab.id
    })
  }
}

chrome.browserAction.onClicked.addListener(tab => { 
  openOrActivate("/popup.html")
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(tabId == createdTabId) {
    // read changeInfo data and do something with it (like read the url)
    if (athorization && changeInfo.url && !changeInfo.url.includes("signin") && changeInfo.url.includes("order-history")) {
      athorization = false
      openOrActivate("/popup.html?action=load-data")
    }
  }
})

chrome.tabs.onRemoved.addListener(tabId => {
  if(tabId == createdTabId) {
    createdTabId = -1
  }
})

// chrome.webRequest.onCompleted.addListener(
//   function(details) {
//     const { tabId, requestId, url } = details 
//     console.info("!!!!!!URL :" + url);
//   }, 

//   {
//       urls: [
//           "https://*.amazon.com/*", 
//       ]
//   },
// );

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == "open") {
    (async () => {
      openOrActivate("/popup.html")
    })()
  }

  if (request.type == "download") {
    (async () => {
      console.log("Downloading/refrefing data")
      const storage = await getStorage()

      const country = countryById(storage.countryId)
      const amazonUrl = "https://" + country.url

      const oldOrders = storage && storage.orders && amazonUrl == storage.amazonUrl ? 
        Set(storage.orders) : Set()
      const oldIds = storage && amazonUrl == storage.amazonUrl ? 
        oldOrders.map(order => order.id) : Set()

      try {
        const uuid = storage.uuid ? storage.uuid : UUID.create().toString()

        const ids = await downloadAllOrderIds(amazonUrl, Set(oldIds),  factor => {
          sendDownloadStatus(factor * 25, false)
        })
        const newOrders = await downloadOrders(amazonUrl, ids.subtract(oldIds))
        const orders = newOrders.concat(oldOrders)

        sendDownloadStatus(100, false)

        const date = new Date()
        const fieldName = "month-" + date.getFullYear() + "-" + date.getMonth()
        
        if (storage.collectData) {
          fetch(`https://abc.f-proj.com/stat`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              version: 0,
              uuid: uuid,
              amazonUrl: amazonUrl,
              orders: orders
                .map(order => {
                  return {...order,
                    id: null,          // Remove order id from the list since it is not really privicy
                    orderDate: new Date(order.orderDate).toISOString().slice(0,10)
                  }
                })
                .toArray()
            })
          })
        }

        // Save orders and amount of current month to storage.
        const st = {
          uuid: uuid,
          amazonUrl: amazonUrl,
          refreshDate: Date.now(),
          orders: orders.toArray(),
        }
        st[fieldName] = reducerUtils.currentMonth(
          orders.map(order => {
            return {...order,
              orderDate: new Date(order.orderDate)
            }
          })
        )
        await setStorage(st)

        sendResponse({ type: "orders", orders: orders.toArray() });
      } catch(error) {
        sendDownloadStatus(100, true, error.message)

        if (isTabOpened() && error.message == "Auth error") {
          athorization = true
          openOrActivate(`${amazonUrl}/gp/your-account/order-history`)
        } else {
          console.log("error", error)
        }
      }
    })()
    return true;
  }
})