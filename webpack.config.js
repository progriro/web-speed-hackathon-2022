/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const nodeExternals = require("webpack-node-externals");

function abs(...args) {
  return path.join(__dirname, ...args);
}

const SRC_ROOT = abs("./src");
const PUBLIC_ROOT = abs("./public");
const DIST_ROOT = abs("./dist");
const DIST_PUBLIC = abs("./dist/public");

const NODE_ENV = process.env.NODE_ENV === "development";

/** @type {Array<import('webpack').Configuration>} */
module.exports = [
  {
    devtool: NODE_ENV === "production" ? false : "inline-source-map",
    entry: path.join(SRC_ROOT, "client/index.jsx"),
    mode: process.env.NODE_ENV,
    module: {
      rules: [
        {
          resourceQuery: (value) => {
            const query = new URLSearchParams(value);
            return query.has("raw");
          },
          type: "asset/source",
        },
        {
          exclude: /([\\/]esm[\\/] | node_modules)/,
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "babel-plugin-styled-components",
                  {
                    minify: true,
                    pure: true,
                    transpileTemplateLiterals: true,
                  },
                ],
              ],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    bugfixes: true,
                    corejs: "3",
                    loose: true,
                    useBuiltIns: "usage",
                  },
                ],
                [
                  "@babel/preset-react",
                  {
                    development: NODE_ENV === "development",
                    useSpread: true,
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    name: "client",
    output: {
      filename: "main-[contenthash:8].js",
      path: DIST_PUBLIC,
      publicPath: "/",
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: PUBLIC_ROOT, to: DIST_PUBLIC }],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(SRC_ROOT, "./client", "./index.html"),
      }),
      new BundleAnalyzerPlugin(),
    ],
    resolve: {
      alias: {
        react: "preact/compat",
        // eslint-disable-next-line sort/object-properties
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
        "react/jsx-runtime": "preact/jsx-runtime",
      },
      extensions: [".js", ".jsx"],
    },
    target: "web",
  },
  {
    devtool: NODE_ENV === "production" ? false : "inline-source-map",
    entry: path.join(SRC_ROOT, "server/index.js"),
    externals: [nodeExternals()],
    mode: process.env.NODE_ENV,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(js|mjs|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: "cjs",
                    spec: true,
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        },
      ],
    },
    name: "server",
    output: {
      filename: "server.js",
      path: DIST_ROOT,
    },
    resolve: {
      extensions: [".mjs", ".js", ".jsx"],
    },
    target: "node",
  },
];
