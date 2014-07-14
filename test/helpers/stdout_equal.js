'use strict';

// Simple implementation to allow tests based on stdout messages
// from: https://github.com/gruntjs/grunt-contrib-jshint

var grunt = require('grunt');
var hooker = require('hooker');


// Helper for testing stdout
module.exports = function stdoutEqual(callback, done) {
  var actual = '';
  // Hook process.stdout.write
  hooker.hook(process.stdout, 'write', {
    // This gets executed before the original process.stdout.write.
    pre: function(result) {
      // Concatenate uncolored result onto actual.
      actual += grunt.log.uncolor(result);
      // Prevent the original process.stdout.write from executing.
      return hooker.preempt();
    }
  });
  // Execute the logging code to be tested.
  callback();
  // Restore process.stdout.write to its original value.
  hooker.unhook(process.stdout, 'write');
  console.log(actual);
  // Actually test the actually-logged stdout string to the expected value.
  done(actual);
};

