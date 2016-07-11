const path = require('path');
const webpack = require('webpack');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

module.exports = {
  cache: true,

  debug: true,

  devtool: 'eval-cheap-module-source-map',

  entry: [
    path.resolve (__dirname, 'src/index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: eslintFriendlyFormatter
  },

  externals: {
    'inline-style-prefixer': {
      amd: 'inline-style-prefixer',
      commonjs: 'inline-style-prefixer',
      commonjs2: 'inline-style-prefixer',
      root: 'Prefixer'
    }
  },

  module: {
    preLoaders: [
      {
        include: [
          /src/
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        include: [
          /src/
        ],
        loader: 'babel',
        test: /\.js?$/
      }
    ]
  },

  output: {
    filename: 'jile.js',
    library: 'jile',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ])
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    fallback: [
      path.join (__dirname, 'src')
    ],

    root: __dirname
  }
};
