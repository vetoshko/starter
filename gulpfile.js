'use strict';
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const less = require('gulp-less');
const gls = require('gulp-live-server');
const nunjucksRender = require('gulp-nunjucks-render');
const prettify = require('gulp-html-prettify');
const replace = require('gulp-replace');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const sourcemaps = require('gulp-sourcemaps');
const siteDB = require('./datasource/data.json');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const notify = require("gulp-notify");
const babel = require('gulp-babel');
const exec = require('child_process').exec;
const config = require('./config.json');

console.log('============', config)

gulp.task('less:dev', () => {
  var autoprefix = new LessPluginAutoPrefix({
    browsers: ["last 2 versions"]
  });

  return gulp.src('public/less/*.less')
    //.pipe(sourcemaps.init())
    .pipe(less({
      plugins: [autoprefix]
    })
      .on('error', notify.onError({
        message: "Error: <%= error.message %>",
        title: "Less Compile Error"
      }))
    )
    //.pipe(sourcemaps.write('.', {includeContent: false, mapSources: 'public/less/**'}))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('less:prod', () => {
  let cleancss = new LessPluginCleanCSS({
      advanced: true
    });

  let autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 20 versions", "IE 8", "IE 9"]
    });

  return gulp.src('public/less/*.less')
    .pipe(less({
      plugins: [autoprefix, cleancss]
    })
      .on('error', notify.onError({
        message: "Error: <%= error.message %>",
        title: "Less Compile Error"
      }))
    )
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('js', () => {
  return gulp.src('public/javascripts/sources/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    })
      .on('error', notify.onError({
        message: "Error: <%= error.message %>",
        title: "JS Compile Error"
      }))
    )
    .pipe(sourcemaps.write('../javascripts/'))
    .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('compress', () => {
  return gulp.src(['public/javascripts/dist/*.js', 'public/javascripts/app.js'])
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('sprites', () => {

  let spriteData = gulp.src('public/__icons/*.png').pipe(spritesmith({
    imgName: 'iconset.png',
    cssName: 'c-icon.less',
    padding: 10,
    cssTemplate: 'icons.hbs'
  }));

  let imgStream = spriteData.img
    .pipe(gulp.dest('public/images/'));
  let cssStream = spriteData.css
    .pipe(gulp.dest('public/less/components/'));

  return merge(imgStream, cssStream);
});

gulp.task('default', () => {
  let server = gls.new(['bin/www']);
  server.start();

  gulp.watch([
    'views/blocks/*.html', 
    'views/*.html', 
    'datasource/*.json', 
    'app.js', 
    'config.json', 
    'gulpfile.js', 
    'routes/**/*.js'
    ], function(file) {
      gutil.log('File:', path.basename(file.path), 'was', file.type, '=> livereload');
      server.start.bind(server)();
      server.notify.apply(server, [file]);
  });

  gulp.watch(['public/stylesheets/*.css', 'public/javascripts/*.js'], function(file) {
      gutil.log('File:', path.basename(file.path), 'was', file.type, '=> livereload');
      server.notify.apply(server, [file]);
  });

  gulp.watch(['public/javascripts/sources/*.js'], ['js']);
  gulp.watch(['public/less/*.less', 'public/less/**/*.less'], ['less:dev']);
  gulp.watch(['public/__icons/*.png'], ['sprites']);
  
});

gulp.task('compileHtml', function (cb) {
  exec('node __export.js', function (err, stdout, stderr) {
    console.log(stdout);
    cb(err);
  });
});


gulp.task('exportDPE', () => {
  let images, scripts, styles;
  
  images = new RegExp('src=+([\'\"])\/images\/(.[^\'\"]+)', 'g');
  scripts = new RegExp('src=+([\'\"])\/javascripts\/(.[^\'\"]+)', 'g');
  styles = new RegExp('src=+([\'\"])\/stylesheets\/(.[^\'\"]+)', 'g');

  gulp.src([ 'html/*.html'])
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(replace(images, 'src=$1@File("/files/images/$2")'))
    .pipe(replace(scripts, 'src=$1@File("/files/js/$2")'))
    .pipe(replace(styles, 'src=$1@File("/files/css/$2")'))
    .pipe(gulp.dest(`${config.buildDir}`));
});

gulp.task('exportHTML', ['compileHtml'], () => {
  
  gulp.src([ 'html/*.html'])
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(gulp.dest(`${config.buildDir}`));
});


gulp.task('copyStatic', ['less:prod', 'js'], () => {
  gulp.src(['!public/less', '!public/less/**', '!public/javascripts/sources/*', '!public/javascripts/sources', 'public/**/*', 'public/*' ])
    .pipe(gulp.dest(`${config.buildDir}`));
});

gulp.task('publish', ['exportHTML', 'copyStatic']);
gulp.task('publishDPE', ['exportDPE', 'copyStatic']);