# grunt-sg-release

> The SunGard standard release script for HTML5 projects.

## About

This task provides the standard workflow for creating releases on git repositories.

### Requirements

In order to use this task you will need `git` installed and available as a system-wide command. **npm** and **Bower** are also required in order to validate HTML5 packages but you can disable this validation using the configurable options.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

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
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  sg_release: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 SunGard. Licensed under the MIT license.
