'use strict';

var gulp = require('gulp'),
    notify = require("gulp-notify"),
    cleanCSS = require('gulp-minify-css'),
    minifyjs = require('gulp-js-minify'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    babelify = require('babelify'),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    jsImport = require('gulp-js-import'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat');

var paths = {
    sass: "dev/sass/",
    css: "css/",
    js: "js/"
};

//Convert ES6 ode in all js files in src/js folder and copy to 
//build folder as bundle.js
gulp.task("build", () => {
    return browserify({
        entries: ["./dev/js/index.js"]
    })
    .transform(babelify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
});

//compile sass to css
gulp.task('sass', () => {
    return gulp.src(paths.sass + 'style.sass')
        .pipe(sourcemaps.init())
          .pipe(sass.sync().on('error', sass.logError))
          .pipe(autoprefixer({ browsers: ['last 2 version']}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css))

        .pipe(connect.reload())
        .pipe(notify({
            title: 'Task Complete',
            message: 'Development task finished running',
            wait: true,
            onLast: true
        }));
});


gulp.task('minify-css', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});

// minify js after gulp-built
gulp.task('minify-js',  () => {
  gulp.src('./dist/bundle.js')
    .pipe(minifyjs())
    .pipe(gulp.dest('dist'));
});

// watch for changes 
gulp.task('watch', () => {
    gulp.watch(paths.sass + '**/*.sass', ['sass']);
});

//localhost:8080
gulp.task('web-server', () => {
    connect.server({
        livereload: true
    });
});

//Default task. This will be run when no task is passed in arguments to gulp
gulp.task("default",["build", "web-server", "watch"]);