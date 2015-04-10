'use strict';

var expect = require('chai').expect;

var grunt = require('grunt');

require('../Gruntfile')(grunt);

/* global describe, it */

describe('buildconfig', function () {

  it('should generate config file for given env', function () {

    var BUILD_ENV = 'development';

    var root = __dirname + '/../';

    var options = grunt.config.get('buildconfig').options;
    var expected = require(root + options.srcFile);
    
    global.window = {};
    require(root + options.destFile);

    expect(global.window.__CONFIG__).to.deep.equal(expected[BUILD_ENV]);
  });

});

