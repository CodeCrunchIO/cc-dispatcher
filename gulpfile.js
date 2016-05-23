var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var concat  = require('gulp-concat');

// default src path
var JS_SRC_PATH     = 'src/dispatcher.js';
// default release path
var RELEASE_PATH    = 'build/release';

// build task
gulp.task('build', function() {
    // require file system
    var fs = require('fs');

    // read original src
    fs.createReadStream(JS_SRC_PATH)
    // pipe then write original src
    .pipe(fs.createWriteStream(RELEASE_PATH + '/dispatcher.js'));

    // set the src
    return gulp.src(JS_SRC_PATH)
    // set the build name
    .pipe(concat('dispatcher.js'))
    // uglify!
    .pipe(uglify({ mangle : true }))
    // rename
    .pipe(rename({ extname : '.min.js' }))
    // save to release path
    .pipe(gulp.dest(RELEASE_PATH));
});

// default task
gulp.task('default', function() {
    gulp.start('build');
});