import config from './config';
import path from 'path';
import gulp from 'gulp';
import eslint from 'gulp-eslint';

gulp.task('eslint', () => gulp.src(path.join(config.path.src, '/**/*.js'))
    .pipe(eslint('.eslintrc.json'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
