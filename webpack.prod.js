const path = require('path');
const fs = require('fs');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CopyPublicAssets', () => {
          fs.copyFileSync(
            path.resolve(__dirname, 'public/robots.txt'),
            path.resolve(__dirname, 'dist/robots.txt'),
          );
        });
      },
    },
  ],
});