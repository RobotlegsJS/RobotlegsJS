const webpack = require("webpack")
const path = require("path")

const webpackConfig = require('./webpack.config.js')

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["mocha", "chai", "sinon"],
    files: [
      "./test/**.test.ts"
    ],
    preprocessors: {
      "./test/**.test.ts": ["webpack"]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-chai"),
      require("karma-sinon"),
      require("karma-chrome-launcher"),
    ],
    reporters: ["dots"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false
  });
};
