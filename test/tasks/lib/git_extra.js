'use strict';


var exec = require('child_process').exec;


function _exec(command, info) {

  info.grunt.log.debug('Using test dir: ' + info.dir);

  var options = {
    cwd: info.dir
  };

  exec(command, options, function (err, stdout, stderr) {

    info.grunt.log.debug(stdout);

    if (err) {
      info.grunt.log.debug(stderr);
      info.grunt.fatal('Could not run the command: ' + command);
    }

    info.done();
  });

}


// ---


function gitInit(grunt, dir, done) {

  _exec('git init', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitCheckoutDevelop(grunt, dir, done){

  _exec('git checkout -b develop', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitCommit(msg, grunt, dir, done){

  _exec('git commit -m \'' + msg + '\'', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitAdd(filename, grunt, dir, done){

  _exec('git add ' + filename, {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


module.exports = {
  init: gitInit,
  checkoutDevelop: gitCheckoutDevelop,
  commit: gitCommit,
  add: gitAdd
};

