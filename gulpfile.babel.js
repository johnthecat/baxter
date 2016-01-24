'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

wrench.readdirSyncRecursive('./gulp').filter(function (file) {
    return (/\.(js)$/i).test(file);
}).map(function (file) {
    require('./gulp/' + file);
});

gulp.task('default', function () {
    gulp.start('build:prod');
});
