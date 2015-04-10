'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= mochaTest.test %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      test: ['.tmp'],
    },

    buildconfig: {
      options: {
        srcFile: 'test/fixtures/config.js',
        destFile: '.tmp/config.js',
        varName: '__CONFIG__',
      }
    },

    // Unit tests.
    mochaTest: { 
      test: ['test/test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['clean', 'buildconfig:development', 'mochaTest']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['lint', 'test']);
};
