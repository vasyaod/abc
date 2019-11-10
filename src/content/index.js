"use strict";

/**
 * (C) Vasilii Vazhesov (vasiliy.vazhesov@gmail.com)
 */
import React from 'react'
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import { formatCurrency } from '../countries.js'
import { getStorage, sendMessage, sleep } from '../async-utils.js'
import { isEventAccept } from './event-braker-util.js'

import reducer from './reducers.js'
import {openDialog} from './actions.js'

import App from './components/App.jsx'

var appContainer = document.createElement('div');
document.body.appendChild(appContainer);

const store = createStore(reducer, applyMiddleware(thunkMiddleware))

const render = () =>
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    appContainer
  )
render()
store.subscribe(render)

async function init() {
  const storage = await getStorage() 
  const date = new Date()
  const fieldName = "month-" + date.getFullYear() + "-" + date.getMonth()

  const buttonDiv = document.querySelector("#addToCart_feature_div")
  if (buttonDiv) {
    var budgetContainer = document.createElement('div');
    budgetContainer.innerHTML = `
      <div class="a-section a-spacing-medium a-spacing-top-small">
        <ul class="a-unordered-list a-vertical a-spacing-none">  
          <li>
            ${formatCurrency(storage.countryId, storage[fieldName])} were spent this month
          </li>
        </ul>
      <div>
    `
    buttonDiv.parentNode.insertBefore(budgetContainer, buttonDiv.nextSibling)
  }

  // If we are on some particular page we need to 
  // update order information. It is important since after
  // payment accomplishing orders infomation should be refreshed
  const url = new URL(window.location.href);
  
  // When a user comes to one of those pages we should refresh data.
  const obligatoryForRefreshPages = ["thankyou"]
  if (obligatoryForRefreshPages.find(page => url.pathname.includes(page))) {
    sendMessage({type: "download"})
  }

  // If we have old data (great then 1 day), we need to refresh them.
  if (Date.now() - storage.refreshDate > 1000 * 3600 * 24) {
    sendMessage({type: "download"})
  }

  // Set listeners on most usable buttons
  const monthLimitValue = parseInt(storage.monthLimitValue)
  const monthValue = parseInt(storage[fieldName])
  // console.log("!", storage.isMonthLimitEnable, monthLimitValue, monthValue ,storage.monthLimitValue < storage[fieldName])
  if (storage.isMonthLimitEnable && monthLimitValue < monthValue) {
    [
      "#turbo-checkout-pyo-button", 
      "#add-to-cart-button", 
      "#hlb-ptc-btn-native",
      "input[name=proceedToCheckout]"
    ].map (selector => {
      const element = $(selector)
      if (element) {
        $(element).click(function (event) {
          if(!isEventAccept()) {
            event.preventDefault()
            event.stopPropagation()
            store.dispatch(openDialog(
              element, 
              event, 
              storage.monthLimitValue,
              storage[fieldName]),
              storage.countryId,
            )
            return false;
          } else {
            return true;
          }
        })
      }
    })
  }
}

init()