process.env.TEST = true;
process.env.NODE_ENV = 'test';

const webpack = require("webpack");
const path = require("path");
const webpackConfig = require('./webpack.config.js')({ isTest: true });

delete webpackConfig.entry;

let frameworks = [
  "mocha",
  "chai",
  "sinon",
  "es6-shim"
];

let plugins = [
  "karma-webpack",
  "karma-sourcemap-writer",
  "karma-sourcemap-loader",
  "karma-mocha-reporter",
  "karma-mocha",
  "karma-chai",
  "karma-sinon",
  "karma-es6-shim",
  "karma-remap-istanbul",
  "karma-coverage-istanbul-reporter"
];

module.exports = function(config) {

  var configuration = {
    basePath: "",
    frameworks: frameworks,
    files: [
      { pattern: "./test/**/**/**.test.ts", include: true },
      { pattern: '**/*.map', served: true, included: false, watched: true }
    ],
    preprocessors: {
      "./**/**/**/**.ts": ["sourcemap"],
      "./test/**/**/**.test.ts": ["webpack"]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: plugins,
    reporters: (
      config.singleRun ?
        ["dots", "mocha", "coverage-istanbul"] :
        ["dots", "mocha"]
    ),
    coverageIstanbulReporter: {
      reports: ["html", "lcov", "lcovonly", "text-summary"],
      dir: "coverage",
      fixWebpackSourcePaths: true,
      "report-config": {
        html: {
          subdir: "html-report"
        }
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: []
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['PhantomJS'];
    configuration.plugins.push("karma-phantomjs-launcher");
  } else {
    configuration.browsers = ['PhantomJS'];
    configuration.plugins.push("karma-phantomjs-launcher");
  }

  config.set(configuration);
};
