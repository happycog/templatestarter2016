"use strict";

module.exports = function (grunt) {
  var pkg = require("../package.json");

  grunt.registerMultiTask(pkg.name, pkg.description, function () {
    var csswring = require("../index");
    var fs = require("fs-extra");

    var options = this.options({});

    this.files.forEach(function (file) {
      var dest;
      var map;
      var processed;
      var src;

      if (file.src.length !== 1) {
        grunt.fail.warn("This Grunt plugin does not support multiple source files.");
      }

      src = file.src[0];
      dest = file.dest;

      if (!fs.existsSync(src)) {
        grunt.log.warn("Source file \"" + src + "\" not found.");

        return;
      }

      if (options.map) {
        options.from = src;
        options.to = dest;
      }

      processed = csswring.wring(fs.readFileSync(src, "utf8"), options);
      fs.outputFileSync(dest, processed.css);
      grunt.log.writeln("File \"" + dest + "\" created.");

      if (processed.map) {
        map = dest + ".map";
        fs.outputFileSync(map, processed.map);
        grunt.log.writeln("File \"" + map + "\" created.");
      }
    });
  });
};
