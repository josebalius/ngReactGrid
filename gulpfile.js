var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var packageJSON = require('./package.json');

gulp.task('css', function() {
    return gulp.src('./src/css/**.css')
            .pipe(concat('ngReactGrid-' + packageJSON.version + '.css'))
            .pipe(gulp.dest('./build/css'));
});

gulp.task('img', function() {
    return gulp.src('./src/img/**.png')
            .pipe(gulp.dest('./build/img'));
});

gulp.task('build-grid', function() {
    var jsxFilter = gulpFilter('**/*.jsx');
    return gulp.src(['./src/js/**.js', './src/jsx/**.jsx'])
            .pipe(jsxFilter)
            .pipe(react())
            .pipe(jsxFilter.restore())
            .pipe(concat('ngReactGrid-' + packageJSON.version + '.js'))
            .pipe(replace(/{\$version}/g, packageJSON.version))
            .pipe(gulp.dest('./build/js/'))
});

gulp.task('uglify-build', ['build-grid'], function() {
    return gulp.src(['./build/js/ngReactGrid-' + packageJSON.version + '.js'])
            .pipe(uglify({
                preserveComments: 'some'
            }))
            .pipe(rename('ngReactGrid-' + packageJSON.version + '.min.js'))
            .pipe(gulp.dest('./build/js'))
})

gulp.task('build', ['build-grid', 'uglify-build', 'css', 'img']);

gulp.task('default', ['build'], function() {
    gulp.watch('./src/**', ['build']);
});
