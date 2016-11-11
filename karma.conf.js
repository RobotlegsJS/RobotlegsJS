process.env.TEST = true;
process.env.NODE_ENV = 'test';

const webpack = require("webpack");
const path = require("path");
const webpackConfig = require('./webpack.config.js')({isTest: true});

delete webpackConfig.entry;

module.exports = function(config) {

  var configuration = {
    basePath: "",
    frameworks: [
      "mocha",
      "chai",
      "sinon",
      "es6-shim"
    ],
    files: [
      "./test/entry.test.ts",
      "./test/**/**/**.test.ts",
      {
        pattern: '**/*.map',
        served: true,
        included: false,
        watched: true
      }
    ],
    preprocessors: {
      "./**/**/**/**.ts": ["sourcemap"],
      "./test/**/**/**.test.ts": ["webpack"]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      "karma-webpack",
      "karma-sourcemap-writer",
      "karma-sourcemap-loader",
      "karma-remap-istanbul",
      "karma-mocha-reporter",
      "karma-mocha",
      "karma-chai",
      "karma-sinon",
      "karma-es6-shim",
      "karma-coverage"
    ],
    reporters: (config.singleRun
      ? ["dots", "mocha", "coverage"]
      : ["dots", "mocha"]),
    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ],
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome']
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['PhantomJS'];
    configuration.plugins.push("karma-phantomjs-launcher");
  } else {
    configuration.browsers = ['Chrome'];
    configuration.plugins.push("karma-chrome-launcher");
  }

  config.set(configuration);
};
