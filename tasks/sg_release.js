'use strict';


var gitHelper = require('./lib/helpers/git');
var dependenciesHelper = require('./lib/helpers/dependencies');
var messages = require('./lib/messages');

module.exports = function (grunt) {

  grunt.task.loadNpmTasks('grunt-bump');

  grunt.registerTask('prepare_sg_release', function () {

    var done = this.async(); 

    function checkNpmInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'npm', checkBowerInstall);
    }

    function checkBowerInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'bower', checkoutTempReleaseBranch);
    }

    function checkoutTempReleaseBranch() {
      gitHelper.checkout(grunt, process.cwd(), '-b release', done);
    }

    (function start() {
      gitHelper.check(grunt);
      checkNpmInstall();
    })();

  });

  grunt.registerMultiTask('sg_release', 'The SunGard standard release script for HTML5 projects.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      developBranch: 'develop',
      masterBranch: 'master'
    });

    grunt.task.run('prepare_sg_release');
    grunt.task.run('bump-only');

  });

};

