import fetch from 'cross-fetch';
import { parse } from 'node-html-parser'
import { List, Set } from 'immutable'

const fieldRegExp = new RegExp(`orderI[dD]=`)
const orderIdRegExp = new RegExp(`orderId=([0-9\-]+)`, 'gim')
const amountRegExp = new RegExp(/Grand Total:.*?([0-9,\.]+)/, 'i')
const dateRegExp = new RegExp(`/Ordered on ([A-Za-z0-9,\\s]*)/`, 'i')
const refundRegExp = new RegExp(/Refund for this return.*?([0-9,\.]+)/, 'i')
const itemIdExp = new RegExp(`/gp/product/([A-Za-z0-9]+)/`)

export function parseOrders(htmlData) {
  const matches = htmlData.match(orderIdRegExp)

  if (matches == null) {
    return Set()
  }

  // const root = parse(content);
  // const orders = root.querySelectorAll('.order')
  // orders.forEach(element => {
  //     const prices = element.querySelectorAll('.a-color-price')
  //     console.log(prices.length);
  // });
  //£

  return Set(matches.map(
    x => x.replace(fieldRegExp, "")
  ))
}

export function parseOrder(htmlData, orderId) {

  const root = parse(htmlData);

  // Extract data and amount
  const orders = root.querySelectorAll('.a-row span')
  const text = orders
    .map(element => element.removeWhitespace().rawText.trim())
    .reduce((prev, current) => prev + "/" + current, "")

  const dateMmatches = text.match(dateRegExp)
  if (!dateMmatches) {
    throw new Error("Parsing error, date of a order can't be found")
  }

  const amountMatches = text.match(amountRegExp)
  if (!amountMatches) {
    throw new Error("Parsing error, amount of a order can't be found")
  }

  let amount = parseFloat(amountMatches[1])

  const refundMatches = text.match(refundRegExp)

  if (refundMatches) {
    amount = amount - parseFloat(refundMatches[1])
  }

  // List of items
  const itemLinks =
    List(root.querySelectorAll('div.shipment a.a-link-normal'))
      .filter(e => e.attributes["href"])
      .flatMap(e => {
        const href = e.attributes["href"]
        if (href && href.match(itemIdExp) && e.querySelector('img')) {
          const group = href.match(itemIdExp)
          const asin = group[1]
          const imgElement = e.querySelector('img')
          const title = imgElement && imgElement.attributes["title"] ?
            imgElement.attributes["title"] : null

          return List([{
            asin: asin,
            title: title
          }])

        } else {
          return List()
        }
      })
      .toSet()

  return {
    id: orderId,
    orderDate: Date.parse(dateMmatches[1]),
    amount: amount,
    items: itemLinks.toArray()
  }

  // const root = parse(content);
  // const orders = root.querySelectorAll('.order')
  // orders.forEach(element => {
  //     const prices = element.querySelectorAll('.a-color-price')
  //     console.log(prices.length);
  // });
  //£
  //return orderIds
}

/** Downloads list of order ids from one page...*/
async function downloadOrderIds(url, filter, index, orderIds, callback) {
  const res = await fetch(`${url}/gp/your-account/order-history?orderFilter=year-${filter}&startIndex=${index}`, {
    method: 'GET'
  })

  // Execure callback if it is set
  if (callback) {
    callback(filter, index)
  }

  if (res.type != "opaqueredirect" && res.url.includes("signin")) {
    throw new Error("Auth error")
  }

  if (res.status >= 400) {
    throw new Error(`Parsing error, wrong page status ${res.status} for order list page`)
  }

  const newOrderIds = parseOrders(await res.text())
  //    console.log(">>>>", url, filter, index)

  const dt = new Date()
  if (filter == dt.getFullYear() - 3) {
    return orderIds    // 2016 is min year
  } else if (newOrderIds.size > 0 && newOrderIds.subtract(orderIds).size == 0) {
    return orderIds    // if we don't have a new values we need to exit.
  } else if (newOrderIds.size > 0) {
    return await downloadOrderIds(url, filter, index + 10, orderIds.concat(List(newOrderIds)), callback)
  } else if (index != 0) {
    return await downloadOrderIds(url, filter - 1, 0, orderIds.concat(List(newOrderIds)), callback)
  } else {
    return orderIds
  }
}

/** Downloads list of order ids */
export async function downloadAllOrderIds(url, oldUrls, callback) {
  const dt = new Date()
  return downloadOrderIds(url, dt.getFullYear(), 0, Set(oldUrls), async filter => {
    if (callback) {
      callback(dt.getFullYear() - filter)
    }
  })
}

async function downloadOrder(url, orderId) {
  const res = await fetch(`${url}/gp/your-account/order-details?orderID=${orderId}`, {
    method: 'GET'
  })

  if (res.type != "opaqueredirect" && res.url.includes("signin")) {
    throw new Error("Auth error")
  }

  if (res.status >= 400) {
    throw new Error(`Parsing error, wrong page status ${res.status} for order detail page`)
  }

  return parseOrder(await res.text(), orderId)
}

/** Downloads order information by list of ids */
export async function downloadOrders(url, orderIds) {
  const promsOfOrders = orderIds
    .map(id => downloadOrder(url, id))

  return List(await Promise.all(promsOfOrders.toArray())).toSet()
}

export async function download(url) {
  return downloadOrders(url, await downloadOrderIds(url))
}
