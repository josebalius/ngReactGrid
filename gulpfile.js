var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var browserify = require('gulp-browserify');
var packageJSON = require('./package.json');

gulp.task('css', function () {
    return gulp.src('./src/css/**.css')
        .pipe(concat('ngReactGrid.css'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('img', function () {
    return gulp.src('./src/img/**.png')
        .pipe(gulp.dest('./build/img'));
});

gulp.task('build-grid', function () {
    var jsxFilter = gulpFilter('**/*.jsx');
    var jsFilter = gulpFilter("**/*.js");
    return gulp.src(['./src/js/main.js', './src/jsx/**.jsx'])
        .pipe(jsFilter)
        .pipe(browserify())
        .pipe(jsFilter.restore())
        .pipe(jsxFilter)
        .pipe(react())
        .pipe(jsxFilter.restore())
        .pipe(concat('ngReactGrid.js'))
        .pipe(replace(/{\$version}/g, packageJSON.version))
        .pipe(gulp.dest('./build/js/'))
});

gulp.task('uglify-build', ['build-grid'], function () {
    return gulp.src(['./build/js/ngReactGrid.js'])
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename('ngReactGrid.min.js'))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('build', ['build-grid', 'uglify-build', 'css', 'img']);

gulp.task('default', ['build'], function () {
    gulp.watch('./src/**', ['build']);
});
