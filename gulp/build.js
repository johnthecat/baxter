import config from './config';
import path from 'path';
import gulp from 'gulp';
import util from 'gulp-util';
import webpack from 'webpack-stream';
import minify from 'gulp-minify';
import eslint from 'gulp-eslint';

let errorHandler = (err, stats) => {
    if (err) {
        throw new util.PluginError(`webpack`, err);
    }
    util.log(`[webpack] ${stats.toString()}`);
};

gulp.task('build', ['eslint'], () => gulp.src(path.join(config.path.src, 'index.js'))
    .pipe(webpack(config.webpack, null, errorHandler))
    .pipe(gulp.dest(path.join(config.path.dist, '/')))
);

gulp.task('build:watch', ['build'], () => gulp.watch(path.join(config.path.src, '/**/*.js'), ['eslint', 'build']));

gulp.task('build:prod', ['eslint'], () => gulp.src(path.join(config.path.src, 'index.js'))
    .pipe(webpack(config.webpackDist, null, errorHandler))
    .pipe(minify(config.minify))
    .pipe(gulp.dest(path.join(config.path.dist, '/')))
);
