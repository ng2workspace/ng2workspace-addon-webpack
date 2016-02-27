require('es6-shim');
require('es6-promise');
require('reflect-metadata');

if(process.env.mode === 'production') {
  require('zone.js/dist/zone-microtask.min.js');
} else {
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/zone-microtask.js');
  require('zone.js/dist/long-stack-trace-zone.js');
}

// for RxJS, manually import operators when used - not part of polyfills