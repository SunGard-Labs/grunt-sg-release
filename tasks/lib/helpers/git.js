'use strict';


var which = require('which');

var messages = require('../messages');
var exec = require('./exec');


function testForExec() {

  try {
    which.sync(module.exports.execName);
    return true;
  } catch (ex) {
    return false;
  }

}


// ---


function check(grunt) {

  if (!testForExec()) {
    grunt.fatal(messages.noGitError);
  } else {
    grunt.log.debug(messages.gitFound);
  }

}


// ---


function checkout(grunt, dir, branchName, done) {

  exec('git checkout ' + branchName, {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function merge(grunt, dir, mergeOptions, mergeFromBranch, msgPrefix, msg, done) {

  exec('git merge --no-ff ' + (mergeOptions || "") + ' -m "' + msgPrefix + ' ' + msg + '" ' + mergeFromBranch, {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function createBranch(grunt, dir, branchName, done) {

  checkout(grunt, dir, '-b ' + branchName, done);

}


// ---


function deleteBranch(grunt, dir, branchName, done) {

  exec('git branch -D ' + branchName, {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function deleteRemoteBranch(grunt, dir, pushTo, branchName, done) {

  exec('git push ' + pushTo + ' :' + branchName, {
    grunt: grunt,
    dir: dir,
    done: done
  });

}

// ---


function commit(grunt, dir, msgPrefix, msg, done) {

  exec('git commit -a -m "' + msgPrefix + ' ' + msg + '"', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function push(grunt, dir, remote, value, done) {

  exec('git push ' + remote + ' ' + value, {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


module.exports = {
  execName: 'git',
  check: check,
  checkout: checkout,
  commit: commit,
  createBranch: createBranch,
  deleteBranch: deleteBranch,
  deleteRemoteBranch: deleteRemoteBranch,
  merge: merge,
  push: push
};

