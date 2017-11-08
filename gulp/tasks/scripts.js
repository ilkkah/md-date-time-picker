var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var browserSync = require('browser-sync');
var config = require('../config');

console.log('..........')

gulp.task('scripts', function () {
	return gulp.src(config.src.js)
	.pipe(debug())
	.pipe(babel())
	.pipe(gulp.dest(config.dist.js))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(uglify())
	.pipe(gulp.dest(config.dist.js))
	.pipe(browserSync.reload({
		stream: true
	}));
});
