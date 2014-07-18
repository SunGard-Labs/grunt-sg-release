'use strict';


var inquirer = require('inquirer');
var semver = require('semver');

var messages = require('./messages');


// ---


var releaseVersionQuestion = {
  type: 'input',
  name: 'releaseVersion',
  message: null,
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


function _getVersion(optionName, optionOutput, message, grunt, done, mockInput) {

    if (!grunt.option(optionName)) {

      releaseVersionQuestion.message = message;

      var prompt = inquirer.prompt([releaseVersionQuestion], function (answers) {
        grunt.option(optionOutput, answers['releaseVersion']);
        releaseVersionQuestion.message = null; 
        done();
      });

      if (mockInput) {
        prompt.rl.emit('line');
      }

    }
}


// ---


function getReleaseVersion(grunt, done, mockInput) {

  _getVersion('releaseVersion', 'setversion', messages.releaseVersionQuestion, grunt, done, mockInput);

}


// ---


function getNextVersion(grunt, done, mockInput) {

  _getVersion('releaseVersion', 'setversion', messages.releaseNextQuestion, grunt, done, mockInput);

}


// ---


module.exports = {
  releaseQuestion: releaseVersionQuestion,
  getRelease: getReleaseVersion,
  getNext: getNextVersion
};

