
export function currentMonth(orders) {
  return orders
    .filter(x => {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return firstDay.getTime() <= x.orderDate.getTime()
    })
    .map(x => x.amount)
    .reduce((prev, current) => prev + current, 0.0)
    .toFixed(0)
}

export function previousMonth(orders) {
  return orders
    .filter(x => {
      var date = new Date();
      var firstDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      var firstDayTheMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      return firstDayTheMonth.getTime() > x.orderDate.getTime() && firstDayOfPreviousMonth.getTime() <= x.orderDate.getTime()
    })
    .map(x => x.amount)
    .reduce((prev, current) => prev + current, 0.0)
    .toFixed(0)
}

export function currentYear(orders) {
  return orders
    .filter(x => {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), 0, 1);
      return firstDay.getTime() <= x.orderDate.getTime()
    })
    .map(x => x.amount)
    .reduce((prev, current) => prev + current, 0.0)
    .toFixed(0)
}

export function previousYear(orders) {
  return orders
    .filter(x => {
      var date = new Date();
      var firstDayOfPreviousMonth = new Date(date.getFullYear() - 1, 0, 1);
      var firstDayTheMonth = new Date(date.getFullYear(), 0, 1);
      return firstDayTheMonth.getTime() > x.orderDate.getTime() && firstDayOfPreviousMonth.getTime() <= x.orderDate.getTime()
    })
    .map(x => x.amount)
    .reduce((prev, current) => prev + current, 0.0)
    .toFixed(0)
}