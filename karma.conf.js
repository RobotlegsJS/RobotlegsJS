process.env.TEST = true;
process.env.NODE_ENV = 'test';

const webpack = require("webpack")
const path = require("path")
const webpackConfig = require('./webpack.config.js')

delete webpackConfig.entry;

module.exports = function(config) {
  const coverage = config.singleRun ? ['coverage'] : [];

  var configuration = {
    basePath: "",
    frameworks: ["mocha"],
    files: [
      // "./test/robotlegs/bender/framework/impl/context.test.ts",
      "./test/entry.test.ts",
      "./test/**/**/**.test.ts",
      {
        pattern: '**/*.map',
        served: true,
        included: false,
        watched: true,
      },
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
      "karma-mocha",
      "karma-chai",
      "karma-sinon",
      "karma-coverage",
      "karma-chrome-launcher",
    ],
    reporters: ["dots", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
