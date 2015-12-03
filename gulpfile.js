"use strict";
var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    uncss = require('gulp-uncss'),
    runSequence = require('run-sequence'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    zip = require('gulp-vinyl-zip'),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    fontello = require("gulp-fontello");

var packageName = 'encal';

gulp.task('minify-assets', function () {
    return gulp.src('src/newtab.html')
        .pipe(useref())
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', uncss({
            ignore: [
                /\.table/
            ],
            html: ["src/*.html", "src/html/*.html"]
        })))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest(packageName));
});

gulp.task('minify-html', function () {
    return gulp.src('src/html/*.html')
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(gulp.dest(packageName + '/html'));
});

gulp.task('fontello', function() {
  return gulp.src('src/fontello/config.json')
    .pipe(fontello())
    .pipe(gulp.dest('src/fontello'));
});

gulp.task('clean-folder', function () {
    return del([
        packageName
    ]);
});

gulp.task('copy-manifest', function () {
    return gulp.src('src/manifest.json')
        .pipe(gulp.dest(packageName));
});

gulp.task('copy-font', function () {
    return gulp.src('src/fontello/font/encal.woff')
        .pipe(gulp.dest(packageName + '/fontello/font'));
});

gulp.task('clean-zip', function () {
    return del([
        packageName + '.zip'
    ]);
});

gulp.task('zip', function () {
    return gulp.src(packageName + "/**/*")
        .pipe(zip.dest(packageName + '.zip'));
});

gulp.task('replace-manifest', function () {
    gulp.src(['src/manifest.json'])
        .pipe(replace(/"key": ".*"/g, '"key":"<APPLICATION_KEY>"'))
        .pipe(replace(/"client_id": ".*"/g, '"client_id":"<CLIENT_ID>.apps.googleusercontent.com"'))
        .pipe(rename("src/sample_manifest.json"))
        .pipe(gulp.dest(''));
});

gulp.task('default', function (callback) {
    runSequence(['minify-assets', 'minify-html'],
        callback);
});

gulp.task('recreate', function (callback) {
    runSequence(['clean-folder', 'clean-zip'], ['minify-assets', 'minify-html', 'copy-manifest', 'copy-font'], ['zip', 'replace-manifest'],
        callback);
});
