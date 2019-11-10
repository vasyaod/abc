"use strict";

/**
 * (C) Vasilii Vazhesov (vasiliy.vazhesov@gmail.com)
 */
import React from 'react'
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import {todoApp} from './reducers.js';
import Page from './components/Page.jsx'

import { loadData, loadDataFromStorage, detectCountry, changeDownloadingStatus} from './actions.js'

const store = createStore(todoApp, applyMiddleware(thunkMiddleware))

const render = () =>
  ReactDOM.render(
    <Provider store={store}>
      <Page />
    </Provider>,
    document.getElementById('app')
  )
render()
store.subscribe(render)

const locationUrl = new URL(document.location.href);

if (locationUrl.searchParams.get("debug")) {

} else {
  const action = locationUrl.searchParams.get("action");

  if (locationUrl.searchParams.get("clean-storage")) {
    chrome.storage.local.clear(() => {
      console.log("Storage has been cleaned")
    })
  }

  store.dispatch(detectCountry())
  store.dispatch(loadDataFromStorage())

  if (action == "load-data") {
    store.dispatch(loadData())
  }

  // Set a hook for "download status" messages.
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type == "download-status") {
        store.dispatch(changeDownloadingStatus(request.percent, request.isError, request.error))
      }
    }
  )
}
