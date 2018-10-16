"use strict";

module.exports = function (e) {
  e.initConfig({
    pkg: e.file.readJSON("package.json"),
    babel: {
      options: {
        sourceMap: false,
        presets: ["@babel/preset-env"]
      },
      dist: {
        files: [{
          expand: true,
          src: "src/**/*.js",
          filter: function filter(e) {
            return !e.match(new RegExp("node_modules", "gi"));
          }
        }]
      }
    },
    uglify: {
      build: {
        files: [{
          expand: true,
          src: ['src/**/*.js', '!src/**/*.min.js'],
          dest: 'src',
          cwd: '.',
          rename: function rename(dst, src) {
            // To keep the source js files and make new files as `*.min.js`:
            // return dst + '/' + src.replace('.js', '.min.js');
            // Or to override to src:
            return src;
          }
        }]
      }
    }
  }), 
  e.loadNpmTasks("grunt-eslint"), 
  e.loadNpmTasks("grunt-contrib-uglify"), 
  e.loadNpmTasks("grunt-babel"), 
  e.registerTask("default", []), 
  e.registerTask("ci_build", ["babel", "uglify"]);
};
