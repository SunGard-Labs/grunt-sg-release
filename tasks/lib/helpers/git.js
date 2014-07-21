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


function merge(grunt, dir, mergeFromBranch, msg, done) {

  exec('git merge --no-ff -m "' + msg + '" ' + mergeFromBranch, {
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


function commit(msg, grunt, dir, done){

  exec('git commit -a -m "' + msg + '"', {
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
  merge: merge
};

