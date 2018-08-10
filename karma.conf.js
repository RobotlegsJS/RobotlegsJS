process.env.TEST = true;
process.env.NODE_ENV = "test";

const webpackConfig = require("./webpack.config.js")({ production: false, karma: true });

delete webpackConfig.entry;

module.exports = config => {

  var configuration = {
    basePath: "",
    frameworks: [
      "mocha",
      "chai",
      "sinon",
      "es6-shim"
    ],
    files: [
      { pattern: "node_modules/reflect-metadata/Reflect.js", include: true },
      { pattern: "node_modules/bluebird/js/browser/bluebird.js", include: true },
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
      "karma-coverage-istanbul-reporter"
    ],
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
    browsers: [],
    browserNoActivityTimeout: 50000
  };

  if (process.env.TRAVIS) {
    configuration.browsers.push("PhantomJS");
    configuration.plugins.push("karma-phantomjs-launcher");
  } else {
    configuration.browsers.push("PhantomJS");
    configuration.plugins.push("karma-phantomjs-launcher");
  }

  config.set(configuration);
};
