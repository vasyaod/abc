// Australia 	https://amazon.com.au
// Brazil 	https://amazon.com.br
// Canada 	https://amazon.ca
// China 	https://amazon.cn
// France 	https://amazon.fr
// Germany 	https://amazon.de
// India 	https://amazon.in
// Italy 	https://amazon.it
// Japan 	https://amazon.co.jp
// Mexico 	https://amazon.com.mx
// Spain 	https://amazon.es
// Turkey 	https://amazon.com.tr
// United Kingdom 	https://amazon.co.uk
// United States 	https://amazon.com 

const countries = [
  {
    id: "US",
    name: "United States",
    url: "amazon.com",
    currency: {
      symbol: "$",
      place: "before"
    },
    supported: true
  },
  {
    id: "UK",
    name: "United Kingdom",
    url: "amazon.co.uk"
  },
  {
    id: "AU",
    name: "Australia",
    url: "amazon.com.au"
  },
  {
    id: "BR",
    name: "Brazil",
    url: "amazon.com.br"
  },
  {
    id: "CA",
    name: "Canada",
    url: "amazon.ca",
    currency: {
      symbol: "$",
      place: "before"
    },
    supported: true
  },
  {
    id: "CN",
    name: "China",
    url: "amazon.cn"
  },
  {
    id: "FR",
    name: "France",
    url: "amazon.fr"
  },
  {
    id: "DE",
    name: "Germany",
    url: "amazon.de"
  },
  {
    id: "IN",
    name: "India",
    url: "amazon.in"
  },
  {
    id: "IT",
    name: "Italy",
    url: "amazon.it"
  },
  {
    id: "JP",
    name: "Japan",
    url: "amazon.co.jp"
  },
  {
    id: "MX",
    name: "Mexico",
    url: "amazon.com.mx"
  },
  {
    id: "ES",
    name: "Spain",
    url: "amazon.es"
  },
  {
    id: "TR",
    name: "Turkey",
    url: "amazon.com.tr"
  },
]

export function countryById(id) {
  const res = countries.find(c => c.id == id)
  return res == null ? countries[0] : res
}

export function formatCurrency(id, value) {
  const country = countryById(id)
  const minus = value < 0 ? "-" : ""
  if (country.currency && country.currency.place == "before") {
    return minus + country.currency.symbol + Math.abs(value)
  }
  if (country.currency && country.currency.place == "after") {
    return minus + Math.abs(value) + country.currency.symbol
  }
  return value
}

export default countries