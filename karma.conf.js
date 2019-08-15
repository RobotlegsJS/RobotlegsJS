const puppeteer = require("puppeteer");

process.env.TEST = true;
process.env.NODE_ENV = "test";
process.env.CHROME_BIN = puppeteer.executablePath();

const webpackConfig = require("./webpack.config.js")({ production: false, karma: true });

delete webpackConfig.entry;

module.exports = config => {
    "use strict";

    var configuration = {
        basePath: "",
        frameworks: ["mocha", "sinon-chai", "es6-shim"],
        files: [
            { pattern: "node_modules/reflect-metadata/Reflect.js", include: true },
            { pattern: "node_modules/bluebird/js/browser/bluebird.js", include: true },
            { pattern: "./test/index.ts", include: true },
            { pattern: "**/*.map", served: true, included: false, watched: true }
        ],
        preprocessors: {
            "./test/index.ts": ["webpack"],
            "./**/**/**/**.ts": ["sourcemap"]
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        plugins: [
            "karma-webpack",
            "karma-sourcemap-writer",
            "karma-sourcemap-loader",
            "karma-mocha-reporter",
            "karma-mocha",
            "karma-sinon-chai",
            "karma-es6-shim",
            "karma-coverage-istanbul-reporter"
        ],
        mime: {
            "text/x-typescript": ["ts", "tsx"]
        },
        reporters: config.singleRun ? ["dots", "mocha", "coverage-istanbul"] : ["dots", "mocha"],
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
        configuration.browsers.push("ChromeHeadless");
        configuration.plugins.push("karma-chrome-launcher");
    } else {
        configuration.browsers.push("ChromeHeadless");
        configuration.plugins.push("karma-chrome-launcher");
    }

    config.set(configuration);
};
