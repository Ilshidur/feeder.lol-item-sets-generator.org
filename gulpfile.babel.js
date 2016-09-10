import gulp from 'gulp';
import babel from 'gulp-babel';
import runSequence from 'run-sequence';
import del from 'del';

gulp.task('clean', () => {
  return del([
    'dist'
  ]);
});

gulp.task('build', () => {
  return gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', (callback) => {
  runSequence(
    'clean',
    'build',
    callback
  );
});
