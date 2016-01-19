var elixir = require('laravel-elixir');
require('./tasks/angular.task.js');
require('./tasks/bower.task.js');
require('./tasks/ngHtml2Js.task.js');
require('laravel-elixir-livereload');

var config = {
	assets_path: './resources/assets',
	build_path_html:'./public/views',
	build_path_css:'./public/css',
	build_path_js:'./public/js'
};
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
	 .bower('./bower.js')
	 .angular('./ngjs/')
	 .ngHtml2Js('./ngjs/**/*.html')
	 .less('./ngjs/**/*.less', 'public/css')
	 .copy('./ngjs/app/**/*.html', 'public')
	 .copy('./ngjs/directives/**/*.html', 'public/views')
	 .copy('./ngjs/dialogs/**/*.html', 'public/views')
	 .livereload([
		 'public/js/vendor.js',
		 'public/js/partials.js',
		 'public/js/app.js',
		 'public/css/vendor.css',
		 'public/css/app.css'
	 ], {
		 liveCSS: true
	 });

 //.phpUnit();
});
