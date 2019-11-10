import { redispatchEvent } from './event-braker-util.js'
import { sendMessage } from '../async-utils.js'

export function openPlugin() {
  return dispatch => {
    sendMessage({type: "open"})
  }
}

export function openDialog(element, event, limit, spent, countryId) {
  return async dispatch => {
    dispatch({
      type: 'VALUES_CHANGED',
      values: {
        isDialogActive: true,
        element: element,
        lastEvent: event,
        limit: limit,
        spent: spent,
        countryId: countryId
      }
    })
  }
}

export function cancel() {
  return async dispatch => {
    dispatch({
      type: 'VALUES_CHANGED',
      values: {
        isDialogActive: false,
      }
    })
  }
}

export function proceedPurchase() {
  return async (dispatch, getState) => {
    const state = getState()
    redispatchEvent(state.element, state.event)
    dispatch({
      type: 'VALUES_CHANGED',
      values: {
        isDialogActive: false,
      }
    })
  }
}