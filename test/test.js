'use strict';

var expect = require('chai').expect;

var grunt = require('grunt'),
    runTask = require('grunt-run-task'),
    co = require('co');

runTask.loadTasks('tasks');

require('../Gruntfile')(grunt);

/* global describe, it */

describe('buildconfig', function () {

  it('should throw error when mode is invalid', function (done) {

    co(function* () {

      var config = grunt.config.get('buildconfig');
      config.options.mode = 'invalid';

      var err = null;
      try {
        yield function (callback) {
          runTask.task('buildconfig:development', config).run(callback);
        };
      } catch(e) {
        err = e;
      }

      expect(err).to.equal('Invalid mode: invalid');

    }).then(done, done);
  });

  it('should generate config file for given env (mode=default)', function (done) {

    co(function* () {

      var root = __dirname + '/../';
      var destFile = root + '.tmp/config.default.js';

      var config = grunt.config.get('buildconfig');
      config.options.destFile = destFile;

      var expected = require(root + config.options.srcFile);

      yield function (callback) {
        runTask.task('buildconfig:development', config).run(callback);
      };

      global.window = {};
      require(destFile);

      expect(global.window.__CONFIG__).to.deep.equal(expected.development);

    }).then(done, done);
  });

  it('should generate config file for given env (mode=browserify)', function (done) {

    co(function* () {

      var root = __dirname + '/../';
      var destFile = root + '.tmp/config.browserify.js';

      var config = grunt.config.get('buildconfig');
      config.options.mode = 'browserify';
      config.options.destFile = destFile;

      var expected = require(root + config.options.srcFile);

      yield function (callback) {
        runTask.task('buildconfig:development', config).run(callback);
      };

      var actual = require(destFile);

      expect(actual).to.deep.equal(expected.development);

    }).then(done, done);
  });

});

