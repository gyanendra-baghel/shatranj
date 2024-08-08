// webpack.config.js

const path = require("path");

module.exports = [
  {
    entry: "./src/index.js",
    output: {
      filename: "shataranj.js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "umd",
      libraryExport: "default",
      library: {
        name: "Shataranj",
        type: "umd",
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js"],
    },
    mode: "development",
  },
  {
    entry: "./src/index.js",
    output: {
      filename: "shataranj.min.js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "umd",
      libraryExport: "default",
      library: {
        name: "Shataranj",
        type: "umd",
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js"],
    },
    mode: "production",
  },
];
