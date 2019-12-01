import { List } from 'immutable'
import * as u from '../reducer-utils.js'

import countries, { countryById } from '../countries.js'

const initialState = {
  collectData: false,
  isCountryCheck: true,
  isDataLoaded: false,
  loadingStatus: null,
  isLoadingError: false,
  redirectUrl: null,
  countryId: null,
  country: null,
  orders: [],
  summary: {
    currentMonth: 0,
    previousMonth: 0,
    currentYear: 0,
    previousYear: 0,
    total: 0
  },
  monthlyDataChartDatasets : [],

  isMonthLimitSet: false,
  monthLimit: 100
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function monthByIndex(index) {
  if (index < 0) {
    index = 12 + index
  }
  return monthNames[index]
}

export function todoApp(state = initialState, action) {
  switch (action.type) {

    case 'STATE_RESETED':
      return initialState

    case 'VALUES_CHANGED':
      return Object.assign({}, state, action.values)

    case 'COUNTRY_DETECTED':
      return {...state,
        countryId: action.countryId,
        isCountryCheck: false,
        country: countryById(action.countryId)
      }

    case 'COUNTRY_CHANGED':
      return {...state,
        countryId: action.countryId,
        country: countryById(action.countryId)
      }

    case 'DATA_COLLECT_FLAG_CHANGED':
      return {...state,
        collectData: action.collectData,
      }

    case 'REDIRECT_TO_SIGNIN':
      return {...state,
        redirectUrl: action.url,
        loadingStatus: null
      }

    case 'LOADING_STARTED':
      return {...state,
        loadingStatus: {
          text: "Downloading data. It can take some time.",
          percent: 0,
          isLoadingError: false
        }
      }

    case 'LOADING_CHANGED':
      return {...state,
        loadingStatus: state.loadingStatus && !action.isLoadingError ? {...state.loadingStatus, percent: action.percent } : null,
        isLoadingError: action.isLoadingError,
        loadingError: action.loadingError,
      }

    case 'LOADING_FINISHED':
      return {...state,
        isDataLoaded: true,
        isLoadingError: false,
        loadingStatus: null,
        refreshDate: action.refreshDate,
        orders: action.items,
        summary: {
          currentMonth: u.currentMonth(action.items),
          currentMonthName: monthByIndex(new Date().getMonth()),
          previousMonth: u.previousMonth(action.items),
          previousMonthName: monthByIndex(new Date().getMonth() - 1),
          currentYear: u.currentYear(action.items),
          previousYear: u.previousYear(action.items)
        },
        monthlyDataTable:
          List([0,1,2,3,4,5,6,7,8,9,10,11])
            .map(month => {
              return { 
                month: 
                  month,
                amount: 
                  action
                    .items
                    .filter(x => {
                      var date = new Date();
                      var firstDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth() - month - 1, 1);
                      var firstDayTheMonth = new Date(date.getFullYear(), date.getMonth() - month, 1);
                      return firstDayTheMonth.getTime() >= x.orderDate.getTime() && firstDayOfPreviousMonth.getTime() <= x.orderDate.getTime()
                    })
                    .map(x => x.amount)
                    .reduce((prev, current) => prev + current, 0.0)
                    .toFixed(0)
              }}),

        monthlyDataChartDatasets:
          {
            labels:
              List([0,1,2,3,4,5,6,7,8,9,10,11])
                .map (m => {
                  const date = new Date();
                  let index = date.getMonth() - m
                  let year = (date.getFullYear() - 2000)
                  if (index < 0) {
                    year = year - 1
                  }
                  return monthByIndex(index) + ", " + year
                })
                .toArray(),

            datasets: [{
              label: "Spendings",
              backgroundColor: "#2185d0",
              data: 
                List([0,1,2,3,4,5,6,7,8,9,10,11])
                  .map(month => 
                    action
                      .items
                      .filter(x => {
                        var date = new Date();
                        var firstDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth() - month, 1);
                        var firstDayTheMonth = new Date(date.getFullYear(), date.getMonth() - month + 1, 1);
                        return firstDayTheMonth.getTime() >= x.orderDate.getTime() && firstDayOfPreviousMonth.getTime() <= x.orderDate.getTime()
                      })
                      .map(x => x.amount)
                      .reduce((prev, current) => prev + current, 0.0)
                      .toFixed(0)
                  )
                  .toArray()
            }]
          }
      }

    default:
      return state
  }
}
