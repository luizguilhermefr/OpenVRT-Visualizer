'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const {dependencies} = require('../package.json')
const {NoEmitOnErrorsPlugin, DefinePlugin} = require('webpack')
const ClosureCompilerPlugin = require('webpack-closure-compiler')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: [
    ...Object.keys(dependencies || {}),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.node'],
  },
  target: 'electron-main',
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new DefinePlugin({
      '__static': `"${path.join(__dirname, '../static')
        .replace(/\\/g, '\\\\')}"`,
    }),
  )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new ClosureCompilerPlugin({mode: 'AGGRESSIVE_BUNDLE'}, {
      compilation_level: 'ADVANCED',
      warning_level: 'QUIET',
    }),
  )
}

module.exports = mainConfig
