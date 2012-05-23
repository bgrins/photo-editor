/*global module:false*/
module.exports = function(grunt) {

  var staging ='intermediate/';
  var output = 'publish/';
  
  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Gradient Generator Concept - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://briangrinstead.com/gradient/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Brian Grinstead */'
    },
    staging: 'intermediate/',
    output: 'publish/',
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
      js: 'publish/dist/js/*.js',
      css: 'publish/dist/js/*.css',
      img: 'publish/dist/img/**'
    },
    lint: {
      files: ['grunt.js', 'js/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'js/shared/*.js'],
        dest: 'dist/concat/shared.js'
      },
      gradient: {
        src: ['<banner:meta.banner>', 'js/plugins/*.js', 'js/app/*.js'],
        dest: 'dist/concat/app.js'
      },
      gradientHtml: {
        src: ['index.html'],
        dest: 'dist/index.html'
      }
    },
    css: {
        'dist/css/all.min.css': ['css/bootstrap.css', 'css/ui.css', 'css/jquery.Jcrop.css', 'css/app.css'],
        'dist/css/all.min.css': ['css/*.css'],
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/js/shared.min.js'
      },
      gradient: {
        src: ['<banner:meta.banner>', '<config:concat.gradient.dest>'],
        dest: 'dist/js/app.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });
  
  grunt.loadNpmTasks('node-build-script');
  grunt.registerTask('default', 'concat min');

};
