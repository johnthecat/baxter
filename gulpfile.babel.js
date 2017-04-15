import gulp from 'gulp';
import wrench from 'wrench';

wrench.readdirSyncRecursive('./gulp')
    .filter((file) => (/\.(js)$/i).test(file))
    .forEach((file) => {
        require('./gulp/' + file);
    });

gulp.task('default', function () {
    gulp.start('build:prod');
});
