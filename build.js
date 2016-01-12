 var builder = require('systemjs-builder');

  // `builder.loadConfig` will load config from a file
  builder.loadConfig('client/config.js')
  .then(function() {
    // additional config can also be set through `builder.config`
    builder.config({
      baseURL: 'file:' + process.cwd() + '/client',
      rootURL: 'file:' + process.cwd(),

      // to disable css optimizations
      // cssOptimize: false
    });

    return builder.build('myModule', 'bundle.js');
  });