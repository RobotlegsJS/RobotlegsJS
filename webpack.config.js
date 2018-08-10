const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = env => {

  if (!env) env = { production: false, karma: false };

  let mode = env.production ? "production" : "development";
  let tsconfig = !env.karma ? "tsconfig.json" : "tsconfig.test.json";
  let output = env.production ? "dist" : "dist-test";
  let filename = env.production ? "robotlegs.min.js" : "robotlegs.js";

  return {
    mode: mode,

    entry: {
      main: path.join(__dirname, "src/index.ts")
    },

    output: {
      path: path.join(__dirname, output),
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
            : /^.*(src).*\.ts$/),
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
        ? []
        : [ new webpack.SourceMapDevToolPlugin({ test: /\.ts$/i }) ]
    ),

    optimization:
      (env.production)
        ? {
            concatenateModules: true,
            minimize: true,
            minimizer: [
              new UglifyJsPlugin({
                cache: true,
                parallel: 4,
                uglifyOptions: {
                  output: {
                    comments: false
                  }
                }
              })
            ]
          }
        : {}
    ,

    resolve: {
      extensions: [".ts", ".js", ".json"]
    }
  }
};
