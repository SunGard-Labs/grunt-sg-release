'use strict';


var exec = require('../../../tasks/lib/helpers/exec');


function gitInit(grunt, dir, done) {

  exec('git init', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitCheckoutDevelop(grunt, dir, done){

  exec('git checkout -b develop', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitCommit(msg, grunt, dir, done){

  exec('git commit -m \'' + msg + '\'', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitAdd(filename, grunt, dir, done){

  exec('git add ' + filename, {
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

