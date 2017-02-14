//thanks muchly to
// https://quickleft.com/blog/setting-up-a-clientside-javascript-project-with-gulp-and-browserify/

// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');
var gulpIgnore = require('gulp-ignore');
// Build Dependencies
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var mocha = require('gulp-mocha');
// Development Dependencies
var jshint = require('gulp-jshint');

// Test Dependencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('browserify-client', ['lint-public'], function() {
  return gulp.src('public/shared/core.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('core.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/bin'));
	
});
gulp.task('lint-client', function() {
  return gulp.src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('uglify', ['browserify-client'],function() {
  return gulp.src('build/core.js')
 
.pipe(uglify({mangle: false}).on('error', gutil.log))
    .pipe(rename('core.js'))
    .pipe(gulp.dest('public/bin'));
});

gulp.task('lint-public', function() {
  return gulp.src('./public/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
  return gulp.src('./test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});




//* not sure */
gulp.task('browserify-test', ['lint-test'], function() {
  return gulp.src('test/client/index.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('client-test.js'))
    .pipe(gulp.dest('build'));
});



gulp.task('watch', function() {
  gulp.watch(['public/**/*.js','!public/bin/*.js'], ['browserify-client', 'test']);
  gulp.watch('test/**/*.js', ['test']);
});

gulp.task('build', ['uglify']);


gulp.task('test', function() {
  gulp.
    src('./test/test.js').
    pipe(mocha()).
    on('error', function(err) {
      this.emit('end');
    });
});

gulp.task('go', ['test', 'build', 'watch']);





