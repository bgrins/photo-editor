/*global module:false*/
module.exports = function(grunt) {

  var staging ='intermediate/';
  var output = 'publish/';

  grunt.initConfig({
    meta: {
      version: '0.1.1',
      banner: '/*! JavaScript Photo Editor - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://briangrinstead.com/photo-editor/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Brian Grinstead */'
    },
    lint: {
      files: ['grunt.js', 'js/app/**/*.js']
    },
    staging: staging,
    output: output,
    usemin: {
      files: ['dist/index.html']
    },
    exclude: '.git .gitignore build/** node_modules/** grunt.js package.json *.md'.split(' '),
    mkdirs: {
      staging: '<config:exclude>',
      output: '<config:exclude>'
    },
    rev: {
      js: 'dist/js/*.js',
      css: 'dist/css/*.css',
      img: 'dist/img/**'
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      shared: {
        src: ['<banner:meta.banner>', 'js/shared/*.js'],
        dest: 'dist/concat/shared.js'
      },
      app: {
        src: ['<banner:meta.banner>', 'js/plugins/*.js', 'js/app/*.js'],
        dest: 'dist/concat/app.js'
      },
      appHtml: {
        src: ['index.html'],
        dest: 'dist/index.html'
      },
      css: {
        src: ['css/bootstrap.css', 'css/ui.css', 'css/jquery.Jcrop.css', 'css/app.css'],
        dest: 'dist/css/all.concat.css'

      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.shared.dest>'],
        dest: 'dist/js/shared.min.js'
      },
      gradient: {
        src: ['<banner:meta.banner>', '<config:concat.app.dest>'],
        dest: 'dist/js/app.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        'Backbone': true,
        'Handlebars': true,
        'FileReaderJS': true,
        '_': true,
        '$': true,
        'console': true,
        'log': true,
        'SL': true
      }
    },
    cssmin: {
      css: {
        src: '<config:concat.css.dest>',
        dest: 'dist/css/all.min.css'
      }
    }/*,
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    } */
  });

  grunt.loadNpmTasks('node-build-script');
  grunt.loadNpmTasks('grunt-css');
  grunt.registerTask('default', 'lint concat min cssmin usemin');

};
