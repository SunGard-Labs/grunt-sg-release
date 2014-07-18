'use strict';


var inquirer = require('inquirer');
var gitHelper = require('./lib/helpers/git');
var dependenciesHelper = require('./lib/helpers/dependencies');
var messages = require('./lib/messages');
var version = require('./lib/version');

module.exports = function (grunt) {

  grunt.task.loadNpmTasks('grunt-bump');


  // ---


  grunt.registerTask('prepare_sg_release', function () {

    var done = this.async();
    var options = this.options({
      tempReleaseBranch: 'release'
    });

    function checkGit() {
      gitHelper.check(grunt);
      checkNpmInstall();
    }

    function checkNpmInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'npm', checkBowerInstall);
    }

    function checkBowerInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'bower', checkoutTempReleaseBranch);
    }

    function checkoutTempReleaseBranch() {
      gitHelper.checkout(grunt, process.cwd(), '-b ' + options.tempReleaseBranch, getReleaseVersion);
    }

    function getReleaseVersion() {
      version.getRelease(grunt, done);
    }

    (function start() {
      checkGit();
    })();

  });


  // ---


  grunt.registerMultiTask('sg_release', 'The SunGard standard release script for HTML5 projects.', function () {

    grunt.task.run('prepare_sg_release');
    grunt.task.run('bump-only');

  });

};

