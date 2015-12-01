"use strict";

var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	connect = require('gulp-connect'),
	browserSync = require('browser-sync').create();
var paths={
	index:"personal_project/index.html",
	htmlTemplate:"personal_project/app/**/*.html",
	js:"personal_project/js/**/*.js",
	app:"personal_project/app/**/*.js",
	css:"personal_project/css/**/*css",
	stylus:"personal_project/stylus/**/*.styl",
	stylusDev:"personal_project/stylus/main.styl",
	stylusDest:"personal_project/css/"
};


gulp.task('stylusCompile',function(){
	gulp.src(paths.stylusDev)
		.pipe(stylus({
			//compress:true
		}))
		.pipe(gulp.dest(paths.stylusDest));
});

gulp.task('connect',function(){
	browserSync.init({
		server:{
			baseDir:'personal_project',
			index:'index.html'
		}
	});
});

gulp.task('watch',function(){
	gulp.watch(paths.stylus,['stylusCompile']).on('change',browserSync.reload);
	gulp.watch([paths.js,paths.app,paths.index,paths.htmlTemplate]).on('change',browserSync.reload);
});

gulp.task('default', ['connect','watch']);

//PART 1 Server
gulp.task('connectPart1',function(){
	browserSync.init({
		server:{
			baseDir:'maze',
			index:'index.html'
		}
	});
});

gulp.task('watchPart1',[],function(){
	gulp.watch(['maze/js/main.js','maze/css/main.css','maze/index.html'],browserSync.reload);
});

gulp.task('servePart1', ['connectPart1','watchPart1']);