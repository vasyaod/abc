# Budget control for Amazon

The extension allows to control your spendings, to build reports and to set budget limit for Amazon.

Purpose and features:
 - track and be aware of your spendings
 - set limits
 - get notified if limits are exceeded
 - see and download order history and item list

The plugin doesn't send your data and statistics anywhere without your permission.

Presentation: https://vasyaod.github.io/abc/

Discourse of issues in the group https://groups.google.com/forum/#!forum/amazon-budget-control

## Philosophical discuss

A lot of people use bank apps for monitoring them spendings and budget but in this concrete case, the plugin was developed especially for amazon web site (maybe because the author is buying 99% of non-grocery goods on this market).

The plugin is positioned #anti-cash-flow against other apps that encourage an increasing number or amount of transactions. The primary goal is to avoid emotion behavior and purchases.

## Download

[Chrome extension](https://bit.ly/2mA03Ie)

[Firefox extension](https://mzl.la/2nOiSHJ)

## Screenshots

![Report Screenshot](/promotion/screenshot1-1280x800.png)

![Limit Screenshot](/promotion/screenshot2-1280x800.png)

![Limit Screenshot](/promotion/screenshot3-1280x800.png)

![Settings Screenshot](/promotion/screenshot4-1280x800.png)

## Building

```
npm install
```

```
npm run build
```

After the command all distributed files will be in `/dist` folder

## Alternative building

Alternative way to build the plugin is using `build` shell script

```
./build
```

## Release notes

1.0.3

 - remove unused permissions from manifest.json
 - remove the statistics sending field form the initial setting form
 - fix limit message issue

1.1.0

 - add list of order / items 
 - fix NaN issue on Amazon content page
 - add link to github project
 - fix a accumulating error

## License

© Vasilii Vazhesov (vasiliy.vazhesov@gmail.com)

Licensed under the MIT license.