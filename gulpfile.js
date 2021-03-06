var gulp = require('gulp');

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var _if = require('gulp-if');
var plumber = require('gulp-plumber'); 
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css')
var minifyHtml = require('gulp-htmlmin')
var rename = require('gulp-rename');
var markdown = require('gulp-markdown');
var jeditor = require('gulp-json-editor');
var imagemin = require('gulp-imagemin');
var gm = require('gulp-gm');
var changed = require('gulp-changed');
var rev = require('gulp-rev-all');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');
var webpack2 = require('webpack');
var markdownToJson = require('gulp-markdown-to-json');

var merge = require('merge-stream');
var through = require('through2').obj;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var glob = require('glob');
var touch = require('touch');
var mkdirp = require('mkdirp');

var fs = require('fs');
var path = require('path');

var webpackConfig = require('./webpack.config.js');
var config = require('./config.json');
var data = require('./data.js');

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(_if(!config.serve, minifyHtml({collapseWhitespace: true})))
    .pipe(gulp.dest('www/'))
    .pipe(_if(config.serve, browserSync.stream()));
});

gulp.task('css', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(_if(!config.serve, minifyCss()))
    .pipe(gulp.dest('www/css'))
    .pipe(_if(config.serve, browserSync.stream()));
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

gulp.task('data', ['imgs'], function(cb) {
  return gulp.src('src/data/data.json')
    .pipe(jeditor(json => data.init(json)))
    .pipe(gulp.dest('src/js'))
});

gulp.task('js-client', ['data'], function() {
  return gulp.src('src/js/client.jsx')
    .pipe(_if(config.serve, plumber(function(err) {
      console.log((err.codeFrame) ? err.codeFrame : err);
      console.log(err.message);
    })))
    .pipe(webpack(webpackConfig(!config.serve), webpack2))
    .pipe(babel({ presets: ['es2015', 'react'], compact: true }))
    .pipe(_if(!config.serve, uglify().on('error', (err) => console.log(err))))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('www/js/'))
    .pipe(_if(config.serve, browserSync.stream()));
});

gulp.task('js-server', ['js-client'], function() {
});

gulp.task('js', ['js-client', 'js-server']);

gulp.task('imgs', function() {
  var base = {base:'src/imgs/'};

  var imgs = gulp.src('src/imgs/{links/,}*.{jpg,png,svg}')
    .pipe(changed('www/'));

  var imgsEditions = config.imageSizes.map(size => {
    return gulp.src('src/imgs/ausgaben/**/*.{jpg,png}', base)
      .pipe(_if(size > 0, rename({suffix:'_' + size + 'px'})))
      .pipe(changed('www/'))
      .pipe(_if(size > 0, gm((file) => file.resize(size, size))));
  });
 
  return merge(imgs, merge(imgsEditions)) 
    .pipe(imagemin())
    .pipe(gulp.dest('www/'))
    .pipe(_if(config.serve, browserSync.stream()));
});

gulp.task('json-works', ['imgs'], function() {
  return gulp.src('src/data/data.json')
    .pipe(jeditor(data.init))
    .pipe(jeditor(data => data.worksByYearAndTitle.map(w => data.works[w])))
    .pipe(rename('werke.json'))
    .pipe(gulp.dest('www'));
});

gulp.task('json-editions', ['imgs'], function() {
  return gulp.src('src/data/data.json')
    .pipe(jeditor(data.init))
    .pipe(jeditor(data => data.editionsByYearAndTitle.map(e => data.editions[e])))
    .pipe(rename('ausgaben.json'))
    .pipe(gulp.dest('www'));
});

gulp.task('json-work-detail', ['imgs'], function() {
  var d = data.load();
  return gulp.src('src/data/werke/*.md')
    .pipe(markdown())
    .pipe(through(function(file, enc, cb) {
      var id = file.path.replace(/.*\/(.*).html$/, '$1');
      d.works[id].desc = file.contents.toString();
      file.contents = new Buffer(JSON.stringify(d.works[id]));
      cb(null, file);
    }))
    .pipe(rename({extname:'.json'}))
    .pipe(gulp.dest('www/werke'))
});

gulp.task('json-edition-detail', ['imgs'], function() {
  var d = data.load();
  return gulp.src('src/data/ausgaben/*/*.md')
    .pipe(markdown())
    .pipe(through(function(file, enc, cb) {
      var id = file.path.replace(/.*\/(.*\/.*).html$/, '$1');
      d.editions[id].notes = file.contents.toString();
      file.contents = new Buffer(JSON.stringify(d.editions[id]));
      cb(null, file);
    }))
    .pipe(rename({extname:'.json'}))
    .pipe(gulp.dest('www/ausgaben'))
});

gulp.task('json-text', function() {
  return gulp.src('src/text/**/*.md')
    .pipe(markdownToJson(require('marked')))
    .pipe(gulp.dest('www/'));
});

gulp.task('json', ['json-works', 'json-editions', 
                   'json-work-detail', 'json-edition-detail', 
                   'json-text']);

gulp.task('txt', function() {
  return gulp.src('src/*.txt')
    .pipe(gulp.dest('www'));
});

gulp.task('build',  ['html', 'css', 'js', 'imgs', 'json', 'txt']);

gulp.task('serve', function(cb) {
  config.serve = true;

  runSequence('build', function() {
    browserSync.init({
      server: {
        baseDir: 'www/',
        middleware: function(req, res, next) {
          if (!/\.(json|css|js|png|jpg|svg)$/.test(req.url)) {
            req.url = '/';
          } else if (/_v-/.test(req.url)) {
            req.url = req.url.replace(/_v-.*\./, '.');
          }
          next();
        }
      }
    });

    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/js/**/*.js{,x}', ['js']);
    gulp.watch('src/imgs/**/*', ['imgs']);
    gulp.watch('src/data/**/*', ['json', 'js']);
    gulp.watch('src/text/**/*', ['json-text']);

    cb();
  });
});

gulp.task('dist', ['build'], function() {
  var revFiles = gulp.src('www/**/*.{js,css,html}')
    .pipe(rev.revision({
       dontRenameFile: [/html$/],
       dontSearchFile: [/js$/],
       transformFilename: function(file, fullHash) {
         var ext = path.extname(file.path);
         var hash = fullHash.substring(0, 10);
         var hashed = gutil.replaceExtension(file.path, '_v-' + hash + ext);
         return path.basename(hashed);
       }
    }))
    .pipe(through(function(file, enc, cb) {
      file.path = file.revPathOriginal;
      cb(null, file);
    }));
  var copyFiles = gulp.src(['www/**', '!www/**/*.{js,css,html}']);

  return merge(revFiles, copyFiles).pipe(gulp.dest('dist'));
});

gulp.task('default', ['dist']);
