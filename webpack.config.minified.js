const defaultConfig = require('./webpack.config');
const OptimizeJsPlugin = require('optimize-js-plugin');

module.exports = Object.assign({}, defaultConfig, {
  devtool: false,

  mode: 'production',

  output: Object.assign({}, defaultConfig.output, {
    filename: 'jile.min.js',
  }),

  plugins: defaultConfig.plugins.concat([
    new OptimizeJsPlugin({
      sourceMap: false,
    }),
  ]),
});
