var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css')
var jsonMinify = require('gulp-json-minify')
var htmlmin = require('gulp-htmlmin')
var rename = require("gulp-rename")
var uglify = require('gulp-uglify')
var pkg = require('./package.json')
var browserSync = require('browser-sync').create()

// Minify JSON
gulp.task('json:minify', function() {
  return gulp.src([
      './*.json',
      '!./*.min.json',	  
	  '!./package*.json'
    ])
    .pipe(jsonMinify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
})

// JSON
gulp.task('json', ['json:minify']);

// Minify CSS
gulp.task('css:minify', function() {
  return gulp.src([
      './*.css',
      '!./*.min.css'
    ])
    .pipe(cleanCSS())    
	.pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
})

// CSS
gulp.task('css', ['css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './*.js',
      '!./*.min.js',
	  '!./gulpfile.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
});

// JS
gulp.task('js', ['js:minify'])

// Minify HTML
/*gulp.task('html:minify', function() {
  return gulp.src([
      './*.html',
      '!./index.html'
    ])
	.pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
})

// HTML
gulp.task('html', ['html:minify'])*/

// Default task
gulp.task('default', ['json', 'css', 'js'])

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./docs"
    }
  })
})

// Dev task
gulp.task('dev', ['css', 'js', 'json', 'browserSync'], function() {
  gulp.watch('./*.css', ['css']);
  gulp.watch('./*.js', ['js'])
  gulp.watch('./*.json', ['json'])
  gulp.watch('./*.html', browserSync.reload)
})
