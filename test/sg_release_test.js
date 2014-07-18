'use strict';

var path = require('path');

var grunt = require('grunt');

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

    // TODO: would be better to have folder passed as a Gruntfile option
    // but grunt-contrib-nodeunit doesn't really have an option for that
    var dir = path.resolve('tmp');

    function checkBowerInstall() {
      dependenciesHelper.checkInstall(grunt, dir, 'bower', test.done);
    }

    dependenciesHelper.checkInstall(grunt, dir, 'npm', checkBowerInstall);
  },


  // ---


  testReleaseVersion: function (test) {
    test.expect(1);

    var defaultVersion = '1.2.0';

    version.releaseQuestion.default = defaultVersion;
    version.getRelease(grunt, function() {
      test.equal(grunt.option('setversion'), defaultVersion);
      test.done();
    }, true);
  }


};

