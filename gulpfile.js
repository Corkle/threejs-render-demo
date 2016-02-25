var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

/*********************************************
* TASK: gulp
* Start server and watch for file changes
*********************************************/
gulp.task('default', ['connect:dev'], function () {
    gulp.watch('./js/*.js', ['reload']);
	gulp.watch('./index.html', ['reload']);
	gulp.watch('./css/style.css', ['reload']);
});


/*********************************************
* TASK: connect:dev
* Start development server
*********************************************/
gulp.task('connect:dev', function() {
	plugins.connect.server({
		root: path.resolve('./'),
		port: 3000,
		livereload: true
	});
});

/*********************************************
* TASK: reload
* Reload server
*********************************************/
gulp.task('reload', function () {
	gulp.src('./index.html')
		.pipe(plugins.connect.reload());
});


