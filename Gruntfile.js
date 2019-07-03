module.exports = grunt => {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({

    browserSync: {
      options: {
        server: {
          baseDir: "./"
        },
        startPath: "preview/",
        watchTask: true
      },

      bsFiles: {
        src: "dist/**/*.css"
      }
    },

    clean: {
      dist: {
        src: "dist/"
      }
    },

    copy: {
      dist: {
        files: [

          // theme dependencies
          {
            expand: true,
            cwd: "sass/",
            src: ["base/fonts/**/*.*", "!base/fonts/**/*.scss"],
            dest: "dist/"
          },
          {
            expand: true,
            cwd: "sass/",
            src: "base/icons/fonts/**/*.*",
            dest: "dist/"
          },
          {
            expand: true,
            cwd: "sass/",
            src: "base/images/**/*.*",
            dest: "dist/"
          }
        ]
      },

      setup: {
        options: {

          // move to `my-theme` file config when
          // https://github.com/gruntjs/grunt-contrib-copy/issues/299 is fixed
          process: (content, srcpath, destpath) => {
            if (destpath.indexOf("/my-theme/") === -1) {
              return content;
            }

            const defaultThemeHeader = "Theme: Light (Default)";
            const customThemeHeader = "Theme: My Theme";

            return content.replace(defaultThemeHeader, customThemeHeader);
          },

          // prevents binary file corruption during copy
          // see https://github.com/gruntjs/grunt-contrib-copy/issues/64
          noProcess: "**/*.{ttf,woff}"
        },

        files: [

          // theme base
          {
            expand: true,
            cwd: "node_modules/arcgis-js-api/themes",
            src: "base/**/*.*",
            dest: "sass/"
          },

          // starter theme
          {
            expand: true,
            cwd: "node_modules/arcgis-js-api/themes/light",
            src: "main.scss",
            dest: "sass/my-theme/"
          },

          // theme examples
          {
            expand: true,
            cwd: "node_modules/arcgis-js-api/themes",
            src: ["**/main.scss", "!base/*.*"],
            dest: "sass/examples/"
          }
        ]
      }
    },

    sass: {
      options: {
        implementation: require("node-sass"),
        outputStyle: "compressed"
      },

      dist: {
        files: [
          {
            expand: true,
            cwd: "sass/",
            src: ["**/*.scss", "!{base,examples}/**"],
            ext: ".css",
            dest: "dist/"
          }
        ]
      }
    },

    watch: {
      sass: {
        files: ["sass/**/*.scss", "!sass/examples/**"],
        tasks: "build",
        options: {
          interrupt: true
        }
      }
    }

  });


  grunt.registerTask("setup", ["copy:setup"]);
  grunt.registerTask("dev", ["build", "preview", "watch:sass"]);
  grunt.registerTask("build", ["clean", "sass", "copy:dist"]);
  grunt.registerTask("preview", ["browserSync"]);

};
