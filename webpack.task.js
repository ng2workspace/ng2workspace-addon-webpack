var formula = {
  '#default': 'once',

  webpackConfig: require('./config/webpack.config.default.js'),

  ':once': {
    watch: false
  },

  ':watch': {
    watch: true
  }
};

var action = function(done) {
  var webpack = require('webpack'),
      gutil   = require('gulp-util'),
      config  = this.config.webpackConfig;

  setProcessEnv(config);

  if(this.config.watch) {
    var url = 'http://' + config.devServer.host + ':' + config.devServer.port;
    applyInlineReloadStrategy(config, url);
    startWebpackDevServer(config);
  } else {
    var compiler = webpack(config);
    compiler.run(handleResults);
  }

  gutil.log(gutil.colors.yellow('====== Webpack Config ======\n'),
      gutil.colors.grey(require('util').inspect(config)));

  //=========== helper functions ===========//

  function startWebpackDevServer(config) {
    var WebpackDevServer = require('webpack-dev-server');

    config.plugins.push((function() {
      function HandleStatsPlugin() {}

      HandleStatsPlugin.prototype.apply = function(compiler) {
        if(typeof(process) !== 'undefined') {
          compiler.plugin('done', function(stats) {
            handleResults(null, stats);
          });
        }
      };

      return new HandleStatsPlugin();
    })());

    new WebpackDevServer(webpack(config), {
      noInfo: true,
      quiet: true
    }).listen(config.devServer.port, 'localhost', function(err) {
      if(err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }

      log(gutil.colors.blue('Server started:', url));
    });
  }

  function applyInlineReloadStrategy(config, url) {
    var devServerPath = require.resolve('webpack-dev-server')
        .match(/.*webpack-dev-server/)[0];

    // set up inline reload strategy through webpack-dev-server
    Object.keys(config.entry).forEach(function(key) {
      config.entry[key] = [].concat(config.entry[key]);
      config.entry[key].unshift(devServerPath + '/client?' + url);
    });
  }

  function setProcessEnv(config) {
    var env = config.ng2workspace.env;

    config.plugins.push(new webpack.DefinePlugin({
      'process.env': Object.keys(env).reduce(function(memo, key) {
        memo[key] = JSON.stringify(env[key]);
        return memo;
      }, {})
    }));
  }

  function handleResults(error, stats) {
    if(error) {
      return handleFatalError(error);
    }

    var jsonStats = stats.toJson();

    if(jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings);
    }

    if(jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors);
    }

    logStats(stats.toString({colors: true}));

    if(done) done();
    done = null;
  }

  function handleFatalError(error) {
    soundBeep();
    log(gutil.colors.red('FATAL:', error));
    throw new gutil.PluginError('webpack', {message: error});
  }

  function handleSoftErrors(errors) {
    soundBeep();
    errors.forEach(function(error) {
      log(gutil.colors.red('ERROR:', error));
    });
  }

  function handleWarnings(warnings) {
    warnings.forEach(function(warning) {
      log(gutil.colors.yellow('WARNING:', warning));
    });
  }

  function logStats(stats) {
    var toLog = stats.toString().replace(/\n/g,
        gutil.colors.grey('\n         \u2192 [webpack] ').toString());

    log(toLog);
  }

  function log() {
    var args = [].slice.call(arguments);
    args.unshift(gutil.colors.cyan('[webpack]'));
    gutil.log.apply(gutil, args);
  }

  function soundBeep() {
    process.stdout.write('\x07');
  }
};

/*** @type IRecipeDefinition */
module.exports = {
  formula: formula,
  action: action
};