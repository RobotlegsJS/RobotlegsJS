const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env => {

  if (!env) env = {production: false};

  let tsconfig = env.production ? "tsconfig.json" : "tsconfig.test.json";
  let filename = env.production ? "robotlegs.min.js" : "robotlegs.js";

  return {
    mode: env.production ? "production" : "development",
    entry: {
      main: path.join(__dirname, "src/index.ts")
    },

    output: {
      path: path.join(__dirname, "dist"),
      filename: filename,

      libraryTarget: "var",
      library: "RobotlegsJS"
    },

    devtool: env.production ? undefined : "inline-source-map",

    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader?configFile=" + tsconfig
        },
        {
          test: ((env.production) /* disable this loader for production builds */
            ? /^$/
            : /^(.(?!\.test))*\.ts$/),
          loader: "istanbul-instrumenter-loader",
          query: {
            embedSource: true
          },
          enforce: "post"
        }
      ]
    },

    plugins: (
      (env.production)
        ? [ new UglifyJSPlugin() ]
        : [ new webpack.SourceMapDevToolPlugin({ test: /\.ts$/i }) ]
    ),

    resolve: {
      extensions: ['.ts', '.js', '.json']
    }
  }
});
