const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const jsonMinify = require('gulp-json-minify');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create();

// Minify JSON
function json_minify() {
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
        .pipe(browserSync.stream());
}

// JSON
const json = gulp.series(json_minify);

// Minify CSS
function css_minify() {
    return gulp.src([
            './*.css',
            '!./*.min.css'
        ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('.'))
        .pipe(browserSync.stream());
}

// CSS
const css = gulp.series(css_minify);

// Minify JavaScript
function js_minify() {
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
        .pipe(browserSync.stream());
}

// JS
const js = gulp.series(js_minify);

// Configure the browserSync task
function browserSyncTask() {
    browserSync.init({
        server: { baseDir: "." }
    })
}

// Watch
gulp.watch(['./*.json', '!./*.min.json'], json);
gulp.watch(['./*.css', '!./*.min.css'], css);
gulp.watch(['./*.js', '!./*.min.js'], js);
gulp.watch(['./*.min.css', './*.min.js', './*.min.json', './*.html'], browserSync.reload);

// Default task
exports.default = gulp.series(json, css, js);
// Dev task
exports.dev = gulp.series(browserSyncTask);