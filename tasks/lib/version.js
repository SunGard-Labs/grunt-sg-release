'use strict';


var inquirer = require('inquirer');
var semver = require('semver');

var messages = require('./messages');


// ---


var releaseVersionQuestion = {
  type: 'input',
  name: 'releaseVersion',
  message: messages.releaseVersionQuestion,
  validate: function (input) {
    if (semver.valid(input)) {
      return true;
    } else {
      return messages.versionNotValid;
    }
  },
  filter: function (input) {
    return semver.valid(input);
  }
};


// ---


function getReleaseVersion(grunt, done, mockInput) {

    if (!grunt.option('releaseVersion')) {

      var prompt = inquirer.prompt([releaseVersionQuestion], function (answers) {
        grunt.option('setversion', answers['releaseVersion']);
        done();
      });

      if (mockInput) {
        prompt.rl.emit('line');
      }

    }
}


// ---


module.exports = {
  releaseQuestion: releaseVersionQuestion,
  getRelease: getReleaseVersion
};

