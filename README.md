# grunt-sg-release

> The SunGard standard release script for HTML5 projects.

version: 0.0.3-rc

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
      developBranch: 'develop',
      masterBranch: 'master'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
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

#### grunt-bump options

Additionally to all the available options listed above, all the [grunt-bump](https://github.com/vojtajina/grunt-bump) options are available to be configured when using this task.

### Usage Examples

#### Default Options
In this example, the default options are used to create the release. Please refer to the **Options** section above to get to know  the default values.

```js
grunt.initConfig({
  sg_release: {
    options: {}
    run: {}
  }
})
```

#### Custom Options

In this example all possible configurable values are listed with their default values inside the **options** property of **sg_release** task. In addition some custom options are used to configure a **custom** target.

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
      mergeToDevelopMsg: 'Merge into develop',
      mergeToMasterMsg: 'Merge into master',
      developVersionCommitMsg: 'Increased version for development',
      // pushTo is an overlapped property, required by both sg_release and grunt-bump
      pushTo: 'upstream',
      // grunt-bump specific options
      bumpVersion: true,
      files: ['package.json'],
      updateConfigs: [], // array of config properties to update (with files)
      commit: true,
      commitMessage: 'Release v%VERSION%',
      commitFiles: ['package.json'], // '-a' for all files
      createTag: true,
      tagName: 'v%VERSION%',
      tagMessage: 'Version %VERSION%',
      push: true,
      gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
    },
    custom: {
      pushTo: 'origin',
      commitFiles: ['-a']
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 SunGard. Licensed under the MIT license.

