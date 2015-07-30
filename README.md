# grunt-sg-release

> The SunGard standard release script for HTML5 projects.

version: 0.2.5-rc

[![Build Status](https://travis-ci.org/SunGard-Labs/grunt-sg-release.svg?branch=master)](https://travis-ci.org/SunGard-Labs/grunt-sg-release)

## About

This task provides a standard workflow for creating releases on git repositories. It extends the [grunt-bump](https://github.com/vojtajina/grunt-bump) plugin task in order to provide some of the essential release steps. Getting to know both tasks will help a lot when you want to configure your custom releases.

## Requirements

### Grunt

First of all, this plugin requires Grunt. If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

### Git, Bower and npm

In order to use this task you will need `git` installed and available as a system-wide command. **npm** and **Bower** are also required in order to validate HTML5 packages but you can disable this validation using the configurable options.

### Gitflow branches

This release task was created to work with the [Gitflow Workflow](https://www.atlassian.com/git/workflows#!workflow-gitflow). If your Git repository is not using something similar, chances are that you do not should use this plugin.

Your Git repository will need to have both *develop* and *master* branches created and pushed to the remote server. Also, do not try to recreate existing versions, this will break [grunt-bump](https://github.com/vojtajina/grunt-bump) release cycle.

## Getting Started

Once you're familiar with all the requirements, you may install this plugin with this command:

```shell
npm install grunt-sg-release --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sg-release');
```

## The "sg_release" task

### Overview
In your project's Gruntfile, add a section named `sg_release` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sg_release: {
    options: {
      skipBowerInstall: true,
      developBranch: 'develop',
      masterBranch: 'master',
      files: [
        'package.json',
        'README.md'
      ],
      commitMessage: 'Release v%VERSION%',
      commitFiles: ['-a'], // '-a' for all files
      pushTo: 'origin',
      mergeOptions: ''
    }
  },
})
```

### Options

#### options.skipBowerInstall
Type: `Boolean`
Default value: false

Skip the execution of `bower install` command

#### options.skipNpmInstall
Type: `Boolean`
Default value: false

Skip the execution of `npm install` command

#### options.developBranch
Type: `String`
Default value: 'develop'

Name of the branch used as a "development branch" in your repository.

#### options.masterBranch
Type: `String`
Default value: 'master'

Name of the branch used as a "master branch" in your repository.

#### options.tempReleaseBranch
Type: `String`
Default value: 'release'

Name prefix of the branch used as a temporary release branch in your repository.

#### options.commitMessagePrefix
Type: `String`
Default value: ''

Prefix to be added before the commit messages below. It's just an empty string by default. Also note that a space will be always added between the prefix and the message.

#### options.mergeToDevelopMsg
Type: `String`
Default value: 'Merge into develop'

Commit message to be used when merging changes into the develop branch.

#### options.mergeToMasterMsg
Type: `String`
Default value: 'Merge into master'

Commit message to be used when merging changes into the master branch.

#### options.developVersionCommitMsg
Type: `String`
Default value: 'Increased version for development'

Commit message to be used in the development version update commit.

#### options.pushTo
Type: `String`
Default value: 'upstream'

Reference to the git remote repository to push to.

#### options.mergeOptions
Type : `String`
Default value: ''

Merge options are applied during the merge of one branch into another, e.g. for automatically applying the option to always auto-merge 'theirs' you can pass '--strategy-option theirs', see http://git-scm.com/docs/git-merge

#### options.startOnly
Type: `Boolean`
Default value: 'false'

If true, the task will ony create the release branch and change the version. Useful for e.g. hotfixes that are done by multiple participants.

A sample configuration for a release & hotfix approach could be : 

```js
grunt.initConfig({
  sg_release: {
        options: {
            skipBowerInstall: true,
            skipNpmInstall: true,
            files: [
                'package.json',
                'bower.json'
            ],
            commitFiles: ['-a'],
            tagName: '%VERSION%',
            developBranch: 'develop',
            masterBranch: 'master',
            pushTo: "origin"
        },
        release: {
            options: {
                commitMessage: 'Release v%VERSION%',
                tempReleaseBranch: 'release',
                push: false,
                createTag: true
            }
        },
        hotfixStart: {
            options: {
                commitMessage: 'Hotfix ' + grunt.option('releaseVersion'),
                tempReleaseBranch: 'hotfix',
                push: true,
                startOnly: true
            }
        },
        hotfixFinish: {
            options: {
                commitMessage: 'Hotfix ' + grunt.option('releaseVersion'),
                tempReleaseBranch: 'hotfix',
                finishOnly: true,
                deleteRemoteBranch : true
            }
        }
    }
});
```
A release can then be made with 'grunt sg_release:release --releaseVersion 2.0.0 --developVersion 2.1.0-SNAPSHOT'
A hotfix can be started with 'grunt sg_release:hotfixStart --releaseVersion 2.0.1 --developVersion 2.1.0-SNAPSHOT' and finished  with 'grunt sg_release:hotfixFinish --releaseVersion 2.0.1 --developVersion 2.1.0-SNAPSHOT'


#### options.finishOnly
Type: `Boolean`
Default value: 'false'

If true, the task will finish a release that was started with startOnly.

#### options.deleteRemoteBranch
Type: `Boolean`
Default value: 'false'

If true, the branch pushed to the remote earlier will get deleted. 

#### grunt-bump options

Additionally to all the available options listed above, all the [grunt-bump](https://github.com/vojtajina/grunt-bump) options are available to be configured when using this task.

### Usage Example

In this example all possible configurable values are listed with their default values inside the **options** property of **sg_release** task. Feel free to modify them inside your Gruntfile to better suit your project configuration.

```js
grunt.initConfig({
  sg_release: {
    options: {
      // sg_release specific properties
      skipBowerInstall: false,
      skipBowerInstall: false,
      developBranch: 'develop',
      masterBranch: 'master',
      tempReleaseBranch: 'release',
      commitMessagePrefix: '',
      mergeToDevelopMsg: 'Merge into develop',
      mergeToMasterMsg: 'Merge into master',
      developVersionCommitMsg: 'Increased version for development',
      startOnly: false,
      finishOnly: false,
      deleteRemoteBranch: false,
      // pushTo and tagName are overlapped properties, used by both sg_release and grunt-bump
      pushTo: 'upstream',
      tagName: 'v%VERSION%',
      // grunt-bump specific options
      bumpVersion: true,
      files: ['package.json'],
      updateConfigs: [], // array of config properties to update (with files)
      commit: true,
      commitMessage: 'Release v%VERSION%',
      commitFiles: ['package.json'], // '-a' for all files
      createTag: true,
      tagMessage: 'Version %VERSION%',
      push: false, // push during the first bump phase is deactivated by default
      gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
    }
  }
})
```

## Setting release version number

When running the task you will be prompted to enter the release version number. Additionally, you will also be prompted to enter a version number to be used on the **develop** branch.

It is possible to specify a `releaseVersion` and `developVersion` on command line in order to skip these question and use the provided values when invoking the task. See the example below:

```shell
grunt sg_release --releaseVersion 1.0.0 --developVersion 1.0.1-rc
```

## Creating a hotfix
A hotfix follows the same flow as a release but it usually branches off the master branch. All you have to do is to first checkout the master branch, then call the sg_release task. 

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 SunGard. Licensed under the MIT license.

