var gulp = require('gulp');
var babel = require('gulp-babel'); var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var _if = require('gulp-if');
var plumber = require('gulp-plumber'); 
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var fs = require('fs');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css')
var minifyHtml = require('gulp-htmlmin')
var rename = require('gulp-rename');
var markdown = require('gulp-markdown');
var jeditor = require('gulp-json-editor');

var serve = false;

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(_if(!serve, minifyHtml({collapseWhitespace: true})))
    .pipe(gulp.dest('www/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('css', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(_if(!serve, minifyCss()))
    .pipe(gulp.dest('www/css'))
    .pipe(_if(serve, browserSync.stream()));
});

function data() {
  var worksByYear = JSON.parse(fs.readFileSync('www/werke.json'))
  var editionsByYear = JSON.parse(fs.readFileSync('www/ausgaben.json'))

  var mapToObj = (obj, val) => { obj[val.id] = val; return obj; };
  var works = worksByYear.reduce(mapToObj, {});
  var editions = editionsByYear.reduce(mapToObj, {});

  return JSON.stringify({
    works: works,
    editions: editions,
    worksByYear: worksByYear.map((work) => work.id),
    editionsByYear: editionsByYear.map((edition) => edition.id)
  });
}

gulp.task('js', ['data'], function(cb) {
  return gulp.src('src/js/app.js')
    .pipe(_if(serve, plumber(function(err) {
      console.log((err.codeFrame) ? err.codeFrame : err);
      console.log(err.message);
    })))
    .pipe(replace('{/*DATA*/}', data()))
    .pipe(concat('app.js'))
    .pipe(babel({ presets: ['es2015', 'react'] }))
    .pipe(_if(!serve, uglify()))
    .pipe(gulp.dest('www/js/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('imgs', function() {
  return gulp.src('src/imgs/**/*')
    .pipe(gulp.dest('www/imgs/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('data-works', function() {
  function getYear(work, data) {
    var years = work.publishedIn
      .map((edition) => edition.replace(/.*\//, ''))
      .map((year) => parseInt(year));
    return Math.min.apply(Math, years);
  }

  return gulp.src('src/data/data.json')
    .pipe(jeditor(function(data) {
       return worksByYear = Object.keys(data.works)
         .map((id) => { data.works[id].id = id; return data.works[id]; })
         .map((work) => { work.year = getYear(work); return work; })
         .sort((work1, work2) => work1.year - work2.year);
    }))
    .pipe(rename('werke.json'))
    .pipe(gulp.dest('www'));
});

gulp.task('data-editions', function() {
  return gulp.src('src/data/data.json')
    .pipe(jeditor(function(data) {
      var editionsByYear = Object.keys(data.editions)
        .map((id) => { data.editions[id].id = id; return data.editions[id]; })
        .sort((edition1, edition2) => edition1.year - edition2.year);
      return editionsByYear;
    }))
    .pipe(rename('ausgaben.json'))
    .pipe(gulp.dest('www'));
});

gulp.task('data-md', function() {
  return gulp.src('src/data/**/*.md')
    .pipe(markdown())
    .pipe(replace(/.*/, function(html) {
      return JSON.stringify({content:html});
    }))
    .pipe(rename({extname:'.json'}))
    .pipe(gulp.dest('www/'));
});

gulp.task('data', ['data-works', 'data-editions', 'data-md']);

gulp.task('build',  ['html', 'css', 'js', 'imgs', 'data']);

gulp.task('serve', function(cb) {
  serve = true;

  runSequence('build', function() {
    browserSync.init({
      server: {
        baseDir: 'www/',
        middleware: function(req, res, next) {
          if (!/\/(css|js|imgs)/.test(req.url) && !/.*\.json/.test(req.url)) {
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
    gulp.watch('src/data/**/*', ['data']);

    cb();
  });
});

gulp.task('default', ['build']);
