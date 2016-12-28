'use strict'

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babelify = require('babelify');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var babel = require('gulp-babel');


// Processing pipelines
gulp.task('jshint', () => gulp
    .src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('bundle', () => {
    var b = browserify({
        entries: './src/js/index.js',
        debug: true
    }).transform(babelify.configure({
        presets: ["es2015"]
    }));
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
           .pipe(uglify())
           .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('styles', () => gulp
    .src('src/css/main.scss')
    .pipe(sass())
    .on('error', console.log)
    .pipe(gulp.dest('public/css'))
);

gulp.task('html', () => gulp
    .src('src/*.html')
    .pipe(gulp.dest('public'))
);

gulp.task('data', () => gulp
    .src('src/data/*')
    .pipe(gulp.dest('public/data'))
);

// Watch styles
gulp.task('watchStyles', () => {
    gulp.watch('src/**/*.scss', ['styles']);
});
// Watch js
gulp.task('watchJs', () => {
    gulp.watch('src/**/*.js', ['jshint', 'bundle'])
});
// Watch html
gulp.task('watchHtml', () => {
    gulp.watch('src/**/*.html', ['html'])
});

gulp.task('watch', ['watchStyles', 'watchJs', 'watchHtml']);
gulp.task('default', ['styles', 'html', 'data', 'bundle'], () => {
    gutil.log('Up and running');
});
