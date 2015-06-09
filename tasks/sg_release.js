'use strict';


var inquirer = require('inquirer');
var extendGruntPlugin = require('extend-grunt-plugin');

var gitHelper = require('./lib/helpers/git');
var dependenciesHelper = require('./lib/helpers/dependencies');
var messages = require('./lib/messages');
var version = require('./lib/version');


// ---


module.exports = function (grunt) {


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
      gitHelper.merge(grunt, process.cwd(), releaseBranchName, options.commitMessagePrefix, options.mergeToMasterMsg, checkoutDevelop);
    }

    function checkoutDevelop() {
      gitHelper.checkout(grunt, process.cwd(), options.developBranch, mergeIntoDevelopBranch);
    }

    function mergeIntoDevelopBranch() {
      gitHelper.merge(grunt, process.cwd(), releaseBranchName, options.commitMessagePrefix, options.mergeToMasterMsg, deleteTempReleaseBranch);
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
      gitHelper.commit(grunt, process.cwd(), options.commitMessagePrefix, options.developVersionCommitMsg, pushDevelopBranch);
    }

    function pushDevelopBranch() {
      gitHelper.push(grunt, process.cwd(), options.pushTo, options.developBranch, pushMasterBranch);
    }

    function pushMasterBranch() {
      gitHelper.push(grunt, process.cwd(), options.pushTo, options.masterBranch, pushReleaseTag);
    }

    function pushReleaseTag() {
      var tagNameOption = options.tagName;
      var releaseVersion = grunt.option('releaseVersion');
      var tagName = tagNameOption.replace('%VERSION%', releaseVersion);

      gitHelper.push(grunt, process.cwd(), options.pushTo, tagName, done);
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
      commitMessagePrefix: '',
      mergeToDevelopMsg: messages.mergeToDevelopMsg,
      mergeToMasterMsg: messages.mergeToMasterMsg,
      developVersionCommitMsg: messages.developVersionCommitMsg,
      tagName: 'v%VERSION%',
      pushTo: 'upstream',
      push: false // By default push should happen only at the end, during finish_sg_release subtask
    });

    extendGruntPlugin(grunt, require('grunt-bump'), {
      'bump': options,
      'bump-only': options
    });

    if (options.finishOnly !== true && options.finishOnly !== "true") {
      grunt.task.run('prepare_sg_release');
      grunt.task.run('bump');
    }
    
    if (options.finishOnly === true || options.finishOnly === "true") {
      // get the version again since we cannot call prepare_sg_release here
      version.getRelease(grunt, function () {
        releaseBranchName = options.tempReleaseBranch + '/v' + grunt.option('setversion');
      });
    }

    if (options.startOnly !== true && options.startOnly !== "true") {
      grunt.task.run('merge_sg_release');
      grunt.task.run('bump-only');
      grunt.task.run('finish_sg_release');
    }
  });

};

