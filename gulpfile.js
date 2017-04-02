'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const es = require('event-stream');
const webpack = require('webpack-stream');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:core',
	'build:web:script',
	'build:copy'
]);

gulp.task('build:core', () => {
	const tsResult = project
		.src()
		.pipe(project());

	return es.merge(
		tsResult.js.pipe(gulp.dest('./built/')),
		tsResult.dts.pipe(gulp.dest('./built/'))
	);
});

gulp.task('build:web:script', () =>
	webpack(require('./webpack.config'), require('webpack'))
		.pipe(gulp.dest('./built/web/'))
);

gulp.task('build:copy', () => {
	return gulp.src([
		'./src/web/view.pug'
	])
		.pipe(gulp.dest('./built/web/'));
});
