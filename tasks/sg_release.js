'use strict';


var inquirer = require('inquirer');
var gitHelper = require('./lib/helpers/git');
var dependenciesHelper = require('./lib/helpers/dependencies');
var messages = require('./lib/messages');
var version = require('./lib/version');

module.exports = function (grunt) {

  grunt.task.loadNpmTasks('grunt-bump');


  // ---


  var options;
  var releaseBranchName;

  grunt.registerTask('prepare_sg_release', function () {

    var done = this.async();

    function checkGit() {
      gitHelper.check(grunt);
      checkNpmInstall();
    }

    function checkNpmInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'npm', options.skipNpmInstall, checkBowerInstall);
    }

    function checkBowerInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'bower', options.skipBowerInstall, getReleaseVersion);
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
      gitHelper.merge(grunt, process.cwd(), releaseBranchName, options.mergeToMasterMsg, deleteTempReleaseBranch);
    }

    function deleteTempReleaseBranch() {
      gitHelper.deleteBranch(grunt, process.cwd(), releaseBranchName, getNextVersion);
    }

    function getNextVersion() {
      version.getNext(grunt, done);
    }

    (function start() {
      checkoutMaster();
    })();

  });


  // ---


  grunt.registerTask('finish_sg_release', function () {

    var done = this.async();

    function commitDevelopmentVersion() {
      gitHelper.commit(grunt, process.cwd(), options.developVersionCommitMsg, pushDevelopBranch);
    }

    function pushDevelopBranch() {
      gitHelper.push(grunt, process.cwd(), options.pushTo, options.developBranch, pushMasterBranch);
    }

    function pushMasterBranch() {
      gitHelper.push(grunt, process.cwd(), options.pushTo, options.masterBranch, pushReleaseTag);
    }

    function pushReleaseTag() {
      gitHelper.push(grunt, process.cwd(), options.pushTo, 'v' + grunt.option('releaseVersion'), done);
    }

    (function start() {
      commitDevelopmentVersion();
    })();

  });


  // ---


  grunt.registerMultiTask('sg_release', 'The SunGard standard release script for HTML5 projects.', function () {

    options = this.options({
      skipBowerInstall: false,
      skipNpmInstall: false,
      developBranch: 'develop',
      masterBranch: 'master',
      tempReleaseBranch: 'release',
      mergeToDevelopMsg: messages.mergeToMasterMsg,
      mergeToMasterMsg: messages.mergeToDevelopMsg,
      developVersionCommitMsg: messages.developVersionCommitMsg,
      pushTo: 'upstream'
    });

    grunt.task.run('prepare_sg_release');
    grunt.task.run('bump');
    grunt.task.run('merge_sg_release');
    grunt.task.run('bump-only');
    grunt.task.run('finish_sg_release');

  });

};

