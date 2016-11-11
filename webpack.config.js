const webpack = require('webpack');
const path = require('path');

module.exports = (function(options) {

  if (!options) options = {isTest: false};

  var tsconfig = options.isTest ? "tsconfig.test.json" : "tsconfig.json";

  return {
    entry: {
      main: path.join(__dirname, "src/index.ts")
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js"
    },

    devtool: 'inline-source-map',

    module: {
      rules: [
        { test: /\.ts$/, loader: "ts-loader?configFileName=" + tsconfig },
        {
          test: /^(.(?!\.test))*\.ts$/,
          loader: "istanbul-instrumenter-loader",
          query: {
            embedSource: true
          },
          enforce: "post"
        }
      ]
    },

    plugins: [
      // new webpack.optimize.UglifyJsPlugin()
      new webpack.SourceMapDevToolPlugin({ test: /\.ts$/i })
    ],

    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        // sinon: 'sinon/pkg/sinon'
      }
    }
  }
});
