'use strict';


var path = require('path');

var gitExtra = require('./lib/git_extra');
var gitHelper = require('../../tasks/lib/helpers/git');

module.exports = function (grunt) {

  grunt.registerMultiTask(
    'setup_test_folder',
    'Setup the test folder containing a git repo',
    function setupTestFolderTask() {

    var options = this.options({
      remote_folder: 'tmp_remote',
      folder: 'tmp'
    });

    var remoteDir = path.resolve(options.remote_folder);
    var tmpDir = path.resolve(options.folder);

    var done = this.async();
    var depContent = '{"name":"foo", "version":"0.0.1"}\n';


    function createRepo() {
      gitExtra.init(grunt, remoteDir, cloneRepo);
    }

    function cloneRepo() {
      gitExtra.clone(grunt, tmpDir, remoteDir, createReadmeFile);
    }

    function createReadmeFile() {
      grunt.file.write(tmpDir + '/README.md', 'Hello world');
      gitExtra.add('README.md', grunt, tmpDir, commitReadmeFile);
    }

    function commitReadmeFile() {
      gitHelper.commit(grunt, tmpDir, 'Adding readme file', checkoutDevelop);
    }

    function checkoutDevelop() {
      gitExtra.checkoutDevelop(grunt, tmpDir, modifyReadmeFile);
    }

    function modifyReadmeFile() {
      grunt.file.write(tmpDir + '/README.md', 'Hello world\nNew changeset');
      gitExtra.add('README.md', grunt, tmpDir, commitReadmeFileChanges);
    }

    function commitReadmeFileChanges() {
      gitHelper.commit(grunt, tmpDir, 'Updating readme file', addNpmFiles);
    }

    function addNpmFiles() {
      grunt.file.write(tmpDir + '/package.json', depContent);
      gitExtra.add('package.json', grunt, tmpDir, addBowerFiles);
    }

    function addBowerFiles() {
      grunt.file.write(tmpDir + '/bower.json', depContent);
      gitExtra.add('bower.json', grunt, tmpDir, commitPackageFiles);
    }

    function commitPackageFiles() {
      gitHelper.commit(grunt, tmpDir, 'Adding package files', tagRepo);
    }

    function tagRepo() {
      gitExtra.tag(grunt, tmpDir, 'v1.0.0', 'Release v1.0.0', done);
    }

    (function start() {
      createRepo();
    })();

  });

};

