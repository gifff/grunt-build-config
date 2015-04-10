'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    indentString = require('indent-string');

module.exports = function(grunt) {

  grunt.registerTask('buildconfig', 'Make config file for browser at build time',
    function (target) {

      if (!target) {
        grunt.fail.warn('target must be given');
      }

      var options = this.options({
        src: 'buildconfig',
        dest: 'out/buildconfig.js',
        varName: '__BUILD_CONFIG__',
      });

      var config = require(path.resolve(options.src))[target];
      if (!config) {
        grunt.fail.warn('invalid target: ' + target);
      }

      var template = fs.readFileSync(__dirname + '/config.template');
      var compiled = _.template(template.toString());

      var configFile = compiled({
        varName: options.varName, 
        config: indentString(JSON.stringify(config, undefined, 2), ' ', 2)
      });

      mkdirp.sync(path.dirname(options.dest));
      fs.writeFileSync(options.dest, configFile);

    });

};

