'use strict';


var exec = require('../../../tasks/lib/helpers/exec');


function gitInit(grunt, dir, done) {

  exec('git init --bare', {
    grunt: grunt,
    dir: dir,
    done: done
  });

}


// ---


function gitClone(grunt, dir, remoteDir, done) {

  exec('git clone ' + remoteDir + ' ' + dir, {
    grunt: grunt,
    dir: remoteDir,
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
  clone: gitClone,
  add: gitAdd
};

