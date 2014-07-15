'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    mkdir: {
      tests: {
        options: {
          create: ['tmp']
        }
      }
    },

    setup_test_folder: {
      tests: {
        folder: 'tmp'
      }
    },

    // Configuration to be run (and then tested).
    sg_release: {
      tests: {
        developBranch: 'develop',
        masterBranch: 'master',
        messagePrefix: 'Release '
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  grunt.loadTasks('test/tasks');

  grunt.registerTask('test', ['clean', 'mkdir', 'setup_test_folder', 'sg_release', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

