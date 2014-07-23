'use strict';


var messages = require('../messages');
var exec = require('./exec');


// ---


function checkInstall(grunt, dir, command, skipValidation, done) {

  if (!skipValidation && !grunt.option('no' + command)) {
    exec(command + ' install', {
      grunt: grunt,
      dir: dir,
      done: done
    });
  } else {
    done();
  }

}


// ---


module.exports = {
  checkInstall: checkInstall
};

