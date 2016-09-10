const webpack = require('webpack')
const path = require('path')

module.exports = (function(options) {
    console.log(options)

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
      loaders: [
        { test: /\.ts$/, loader: "awesome-typescript-loader" }
      ],
      postLoaders: [
        {
          test: /^(.(?!\.test))*\.ts$/,
          loader: "istanbul-instrumenter-loader",
          query: {
            embedSource: true,
          },
        }
      ],
    },

    plugins: [
      // new webpack.optimize.UglifyJsPlugin()
      new webpack.SourceMapDevToolPlugin({ test: /\.ts$/i })
    ],

    resolve: {
      extensions: ['', '.ts', '.js', '.json'],
      root: [ path.join(__dirname, "./src") ],
      alias: {
         // sinon: 'sinon/pkg/sinon'
      }
    }


  }
})()
