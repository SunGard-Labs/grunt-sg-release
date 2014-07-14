'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('sg_release', 'The SunGard standard release script for HTML5 projects.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      developBranch: 'develop',
      masterBranch: 'master',
      messagePrefix: 'Release '
    });

  });

};

