'use strict';

var path = require('path');

var grunt = require('grunt');

var exec = require('../tasks/lib/helpers/exec');
var messages = require('../tasks/lib/messages');
var gitHelper = require('../tasks/lib/helpers/git');
var dependenciesHelper = require('../tasks/lib/helpers/dependencies');
var stdoutEqual = require('./helpers/stdout_equal.js');
var version = require('../tasks/lib/version');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/


// TODO: would be better to have folder passed as a Gruntfile option
// but grunt-contrib-nodeunit doesn't really have an option for that
// https://github.com/gruntjs/grunt-contrib-nodeunit/issues/26
var dir = path.resolve('tmp');
var releaseVersion = '1.2.0';
var releaseBranchName = 'release/v' + releaseVersion;

exports.sg_release = {

  setUp: function (done) {
    // setup here if necessary
    done();
  },


  // ---


  noGitAvailable: function (test) {
    test.expect(1);

    var gitExecName = gitHelper.execName;
    var gruntFatal = grunt.fatal;

    gitHelper.execName = 'nonExistingGitCommand';
    grunt.fatal = function mockGruntFatal(msg) {
      test.equal(msg, messages.noGitError);
    };

    gitHelper.check(grunt);

    gitHelper.execName = gitExecName;
    grunt.fatal = gruntFatal;

    test.done();
  },


  // ---


  testDependencies: function (test) {
    test.expect(0);

    function checkBowerInstall() {
      dependenciesHelper.checkInstall(grunt, dir, 'bower', false, test.done);
    }

    dependenciesHelper.checkInstall(grunt, dir, 'npm', false, checkBowerInstall);
  },


  // ---


  testReleaseVersion: function (test) {
    test.expect(1);

    var defaultVersion = releaseVersion;

    version.releaseQuestion.default = defaultVersion;
    version.getRelease(grunt, function() {
      test.equal(grunt.option('setversion'), defaultVersion);
      test.done();
    }, true);
  },


  // ---


  testNextVersion: function (test) {
    test.expect(1);

    var defaultVersion = '1.2.1-rc';

    version.releaseQuestion.default = defaultVersion;
    version.getNext(grunt, function() {
      test.equal(grunt.option('setversion'), defaultVersion);
      test.done();
    }, true);
  },


  // ---


  testCreateNewBranch: function (test) {
    test.expect(1);

    gitHelper.createBranch(grunt, dir, releaseBranchName, function () {
      exec('git branch', {
        grunt: grunt,
        dir: dir,
        done: function (stdout) {
          // output should contain the new branch name
          test.notEqual(stdout.indexOf(releaseBranchName), -1);
          test.done();
        }
      });
    });
  },


  // ---


  testCheckoutMaster: function (test) {
    test.expect(1);

    gitHelper.checkout(grunt, dir, 'master', function () {
      exec('git branch', {
        grunt: grunt,
        dir: dir,
        done: function (stdout) {
          // output should contain correct current branch indication
          test.notEqual(stdout.indexOf('* master'), -1);
          test.done();
        }
      });
    });
  },


  // ---


  testMergeIntoMaster: function (test) {
    test.expect(1);

    gitHelper.merge(grunt, dir, releaseBranchName, messages.mergeToMasterMsg, function (stdout) {
      // output should contain success message
      test.notEqual(stdout.indexOf('Merge made'), -1);
      test.done();
    });
  },


  // ---


  testCheckoutDevelop: function (test) {
    test.expect(1);

    gitHelper.checkout(grunt, dir, 'develop', function () {
      exec('git branch', {
        grunt: grunt,
        dir: dir,
        done: function (stdout) {
          // output should contain correct current branch indication
          test.notEqual(stdout.indexOf('* develop'), -1);
          test.done();
        }
      });
    });
  },


  // ---


  testMergeIntoDevelop: function (test) {
    test.expect(1);

    gitHelper.merge(grunt, dir, releaseBranchName, messages.mergeToDevelopMsg, function (stdout) {
      // output should contain success message
      test.notEqual(stdout.indexOf('Already up-to-date'), -1);
      test.done();
    });
  },


  // ---


  testRemoveBranch: function (test) {
    test.expect(1);

    gitHelper.deleteBranch(grunt, dir, releaseBranchName, function () {
      exec('git branch', {
        grunt: grunt,
        dir: dir,
        done: function (stdout) {
          // output should contain the new branch name
          test.equal(stdout.indexOf(releaseBranchName), -1);
          test.done();
        }
      });
    });
  },


  // ---


  testCommitDevelopment: function (test) {
    test.expect(1);

    var testContent = '{"name":"foo", "version":"0.0.2"}\n';

    // Touch 2 version files to simulate changes on repo
    grunt.file.write(dir + '/bower.json', testContent);
    grunt.file.write(dir + '/package.json', testContent);

    gitHelper.commit(grunt, dir, messages.developVersionCommitMsg, function (stdout) {
      // output should contain success commit msg
      test.notEqual(stdout.indexOf('2 files changed'), -1);
      test.done();
    });
  },


  // ---


  testPushDevelop: function (test) {
    test.expect(0);

    gitHelper.push(grunt, dir, 'origin', 'develop', function (stdout) {
      // if command have not failed, push was successful
      test.done();
    });
  },


  // ---


  testPushMaster: function (test) {
    test.expect(0);

    gitHelper.push(grunt, dir, 'origin', 'master', function (stdout) {
      // if command have not failed, push was successful
      test.done();
    });
  },


  // ---


  testPushTag: function (test) {
    test.expect(0);

    gitHelper.push(grunt, dir, 'origin', 'v1.0.0', function (stdout) {
      // if command have not failed, push was successful
      test.done();
    });
  }

};

