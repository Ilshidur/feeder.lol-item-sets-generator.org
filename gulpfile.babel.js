import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import runSequence from 'run-sequence';
import del from 'del';

gulp.task('clean', () =>
  del([
    'dist',
  ]),
);

gulp.task('lint', () =>
  gulp
    .src([
      'src/**/*.js',
      'dist/**/*.js',
      '!node_modules/**',
    ])
    .pipe(eslint())
    .pipe(eslint.format('node_modules/eslint-formatter-pretty'))
    .pipe(eslint.failAfterError()),
);

gulp.task('build', () =>
  gulp
    .src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-runtime'],
    }))
    .pipe(gulp.dest('dist')),
);

gulp.task('default', (callback) => {
  runSequence(
    'clean',
    'lint',
    'build',
    callback,
  );
});
