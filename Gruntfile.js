module.exports = function(grunt) {
  grunt.initConfig({
    destFolder: 'dist',
    distFolder: 'js',
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: '<%= distFolder %>/main.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: [
          {src: ['js/main.js'], dest: '<%= destFolder %>/js/main.min.js'},
          {src: ['js/foursquare.api.js'], dest: '<%= destFolder %>/js/foursquare.api.min.js'}
        ]
      }
    },
    cssmin: {
      target: {
        files: [
          {expand: true, src: 'css/style.css', dest: '<%= destFolder %>', ext: '.min.css'}
        ]
      }
    },
    minifyHtml: {
      options: {
        cdata: true
      },
      dist: {
        files: [
          {expand: true, src: '*.html', dest: '<%= destFolder %>', ext: '.html'}
        ]
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: 'css/*', dest: '<%= destFolder %>'},
          {expand: true, src: 'fonts/*', dest: '<%= destFolder %>'},
          {expand: true, src: 'images/*', dest: '<%= destFolder %>'},
          {expand: true, src: 'js/lib/*', dest: '<%= destFolder %>'}
        ]
      }
    },
    clean: {
      build: {
        src: 'dist/*'
      }
    },
    jshint: {
      files: ['js/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }
  }); // The end of grunt.initConfig

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-minify-html');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean', 'uglify', 'jshint', 'cssmin', 'minifyHtml', 'copy']);
};