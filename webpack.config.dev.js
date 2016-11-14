const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebpackDashboard = require('webpack-dashboard/plugin');

const defaultConfig = require('./webpack.config');

const PORT = 3000;

const preLoaders = defaultConfig.module.preLoaders.map((preLoader) => {
  return Object.assign({}, preLoader, {
    cacheable: false
  });
});

const loaders = defaultConfig.module.loaders.map((loader) => {
  if (loader.loader === 'babel') {
    return Object.assign({}, loader, {
      cacheable: false,
      include: [
        /src/,
        /DEV_ONLY/
      ],
    });
  }

  return loader;
});

module.exports = Object.assign({}, defaultConfig, {
  cache: true,

  devServer : {
    contentBase: './dist',
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    quiet: false,
    port: PORT,
    stats: {
      colors: true,
      progress: true
    }
  },

  entry: [
    path.resolve (__dirname, 'DEV_ONLY', 'App.js')
  ],

  eslint: Object.assign({}, defaultConfig.eslint, {
    failOnWarning: false
  }),

  externals: null,

  module: {
    preLoaders,
    loaders
  },

  output: Object.assign({}, defaultConfig.output, {
    publicPath: `http://localhost:${PORT}/`
  }),

  plugins: [
    ...defaultConfig.plugins,
    new HtmlWebpackPlugin(),
    new WebpackDashboard()
  ]
});
