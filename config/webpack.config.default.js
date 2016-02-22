var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var workspace = require('ng2workspace').ng2workspace;
var workspaceConfig = workspace.config;

var commons = {
  outputFilename: '[name].bundle.js',
  outputPath: workspace.util.toAbsolute(workspaceConfig.dir_bin),
  watchOptions: {aggregateTimeout: 200}
};

module.exports = {
  context: workspaceConfig.root,

  debug: true,

  devtool: 'source-map',

  devServer: {
    contentBase: commons.outputPath,
    filename: commons.outputFilename,
    historyApiFallback: true,
    host: workspaceConfig.host_dev,
    hot: workspaceConfig.hot_reload,
    port: workspaceConfig.port_dev,
    watchOptions: commons.watchOptions
  },

  entry: {
    polyfills: path.resolve(__dirname, '..', 'polyfills.js'),
    main: workspace.util.toRelative(workspaceConfig.dir_src, 'main')
  },

  externals: [],

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        // todo(mm): someday this exclude shouldn't be necessary!
        exclude: [workspace.util.toAbsolute('node_modules/rxjs')]
      }
    ],
    loaders: [],
    postLoaders: [],
    noParse: []
  },

  ng2workspace: workspaceConfig,

  node: {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  },

  output: {
    path: commons.outputPath,
    filename: commons.outputFilename,
    sourceMapFilename: '[name].bundle.map',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],

  resolve: {
    extensions: ['','.js'],
    alias: {},
    root: []
  },

  resolveLoader: {
    root: glob.sync(workspace.util
        .toAbsolute('node_modules', 'ng2workspace-addon-*', 'node_modules'))
  }
};