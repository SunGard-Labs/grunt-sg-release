'use strict';

var which = require('which');

var messages = require('../messages');


function testForExec() {

  try {
    which.sync(module.exports.execName);
    return true;
  } catch (ex) {
    return false;
  }

}

function check(grunt) {

  if (!testForExec()) {
    grunt.fatal(messages.noGitError);
  } else {
    grunt.log.debug('Git command found!');
  }

}


// ---


module.exports = {
  execName: 'git',
  check: check
};

