module.exports = function(config, taskConfig) {
  var webpack = require('webpack');
  var ng2workspace = require('ng2workspace').ng2workspace;
  var WebpackMd5Hash    = require('webpack-md5-hash');
  var CompressionPlugin = require('compression-webpack-plugin');

  ng2workspace.util.mergeInPlace(config, {
    debug: false,
    devServer: {
      filename: '[name].[chunkhash].bundle.js',
      host: config.ng2workspace.host_prod,
      port: config.ng2workspace.port_prod
    },
    output: {
      filename: '[name].[chunkhash].bundle.js',
      sourceMapFilename: '[name].[chunkhash].bundle.map',
      chunkFilename: '[id].[chunkhash].chunk.js'
    },
    plugins: [
      new WebpackMd5Hash(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.[chunkhash].bundle.js',
        chunks: Infinity
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        // todo(mm): enable mangling on angular2 beta.3 release
        // mangle: { screw_ie8 : true },
        mangle: false,
        compress : { screw_ie8 : true},
        comments: false

      }),
      new CompressionPlugin({
        algorithm: function gzipMaxLevel(buffer, callback) {
          return require('zlib')['gzip'](buffer, {level: 9}, callback)
        },
        regExp: /\.css$|\.html$|\.js$|\.map$/,
        threshold: 2 * 1024
      })
    ]
  });
};