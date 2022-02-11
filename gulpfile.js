const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
  return gulp
    .src('src/**/*.ts')
    .pipe(tsProject()).js.pipe(gulp.dest('dist'));
});

gulp.task('copy-types', () => {
  return gulp
    .src('src/**/binaryts.types.ts')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('build', 'copy-types'));
