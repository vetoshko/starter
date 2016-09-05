var path = require('path');
var combiner = require('stream-combiner2');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
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
var notify = require("gulp-notify");

gulp.task('less:dev', function() {
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


gulp.task('less:prod', function() {
  var cleancss = new LessPluginCleanCSS({
      advanced: true
    }),
    autoprefix = new LessPluginAutoPrefix({
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

gulp.task('compress', function() {
  return gulp.src(['public/javascripts/dist/*.js', 'public/javascripts/app.js'])
    .pipe(uglify())
    .pipe(concat('app.min.js'))
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

  gulp.watch(['public/less/*.less', 'public/less/**/*.less'], ['less:dev']);
  gulp.watch(['public/__icons/*.png'], ['sprites']);
  
});


gulp.task('exportDPE', function() {
  var images, scripts, styles;
  
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

gulp.task('exportHTML', function() {
  var src, href, url;

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
gulp.task('copyStatic', ['less:prod', 'compress'], function() {
  gulp.src(['public/**/*', 'public/*' ])
    .pipe(gulp.dest('export'));
});

gulp.task('publish', ['exportHTML', 'compress', 'less:prod', 'copyStatic']);
gulp.task('publishDPE', ['exportDPE', 'compress', 'less:prod']);