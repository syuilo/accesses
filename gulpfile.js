'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const ls = require('gulp-livescript');
const stylus = require('gulp-stylus');
const tslint = require('gulp-tslint');
const merge = require('merge2');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:ts',
	'build:scripts',
	'build:styles',
	'build:copy'
]);

gulp.task('build:ts', () => {
	const tsResult = project
		.src()
		.pipe(ts(project));

	return merge([
		tsResult.pipe(gulp.dest('./built/')),
		tsResult.dts.pipe(gulp.dest('./built/'))
	]);
});

gulp.task('build:scripts', () => {
	return gulp.src('./src/web/**/*.ls')
		.pipe(ls())
		.pipe(gulp.dest('./built/web/'));
});

gulp.task('build:styles', () => {
	return gulp.src('./src/web/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('./built/web/'));
});

gulp.task('build:copy', () => {
	return gulp.src([
		'./src/web/**/*',
		'!**/*.ts',
		'!**/*.ls',
		'!**/*.styl'
	])
		.pipe(gulp.dest('./built/web/'));
});

gulp.task('test', [
	'lint'
]);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
	.pipe(tslint())
	.pipe(tslint.report('verbose'))
);
