'use strict';

var fs = require('fs'),
    path = require('path'),
    format = require('util').format,
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    indentString = require('indent-string');

module.exports = function(grunt) {

  grunt.registerTask('buildconfig',
    'Make config file for browser at build time',
    function (target) {

      var options = this.options({
        srcFile: 'buildconfig',
        destFile: 'out/buildconfig.js',
        varName: '__BUILD_CONFIG__',
        mode: 'default',
      });

      var configTable = null;
      try {
        configTable = require(path.resolve(options.srcFile));
      } catch(e) {
        grunt.fail.warn(format('Cannot find source \'%s\'', options.srcFile));
        return false;
      }

      function exitWithTargetError () {
        grunt.log.warn('Available targets: [%s]',
          Object.keys(configTable).join(', '));
        grunt.fail.warn(format('Invalid target: %s', target || '(undefined)'));

        return false;
      }

      if (!target) {
        grunt.log.warn('target must be given');
        return exitWithTargetError();
      }

      var config = configTable[target];
      if (!config) {
        grunt.log.warn('Cannot find config with target \'%s\'', target);
        return exitWithTargetError();
      }

      var tmplFile;

      switch(options.mode) {
        case 'default':
          tmplFile = 'default.tmpl';
          break;
        case 'browserify':
          tmplFile = 'browserify.tmpl';
          break;
        default:
          grunt.fail.warn(format('Invalid mode: %s', options.mode));
      }

      var template = fs.readFileSync(__dirname + '/templates/' + tmplFile);
      var compiled = _.template(template.toString());

      var configFile = compiled({
        varName: options.varName,
        config: indentString(JSON.stringify(config, undefined, 2), ' ', 2)
      });

      mkdirp.sync(path.dirname(options.destFile));
      fs.writeFileSync(options.destFile, configFile);

      grunt.log.ok('Config file generated: %s', options.destFile);

      return true;
    });

};

