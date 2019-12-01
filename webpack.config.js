const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,

  entry: {
    popup: "./src/primary/index.js",
    background: "./src/background.js",
    contentscript: "./src/content/index.js"
  },

  output: {
    filename: '[name].bundle.js',
  // filename: "bundle.js",
    //path: __dirname,
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new CopyPlugin([
      { from: 'icons/**', to: './'},
      { from: 'themes/**', to: './'},
      { from: 'images/**', to: './'},
      { from: 'manifest.json', to: './'},
      { from: 'popup.html', to: './'},
      { from: 'jquery-3.4.1.min.js', to: './' },
      { from: 'semantic.min.css', to: './' },
      { from: 'icon.min.css', to: './' },
    ]),
  ],
  // Existing Code ....
  module : {
    rules: [
      {
        test : /\.(ts|js)x?$/,
        exclude: /node_modules\/(?!(lit-html|@polymer)\/).*/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  }
};
