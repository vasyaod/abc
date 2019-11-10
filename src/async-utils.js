const locationUrl = new URL(window.location.href);
const debug = locationUrl.searchParams.get("debug");

export function sleep(t) {
   return new Promise((resolve) => setTimeout(resolve, t))
}

export function getStorage() {
  return new Promise(function(resolve, reject) {
    if(!debug) {
      chrome.storage.local.get((result) => {
        resolve(result)
      })
    } else {
      resolve(null)
    }
  })
}

export function setStorage(values) {
  return new Promise(function(resolve, reject) {
    if(!debug) {
      chrome.storage.local.set(values, (result) => {
        resolve(result)
      })
    } else {
      resolve(null)
    }
  })
}

export function sendMessage(values) {
  return new Promise(function(resolve, reject) {
    if(!debug) {
      chrome.runtime.sendMessage(values, function(response) {
        resolve(response)
      });
    } else {
      resolve(null)
    }
  })
}