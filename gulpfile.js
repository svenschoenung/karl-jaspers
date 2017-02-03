var gulp = require('gulp');

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var _if = require('gulp-if');
var plumber = require('gulp-plumber'); 
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css')
var minifyHtml = require('gulp-htmlmin')
var rename = require('gulp-rename');
var markdown = require('gulp-markdown');
var jeditor = require('gulp-json-editor');
var imagemin = require('gulp-imagemin');
var gm = require('gulp-gm');
var changed = require('gulp-changed');

var merge = require('merge-stream');
var through = require('through2').obj;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var glob = require('glob');
var touch = require('touch');
var mkdirp = require('mkdirp');

var fs = require('fs');
var path = require('path');

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

gulp.task('md', function() {
  var data = require('./src/data/data.json');
  Object.keys(data.editions).forEach((edition) => {
    mkdirp.sync(path.dirname('./src/data/ausgaben/' + edition));
    touch.sync('./src/data/ausgaben/' + edition + '.md');
  });
  Object.keys(data.works).forEach((work) => {
    mkdirp.sync('./src/data/werke/');
    touch.sync('./src/data/werke/' + work + '.md');
  });
});

function readData() {
  return JSON.parse(fs.readFileSync('src/data/data.json'));
}

function jsData() {
  var data = readData();
  data = addYearAndIdToWorks(data);
  data = addIdAndNameToEditions(data);

  var worksByYear = sortWorksByYear(data);
  var editionsByYear = sortEditionsByYear(data);

  var editionsByName = editionsByYear.reduce((byName, edition) => {
    byName[edition.name] = byName[edition.name] || [];
    byName[edition.name].push(edition.id);
    return byName;
  }, {});

  return JSON.stringify({
    works: data.works,
    editions: data.editions,
    worksByYear: worksByYear.map((work) => work.id),
    editionsByYear: editionsByYear.map((edition) => edition.id),
    editionsByName: editionsByName
  });
}

gulp.task('js', function(cb) {
  return gulp.src('src/js/app.js')
    .pipe(_if(serve, plumber(function(err) {
      console.log((err.codeFrame) ? err.codeFrame : err);
      console.log(err.message);
    })))
    .pipe(replace('{/*DATA*/}', jsData()))
    .pipe(concat('app.js'))
    .pipe(babel({ presets: ['es2015', 'react'] }))
    .pipe(_if(!serve, uglify()))
    .pipe(gulp.dest('www/js/'))
    .pipe(_if(serve, browserSync.stream()));
});

gulp.task('imgs', function() {
  var base = {base:'src/imgs/'};

  var imgs = gulp.src('src/imgs/{links/,}*.{jpg,png,svg}')
    .pipe(changed('www/imgs/'));

  var imgsEditions = gulp.src('src/imgs/ausgaben/**/*.{jpg,png}', base)
    .pipe(rename({extname:'.png'}))
    .pipe(changed('www/imgs/'))
    .pipe(gm((file) => file.setFormat('png')));

  var imgsEditions100 = gulp.src('src/imgs/ausgaben/**/*.{jpg,png}', base)
    .pipe(rename({suffix:'.100px', extname:'.png'}))
    .pipe(changed('www/imgs/'))
    .pipe(gm((file) => file.resize(100, 100).setFormat('png')))

  var imgsEditions200 = gulp.src('src/imgs/ausgaben/**/*.{jpg,png}', base)
    .pipe(rename({suffix:'.200px', extname:'.png'}))
    .pipe(changed('www/imgs/'))
    .pipe(gm((file) => file.resize(200, 200).setFormat('png')))
  
  return merge(imgs, imgsEditions, imgsEditions100, imgsEditions200) 
    .pipe(imagemin())
    .pipe(gulp.dest('www/imgs/'))
    .pipe(_if(serve, browserSync.stream()));
});

function getYearFromEdition(edition) {
  return edition.replace(/.*\/(\d{4})\/?.*/, '$1');
}

function addYearAndIdToWorks(data) {
  Object.keys(data.works).forEach((workId) => {
    var work = data.works[workId];
    var years = work.publishedIn
      .map((edition) => getYearFromEdition(edition))
      .map((year) => parseInt(year));
    var year =  Math.min.apply(Math, years);
    work.year = year;
    work.id = workId;
  });
  return data;
}

function sortWorksByYear(data) {
  return Object.keys(data.works)
   .map((workId) => data.works[workId])
   .sort((work1, work2) => work1.year - work2.year);
}

gulp.task('json-works', function() {
  return gulp.src('src/data/data.json')
    .pipe(jeditor(addYearAndIdToWorks))
    .pipe(jeditor(sortWorksByYear))
    .pipe(rename('werke.json'))
    .pipe(gulp.dest('www'));
});

function addIdAndNameToEditions(data) {
  var images = ['umschlag', 'cover', 'einband', 'titelseite'];
  Object.keys(data.editions).forEach((editionId) => {
    var edition = data.editions[editionId]; 
    edition.id = editionId;
    edition.name = editionId.replace(/\/.*/, '');
    edition.images = glob.sync('src/imgs/ausgaben/' + editionId + '/*')
      .map((f) => path.parse(f).name)
      .sort((f1, f2) => images.indexOf(f1) - images.indexOf(f2));
    edition.contains = Object.keys(data.works).filter((workId) =>
      data.works[workId].publishedIn.indexOf(editionId) >= 0
    );
    edition.year = getYearFromEdition(editionId);
  });
  return data;
}

function sortEditionsByYear(data) {
 return Object.keys(data.editions)
   .map((editionId) => data.editions[editionId])
   .sort((edition1, edition2) => edition1.year - edition2.year);
}

gulp.task('json-editions', function() {
  return gulp.src('src/data/data.json')
    .pipe(jeditor(addIdAndNameToEditions))
    .pipe(jeditor(sortEditionsByYear))
    .pipe(rename('ausgaben.json'))
    .pipe(gulp.dest('www'));
});

gulp.task('json-work-detail', function() {
  var data = addYearAndIdToWorks(readData());
  return gulp.src('src/data/werke/*.md')
    .pipe(markdown())
    .pipe(through(function(file, enc, cb) {
      var id = file.path.replace(/.*\/(.*).html$/, '$1');
      var json = Object.assign({}, data.works[id], {
        desc:file.contents.toString()
      });
      file.contents = new Buffer(JSON.stringify(json));
      cb(null, file);
    }))
    .pipe(rename({extname:'.json'}))
    .pipe(gulp.dest('www/werke'))
});

gulp.task('json-edition-detail', function() {
  var data = addIdAndNameToEditions(readData());
  return gulp.src('src/data/ausgaben/*/*.md')
    .pipe(markdown())
    .pipe(through(function(file, enc, cb) {
      var id = file.path.replace(/.*\/(.*\/.*).html$/, '$1');
      var json = Object.assign({}, data.editions[id], {
        notes:file.contents.toString()
      });
      file.contents = new Buffer(JSON.stringify(json));
      cb(null, file);
    }))
    .pipe(rename({extname:'.json'}))
    .pipe(gulp.dest('www/ausgaben'))
});

gulp.task('json', ['json-works', 'json-editions', 
                   'json-work-detail', 'json-edition-detail']);

gulp.task('build',  ['html', 'css', 'js', 'imgs', 'json']);

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
    gulp.watch('src/imgs/**/*', ['imgs']);
    gulp.watch('src/data/**/*', ['json', 'js']);

    cb();
  });
});

gulp.task('default', ['build']);
