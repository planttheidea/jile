const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  entry: [path.resolve(__dirname, 'src', 'index.js')],

  externals: ['hash-it', 'inline-style-prefixer'],

  mode: 'development',

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [path.join(__dirname, 'src')],
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
          emitError: true,
          failOnError: true,
          failOnWarning: false,
          formatter: require('eslint-friendly-formatter'),
        },
        test: /\.js$/,
      },
      {
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'DEV_ONLY')],
        loader: 'babel-loader',
        test: /\.js?$/,
      },
    ],
  },

  output: {
    filename: 'jile.js',
    library: 'jile',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },

  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV']), new LodashModuleReplacementPlugin()],
};
