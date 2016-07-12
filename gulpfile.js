var path = require('path');
var combiner = require('stream-combiner2');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
//var server = require('gulp-express');
var gls = require('gulp-live-server');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify = require('gulp-html-prettify');
var replace = require('gulp-replace');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var siteDB = require('./datasource/data.json');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('jet-less', function() {
    var autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 10 versions", "IE 8", "IE 9", "IE 10"]
    });

    var cleancss = new LessPluginCleanCSS({});

  return gulp.src('public/jet-less/jet-style.less')
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }).on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    }))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('less:dev', function() {
    var autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 2 versions"]
    });

  return gulp.src('public/less/style.less')
    .pipe(less({
      plugins: [autoprefix]
    }).on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    }))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('less:prod', function() {
  var cleancss = new LessPluginCleanCSS({
      advanced: true
    }),
    autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 20 versions", "IE 8", "IE 9"]
    });

  return gulp.src('public/less/style.less')
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }).on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    }))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('compress', function() {
  return gulp.src(['public/jet-js/*.js'])
    .pipe(uglify())
    .pipe(concat('jet.min.js'))
    .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('sprites', function() {

  var spriteData = gulp.src('public/__icons/*.png').pipe(spritesmith({
    imgName: 'iconset.png',
    cssName: 'c-icon.less',
    padding: 10,
    cssTemplate: 'icons.hbs'
  }));

  var imgStream = spriteData.img
    .pipe(gulp.dest('public/images/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('public/less/components/'));

  return merge(imgStream, cssStream);
});

gulp.task('default', function() {
  var server = gls.new(['bin/www']);
  server.start();

  gulp.watch(['views/blocks/*.html','public/stylesheets/*.css', 'views/*.html', 'datasource/data.json', 'app.js', 'gulpfile.js', 'routes/**/*.js'], function(file) {
      gutil.log('File:', path.basename(file.path), 'was', file.type, '=> livereload');
      server.start.bind(server)();
      server.notify.apply(server, [file]);
  });
  gulp.watch(['public/javascripts/jet-js/*.js'], ['compress']);
  gulp.watch(['public/less/*.less', 'public/less/**/*.less'], ['less:dev']);
  gulp.watch(['public/jet-less/*.less', 'public/jet-less/**/*.less'], ['jet-less']);
  gulp.watch(['public/__icons/*.png'], ['sprites']);
});


gulp.task('export', function() {
  var images, scripts, styles;
  
  nunjucksRender.nunjucks.configure(['views/'], {
    watch: false
  });

  gulp.src([ '!views/layout.html', '!views/error.html', 'views/*.html', '!views/__*.html'])
    .pipe(nunjucksRender({
      isExport: true,
      ctx: siteDB
    }))
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(gulp.dest('export'));
});


gulp.task('copyStatic', ['less:prod', 'compress'], function() {
  gulp.src(['public/**/*', 'public/*'])
    .pipe(gulp.dest('export'));
});

gulp.task('publish', ['export', 'compress', 'less:prod', 'copyStatic']);