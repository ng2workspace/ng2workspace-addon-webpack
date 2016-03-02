module.exports = function(config, taskConfig) {
  var webpack = require('webpack');
  var ng2workspace = require('ng2workspace').ng2workspace;

  ng2workspace.util.mergeInPlace(config, {
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.bundle.js',
        minChunks: Infinity
      })]
  });
};