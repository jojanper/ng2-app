const path = require('path');

const mode = process.env.NODE_ENV || 'development';

console.log(mode);

const config = {
  entry: './src/app/pages/apps/pages/audio/worker/worker.js',
  mode,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'decoder-worker.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

module.exports = config;
