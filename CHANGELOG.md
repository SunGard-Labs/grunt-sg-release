
# 1.0.0 / 2015-08-04


## Features

  * Add possibility to stop release in the middle

## Breaking Changes

The sg_release task is now a multitask. This means you need to provide a target in its config for it to do anything.

Before:
```js
'sg-release': {
  options: { ... }
}
```

After:
```js
'sg_release': {
  options: { ... }
  myTarget: {}
}
```

(See [gruntjs/grunt#279](https://github.com/gruntjs/grunt/issues/279))
