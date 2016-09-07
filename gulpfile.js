var gulp = require('gulp');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function () {
  return del([
    'dist'
  ]);
});

gulp.task('build', function () {
  return gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', function (callback) {
  runSequence(
    'clean',
    'build',
    callback
  );
});
