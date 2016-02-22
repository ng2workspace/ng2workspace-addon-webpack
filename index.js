module.exports = function() {
  var ng2workspace = require('ng2workspace').ng2workspace;
  var webpackConfig = require('./config/webpack.config.default.js');

  if(ng2workspace.config.env.mode === 'development') {
    require('./config/webpack.adjust.dev.js')(webpackConfig);
  } else if(ng2workspace.config.env.mode === 'production') {
    require('./config/webpack.adjust.prod.js')(webpackConfig);
  }

  /**
   * @type INg2WorkspaceAddon
   */
  return {
    export: {
      webpackConfig: webpackConfig
    },

    recipes: ['webpack.task.js']
  }
};