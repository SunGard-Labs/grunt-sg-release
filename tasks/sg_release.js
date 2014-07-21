'use strict';


var inquirer = require('inquirer');
var gitHelper = require('./lib/helpers/git');
var dependenciesHelper = require('./lib/helpers/dependencies');
var messages = require('./lib/messages');
var version = require('./lib/version');

module.exports = function (grunt) {

  grunt.task.loadNpmTasks('grunt-bump');


  // ---


  var releaseBranchName;

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
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'bower', getReleaseVersion);
    }

    function getReleaseVersion() {
      version.getRelease(grunt, createTempReleaseBranch);
    }

    function createTempReleaseBranch() {
      releaseBranchName = options.tempReleaseBranch + '/v' + grunt.option('setversion');
      gitHelper.createBranch(grunt, process.cwd(), releaseBranchName, done);
    }

    (function start() {
      checkGit();
    })();

  });


  // ---


  grunt.registerTask('merge_sg_release', function () {

    var done = this.async();
    var options = this.options({
      developBranch: 'develop',
      masterBranch: 'master',
      mergeToDevelopMsg: messages.mergeToMasterMsg,
      mergeToMasterMsg: messages.mergeToDevelopMsg
    });

    function checkoutMaster() {
      gitHelper.checkout(grunt, process.cwd(), options.masterBranch, mergeFromTempReleaseBranch);
    }

    function mergeFromTempReleaseBranch() {
      gitHelper.merge(grunt, process.cwd(), releaseBranchName, options.mergeToMasterMsg, checkoutDevelop);
    }

    function checkoutDevelop() {
      gitHelper.checkout(grunt, process.cwd(), options.developBranch, mergeIntoDevelopBranch);
    }

    function mergeIntoDevelopBranch() {
      gitHelper.merge(grunt, process.cwd(), releaseBranchName, options.mergeToMasterMsg, done);
    }

    (function start() {
      checkoutMaster();
    })();

  });


  // ---


  grunt.registerMultiTask('sg_release', 'The SunGard standard release script for HTML5 projects.', function () {

    grunt.task.run('prepare_sg_release');
    grunt.task.run('bump-only');
    grunt.task.run('merge_sg_release');

  });

};

