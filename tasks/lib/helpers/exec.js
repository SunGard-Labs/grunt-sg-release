'use strict';


var _exec = require('child_process').exec;


module.exports = function exec(command, info) {

  info.grunt.log.debug(command);
  info.grunt.log.debug('Using dir: ' + info.dir);

  var options = {
    cwd: info.dir
  };

  _exec(command, options, function execDone(err, stdout, stderr) {

    info.grunt.log.debug(stdout);

    if (err) {
      info.grunt.log.error(stderr);
      info.grunt.fatal('Could not run the command: ' + command);
    }

    info.done(stdout);
  });

};

