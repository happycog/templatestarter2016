# grunt-pixrem

> Generate pixel fallbacks for rem units with [Grunt](http://gruntjs.com/).

## Getting Started

This plugin requires [Grunt](http://gruntjs.com/) `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide which explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process you may install this plugin with the command:

```shell
npm install grunt-pixrem --save-dev
```

After the plugin has been installed, load it in your Gruntfile with:

```js
grunt.loadNpmTasks('grunt-pixrem');
```

## pixrem task

_Run this task with the `grunt pixrem` command._

Grunt-pixrem is a CSS post-processor that generates CSS with pixel fallbacks or replacements for rem units. Check the [browser data](http://caniuse.com/rem): if you want to use rem units and support < IE9, Opera Mini, or older Opera Mobile, this post-processor is for you.

For the node library, see [node-pixrem](https://github.com/robwierzbowski/node-pixrem).

### Options

#### rootvalue

Type: `String`  
Default: `16px`  

The root element font size. Can be px, rem, em, percent, or unitless pixel value.

#### replace

Type: `Boolean`  
Default: `false`  

Replace rules containing rems instead of adding fallbacks. Useful if you are generating a no-rem only stylesheet.

## Usage examples

### Add fallbacks with a root em value of 1.75em

```js
grunt.initConfig({
  pixrem: {
    options: {
      rootvalue: '1.75em'
    },
    dist: {
      src: 'app/css/main.css',
      dest: 'dist/main.css'
    }
});
```

### Create an IE8 / no-rem-support only stylesheet 

```js
grunt.initConfig({
  pixrem: {
    options: {
      rootvalue: '85%',
      replace: true
    },
    dist: {
      src: 'app/css/main.css',
      dest: 'dist/main.css'
    }
});
```

## Contribute

Report bugs and feature proposals in the [Github issue tracker](https://github.com/robwierzbowski/grunt-pixrem/issues). Run tests with Grunt. In lieu of a formal styleguide, take care to maintain the existing coding style. 

## Release History

0.1.1, Dec 15, 2013: Copy improvements.  
0.1.0, Dec 15, 2013: Initial release.  

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/robwierzbowski/grunt-pixrem/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

