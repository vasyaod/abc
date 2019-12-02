import { List, Set } from 'immutable'

import countries, { countryById } from '../countries.js'
import { getStorage, setStorage, sendMessage } from '../async-utils.js'
import { download } from './download.js'

const locationUrl = new URL(window.location.href);
const debug = locationUrl.searchParams.get("debug");

export function loadDataFromStorage() {
  return async dispatch => {
    const storage = await getStorage()
    
    if (storage && storage.isMonthLimitEnable) {
      dispatch({
        type: 'VALUES_CHANGED',
        values: {
          isMonthLimitEnable: storage.isMonthLimitEnable,
        }
      })
    }

    if (storage && storage.collectData) {
      dispatch({
        type: 'VALUES_CHANGED',
        values: {
          collectData: storage.collectData,
        }
      })
    }

    if (storage && storage.monthLimitValue) {
      dispatch({
        type: 'VALUES_CHANGED',
        values: {
          monthLimitValue: storage.monthLimitValue === null ? 1000 : storage.monthLimitValue,
        }
      })
    }

    if (storage && storage.orders) {
      dispatch({
        type: 'LOADING_FINISHED',
        refreshDate: new Date(storage.refreshDate),
        items: storage.orders.map(order => {
          return {...order,
            orderDate: new Date(order.orderDate)
          }
        })
      })
    }
  }
}

export function switchMonthLimit(flag) {
  return async dispatch => {
    setStorage({
      isMonthLimitEnable: flag,
    })

    dispatch({
      type: 'VALUES_CHANGED',
      values: {
        isMonthLimitEnable: flag,
      }
    })
  }
}

export function setMonthLimitValue(value) {
  return async dispatch => {
    setStorage({
     monthLimitValue: value,
    })

    dispatch({
      type: 'VALUES_CHANGED',
      values: {
        monthLimitValue: value,
      }
    })
  }
}

export function changeCountry(id) {
  return async dispatch => {
    setStorage({
      countryId: id,
    })

    dispatch({
      type: 'COUNTRY_CHANGED',
      countryId: id,
    })
  }
}

export function changeCollectionData(collectData) {
  return async dispatch => {
    setStorage({
      collectData: collectData,
    })

    dispatch({
      type: 'VALUES_CHANGED',
      values: {
        collectData: collectData,
      }
    })
  }
}

export function detectCountry() {
  return async dispatch => {
    if(!debug) {
      const storage = await getStorage()
      if (storage && storage.countryId) {
        dispatch({
          type: 'COUNTRY_DETECTED',
          countryId: storage.countryId
        })
      } else {
        function fetchWithTimeout(url, options, timeout = 5000) {
          return Promise.race([
              fetch(url, options),
              new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('timeout')), timeout)
              )
          ]);
        }
        
        const makeRequest = async (country) => {
          let res
          try {
            res = await fetchWithTimeout(`https://${country.url}/gp/css/order-history`, {
              method: 'GET'
            })
          } catch {
            return {
              id: country.id,
              isAccepted: true
            }
          }
          if (res.type != "opaqueredirect" && res.url.includes("signin") ) {
            return {
              id: country.id,
              isAccepted: false
            }
          } else {
            return {
              id: country.id,
              isAccepted: true
            }
          }
        }
    
        const resolvedCoutries = await Promise.all(countries.map(c => makeRequest(c)));
        const foundCountry = resolvedCoutries.find(x => x.isAccepted)

        const countryId = foundCountry ? foundCountry.id : "US"
        
        setStorage({
          countryId: countryId,
        })

        dispatch({
          type: 'COUNTRY_DETECTED',
          countryId: countryId
        })
      }
    } else {
      dispatch({
        type: 'COUNTRY_DETECTED',
        countryId: "US"
      })
    }
  }
}

export function changeDownloadingStatus(percent, isLoadingError, error) {
  return async (dispatch) => {
    dispatch({
      type: 'LOADING_CHANGED',
      isLoadingError: isLoadingError,
      loadingError: error,
      percent: percent
    })
  }
}

export function resetState() {
  return async (dispatch) => {
  
    chrome.storage.local.clear(() => {
      console.log("Storage has been cleaned")
    })

    dispatch({
      type: 'STATE_RESETED'
    })

    detectCountry()(dispatch)
  }
}

export function loadData() {
  return async (dispatch) => {
    dispatch({
      type: 'LOADING_STARTED'
    })
    
    const responce = await sendMessage({type: "download"})
    if(responce && responce.type == "orders") {
      
      dispatch({
        type: 'LOADING_FINISHED',
        items: 
          responce.orders.map(order => {
            return {...order,
              orderDate: new Date(order.orderDate)
            }
          }),
        refreshDate: new Date()
      })
    }
  }
}

export function shareFacebook() {
  return async (dispatch) => {
    const title = "Control your budget on Amazon, set limits by https://vasyaod.github.io/abc"
    const url = "https://vasyaod.github.io/abc"; 
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}&t=${title}`
    window.open(facebookShareUrl, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
  }
}

export function shareTwitter() {
  return async (dispatch) => {
    const text = "Control your budget on Amazon, set limits"
    const twitterHandle = "amazon-budget-control"
    const url = "https://vasyaod.github.io/abc"; 
    const twitterShareUrl = `https://twitter.com/share?url=${encodeURI(url)}&via=${twitterHandle}&text=${text}`
    window.open(twitterShareUrl, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
  }
}

export function downloadJson() {
  return async (dispatch) => {
    const storage = await getStorage()
    download(JSON.stringify(storage.orders, null, 2), "orders.json", "application/json" )
  }
}

export function downloadCsv() {
  return async (dispatch) => {
    const storage = await getStorage()
    const str = List(storage.orders)
      .sortBy(e => e.orderDate)
      .reverse()
      .map(order => `${order.id},${new Date(order.orderDate).toJSON().slice(0, 10)},${order.amount}`)
      .reduce((accum, data) => accum + data + "\n", "");
    
    download(str, "orders.csv", "text/plain")
  }
}