module.exports = grunt => {

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-sass");

  grunt.initConfig({
    clean: {
      dist: {
        src: ["dist/"]
      }
    },

    copy: {
      dist: {
        files: [

          // theme dependencies
          {
            expand: true,
            cwd: "sass",
            src: ["base/fonts/**/*.*", "!base/fonts/**/*.scss"],
            dest: "dist/"
          },
          {
            expand: true,
            cwd: "sass",
            src: ["base/icons/fonts/**/*.*"],
            dest: "dist/"
          },
          {
            expand: true,
            cwd: "sass",
            src: ["base/images/**/*.*"],
            dest: "dist/"
          }
        ]
      },

      setup: {
        files: [

          // theme base
          {
            expand: true,
            cwd: "node_modules/arcgis-js-api/themes",
            src: ["base/**/*.*"],
            dest: "sass/"
          },

          // starter theme
          {
            expand: true,
            cwd: "node_modules/arcgis-js-api/themes/light",
            src: ["main.scss"],
            dest: "sass/my-theme/"
          },

          // theme examples
          {
            expand: true,
            cwd: "node_modules/arcgis-js-api/themes",
            src: ["**/main.scss", "!base/*.*"],
            dest: "sass/examples/"
          }
        ],
        options: {

          // move in `my-theme` file config if https://github.com/gruntjs/grunt-contrib-copy/issues/299 is fixed
          process: (content, srcpath, destpath) => {
            if (destpath.indexOf("/my-theme/") === -1) {
              return content;
            }

            const defaultThemeHeader = "Theme: Light (Default)";
            const customThemeHeader = "Theme: My Theme";

            return content.replace(defaultThemeHeader, customThemeHeader);
          },

          noProcess: ["**/*.{ttf,woff}"]
        }
      }
    },

    sass: {
      options: {
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
        options: {
          spawn: false
        },
        files: ["sass/**/*.scss", "!sass/examples/**"],
        tasks: ["sass"]
      },
    }

  });

  grunt.registerTask("setup", ["copy:setup"]);
  grunt.registerTask("dist", ["clean", "sass", "copy:dist"]);

};
