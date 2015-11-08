/// <binding />
var gulp = require('gulp');
var sh = require('shelljs');
//var jshint = require('gulp-jshint');

var paths = {
    appSrcJS: "./wwwroot/js/*js",
}

gulp.task('default', function () {
    sh.exec('node -v');
});