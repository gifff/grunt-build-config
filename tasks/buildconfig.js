'use strict';

var fs = require('fs'),
    path = require('path'),
    format = require('util').format,
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    indentString = require('indent-string');

module.exports = function(grunt) {

  grunt.registerTask('buildconfig', 'Make config file for browser at build time',
    function (target) {

      if (!target) {
        grunt.fail.warn('target must be given');
        return false;
      }

      var options = this.options({
        srcFile: 'buildconfig',
        destFile: 'out/buildconfig.js',
        varName: '__BUILD_CONFIG__',
      });

      var configTable = null;
      try {
        configTable = require(path.resolve(options.srcFile));
      } catch(e) {
        grunt.fail.warn(format('Cannot find source \'%s\'', options.srcFile));
        return false;
      }

      var config = configTable[target];
      if (!config) {
        grunt.log.warn('Cannot find config with target \'%s\'', target)
        grunt.log.warn('Available targets: [%s]', Object.keys(configTable).join(', '));
        grunt.fail.warn(format('Invalid target: %s', target));
      }

      var template = fs.readFileSync(__dirname + '/config.template');
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

