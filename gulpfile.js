var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('jsx', function() {
    return gulp.src('./src/jsx/**.jsx')
            .pipe(react())
            .pipe(gulp.dest('./build/jsx'));
});

gulp.task('js', function() {
    return gulp.src('./src/js/**.js')
            .pipe(gulp.dest('./build/js'));
});

gulp.task('css', function() {
    return gulp.src('./src/css/**.css')
            .pipe(gulp.dest('./build/css'));
});

gulp.task('build', ['jsx', 'js', 'css']);

gulp.task('default', ['build'], function() {
    gulp.watch('./src/', ['build']);
});
