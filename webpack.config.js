const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    main: ['./client/entry.js'],
  },
  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        query: {
          cacheDirectory: '.babel-cache',
          sourceMap: false,
        },
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[path][name]--[local]--[hash:base64:10]',
            },
          },
        ],
      },
      {
        test: /node_modules\/unicode-properties.*\.json$/,
        use: 'json-loader',
      },
    ],
  },
};
