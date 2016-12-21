'use strict';
let path = require('path');
let gulp = require('gulp');
let gutil = require('gulp-util');
let less = require('gulp-less');
let gls = require('gulp-live-server');
let nunjucksRender = require('gulp-nunjucks-render');
let prettify = require('gulp-html-prettify');
let replace = require('gulp-replace');
let spritesmith = require('gulp.spritesmith');
let merge = require('merge-stream');
let sourcemaps = require('gulp-sourcemaps');
let siteDB = require('./datasource/data.json');
let LessPluginAutoPrefix = require('less-plugin-autoprefix');
let LessPluginCleanCSS = require('less-plugin-clean-css');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let notify = require("gulp-notify");
let babel = require('gulp-babel');

gulp.task('less:dev', () => {
    var autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 2 versions"]
    });

  return gulp.src('public/less/style.less')
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
      browsers: ["last 30 versions", "IE 8", "IE 9"]
    });

  return gulp.src('public/less/style.less')
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

  gulp.watch(['views/blocks/*.html', 'views/*.html', 'datasource/data.json', 'app.js', 'gulpfile.js', 'routes/**/*.js'], function(file) {
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


gulp.task('exportDPE', () => {
  let images, scripts, styles;
  
  nunjucksRender.nunjucks.configure(['views/'], {
    watch: false
  });
  
  images = new RegExp('src=+([\'\"])\/images\/(.[^\'\"]+)', 'g');
  scripts = new RegExp('src=+([\'\"])\/javascripts\/(.[^\'\"]+)', 'g');
  styles = new RegExp('src=+([\'\"])\/stylesheets\/(.[^\'\"]+)', 'g');

  gulp.src(['views/*.html', '!views/error.html', '!views/layout.html', '!views/__*.html'])
    .pipe(nunjucksRender({
      isExport: true,
      ctx: siteDB
    }))
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(replace(images, 'src=$1@File("/files/images/$2")'))
    .pipe(replace(scripts, 'src=$1@File("/files/js/$2")'))
    .pipe(replace(styles, 'src=$1@File("/files/css/$2")'))
    .pipe(gulp.dest('export'));
    
});

gulp.task('exportHTML', () => {
  let src, href, url;

  src = /src=([\'\"])(?!\/\/)(?!\.*\/?__core)(\.*\/?)(.[^\'\"]*)\1/g;
  href = /href=([\'\"])(?!\/\/)(?!\.*\/?__core)(\.*\/?)(.[^\'\"]*)\1/g;
  url = /url\(([\'\"]?)(?!\/\/)(?!\.*\/?__core)(\.*\/?)(.[^\)]*)\1/g;
  
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
    .pipe(replace(src, 'src=$1$3$1'))
    .pipe(replace(href, 'href=$1$3$1'))
    .pipe(replace(url, 'url($1$3$1'))
    .pipe(gulp.dest('export'));
});

// TODO: ignore less folder
gulp.task('copyStatic', ['less:prod', 'js'], () => {
  gulp.src(['!public/less', '!public/less/**', '!public/javascripts/sources/*', '!public/javascripts/sources', 'public/**/*', 'public/*' ])
    .pipe(gulp.dest('export'));
});

gulp.task('publish', ['exportHTML', 'copyStatic']);
gulp.task('publishDPE', ['exportDPE', 'copyStatic']);