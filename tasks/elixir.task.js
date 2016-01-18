	var elixir = require('laravel-elixir');
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
		.angular('/../gjs/')
		.ngHtml2Js('./ngjs/**/*.html')
		.less('/../ngjs/**/*.less', 'public/css')
		.copy('/../ngjs/app/**/*.html', 'public/build/views/')
		.copy('/../ngjs/directives/**/*.html', 'public/build/views/')
		.copy('/../ngjs/dialogs/**/*.html', 'public/build/views/')
		.livereload([
			'/../public/js/vendor.js',
			'/../public/js/partials.js',
			'/../public/js/app.js',
			'/../public/css/vendor.css',
			'/../public/css/app.css'
		], {
			liveCSS: true
		});

	//.phpUnit();
});
