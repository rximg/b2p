const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target:'node',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/gpt-3-encoder/encoder.json', to: '.' },
        { from: 'node_modules/gpt-3-encoder/vocab.bpe', to: '.' },
      ],
    }),
  ],
};