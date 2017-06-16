const gulp = require('gulp');
const runSequence = require('run-sequence');
const argv = require('yargs').argv;
const git = require('gulp-git');

gulp.task('add', function () {
    console.log('adding...');
    return gulp.src('.')
        .pipe(git.add());
});

gulp.task('commit', function () {
    console.log('commiting');
    if (argv.m) {
        return gulp.src('.')
            .pipe(git.commit(argv.m));
    }
});

gulp.task('push', function () {
    console.log('pushing...');
    if (argv.o) {
        git.push(argv.o, 'master', function (err) {
            if (err) throw err;
        });
    }

});

gulp.task('deploy', function () {
    runSequence('add', 'commit', 'push');
})