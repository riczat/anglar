var elixir = require('laravel-elixir');
var gulp = require('gulp');
var fs = require('fs');
require('./tasks/angular.task.js');
require('./tasks/bower.task.js');
require('./tasks/ngHtml2Js.task.js');
require('laravel-elixir-livereload');


/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
	mix
		.bower()
		.angular('./ngjs/')
		.ngHtml2Js('./ngjs/**/*.html')
		.less('./ngjs/**/*.less', 'public/css')
		.copy('./ngjs/app/**/*.html', 'public/views/app/')
		.copy('./ngjs/app/**/*.html', 'public/views/directives/')
		.copy('./ngjs/app/**/*.html', 'public/views/dialogs/')
		.livereload([
			'public/js/vendor.js',
			'public/js/partials.js',
			'public/js/app.js',
			'public/css/vendor.css',
			'public/css/app.css',
			'public/views/**/*.html'
		], {
			liveCSS: true
		});

	//.phpUnit();
});
