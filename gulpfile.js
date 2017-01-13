var gulp = require('gulp');
var babel = require('gulp-babel'); var concat = require('gulp-concat');
var browserSync = require('browser-sync');

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('www/'))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('www/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(['src/js/header.js', 'src/js/app.js'])
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['es2015', 'react'] 
    }))
    .pipe(gulp.dest('www/js/'))
    .pipe(browserSync.stream());
});

gulp.task('imgs', function() {
  return gulp.src('src/imgs/**/*')
    .pipe(gulp.dest('www/imgs/'))
});

gulp.task('build',  ['html', 'css', 'js', 'imgs']);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: 'www/'
    }
  });

  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/css/**/*.css', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/imgs/**/*', ['imgs']);
});

gulp.task('default', ['build']);
