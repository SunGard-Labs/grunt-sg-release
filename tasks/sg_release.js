'use strict';


var gitHelper = require('./lib/helpers/git');
var dependenciesHelper = require('./lib/helpers/dependencies');
var messages = require('./lib/messages');

module.exports = function (grunt) {

  grunt.registerMultiTask('sg_release', 'The SunGard standard release script for HTML5 projects.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      developBranch: 'develop',
      masterBranch: 'master',
      messagePrefix: 'Release '
    });

    var done = this.async();

    function checkNpmInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'npm', checkBowerInstall);
    }

    function checkBowerInstall() {
      dependenciesHelper.checkInstall(grunt, process.cwd(), 'bower', done);
    }

    (function start() {
      gitHelper.check(grunt);
      checkNpmInstall();
    })();

  });

};

