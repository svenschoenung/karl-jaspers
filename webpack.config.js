var webpack = require('webpack');

var config = {
  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: { presets: ['es2015', 'react'], compact: true }
    }]
  }
};

module.exports = function(prod) {
  if (prod) {
    config.plugins = [
      new webpack.DefinePlugin({
        'process.env': { 'NODE_ENV': JSON.stringify('production') }
      })
    ];
  }

  return config; 
};

