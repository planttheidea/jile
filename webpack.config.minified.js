const webpack = require("webpack");
const defaultConfig = require("./webpack.config");
const OptimizeJsPlugin = require('optimize-js-plugin');

module.exports = Object.assign({}, defaultConfig, {
  devtool: null,

  output: Object.assign({}, defaultConfig.output, {
    filename:"jile.min.js"
  }),

  plugins: defaultConfig.plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        booleans:true,
        conditionals:true,
        drop_console:false,
        drop_debugger:true,
        join_vars:true,
        screw_ie8:true,
        sequences:true,
        warnings:false
      },
      mangle:true,
      sourceMap:false
    }),
    new OptimizeJsPlugin({
      sourceMap: false
    })
  ])
});
