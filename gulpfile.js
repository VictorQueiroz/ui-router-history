var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('build', function () {
	gulp.src(['src/**/*.js','!src/**/*_test.js'])
	.pipe(concat('ui-router-history.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(wrapper({
		header: `(function () {`,
		footer: `});`
	}))
	.pipe(gulp.dest('dist'))
});