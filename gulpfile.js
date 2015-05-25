var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
	gulp.src('src/ui-router-history.js')
	.pipe(concat('ui-router-history.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'))
});