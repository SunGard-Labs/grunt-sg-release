'use strict';


var path = require('path');

var gitExtra = require('./lib/git_extra');

module.exports = function (grunt) {

  grunt.registerMultiTask('setup_test_folder', 'Setup the test folder containing a git repo', function () {

    var options = this.options({
      folder: 'tmp'
    });

    var tmpDir = path.resolve(options.folder);

    gitExtra.init(grunt, tmpDir, this.async());

  });

};

