'use strict';
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sassdoc = require('sassdoc'),
    $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
  return gulp.src('styles/sass/*.scss')
    .pipe($.rubySass({
      style: 'compressed',
      sourcemap: false
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('styles/dist'))
});

gulp.task('scripts', function() {
  return gulp.src(['scripts/**/*.js', '!scripts/**/*.min.js'])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('scripts'))
});

gulp.task('sassdoc', function() {
  return sassdoc.documentize('styles/sass', 'docs/sass', {
    'display': {
      'access': ['public', 'private'],
      'alias': false,
      'watermark': true
    },
    'package': './package.json'
  });
});

gulp.task('default', ['styles', 'scripts', 'sassdoc']);

gulp.task('connect', connect.server({
  root: [__dirname],
  port: 9000,
  livereload: true,
  open: {}
}));
gulp.task('watch', ['connect'], function () {
  gulp.watch([
    '*.html',
    'styles/**/*.css',
    'app/scripts/**/*.js'
  ], function (e) {
    return gulp.src(e.path)
      .pipe(connect.reload());
  });
  gulp.watch('styles/**/*.scss', ['styles']);
  gulp.watch('scripts/**/*.js', ['scripts']);
});
