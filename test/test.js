'use strict';

var Q = require('q');

var Q = require('q'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    grunt = require('grunt'),
    runTask = require('grunt-run-task');

chai.use(chaiAsPromised);
chai.should();

runTask.loadTasks('tasks');

require('../Gruntfile')(grunt);

/* global describe, it */

describe('buildconfig', function () {

  function taskPromise(task, config) {
    return Q.Promise(function (resolve, reject) {
      runTask.task(task, config).run(function (err) {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  it('should throw error when mode is invalid', function () {

    var config = grunt.config.get('buildconfig');
    config.options.mode = 'invalid';

    return taskPromise('buildconfig:development', config)
      .should.be.rejectedWith('Invalid mode: invalid');
  });

  it('should generate config file for given env (mode=default)', function () {

    var root = __dirname + '/../';
    var destFile = root + '.tmp/config.default.js';

    var config = grunt.config.get('buildconfig');
    config.options.destFile = destFile;

    var expected = require(root + config.options.srcFile);

    return taskPromise('buildconfig:development', config).then(function () {
      global.window = {};
      require(destFile);
      global.window.__CONFIG__.should.deep.equal(expected.development);
    });

  });

  it('should generate config file for given env (mode=browserify)', function () {

    var root = __dirname + '/../';
    var destFile = root + '.tmp/config.browserify.js';

    var config = grunt.config.get('buildconfig');
    config.options.mode = 'browserify';
    config.options.destFile = destFile;

    var expected = require(root + config.options.srcFile);

    return taskPromise('buildconfig:development', config).then(function () {
      var actual = require(destFile);
      actual.should.deep.equal(expected.development);
    });
  });

});

