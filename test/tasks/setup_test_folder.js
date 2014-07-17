'use strict';


var path = require('path');

var gitExtra = require('./lib/git_extra');

module.exports = function (grunt) {

  grunt.registerMultiTask(
    'setup_test_folder',
    'Setup the test folder containing a git repo',
    function setupTestFolderTask() {

    var options = this.options({
      folder: 'tmp'
    });

    var tmpDir = path.resolve(options.folder);

    var done = this.async();
    var depContent = '{"name":"foo", "version":"0.0.1"}\n';


    function createReadmeFile() {
      grunt.file.write(tmpDir + '/README.md', 'Hello world');
      gitExtra.add('README.md', grunt, tmpDir, commitReadmeFile);
    }

    function commitReadmeFile() {
      gitExtra.commit('Adding readme file', grunt, tmpDir, checkoutDevelop);
    }

    function checkoutDevelop() {
      gitExtra.checkoutDevelop(grunt, tmpDir, modifyReadmeFile);
    }

    function modifyReadmeFile() {
      grunt.file.write(tmpDir + '/README.md', 'Hello world\nNew changeset');
      gitExtra.add('README.md', grunt, tmpDir, commitReadmeFileChanges);
    }

    function commitReadmeFileChanges() {
      gitExtra.commit('Updating readme file', grunt, tmpDir, addNpmFiles);
    }

    function addNpmFiles() {
      grunt.file.write(tmpDir + '/package.json', depContent);
      gitExtra.add('package.json', grunt, tmpDir, addBowerFiles);
    }

    function addBowerFiles() {
      grunt.file.write(tmpDir + '/bower.json', depContent);
      gitExtra.add('bower.json', grunt, tmpDir, done);
    }

    gitExtra.init(grunt, tmpDir, createReadmeFile);

  });

};

