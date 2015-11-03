'use strict';

var config = require('./config');

var path = require('path');
var gulp = require('gulp');
var util = require('gulp-util');
var webpack = require('webpack-stream');
var minify = require('gulp-minify');

var webpackConfig = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel?presets[]=es2015'
            }
        ],
        resolve: {
            extensions: ['', '.js']
        }
    },
    output: {
        filename: 'index.js'
    }
};

var errorHandler = function (err, stats) {
    if (err) {
        throw new util.PluginError("webpack", err);
    }
    util.log("[webpack]", stats.toString());
};

gulp.task('build', function () {
    webpackConfig.devtool = 'inline-source-map';

    return gulp.src(path.join(config.path.src, 'index.js'))
        .pipe(webpack(webpackConfig, null, errorHandler))
        .pipe(gulp.dest(path.join(config.path.dist, '/')));
});

gulp.task('build:watch', ['build'], function () {
    gulp.watch(path.join(config.path.src, '/**/*.js'), ['build']);
});

gulp.task('build:prod', function () {
    return gulp.src(path.join(config.path.src, 'index.js'))
        .pipe(webpack(webpackConfig, null, errorHandler))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest(path.join(config.path.dist, '/')));
});
