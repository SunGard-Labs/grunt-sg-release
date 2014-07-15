'use strict';


var exec = require('child_process').exec;

function gitInit(grunt, dir, done) {

  grunt.log.debug('Using test dir: ' + dir);

  var options = {
    cwd: dir
  };

  exec('git init', options, function (err, stdout, stderr) {

    grunt.log.debug(stdout);

    if (err) {
      grunt.log.debug(stderr);
      grunt.fatal('Could not init the test repository');
    }

    done();

  });

}

module.exports = {
  init: gitInit
};

