# grunt-build-config

  Make config file for browser at build time

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]

## Why I wrote this

  For server-side applications like node.js, configuration per mode can be set with env variable(ex. NODE_ENV).
  But client-side applications cannot be easily configured in this way, because the apps run on the browser.
  
  So I wrote this! This plugin generates configuration file for browser at 'build time'.
  
  For example, when configuration file is given,

```js
module.exports = {
  development: {
    api_host: "http://localhost:7000",
    env: process.env.NODE_ENV
  },
  production: {
    api_host: "http://my-api.server.com",
    env: process.env.NODE_ENV
  }
};
```
  
  run buildconfig task,
  
```shell
$ grunt buildconfig:development
```
  
  then a file which will run on browsers is generated.
    
  `default` mode:

```js
/* jshint ignore:start */
;(function () {

  'use strict';

  window.__BUILD_CONFIG__ =
  {
    "api_host": "http://localhost:7000",
    "env": "development"
  };

})();
/* jshint ignore:end */
```

  `browserify` mode:

```js
/* jshint ignore:start */
'use strict';
module.exports = {
  "api_host": "http://localhost:7000",
  "env": "development"
};
/* jshint ignore:end */
```

## Installation

```bash
$ npm install grunt-build-config --save-dev
```

## Buildconfig task
_Run this task with the `grunt buildconfig` command._

Read a configuration table and generate a configuration file with given environment.

### Options

#### srcFile

  Type: `String`  
  Default: 'buildconfig'

  Input file path.

  `srcFile` should be an requirable path (ex. *.js, *.json) that returns an object with properties.
  task target will be used to choose value of which property will be used.
  The value of it will be given to the global variable.

#### destFile

  Type: `String`  
  Default: 'out/buildconfig.js'

  Output file path.

#### varName

  Type: `String`  
  Default: '\__BUILD_CONFIG__'
  
  Name of the global variable which contains the configuration information.

#### mode

  Type: `String`
  Default: 'default'
  
  Form of output js file.  
  When mode is `default`, config file data is assigned to a global variable.    
  When mode is `browserify`, config file data will be exported in commonjs way.

### Usage Examples

```js
buildconfig: {
  options: {
    srcFile: 'test/fixtures/config.js',
    destFile: '.tmp/config.js',
    varName: '__CONFIG__',
    mode: 'default'
  }
},
```

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

  [MIT](LICENSE)
  
[npm-image]: https://img.shields.io/npm/v/grunt-build-config.svg
[npm-url]: https://npmjs.org/package/grunt-build-config
[travis-image]: https://travis-ci.org/gifff/grunt-build-config.svg?branch=master
[travis-url]: https://travis-ci.org/gifff/grunt-build-config
