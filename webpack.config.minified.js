var webpack = require("webpack"),
    defaultConfig = require("./webpack.config"),
    productionConfig = Object.assign({}, defaultConfig, {
      cache:false,

      debug:false,

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
        })
      ])
    });

delete productionConfig.devtool;

module.exports = productionConfig;