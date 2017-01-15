var gulp = require('gulp');
var babel = require('gulp-babel'); var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var _if = require('gulp-if');
var plumber = require('gulp-plumber'); 
var runSequence = require('run-sequence');
var header = require('gulp-header');
var footer = require('gulp-footer');
var addSrc = require('gulp-add-src');

var serve = false;

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('www/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('css', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('www/css'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('js', function(cb) {
  return gulp.src('src/data.json')
    .pipe(_if(serve, plumber(function(err) {
      console.log((err.codeFrame) ? err.codeFrame : err);
      console.log(err.message);
    })))
    .pipe(header('var data = '))
    .pipe(footer(';'))
    .pipe(addSrc.append('src/js/app.js'))
    .pipe(concat('app.js'))
    .pipe(babel({ presets: ['es2015', 'react'] }))
    .pipe(gulp.dest('www/js/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('imgs', function() {
  return gulp.src('src/imgs/**/*')
    .pipe(gulp.dest('www/imgs/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('build',  ['html', 'css', 'js', 'imgs']);

gulp.task('serve', function(cb) {
  serve = true;

  runSequence('build', function() {
    browserSync.init({
      server: {
        baseDir: 'www/',
        middleware: function(req, res, next) {
          if (!/\/(css|js|imgs)/.test(req.url)) {
            req.url = '/';
          }
          next();
        }
      }
    });

    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/data.json', ['js']);
    gulp.watch('src/imgs/**/*', ['imgs']);

    cb();
  });
});

gulp.task('default', ['build']);
