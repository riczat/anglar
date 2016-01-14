(function(){
	"use strict";

	angular.module('app',
		[
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.features',
		'app.routes',
		'app.config',
		'partialsModule',
		'datatables',
		'mgcrea.ngstrap',
		'ngAnimate',
		'ui.bootstrap',
		'ngResource',
		'ngMaterial'
		]);

	angular.module('app.routes', ['ui.router']);
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'angular-loading-bar','ngResource']);
	angular.module('app.filters', []);
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.config', ['ngMaterial'], ['ui.bootstrap']);

})();

module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: temp + 'styles.css',
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        less: client + 'styles/styles.less',
        report: report,
        root: root,
        server: server,
        source: 'src/',
        stubsjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            client + 'stubs/**/*.js'
        ],
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * plato
         */
        plato: {js: clientApp + '**/*.js'},

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standalone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/mocha/mocha.js',
            nodeModules + '/chai/chai.js',
            nodeModules + '/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [client + 'test-helpers/*.js'],
        specs: [clientApp + '**/*.spec.js'],
        serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: server + 'app.js',
        defaultPort: '8001'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                temp + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};

var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});

var colors = $.util.colors;
var envenv = $.util.env;
var port = process.env.PORT || config.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

/**
 * Create a visualizer report
 */
gulp.task('plato', function(done) {
    log('Analyzing source with Plato');
    log('Browse to /report/plato/index.html to see Plato results');

    startPlatoVisualizer(done);
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function() {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.less())
//        .on('error', errorLogger) // more verbose and dupe output. requires emit.
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function() {
    log('Compressing and copying images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({empty: true}))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function() {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    // Only include stubs if flag is enabled
    var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(js, '', config.jsOrder))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
    log('Wire up css into the html, after files are ready');

    return gulp
        .src(config.index)
        .pipe(inject(config.css))
        .pipe(gulp.dest(config.client));
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['templatecache'], function(done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var templateCache = config.temp + config.templateCache.file;
    var options = config.getWiredepDefaultOptions();
    var specs = config.specs;

    if (args.startServers) {
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }
    options.devDependencies = true;

    return gulp
        .src(config.specRunner)
        .pipe(wiredep(options))
        .pipe(inject(config.js, '', config.jsOrder))
        .pipe(inject(config.testlibraries, 'testlibraries'))
        .pipe(inject(config.specHelpers, 'spechelpers'))
        .pipe(inject(specs, 'specs', ['**/*']))
        .pipe(inject(templateCache, 'templates'))
        .pipe(gulp.dest(config.client));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'images', 'fonts'], function() {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    del(config.temp);
    log(msg);
    notify(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject', 'test'], function() {
    log('Optimizing the js, css, and html');

    var assets = $.useref.assets({searchPath: './'});
    // Filters are named for the gulp-useref path
    var cssFilter = $.filter('**/*.css');
    var jsAppFilter = $.filter('**/' + config.optimized.app);
    var jslibFilter = $.filter('**/' + config.optimized.lib);

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(inject(templateCache, 'templates'))
        .pipe(assets) // Gather all assets from the html with useref
        // Get the css
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe(cssFilter.restore())
        // Get the custom javascript
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate({add: true}))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(jsAppFilter.restore())
        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore())
        // Take inventory of the file names for future rev numbers
        .pipe($.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe($.useref())
        // Replace the file names in the html with rev numbers
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp, config.report);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function(done) {
    clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function(done) {
    clean(config.build + 'images/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );
    clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    );
    clean(files, done);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', ['vet', 'templatecache'], function(done) {
    startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function(done) {
    startTests(false /*singleRun*/ , done);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['inject'], function() {
    serve(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], function() {
    serve(false /*isDev*/);
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.ver;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest(config.root));
});

/**
 * Optimize the code and re-load browserSync
 */
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

////////////////

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = {read: false};
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
    var debugMode = '--debug';
    var nodeOptions = getNodeOptions(isDev);

    nodeOptions.nodeArgs = [debugMode + '=5858'];

    if (args.verbose) {
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };
}

//function runNodeInspector() {
//    log('Running node-inspector.');
//    log('Browse to http://localhost:8080/debug?port=5858');
//    var exec = require('child_process').exec;
//    exec('node-inspector');
//}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches less, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.less], ['styles'])
            .on('change', changeEvent);
    } else {
        gulp.watch([config.less, config.js, config.html], ['browserSyncReload'])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'hottowel',
        notify: true,
        reloadDelay: 0 //1000
    } ;
    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
    log('Running Plato');

    var files = glob.sync(config.plato.js);
    var excludeFiles = /.*\.spec\.js/;
    var plato = require('plato');

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = config.report + '/plato';

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        if (args.verbose) {
            log(overview.summary);
        }
        if (done) { done(); }
    }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var serverSpecs = config.serverIntegrationSpecs;

    if (args.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function karmaCompleted(karmaResult) {
        log('Karma completed');
        if (child) {
            log('shutting down the child process');
            child.kill();
        }
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Log an error message and emit the end of a task
 */
//function errorLogger(error) {
//    log('*** Start of Error ***');
//    log(error);
//    log('*** End of Error ***');
//    this.emit('end');
//}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}

module.exports = gulp;

module.exports = function(config) {
    var gulpConfig = require('./gulp.config')();

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon', 'chai-sinon'],

        // list of files / patterns to load in the browser
        files: gulpConfig.karma.files,

        // list of files to exclude
        exclude: gulpConfig.karma.exclude,

        proxies: {
            '/': 'http://localhost:8888/'
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: gulpConfig.karma.preprocessors,

        // test results reporter to use
        // possible values: 'dots', 'progress', 'coverage'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: gulpConfig.karma.coverage.dir,
            reporters: gulpConfig.karma.coverage.reporters
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
        // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //        browsers: ['Chrome', 'ChromeCanary', 'FirefoxAurora', 'Safari', 'PhantomJS'],
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};

(function(){
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return './views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
					header: {
						templateUrl: getView('/header')
					},
					sidebar: {
						templateUrl: getView('/sidebar')
					},
					footer: {
						templateUrl: getView('/footer')
					},
					main: {}
				}
			})
			.state('app.landing', {
				url: '/',
				data: {pageName: 'Overview'},
				views: {
					'main@': {
						templateUrl: getView('landing')
					}
				}
			});
			
        }]).state('login', {
            url: '/login',
            views: {
                main: {
                    templateUrl: getView('login')
                },
                footer: {
                    templateUrl: getView('footer')
                }
            }
        })
		
			.state('app.install', {
				url: '/install',
				data: {pageName: 'Install'},
				views: {
					'main@': {
						templateUrl: getView('install')
					}
				}
			})
			.state('app.tabs', {
				url: '/features',
				data: {pageName: 'Features'},
				views: {
					'main@': {
						templateUrl: getView('tabs')
					}
				}
			})
			.state('app.deploy', {
				url: '/deploy',
				data: {pageName: 'Deploy'},
				views: {
					'main@': {
						templateUrl: getView('deploy')
					}
				}
			})
			.state('app.theme', {
				url: '/theme',
				data: {pageName: 'Theme'},
				views: {
					'main@': {
						templateUrl: getView('theme')
					}
				}
			})
			.state('app.toasts', {
				url: '/toasts',
				data: {pageName: 'Toasts'},
				views: {
					'main@': {
						templateUrl: getView('toasts')
					}
				}
			})
			.state('app.dialogs', {
				url: '/dialogs',
				data: {pageName: 'Dialogs'},
				views: {
					'main@': {
						templateUrl: getView('dialogs')
					}
				}
			})
			.state('app.generators', {
				url: '/generators',
				data: {pageName: 'Artisan generators'},
				views: {
					'main@': {
						templateUrl: getView('generators')
					}
				}
			})
			.state('app.jwt_auth', {
				url: '/jwt_auth',
				data: {pageName: 'JSON Web Token Authentication'},
				views: {
					'main@': {
						templateUrl: getView('jwt_auth')
					}
				}
			})
			.state('app.elixir', {
				url: '/elixir',
				data: {pageName: 'Elixir'},
				views: {
					'main@': {
						templateUrl: getView('elixir')
					}
				}
			})
			.state('app.rest_api', {
				url: '/rest_api',
				data: {pageName: 'REST API'},
				views: {
					'main@': {
						templateUrl: getView('rest_api')
					}
				}
			})
			.state('app.unsupported_browser', {
				url: '/unsupported_browser',
				data: {pageName: 'Unsupported Browser'},
				views: {
					'main@': {
						templateUrl: getView('unsupported_browser')
					}
				}
			})
			
			.state('app.create_post', {
		        url: '/create-post',
		        views: {
		          'main@': {
		            templateUrl: getView('create_post')
		          }
		        }
		      })
	      
			.state('app.misc', {
				url: '/misc',
				data: {pageName: 'Miscellaneous features'},
				views: {
					'main@': {
						templateUrl: getView('misc')
					}
				}
			});
})();


(function(){
    "use strict";

    angular.module('app.routes').config( ["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider ) {

        var getView = function( viewName ){
            return '/views/app/' + viewName + '/' + viewName + '.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('landing', {
            url: '/',
            views: {
                main: {
                    templateUrl: getView('landing')
                }
            }
        }).state('login', {
            url: '/login',
            views: {
                main: {
                    templateUrl: getView('login')
                },
                footer: {
                    templateUrl: getView('footer')
                }
            }
        });

    }] );
})();
(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config(["$mdThemingProvider", function($mdThemingProvider) {
  // Extend the red theme with a few different colors
  var neonRedMap = $mdThemingProvider.extendPalette('red', {
    '500': 'ff0000'
  });
  // Register the new color palette map with the name <code>neonRed</code>
  $mdThemingProvider.definePalette('neonRed', neonRedMap);
  // Use that theme for the primary intentions
  $mdThemingProvider.theme('default')
  .primaryPalette('neonRed')
  .accentPalette('grey')
  .warnPalette('red');
}]);

})();
(function(){
	"use strict";

	angular.module('app.filters').filter( 'capitalize', function(){
		return function(input) {
			return (input) ? input.replace(/([^\W_]+[^\s-]*) */g,function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}) : '';
		};
	});
})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'humanReadable', function(){
		return function humanize(str) {
			if ( !str ){
				return '';
			}
			var frags = str.split('_');
			for (var i=0; i<frags.length; i++) {
				frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
			}
			return frags.join(' ');
		};
	});
})();
(function(){
    'use strict';

    angular.module('app.filters').filter('truncateCharacters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    // Get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length-1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    });
})();
(function(){
    'use strict';

    angular.module('app.filters').filter('truncateWords', function () {
        return function (input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    });
})();
(function(){
	"use strict";

	angular.module('app.filters').filter( 'trustHtml', ["$sce", function( $sce ){
		return function( html ){
			return $sce.trustAsHtml(html);
		};
	}]);
})();
(function(){
	"use strict";

	angular.module('app.filters').filter('ucfirst', function() {
		return function( input ) {
			if ( !input ){
				return null;
			}
			return input.substring(0, 1).toUpperCase() + input.substring(1);
		};
	});

})();

(function() {
	"use strict";

	angular.module('app.services').factory('API', ["Restangular", "ToastService", "$localStorage", function(Restangular, ToastService, $localStorage) {

		//content negotiation
		var headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/x.laravel.v1+json'
		};

		return Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer
				.setBaseUrl('/api/')
				.setDefaultHeaders(headers)
				.setErrorInterceptor(function(response) {
					if (response.status === 422) {
						for (var error in response.data.errors) {
							return ToastService.error(response.data.errors[error][0]);
						}
					}
				})
				.addFullRequestInterceptor(function(element, operation, what, url, headers) {
					if ($localStorage.jwt) {
						headers.Authorization = 'Bearer ' + $localStorage.jwt;
					}
				});
		});
	}]);

})();

(function(){
	"use strict";

	angular.module("app.services").factory('DialogService', ["$mdDialog", function($mdDialog){

		return {
			fromTemplate: function(template, $scope){

				var options = {
					templateUrl: './views/dialogs/' + template + '/' + template + '.html'
				};

				if ($scope){
					options.scope = $scope.$new();
				}

				return $mdDialog.show(options);
			},

			hide: function(){
				return $mdDialog.hide();
			},

			alert: function(title, content){
				$mdDialog.show(
					$mdDialog.alert()
						.title(title)
						.content(content)
						.ok('Ok')
				);
			},

			confirm: function(title, content) {
				return $mdDialog.show(
					$mdDialog.confirm()
						.title(title)
						.content(content)
						.ok('Ok')
						.cancel('Cancel')
				);
			}
		};
	}]);
})();
(function(){
	"use strict";

	angular.module("app.services").factory('ToastService', ["$mdToast", function($mdToast){

		var delay = 6000,
			position = 'top right',
			action = 'OK';

		return {
			show: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.action(action)
						.hideDelay(delay)
				);
			},
			error: function(content){
				if (!content){
					return false;
				}
			}
		};
	}]);
})();
(function(){
    "use strict";

    angular.module('app.controllers').controller('CreatePostController', CreatePostController);

    function CreatePostController(){
        //
    }

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('FooterController', FooterController);

    function FooterController(){
        //
    }

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('HeaderCtrl', ["$scope", "$rootScope", "$mdSidenav", "$log", function($scope, $rootScope, $mdSidenav, $log){

		$scope.$watch(function(){
			return $rootScope.current_page;
		}, function(newPage){
			$scope.current_page = newPage || 'Page Name';
		});

		$scope.openSideNav = function() {
			$mdSidenav('left').open();
		};

	}]);

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('LandingController', LandingController);

	function LandingController() {
		var vm = this;

		vm.laravel_description = 'Response macros integrated with your Angular app';
		vm.angular_description = 'Query your API without worrying about validations';
	}

})();

(function() {
	"use strict";

	angular.module('app.controllers')
	    .controller('SidebarCtrl', ["$scope", "$timeout", "$mdSidenav", "$log", function ($scope, $timeout, $mdSidenav, $log) {
	      $scope.toggleLeft = buildDelayedToggler('left');
	      $scope.toggleRight = buildToggler('right');
	      $scope.isOpenRight = function(){
	        return $mdSidenav('right').isOpen();
	      };
	      /**
	       * Supplies a function that will continue to operate until the
	       * time is up.
	       */
	      function debounce(func, wait, context) {
	        var timer;
	        return function debounced() {
	          var context = $scope,
	              args = Array.prototype.slice.call(arguments);
	          $timeout.cancel(timer);
	          timer = $timeout(function() {
	            timer = undefined;
	            func.apply(context, args);
	          }, wait || 10);
	        };
	      }
	      /**
	       * Build handler to open/close a SideNav; when animation finishes
	       * report completion in console
	       */
	      function buildDelayedToggler(navID) {
	        return debounce(function() {
	          $mdSidenav(navID)
	            .toggle()
	            .then(function () {
	              $log.debug("toggle " + navID + " is done");
	            });
	        }, 200);
	      }
	      function buildToggler(navID) {
	        return function() {
	          $mdSidenav(navID)
	            .toggle()
	            .then(function () {
	              $log.debug("toggle " + navID + " is done");
	            });
	        };
	      }
	    }])
	    .controller('LeftCtrl', ["$scope", "$timeout", "$mdSidenav", "$log", function ($scope, $timeout, $mdSidenav, $log) {
	      $scope.close = function () {
	        $mdSidenav('left').close()
	          .then(function () {
	            $log.debug("close LEFT is done");
	          });
	      };
	    }])
	    .controller('RightCtrl', ["$scope", "$timeout", "$mdSidenav", "$log", function ($scope, $timeout, $mdSidenav, $log) {
	      $scope.close = function () {
	        $mdSidenav('right').close()
	          .then(function () {
	            $log.debug("close RIGHT is done");
	          });
	      };
	    }]);
})();
(function(){
    "use strict";

    angular.module('app.controllers').controller('UnsupportedBrowserCtrl', function(){
        //
    });

})();

(function(){
    "use strict";

    ChangePasswordController.$inject = ["DialogService"];
    angular.module('app.controllers').controller('ChangePasswordController', ChangePasswordController);


    function ChangePasswordController(DialogService){

        this.save = function(){
            //
        };

        this.hide = function(){
          	DialogService.hide();
        };

    }

})();

(function(){
    "use strict";

    LoginController.$inject = ["DialogService"];
    angular.module('app.controllers').controller('LoginController', LoginController);


    function LoginController(DialogService){

        this.save = function(){
            //
        };

        this.hide = function(){
          	DialogService.hide();
        };

    }

})();

(function(){
	"use strict";

	angular.module('app.directives').directive('addUsers', addUsersDefinition);

	function addUsersDefinition() {
		return {
			restrict: 'EA',
			templateUrl: 'views/directives/add_users/add_users.html',
			controller: 'AddUsersController',
			link: function( scope, element, attrs ){
				//
			}
		};
	}

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('AddUsersController', AddUsersController);

	function AddUsersController(){
		//
	}

})();

(function(){
	"use strict";

	angular.module('app.directives').directive('createPostForm', createPostFormDefinition);

	function createPostFormDefinition() {
		return {
			restrict: 'EA',
			templateUrl: 'views/directives/create_post_form/create_post_form.html',
			controller: 'CreatePostFormController',
			link: function( scope, element, attrs ){
				//
			}
		};
	}

})();

(function(){
  "use strict";

  CreatePostController.$inject = ["Restangular", "ToastService"];
  angular.module('app.controllers').controller('CreatePostController', CreatePostController);

  function CreatePostController(Restangular, ToastService){

    this.submit = function(){
      var data = {
        name: this.name,
        topic: this.topic,
      };
      
       Restangular.all('posts').post(data).then(function(response){
         ToastService.show('Post added successfully');
       });
    };
  
  }

})();
(function(){
	"use strict";

	angular.module('app.directives').directive('employee', employeeDefinition);

	function employeeDefinition() {
		return {
			restrict: 'EA',
			templateUrl: 'views/directives/employee/employee.html',
			controller: 'EmployeeController',
			link: function( scope, element, attrs ){
				//
			}
		};
	}

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('EmployeeController', EmployeeController);

	function EmployeeController(){
		//
	}

})();

(function(){
	"use strict";

	angular.module('app.directives').directive('userProfile', userProfileDefinition);

	function userProfileDefinition() {
		return {
			restrict: 'EA',
			templateUrl: 'views/directives/user_profile/user_profile.html',
			controller: 'UserProfileController',
			link: function( scope, element, attrs ){
				//
			}
		};
	}

})();

(function(){
	"use strict";

	angular.module('app.controllers').controller('UserProfileController', UserProfileController);

	function UserProfileController(){
		//
	}

})();

/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();

var environment = process.env.NODE_ENV;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment){
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});

module.exports = {
    people: getPeople()
};

function getPeople() {
    return [
        {id: 1, firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida'},
        {id: 2, firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California'},
        {id: 3, firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York'},
        {id: 4, firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota'},
        {id: 5, firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota'},
        {id: 6, firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina'},
        {id: 7, firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming'},
        {id: 8, firstName: 'Aaron', lastName: 'Jinglehiemer', age: 22, location: 'Utah'}
    ];
}

var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function getPeople(req, res, next) {
    res.status(200).send(data.people);
}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function(p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}

(function () {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.admin',
        'app.dashboard',
        'app.layout'
    ]);

})();

/*
 *  Phantom.js does not support Function.prototype.bind (at least not before v.2.0
 *  That's just crazy. Everybody supports bind.
 *  Read about it here: https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
 *  This polyfill is copied directly from MDN
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 */
if (!Function.prototype.bind) {
    /*jshint freeze: false */
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            var msg = 'Function.prototype.bind - what is trying to be bound is not callable';
            throw new TypeError(msg);
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FuncNoOp = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof FuncNoOp && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        FuncNoOp.prototype = this.prototype;
        fBound.prototype = new FuncNoOp();

        return fBound;
    };
}

/* jshint -W079 */
var mockData = (function() {
    return {
        getMockPeople: getMockPeople,
        getMockStates: getMockStates
    };

    function getMockStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }

    function getMockPeople() {
        return [
            {firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida'},
            {firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California'},
            {firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York'},
            {firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota'},
            {firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota'},
            {firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina'},
            {firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming'}
        ];
    }
})();

module.exports = function () {
    var service = {
        notFoundMiddleware: notFoundMiddleware,
        send404: send404
    };
    return service;

    function notFoundMiddleware(req, res, next) {
        send404(req, res, 'API endpoint not found');
    }

    function send404(req, res, description) {
        var data = {
            status: 404,
            message: 'Not Found',
            description: description,
            url: req.url
        };
        res.status(404)
            .send(data)
            .end();
    }
};

(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['logger'];
    /* @ngInject */
    function AdminController(logger) {
        var vm = this;
        vm.title = 'Admin';

        activate();

        function activate() {
            logger.info('Activated Admin View');
        }
    }
})();

/* jshint -W117, -W030 */
describe('AdminController', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.admin');
        bard.inject('$controller', '$log', '$rootScope');
    });

    beforeEach(function () {
        controller = $controller('AdminController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Admin controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Admin', function() {
                expect(controller.title).to.equal('Admin');
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });
        });
    });
});

(function () {
    'use strict';

    angular.module('app.admin', [
        'app.core',
        'app.widgets'
      ]);

})();

(function() {
    'use strict';

    angular
        .module('app.admin')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'admin',
                config: {
                    url: '/admin',
                    templateUrl: 'app/admin/admin.html',
                    controller: 'AdminController',
                    controllerAs: 'vm',
                    title: 'Admin',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }
        ];
    }
})();

/* jshint -W117, -W030 */
describe('admin routes', function () {
    describe('state', function () {
        var view = 'app/admin/admin.html';

        beforeEach(function() {
            module('app.admin', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(view, '');
        });

        it('should map state admin to url /admin ', function() {
            expect($state.href('admin', {})).to.equal('/admin');
        });

        it('should map /admin route to admin View template', function () {
            expect($state.get('admin').templateUrl).to.equal(view);
        });

        it('of admin should work with $state.go', function () {
            $state.go('admin');
            $rootScope.$apply();
            expect($state.is('admin'));
        });
    });
});

(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[helloWorld Error] ',
        appTitle: 'helloWorld'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
    }

})();

/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment);
})();

(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize',
            'blocks.exception', 'blocks.logger', 'blocks.router',
            'ui.router', 'ngplus'
        ]);
})();

(function() {
    'use strict';

    appRun.$inject = ["routerHelper"];
    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [
            {
                state: '404',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();

/* jshint -W117, -W030 */
describe('core', function() {
    describe('state', function() {
        var views = {
            four0four: 'app/core/404.html'
        };

        beforeEach(function() {
            module('app.core', bard.fakeToastr);
            bard.inject('$location', '$rootScope', '$state', '$templateCache');
            $templateCache.put(views.core, '');
        });

        it('should map /404 route to 404 View template', function() {
            expect($state.get('404').templateUrl).to.equal(views.four0four);
        });

        it('of dashboard should work with $state.go', function() {
            $state.go('404');
            $rootScope.$apply();
            expect($state.is('404'));
        });

        it('should route /invalid to the otherwise (404) route', function() {
            $location.path('/invalid');
            $rootScope.$apply();
            expect($state.current.templateUrl).to.equal(views.four0four);
        });
    });
});

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger) {
        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            return $http.get('/api/people')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for getPeople')(e);
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'dataservice', 'logger'];
    /* @ngInject */
    function DashboardController($q, dataservice, logger) {
        var vm = this;
        vm.news = {
            title: 'helloWorld',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getMessageCount(), getPeople()];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getPeople() {
            return dataservice.getPeople().then(function (data) {
                vm.people = data;
                return vm.people;
            });
        }
    }
})();

/* jshint -W117, -W030 */
describe('DashboardController', function() {
    var controller;
    var people = mockData.getMockPeople();

    beforeEach(function() {
        bard.appModule('app.dashboard');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getPeople').returns($q.when(people));
        controller = $controller('DashboardController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Dashboard controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Dashboard', function () {
                expect(controller.title).to.equal('Dashboard');
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });

            it('should have news', function () {
                expect(controller.news).to.not.be.empty;
            });

            it('should have at least 1 person', function () {
                expect(controller.people).to.have.length.above(0);
            });

            it('should have people count of 5', function () {
                expect(controller.people).to.have.length(7);
            });
        });
    });
});

(function() {
    'use strict';

    angular.module('app.dashboard', [
        'app.core',
        'app.widgets'
      ]);
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();

/* jshint -W117, -W030 */
describe('dashboard routes', function () {
    describe('state', function () {
        var view = 'app/dashboard/dashboard.html';

        beforeEach(function() {
            module('app.dashboard', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(view, '');
        });

        bard.verifyNoOutstandingHttpRequests();

        it('should map state dashboard to url / ', function() {
            expect($state.href('dashboard', {})).to.equal('/');
        });

        it('should map /dashboard route to dashboard View template', function () {
            expect($state.get('dashboard').templateUrl).to.equal(view);
        });

        it('of dashboard should work with $state.go', function () {
            $state.go('dashboard');
            $rootScope.$apply();
            expect($state.is('dashboard'));
        });
    });
});

(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htSidebar', htSidebar);

    /* @ngInject */
    function htSidebar () {
        // Opens and closes the sidebar menu.
        // Usage:
        //  <div ht-sidebar">
        //  <div ht-sidebar whenDoneAnimating="vm.sidebarReady()">
        // Creates:
        //  <div ht-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                whenDoneAnimating: '&?'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    $sidebarInner.slideDown(350, scope.whenDoneAnimating);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350, scope.whenDoneAnimating);
                }
            }
        }
    }
})();

/* jshint -W117, -W030 */
/* jshint multistr:true */
describe('htSidebar directive: ', function () {
    var dropdownElement;
    var el;
    var innerElement;
    var isOpenClass = 'dropy';
    var scope;

    beforeEach(module('app.layout'));

    beforeEach(inject(function($compile, $rootScope) {
        // The minimum necessary template HTML for this spec.
        // Simulates a menu link that opens and closes a dropdown of menu items
        // The `when-done-animating` attribute is optional (as is the vm's implementation)
        //
        // N.B.: the attribute value is supposed to be an expression that invokes a $scope method
        //       so make sure the expression includes '()', e.g., "vm.sidebarReady(42)"
        //       no harm if the expression fails ... but then scope.sidebarReady will be undefined.
        //       All parameters in the expression are passed to vm.sidebarReady ... if it exists
        //
        // N.B.: We do NOT add this element to the browser DOM (although we could).
        //       spec runs faster if we don't touch the DOM (even the PhantomJS DOM).
        el = angular.element(
            '<ht-sidebar when-done-animating="vm.sidebarReady(42)">' +
                '<div class="sidebar-dropdown"><a href="">Menu</a></div>' +
                '<div class="sidebar-inner" style="display: none"></div>' +
            '</ht-sidebar>');

        // The spec examines changes to these template parts
        dropdownElement = el.find('.sidebar-dropdown a'); // the link to click
        innerElement    = el.find('.sidebar-inner');      // container of menu items

        // ng's $compile service resolves nested directives (there are none in this example)
        // and binds the element to the scope (which must be a real ng scope)
        scope = $rootScope;
        $compile(el)(scope);

        // tell angular to look at the scope values right now
        scope.$digest();
    }));

    /// tests ///
    describe('the isOpenClass', function () {
        it('is absent for a closed menu', function () {
            hasIsOpenClass(false);
        });

        it('is added to a closed menu after clicking', function () {
            clickIt();
            hasIsOpenClass(true);
        });

        it('is present for an open menu', function () {
            openDropdown();
            hasIsOpenClass(true);
        });

        it('is removed from a closed menu after clicking', function () {
            openDropdown();
            clickIt();
            hasIsOpenClass(false);
        });
    });

    describe('when animating w/ jQuery fx off', function () {
        beforeEach(function () {
            // remember current state of jQuery's global FX duration switch
            this.oldFxOff = $.fx.off;
            // when jQuery fx are of, there is zero animation time; no waiting for animation to complete
            $.fx.off = true;
            // must add to DOM when testing jQuery animation result
            el.appendTo(document.body);
        });

        afterEach(function () {
            $.fx.off = this.oldFxOff;
            el.remove();
        });

        it('dropdown is visible after opening a closed menu', function () {
            dropdownIsVisible(false); // hidden before click
            clickIt();
            dropdownIsVisible(true); // visible after click
        });

        it('dropdown is hidden after closing an open menu', function () {
            openDropdown();
            dropdownIsVisible(true); // visible before click
            clickIt();
            dropdownIsVisible(false); // hidden after click
        });

        it('click triggers "when-done-animating" expression', function () {
            // spy on directive's callback when the animation is done
            var spy = sinon.spy();

            // Recall the pertinent tag in the template ...
            // '    <div ht-sidebar  when-done-animating="vm.sidebarReady(42)" >
            // therefore, the directive looks for scope.vm.sidebarReady
            // and should call that method with the value '42'
            scope.vm = {sidebarReady: spy};

            // tell angular to look again for that vm.sidebarReady property
            scope.$digest();

            // spy not called until after click which triggers the animation
            expect(spy).not.to.have.been.called;

            // this click triggers an animation
            clickIt();

            // verify that the vm's method (sidebarReady) was called with '42'
            // FYI: spy.args[0] is the array of args passed to sidebarReady()
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(42);
        });
    });

    /////// helpers //////

    // put the dropdown in the 'menu open' state
    function openDropdown() {
        dropdownElement.addClass(isOpenClass);
        innerElement.css('display', 'block');
    }

    // click the "menu" link
    function clickIt() {
        dropdownElement.trigger('click');
    }

    // assert whether the "menu" link has the class that means 'is open'
    function hasIsOpenClass(isTrue) {
        var hasClass = dropdownElement.hasClass(isOpenClass);
        expect(hasClass).equal(!!isTrue,
            'dropdown has the "is open" class is ' + hasClass);
    }

    // assert whether the dropdown container is 'block' (visible) or 'none' (hidden)
    function dropdownIsVisible(isTrue) {
        var display = innerElement.css('display');
        expect(display).to.equal(isTrue ? 'block' : 'none',
            'innerElement display value is ' + display);
    }
});

(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htTopNav', htTopNav);

    /* @ngInject */
    function htTopNav () {
        var directive = {
            bindToController: true,
            controller: TopNavController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'navline': '='
            },
            templateUrl: 'app/layout/ht-top-nav.html'
        };

        /* @ngInject */
        function TopNavController() {
            var vm = this;
        }

        return directive;
    }
})();

(function() {
    'use strict';

    angular.module('app.layout', ['app.core']);
})();

(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
    /* @ngInject */
    function ShellController($rootScope, $timeout, config, logger) {
        var vm = this;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        $rootScope.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Created by John Papa',
            link: 'http://twitter.com/john_papa'
        };

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                $rootScope.showSplash = false;
            }, 1000);
        }
    }
})();

/* jshint -W117, -W030 */
describe('ShellController', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.layout');
        bard.inject('$controller', '$q', '$rootScope', '$timeout', 'dataservice');
    });

    beforeEach(function () {
        controller = $controller('ShellController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Shell controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        it('should show splash screen', function () {
            expect($rootScope.showSplash).to.be.true;
        });

        it('should hide splash screen after timeout', function (done) {
            $timeout(function() {
                expect($rootScope.showSplash).to.be.false;
                done();
            }, 1000);
            $timeout.flush();
        });
    });
});

(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$state', 'routerHelper'];
    /* @ngInject */
    function SidebarController($state, routerHelper) {
        var vm = this;
        var states = routerHelper.getStates();
        vm.isCurrent = isCurrent;

        activate();

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = states.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
})();

/* jshint -W117, -W030 */
describe('layout', function() {
    describe('sidebar', function() {
        var controller;
        var views = {
            dashboard: 'app/dashboard/dashboard.html',
            customers: 'app/customers/customers.html'
        };

        beforeEach(function() {
            module('app.layout', bard.fakeToastr);
            bard.inject('$controller', '$httpBackend', '$location',
                          '$rootScope', '$state', 'routerHelper');
        });

        beforeEach(function() {
            routerHelper.configureStates(mockData.getMockStates(), '/');
            controller = $controller('SidebarController');
            $rootScope.$apply();
        });

        bard.verifyNoOutstandingHttpRequests();

        it('should have isCurrent() for / to return `current`', function() {
            $location.path('/');
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for /customers to return `current`', function() {
            $location.path('/customers');
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for non route not return `current`', function() {
            $location.path('/invalid');
            expect(controller.isCurrent({title: 'invalid'})).not.to.equal('current');
        });
    });
});

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('htImgPerson', htImgPerson);

    htImgPerson.$inject = ['config'];
    /* @ngInject */
    function htImgPerson (config) {
        //Usage:
        //<img ht-img-person="{{person.imageSource}}"/>
        var basePath = config.imageBasePath;
        var unknownImage = config.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('htImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('htWidgetHeader', htWidgetHeader);

    /* @ngInject */
    function htWidgetHeader() {
        //Usage:
        //<div ht-widget-header title="vm.map.title"></div>
        // Creates:
        // <div ht-widget-header=""
        //      title="Movie"
        //      allow-collapse="true" </div>
        var directive = {
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: 'app/widgets/widget-header.html',
            restrict: 'EA'
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular.module('app.widgets', []);
})();

// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionHandler', exceptionHandlerProvider)
        .config(config);

    /**
     * Must configure the exception handling
     */
    function exceptionHandlerProvider() {
        /* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function() {
            return {config: this.config};
        };
    }

    config.$inject = ['$provide'];

    /**
     * Configure by setting an optional string value for appErrorPrefix.
     * Accessible via config.appErrorPrefix (via config value).
     * @param  {Object} $provide
     */
    /* @ngInject */
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];

    /**
     * Extend the $exceptionHandler service to also display a toast.
     * @param  {Object} $delegate
     * @param  {Object} exceptionHandler
     * @param  {Object} logger
     * @return {Function} the decorated $exceptionHandler service
     */
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        return function(exception, cause) {
            var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
            var errorData = {exception: exception, cause: cause};
            exception.message = appErrorPrefix + exception.message;
            $delegate(exception, cause);
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             */
            logger.error(exception.message, errorData);
        };
    }
})();

/* jshint -W117, -W030 */
describe('blocks.exception', function() {
    var exceptionHandlerProvider;
    var mocks = {
        errorMessage: 'fake error',
        prefix: '[TEST]: '
    };

    beforeEach(function() {
        bard.appModule('blocks.exception', function(_exceptionHandlerProvider_) {
            exceptionHandlerProvider = _exceptionHandlerProvider_;
        });
        bard.inject('$rootScope');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('exceptionHandlerProvider', function() {
        it('should have a dummy test', inject(function() {
            expect(true).to.equal(true);
        }));

        it('should have exceptionHandlerProvider defined', inject(function() {
            expect(exceptionHandlerProvider).to.be.defined;
        }));

        it('should have configuration', inject(function() {
            expect(exceptionHandlerProvider.config).to.be.defined;
        }));

        it('should have configuration', inject(function() {
            expect(exceptionHandlerProvider.configure).to.be.defined;
        }));

        describe('with appErrorPrefix', function() {
            beforeEach(function() {
                exceptionHandlerProvider.configure(mocks.prefix);
            });

            it('should have appErrorPrefix defined', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix).to.be.defined;
            }));

            it('should have appErrorPrefix set properly', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix)
                    .to.equal(mocks.prefix);
            }));

            it('should throw an error when forced', inject(function() {
                expect(functionThatWillThrow).to.throw();
            }));

            it('manual error is handled by decorator', function() {
                var exception;
                exceptionHandlerProvider.configure(mocks.prefix);
                try {
                    $rootScope.$apply(functionThatWillThrow);
                }
                catch (ex) {
                    exception = ex;
                    expect(ex.message).to.equal(mocks.prefix + mocks.errorMessage);
                }
            });
        });
    });

    function functionThatWillThrow() {
        throw new Error(mocks.errorMessage);
    }
});

(function() {
    'use strict';

    exception.$inject = ["$q", "logger"];
    angular
        .module('blocks.exception')
        .factory('exception', exception);

    /* @ngInject */
    function exception($q, logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(e) {
                var thrownDescription;
                var newMessage;
                if (e.data && e.data.description) {
                    thrownDescription = '\n' + e.data.description;
                    newMessage = message + thrownDescription;
                }
                e.data.description = newMessage;
                logger.error(newMessage);
                return $q.reject(e);
            };
        }
    }
})();

(function() {
    'use strict';

    angular.module('blocks.exception', ['blocks.logger']);
})();

(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    /* @ngInject */
    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());

(function() {
    'use strict';

    angular.module('blocks.logger', []);
})();

/* Help configure the state-base ui.router */
(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        $locationProvider.html5Mode(true);

        this.configure = function(cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger'];
        /* @ngInject */
        function RouterHelper($location, $rootScope, $state, logger) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function(state) {
                    state.config.resolve =
                        angular.extend(state.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var destination = (toState &&
                            (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' +
                            (error.data || '') + '. <br/>' + (error.statusText || '') +
                            ': ' + (error.status || '');
                        logger.warning(msg, [toState]);
                        $location.path('/');
                    }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStates() { return $state.get(); }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    }
                );
            }
        }
    }
})();

(function() {
    'use strict';

    angular.module('blocks.router', [
        'ui.router',
        'blocks.logger'
    ]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJndWxwLmNvbmZpZy5qcyIsImd1bHBmaWxlLmpzIiwia2FybWEuY29uZi5qcyIsIm9sZF9yb3V0ZXMuanMiLCJyb3V0ZXMuanMiLCJjb25maWcvbG9hZGluZ19iYXIuY29uZmlnLmpzIiwiY29uZmlnL3RoZW1lLmNvbmZpZy5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5maWx0ZXIuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmZpbHRlci5qcyIsImZpbHRlcnMvdHJ1bmNhdGVfY2hhcmFjdGVycy5maWx0ZXIuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmZpbHRlci5qcyIsImZpbHRlcnMvdWNmaXJzdC5maWx0ZXIuanMiLCJzZXJ2aWNlcy9BUEkuc2VydmljZS5qcyIsInNlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlLmpzIiwic2VydmljZXMvdG9hc3Quc2VydmljZS5qcyIsImFwcC9jcmVhdGVfcG9zdC9jcmVhdGVfcG9zdC5jb250cm9sbGVyLmpzIiwiYXBwL2Zvb3Rlci9mb290ZXIuY29udHJvbGxlci5qcyIsImFwcC9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2xhbmRpbmcvbGFuZGluZy5jb250cm9sbGVyLmpzIiwiYXBwL3NpZGViYXIvc2lkZWJhci5qcyIsImFwcC91bnN1cHBvcnRlZF9icm93c2VyL3Vuc3VwcG9ydGVkX2Jyb3dzZXIuanMiLCJkaWFsb2dzL2NoYW5nZV9wYXNzd29yZC9jaGFuZ2VfcGFzc3dvcmQuZGlhbG9nLmpzIiwiZGlhbG9ncy9sb2dpbi9sb2dpbi5kaWFsb2cuanMiLCJkaXJlY3RpdmVzL2FkZF91c2Vycy9hZGRfdXNlcnMuZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvYWRkX3VzZXJzL2FkZF91c2Vycy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL2NyZWF0ZV9wb3N0X2Zvcm0vY3JlYXRlX3Bvc3RfZm9ybS5kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9jcmVhdGVfcG9zdF9mb3JtL2NyZWF0ZV9wb3N0X2Zvcm0uZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy9lbXBsb3llZS9lbXBsb3llZS5kZWZpbml0aW9uLmpzIiwiZGlyZWN0aXZlcy9lbXBsb3llZS9lbXBsb3llZS5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3VzZXJfcHJvZmlsZS91c2VyX3Byb2ZpbGUuZGVmaW5pdGlvbi5qcyIsImRpcmVjdGl2ZXMvdXNlcl9wcm9maWxlL3VzZXJfcHJvZmlsZS5kaXJlY3RpdmUuanMiLCJzcmMvc2VydmVyL2FwcC5qcyIsInNyYy9zZXJ2ZXIvZGF0YS5qcyIsInNyYy9zZXJ2ZXIvcm91dGVzLmpzIiwic3JjL2NsaWVudC9hcHAvYXBwLm1vZHVsZS5qcyIsInNyYy9jbGllbnQvdGVzdC1oZWxwZXJzL2JpbmQtcG9seWZpbGwuanMiLCJzcmMvY2xpZW50L3Rlc3QtaGVscGVycy9tb2NrLWRhdGEuanMiLCJzcmMvc2VydmVyL3V0aWxzLzQwNC5qcyIsInNyYy9jbGllbnQvYXBwL2FkbWluL2FkbWluLmNvbnRyb2xsZXIuanMiLCJzcmMvY2xpZW50L2FwcC9hZG1pbi9hZG1pbi5jb250cm9sbGVyLnNwZWMuanMiLCJzcmMvY2xpZW50L2FwcC9hZG1pbi9hZG1pbi5tb2R1bGUuanMiLCJzcmMvY2xpZW50L2FwcC9hZG1pbi9hZG1pbi5yb3V0ZS5qcyIsInNyYy9jbGllbnQvYXBwL2FkbWluL2FkbWluLnJvdXRlLnNwZWMuanMiLCJzcmMvY2xpZW50L2FwcC9jb3JlL2NvbmZpZy5qcyIsInNyYy9jbGllbnQvYXBwL2NvcmUvY29uc3RhbnRzLmpzIiwic3JjL2NsaWVudC9hcHAvY29yZS9jb3JlLm1vZHVsZS5qcyIsInNyYy9jbGllbnQvYXBwL2NvcmUvY29yZS5yb3V0ZS5qcyIsInNyYy9jbGllbnQvYXBwL2NvcmUvY29yZS5yb3V0ZS5zcGVjLmpzIiwic3JjL2NsaWVudC9hcHAvY29yZS9kYXRhc2VydmljZS5qcyIsInNyYy9jbGllbnQvYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29udHJvbGxlci5qcyIsInNyYy9jbGllbnQvYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29udHJvbGxlci5zcGVjLmpzIiwic3JjL2NsaWVudC9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5tb2R1bGUuanMiLCJzcmMvY2xpZW50L2FwcC9kYXNoYm9hcmQvZGFzaGJvYXJkLnJvdXRlLmpzIiwic3JjL2NsaWVudC9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5yb3V0ZS5zcGVjLmpzIiwic3JjL2NsaWVudC9hcHAvbGF5b3V0L2h0LXNpZGViYXIuZGlyZWN0aXZlLmpzIiwic3JjL2NsaWVudC9hcHAvbGF5b3V0L2h0LXNpZGViYXIuZGlyZWN0aXZlLnNwZWMuanMiLCJzcmMvY2xpZW50L2FwcC9sYXlvdXQvaHQtdG9wLW5hdi5kaXJlY3RpdmUuanMiLCJzcmMvY2xpZW50L2FwcC9sYXlvdXQvbGF5b3V0Lm1vZHVsZS5qcyIsInNyYy9jbGllbnQvYXBwL2xheW91dC9zaGVsbC5jb250cm9sbGVyLmpzIiwic3JjL2NsaWVudC9hcHAvbGF5b3V0L3NoZWxsLmNvbnRyb2xsZXIuc3BlYy5qcyIsInNyYy9jbGllbnQvYXBwL2xheW91dC9zaWRlYmFyLmNvbnRyb2xsZXIuanMiLCJzcmMvY2xpZW50L2FwcC9sYXlvdXQvc2lkZWJhci5jb250cm9sbGVyLnNwZWMuanMiLCJzcmMvY2xpZW50L2FwcC93aWRnZXRzL2h0LWltZy1wZXJzb24uZGlyZWN0aXZlLmpzIiwic3JjL2NsaWVudC9hcHAvd2lkZ2V0cy9odC13aWRnZXQtaGVhZGVyLmRpcmVjdGl2ZS5qcyIsInNyYy9jbGllbnQvYXBwL3dpZGdldHMvd2lkZ2V0cy5tb2R1bGUuanMiLCJzcmMvY2xpZW50L2FwcC9ibG9ja3MvZXhjZXB0aW9uL2V4Y2VwdGlvbi1oYW5kbGVyLnByb3ZpZGVyLmpzIiwic3JjL2NsaWVudC9hcHAvYmxvY2tzL2V4Y2VwdGlvbi9leGNlcHRpb24taGFuZGxlci5wcm92aWRlci5zcGVjLmpzIiwic3JjL2NsaWVudC9hcHAvYmxvY2tzL2V4Y2VwdGlvbi9leGNlcHRpb24uanMiLCJzcmMvY2xpZW50L2FwcC9ibG9ja3MvZXhjZXB0aW9uL2V4Y2VwdGlvbi5tb2R1bGUuanMiLCJzcmMvY2xpZW50L2FwcC9ibG9ja3MvbG9nZ2VyL2xvZ2dlci5qcyIsInNyYy9jbGllbnQvYXBwL2Jsb2Nrcy9sb2dnZXIvbG9nZ2VyLm1vZHVsZS5qcyIsInNyYy9jbGllbnQvYXBwL2Jsb2Nrcy9yb3V0ZXIvcm91dGVyLWhlbHBlci5wcm92aWRlci5qcyIsInNyYy9jbGllbnQvYXBwL2Jsb2Nrcy9yb3V0ZXIvcm91dGVyLm1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztDQUdBLFFBQUEsT0FBQSxjQUFBLENBQUE7Q0FDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxhQUFBLGNBQUEsYUFBQSxlQUFBLHNCQUFBO0NBQ0EsUUFBQSxPQUFBLGVBQUE7Q0FDQSxRQUFBLE9BQUEsZ0JBQUE7Q0FDQSxRQUFBLE9BQUEsa0JBQUE7Q0FDQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGVBQUEsQ0FBQTs7OztBQzFCQSxPQUFBLFVBQUEsV0FBQTtJQUNBLElBQUEsU0FBQTtJQUNBLElBQUEsU0FBQTtJQUNBLElBQUEsWUFBQSxTQUFBO0lBQ0EsSUFBQSxTQUFBO0lBQ0EsSUFBQSxPQUFBO0lBQ0EsSUFBQSxpQkFBQTtJQUNBLElBQUEsT0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBO0lBQ0EsSUFBQSxhQUFBLFFBQUEsQ0FBQSxpQkFBQSxPQUFBO0lBQ0EsSUFBQSxRQUFBO1FBQ0EsTUFBQSxRQUFBO1FBQ0EsV0FBQTtRQUNBLFlBQUE7O0lBRUEsSUFBQSxjQUFBOztJQUVBLElBQUEsU0FBQTs7Ozs7UUFLQSxPQUFBO1lBQ0E7WUFDQTs7UUFFQSxPQUFBO1FBQ0EsUUFBQTtRQUNBLEtBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxZQUFBO1FBQ0EsTUFBQSxTQUFBO1FBQ0EsZUFBQSxZQUFBO1FBQ0EsUUFBQSxTQUFBO1FBQ0EsT0FBQSxTQUFBOztRQUVBLElBQUE7WUFDQSxZQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUEsWUFBQTs7UUFFQSxTQUFBO1lBQ0E7WUFDQTtZQUNBOztRQUVBLE1BQUEsU0FBQTtRQUNBLFFBQUE7UUFDQSxNQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7UUFDQSxTQUFBO1lBQ0EsTUFBQSxZQUFBO1lBQ0EsU0FBQTs7UUFFQSxNQUFBOzs7OztRQUtBLFdBQUE7WUFDQSxLQUFBO1lBQ0EsS0FBQTs7Ozs7O1FBTUEsT0FBQSxDQUFBLElBQUEsWUFBQTs7Ozs7UUFLQSxvQkFBQTs7Ozs7UUFLQSxlQUFBO1lBQ0EsTUFBQTtZQUNBLFNBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxNQUFBO2dCQUNBLFlBQUE7Ozs7Ozs7UUFPQSxPQUFBO1FBQ0EsVUFBQTtZQUNBO1lBQ0E7Ozs7OztRQU1BLFlBQUEsU0FBQTtRQUNBLGdCQUFBOzs7Ozs7Ozs7Ozs7UUFZQSxlQUFBO1lBQ0EsY0FBQTtZQUNBLGNBQUE7WUFDQSxjQUFBOztRQUVBLGFBQUEsQ0FBQSxTQUFBO1FBQ0EsT0FBQSxDQUFBLFlBQUE7UUFDQSx3QkFBQSxDQUFBLFNBQUE7Ozs7O1FBS0EsWUFBQSxTQUFBO1FBQ0EsYUFBQTs7Ozs7O0lBTUEsT0FBQSwyQkFBQSxXQUFBO1FBQ0EsSUFBQSxVQUFBO1lBQ0EsV0FBQSxPQUFBLE1BQUE7WUFDQSxXQUFBLE9BQUEsTUFBQTtZQUNBLFlBQUEsT0FBQSxNQUFBOztRQUVBLE9BQUE7Ozs7OztJQU1BLE9BQUEsUUFBQTs7SUFFQSxPQUFBOzs7O0lBSUEsU0FBQSxrQkFBQTtRQUNBLElBQUEsVUFBQTtZQUNBLE9BQUEsR0FBQTtnQkFDQTtnQkFDQSxPQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxPQUFBLE9BQUEsY0FBQTtnQkFDQSxPQUFBOztZQUVBLFNBQUE7WUFDQSxVQUFBO2dCQUNBLEtBQUEsU0FBQTtnQkFDQSxXQUFBOztvQkFFQSxDQUFBLE1BQUEsUUFBQSxRQUFBO29CQUNBLENBQUEsTUFBQSxRQUFBLFFBQUE7b0JBQ0EsQ0FBQSxNQUFBOzs7WUFHQSxlQUFBOztRQUVBLFFBQUEsY0FBQSxZQUFBLHdCQUFBLENBQUE7UUFDQSxPQUFBOzs7O0FDM0tBLElBQUEsT0FBQSxRQUFBLFNBQUE7QUFDQSxJQUFBLGNBQUEsUUFBQTtBQUNBLElBQUEsU0FBQSxRQUFBO0FBQ0EsSUFBQSxNQUFBLFFBQUE7QUFDQSxJQUFBLE9BQUEsUUFBQTtBQUNBLElBQUEsT0FBQSxRQUFBO0FBQ0EsSUFBQSxPQUFBLFFBQUE7QUFDQSxJQUFBLElBQUEsUUFBQTtBQUNBLElBQUEsSUFBQSxRQUFBLHFCQUFBLENBQUEsTUFBQTs7QUFFQSxJQUFBLFNBQUEsRUFBQSxLQUFBO0FBQ0EsSUFBQSxTQUFBLEVBQUEsS0FBQTtBQUNBLElBQUEsT0FBQSxRQUFBLElBQUEsUUFBQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLEtBQUEsS0FBQSxRQUFBLEVBQUE7QUFDQSxLQUFBLEtBQUEsV0FBQSxDQUFBOzs7Ozs7QUFNQSxLQUFBLEtBQUEsT0FBQSxXQUFBO0lBQ0EsSUFBQTs7SUFFQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1NBQ0EsS0FBQSxFQUFBLEdBQUEsS0FBQSxTQUFBLEVBQUE7U0FDQSxLQUFBLEVBQUE7U0FDQSxLQUFBLEVBQUEsT0FBQSxTQUFBLGtCQUFBLENBQUEsU0FBQTtTQUNBLEtBQUEsRUFBQSxPQUFBLFNBQUE7U0FDQSxLQUFBLEVBQUE7Ozs7OztBQU1BLEtBQUEsS0FBQSxTQUFBLFNBQUEsTUFBQTtJQUNBLElBQUE7SUFDQSxJQUFBOztJQUVBLHFCQUFBOzs7Ozs7O0FBT0EsS0FBQSxLQUFBLFVBQUEsQ0FBQSxpQkFBQSxXQUFBO0lBQ0EsSUFBQTs7SUFFQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1NBQ0EsS0FBQSxFQUFBO1NBQ0EsS0FBQSxFQUFBOztTQUVBLEtBQUEsRUFBQSxhQUFBLENBQUEsVUFBQSxDQUFBLGtCQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsT0FBQTs7Ozs7OztBQU9BLEtBQUEsS0FBQSxTQUFBLENBQUEsZ0JBQUEsV0FBQTtJQUNBLElBQUE7O0lBRUEsT0FBQTtTQUNBLElBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLE9BQUEsUUFBQTs7Ozs7OztBQU9BLEtBQUEsS0FBQSxVQUFBLENBQUEsaUJBQUEsV0FBQTtJQUNBLElBQUE7O0lBRUEsT0FBQTtTQUNBLElBQUEsT0FBQTtTQUNBLEtBQUEsRUFBQSxTQUFBLENBQUEsbUJBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxPQUFBLFFBQUE7OztBQUdBLEtBQUEsS0FBQSxnQkFBQSxXQUFBO0lBQ0EsS0FBQSxNQUFBLENBQUEsT0FBQSxPQUFBLENBQUE7Ozs7Ozs7QUFPQSxLQUFBLEtBQUEsaUJBQUEsQ0FBQSxlQUFBLFdBQUE7SUFDQSxJQUFBOztJQUVBLE9BQUE7U0FDQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEVBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxTQUFBO1NBQ0EsS0FBQSxFQUFBLFdBQUEsQ0FBQSxPQUFBO1NBQ0EsS0FBQSxFQUFBLEdBQUEsS0FBQSxTQUFBLEVBQUEsU0FBQSxLQUFBO1NBQ0EsS0FBQSxFQUFBO1lBQ0EsT0FBQSxjQUFBO1lBQ0EsT0FBQSxjQUFBOztTQUVBLEtBQUEsS0FBQSxLQUFBLE9BQUE7Ozs7Ozs7QUFPQSxLQUFBLEtBQUEsV0FBQSxXQUFBO0lBQ0EsSUFBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxXQUFBO0lBQ0EsSUFBQSxVQUFBLE9BQUE7OztJQUdBLElBQUEsS0FBQSxLQUFBLFFBQUEsR0FBQSxPQUFBLE9BQUEsSUFBQSxPQUFBLFdBQUEsT0FBQTs7SUFFQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1NBQ0EsS0FBQSxRQUFBO1NBQ0EsS0FBQSxPQUFBLElBQUEsSUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsT0FBQTs7O0FBR0EsS0FBQSxLQUFBLFVBQUEsQ0FBQSxXQUFBLFVBQUEsa0JBQUEsV0FBQTtJQUNBLElBQUE7O0lBRUEsT0FBQTtTQUNBLElBQUEsT0FBQTtTQUNBLEtBQUEsT0FBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsT0FBQTs7Ozs7OztBQU9BLEtBQUEsS0FBQSxlQUFBLENBQUEsZ0JBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQTtJQUNBLE1BQUEsa0JBQUE7SUFDQTs7Ozs7OztBQU9BLEtBQUEsS0FBQSxlQUFBLENBQUEsa0JBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQTs7SUFFQSxJQUFBLFVBQUEsUUFBQSxXQUFBO0lBQ0EsSUFBQSxnQkFBQSxPQUFBLE9BQUEsT0FBQSxjQUFBO0lBQ0EsSUFBQSxVQUFBLE9BQUE7SUFDQSxJQUFBLFFBQUEsT0FBQTs7SUFFQSxJQUFBLEtBQUEsY0FBQTtRQUNBLFFBQUEsR0FBQSxPQUFBLE9BQUEsT0FBQTs7SUFFQSxRQUFBLGtCQUFBOztJQUVBLE9BQUE7U0FDQSxJQUFBLE9BQUE7U0FDQSxLQUFBLFFBQUE7U0FDQSxLQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsT0FBQTtTQUNBLEtBQUEsT0FBQSxPQUFBLGVBQUE7U0FDQSxLQUFBLE9BQUEsT0FBQSxhQUFBO1NBQ0EsS0FBQSxPQUFBLE9BQUEsU0FBQSxDQUFBO1NBQ0EsS0FBQSxPQUFBLGVBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxPQUFBOzs7Ozs7OztBQVFBLEtBQUEsS0FBQSxTQUFBLENBQUEsWUFBQSxVQUFBLFVBQUEsV0FBQTtJQUNBLElBQUE7O0lBRUEsSUFBQSxNQUFBO1FBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxTQUFBOztJQUVBLElBQUEsT0FBQTtJQUNBLElBQUE7SUFDQSxPQUFBOzs7Ozs7OztBQVFBLEtBQUEsS0FBQSxZQUFBLENBQUEsVUFBQSxTQUFBLFdBQUE7SUFDQSxJQUFBOztJQUVBLElBQUEsU0FBQSxFQUFBLE9BQUEsT0FBQSxDQUFBLFlBQUE7O0lBRUEsSUFBQSxZQUFBLEVBQUEsT0FBQTtJQUNBLElBQUEsY0FBQSxFQUFBLE9BQUEsUUFBQSxPQUFBLFVBQUE7SUFDQSxJQUFBLGNBQUEsRUFBQSxPQUFBLFFBQUEsT0FBQSxVQUFBOztJQUVBLElBQUEsZ0JBQUEsT0FBQSxPQUFBLE9BQUEsY0FBQTs7SUFFQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1NBQ0EsS0FBQSxFQUFBO1NBQ0EsS0FBQSxPQUFBLGVBQUE7U0FDQSxLQUFBOztTQUVBLEtBQUE7U0FDQSxLQUFBLEVBQUE7U0FDQSxLQUFBLFVBQUE7O1NBRUEsS0FBQTtTQUNBLEtBQUEsRUFBQSxXQUFBLENBQUEsS0FBQTtTQUNBLEtBQUEsRUFBQTtTQUNBLEtBQUE7U0FDQSxLQUFBLFlBQUE7O1NBRUEsS0FBQTtTQUNBLEtBQUEsRUFBQTtTQUNBLEtBQUEsWUFBQTs7U0FFQSxLQUFBLEVBQUE7O1NBRUEsS0FBQSxPQUFBO1NBQ0EsS0FBQSxFQUFBOztTQUVBLEtBQUEsRUFBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLE9BQUE7Ozs7Ozs7QUFPQSxLQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUE7SUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQTtJQUNBLElBQUEsZUFBQSxFQUFBLEtBQUEsT0FBQSxLQUFBO0lBQ0EsSUFBQSxXQUFBOzs7Ozs7O0FBT0EsS0FBQSxLQUFBLGVBQUEsU0FBQSxNQUFBO0lBQ0EsTUFBQSxPQUFBLFFBQUEsZ0JBQUE7Ozs7Ozs7QUFPQSxLQUFBLEtBQUEsZ0JBQUEsU0FBQSxNQUFBO0lBQ0EsTUFBQSxPQUFBLFFBQUEsaUJBQUE7Ozs7Ozs7QUFPQSxLQUFBLEtBQUEsZ0JBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBLEdBQUE7UUFDQSxPQUFBLE9BQUE7UUFDQSxPQUFBLFFBQUE7O0lBRUEsTUFBQSxPQUFBOzs7Ozs7O0FBT0EsS0FBQSxLQUFBLGNBQUEsU0FBQSxNQUFBO0lBQ0EsSUFBQSxRQUFBLEdBQUE7UUFDQSxPQUFBLE9BQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFFBQUE7O0lBRUEsTUFBQSxPQUFBOzs7Ozs7Ozs7QUFTQSxLQUFBLEtBQUEsUUFBQSxDQUFBLE9BQUEsa0JBQUEsU0FBQSxNQUFBO0lBQ0EsV0FBQSxxQkFBQTs7Ozs7Ozs7O0FBU0EsS0FBQSxLQUFBLFlBQUEsU0FBQSxNQUFBO0lBQ0EsV0FBQSxzQkFBQTs7Ozs7Ozs7QUFRQSxLQUFBLEtBQUEsYUFBQSxDQUFBLFdBQUEsV0FBQTtJQUNBLE1BQUE7Ozs7Ozs7O0FBUUEsS0FBQSxLQUFBLGVBQUEsQ0FBQSxVQUFBLFdBQUE7SUFDQSxNQUFBOzs7Ozs7Ozs7OztBQVdBLEtBQUEsS0FBQSxRQUFBLFdBQUE7SUFDQSxJQUFBLE1BQUE7SUFDQSxJQUFBLE9BQUEsS0FBQTtJQUNBLElBQUEsVUFBQSxLQUFBO0lBQ0EsSUFBQSxVQUFBO0lBQ0EsSUFBQSxTQUFBO1FBQ0EsUUFBQSxVQUFBO1FBQ0EsT0FBQSxTQUFBO1dBQ0E7UUFDQSxRQUFBLE9BQUE7UUFDQSxPQUFBLFlBQUE7O0lBRUEsSUFBQTs7SUFFQSxPQUFBO1NBQ0EsSUFBQSxPQUFBO1NBQ0EsS0FBQSxFQUFBO1NBQ0EsS0FBQSxFQUFBLEtBQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxPQUFBOzs7Ozs7QUFNQSxLQUFBLEtBQUEscUJBQUEsQ0FBQSxhQUFBLFlBQUE7Ozs7Ozs7O0FBUUEsU0FBQSxZQUFBLE9BQUE7SUFDQSxJQUFBLGFBQUEsSUFBQSxPQUFBLFlBQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBLE1BQUEsS0FBQSxRQUFBLFlBQUEsTUFBQSxNQUFBLE1BQUE7Ozs7Ozs7O0FBUUEsU0FBQSxNQUFBLE1BQUEsTUFBQTtJQUNBLElBQUEsZUFBQSxFQUFBLEtBQUEsT0FBQSxLQUFBO0lBQ0EsSUFBQSxNQUFBOzs7Ozs7Ozs7O0FBVUEsU0FBQSxPQUFBLEtBQUEsT0FBQSxPQUFBO0lBQ0EsSUFBQSxVQUFBLENBQUEsTUFBQTtJQUNBLElBQUEsT0FBQTtRQUNBLFFBQUEsT0FBQSxZQUFBOzs7SUFHQSxPQUFBLEVBQUEsT0FBQSxTQUFBLEtBQUEsUUFBQTs7Ozs7Ozs7O0FBU0EsU0FBQSxVQUFBLEtBQUEsT0FBQTs7SUFFQSxPQUFBO1NBQ0EsSUFBQTtTQUNBLEtBQUEsRUFBQSxHQUFBLE9BQUEsRUFBQSxNQUFBOzs7Ozs7Ozs7O0FBVUEsU0FBQSxNQUFBLE9BQUEsWUFBQTtJQUNBLElBQUEsWUFBQTtJQUNBLElBQUEsY0FBQSxlQUFBOztJQUVBLFlBQUEsV0FBQSxDQUFBLFlBQUE7O0lBRUEsSUFBQSxLQUFBLFNBQUE7UUFDQSxRQUFBLElBQUE7OztJQUdBLE9BQUEsRUFBQSxRQUFBO1NBQ0EsR0FBQSxXQUFBLENBQUEsUUFBQSxTQUFBLElBQUE7WUFDQSxJQUFBO1lBQ0EsSUFBQSxxQkFBQTtZQUNBLFdBQUEsV0FBQTtnQkFDQSxZQUFBLE9BQUE7Z0JBQ0EsWUFBQSxPQUFBLENBQUEsUUFBQTtlQUNBLE9BQUE7O1NBRUEsR0FBQSxTQUFBLFlBQUE7WUFDQSxJQUFBO1lBQ0EsaUJBQUEsT0FBQTs7U0FFQSxHQUFBLFNBQUEsWUFBQTtZQUNBLElBQUE7O1NBRUEsR0FBQSxRQUFBLFlBQUE7WUFDQSxJQUFBOzs7O0FBSUEsU0FBQSxlQUFBLE9BQUE7SUFDQSxPQUFBO1FBQ0EsUUFBQSxPQUFBO1FBQ0EsV0FBQTtRQUNBLEtBQUE7WUFDQSxRQUFBO1lBQ0EsWUFBQSxRQUFBLFFBQUE7O1FBRUEsT0FBQSxDQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQUEsaUJBQUEsT0FBQSxZQUFBO0lBQ0EsSUFBQSxLQUFBLFVBQUEsWUFBQSxRQUFBO1FBQ0E7OztJQUdBLElBQUEsa0NBQUE7Ozs7SUFJQSxJQUFBLE9BQUE7UUFDQSxLQUFBLE1BQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQTthQUNBLEdBQUEsVUFBQTtXQUNBO1FBQ0EsS0FBQSxNQUFBLENBQUEsT0FBQSxNQUFBLE9BQUEsSUFBQSxPQUFBLE9BQUEsQ0FBQTthQUNBLEdBQUEsVUFBQTs7O0lBR0EsSUFBQSxVQUFBO1FBQ0EsT0FBQSxlQUFBO1FBQ0EsTUFBQTtRQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsU0FBQTtZQUNBLE1BQUEsT0FBQTtZQUNBLE9BQUEsT0FBQTtZQUNBO1FBQ0EsV0FBQTtZQUNBLFFBQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtZQUNBLFFBQUE7O1FBRUEsZUFBQTtRQUNBLGdCQUFBO1FBQ0EsVUFBQTtRQUNBLFdBQUE7UUFDQSxRQUFBO1FBQ0EsYUFBQTs7SUFFQSxJQUFBLFlBQUE7UUFDQSxRQUFBLFlBQUEsT0FBQTs7O0lBR0EsWUFBQTs7Ozs7O0FBTUEsU0FBQSxxQkFBQSxNQUFBO0lBQ0EsSUFBQTs7SUFFQSxJQUFBLFFBQUEsS0FBQSxLQUFBLE9BQUEsTUFBQTtJQUNBLElBQUEsZUFBQTtJQUNBLElBQUEsUUFBQSxRQUFBOztJQUVBLElBQUEsVUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBOztJQUVBLElBQUEsWUFBQSxPQUFBLFNBQUE7O0lBRUEsTUFBQSxRQUFBLE9BQUEsV0FBQSxTQUFBOztJQUVBLFNBQUEsZUFBQSxRQUFBO1FBQ0EsSUFBQSxXQUFBLE1BQUEsa0JBQUE7UUFDQSxJQUFBLEtBQUEsU0FBQTtZQUNBLElBQUEsU0FBQTs7UUFFQSxJQUFBLE1BQUEsRUFBQTs7Ozs7Ozs7OztBQVVBLFNBQUEsV0FBQSxXQUFBLE1BQUE7SUFDQSxJQUFBO0lBQ0EsSUFBQSxlQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUEsaUJBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxTQUFBO0lBQ0EsSUFBQSxjQUFBLE9BQUE7O0lBRUEsSUFBQSxLQUFBLGNBQUE7UUFDQSxJQUFBO1FBQ0EsSUFBQSxXQUFBLFFBQUE7UUFDQSxTQUFBLFdBQUE7UUFDQSxTQUFBLE9BQUE7UUFDQSxRQUFBLEtBQUEsT0FBQTtXQUNBO1FBQ0EsSUFBQSxlQUFBLFlBQUEsUUFBQTtZQUNBLGVBQUE7Ozs7SUFJQSxNQUFBLE1BQUE7UUFDQSxZQUFBLFlBQUE7UUFDQSxTQUFBO1FBQ0EsV0FBQSxDQUFBLENBQUE7T0FDQTs7OztJQUlBLFNBQUEsZUFBQSxhQUFBO1FBQ0EsSUFBQTtRQUNBLElBQUEsT0FBQTtZQUNBLElBQUE7WUFDQSxNQUFBOztRQUVBLElBQUEsZ0JBQUEsR0FBQTtZQUNBLEtBQUEsbUNBQUE7ZUFDQTtZQUNBOzs7Ozs7Ozs7O0FBVUEsU0FBQSxrQkFBQSxNQUFBO0lBQ0EsSUFBQSxhQUFBLENBQUEsS0FBQSxVQUFBLEtBQUEsY0FBQTtJQUNBLE9BQUEsS0FBQSxXQUFBO1FBQ0EsQ0FBQSxLQUFBLFlBQUEsTUFBQSxRQUFBLEtBQUE7UUFDQSxDQUFBLEtBQUEsVUFBQSxNQUFBLFFBQUEsS0FBQTtRQUNBLGNBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLFNBQUEsY0FBQSxLQUFBLFdBQUE7SUFDQSxPQUFBLENBQUEsTUFBQSxLQUFBLFFBQUE7Ozs7Ozs7QUFPQSxTQUFBLFlBQUE7SUFDQSxJQUFBLE1BQUEsUUFBQTtJQUNBLElBQUEsV0FBQSxDQUFBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7TUFDQSxLQUFBO0lBQ0EsT0FBQSxFQUFBLE9BQUEsVUFBQTtRQUNBLEtBQUE7Ozs7Ozs7O0FBUUEsU0FBQSxJQUFBLEtBQUE7SUFDQSxJQUFBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsS0FBQSxJQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsSUFBQSxlQUFBLE9BQUE7Z0JBQ0EsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLE9BQUEsS0FBQSxJQUFBOzs7V0FHQTtRQUNBLEVBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7QUFPQSxTQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsV0FBQSxRQUFBO0lBQ0EsSUFBQSxnQkFBQTtRQUNBLE9BQUE7UUFDQSxjQUFBLEtBQUEsS0FBQSxXQUFBO1FBQ0EsTUFBQSxLQUFBLEtBQUEsV0FBQTs7SUFFQSxFQUFBLE9BQUEsZUFBQTtJQUNBLFNBQUEsT0FBQTs7O0FBR0EsT0FBQSxVQUFBOztBQy9xQkEsT0FBQSxVQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsYUFBQSxRQUFBOztJQUVBLE9BQUEsSUFBQTs7UUFFQSxVQUFBOzs7O1FBSUEsWUFBQSxDQUFBLFNBQUEsUUFBQSxTQUFBOzs7UUFHQSxPQUFBLFdBQUEsTUFBQTs7O1FBR0EsU0FBQSxXQUFBLE1BQUE7O1FBRUEsU0FBQTtZQUNBLEtBQUE7Ozs7O1FBS0EsZUFBQSxXQUFBLE1BQUE7Ozs7O1FBS0EsV0FBQSxDQUFBLFlBQUE7O1FBRUEsa0JBQUE7WUFDQSxLQUFBLFdBQUEsTUFBQSxTQUFBO1lBQ0EsV0FBQSxXQUFBLE1BQUEsU0FBQTs7OztRQUlBLE1BQUE7OztRQUdBLFFBQUE7Ozs7O1FBS0EsVUFBQSxPQUFBOzs7UUFHQSxXQUFBOzs7OztRQUtBLFVBQUEsQ0FBQTs7OztRQUlBLFdBQUE7Ozs7QUN4REEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsU0FBQSxnQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxpQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxTQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLFFBQUE7TUFDQSxhQUFBLFFBQUE7O0tBRUEsTUFBQTs7O0lBR0EsTUFBQSxlQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7O1lBS0EsTUFBQSxTQUFBO1lBQ0EsS0FBQTtZQUNBLE9BQUE7Z0JBQ0EsTUFBQTtvQkFDQSxhQUFBLFFBQUE7O2dCQUVBLFFBQUE7b0JBQ0EsYUFBQSxRQUFBOzs7OztJQUtBLE1BQUEsZUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGNBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsYUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxjQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7SUFJQSxNQUFBLGVBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsa0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsZ0JBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQSxDQUFBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7OztJQUlBLE1BQUEsY0FBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxnQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSwyQkFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBLENBQUEsVUFBQTtJQUNBLE9BQUE7S0FDQSxTQUFBO01BQ0EsYUFBQSxRQUFBOzs7OztJQUtBLE1BQUEsbUJBQUE7VUFDQSxLQUFBO1VBQ0EsT0FBQTtZQUNBLFNBQUE7Y0FDQSxhQUFBLFFBQUE7Ozs7O0lBS0EsTUFBQSxZQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUEsQ0FBQSxVQUFBO0lBQ0EsT0FBQTtLQUNB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U0FBQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7S0FDQSxVQUFBO09BQ0EsTUFBQTtPQUNBLFFBQUE7T0FDQSxHQUFBO09BQ0EsT0FBQTs7Ozs7O0FDdENBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7Ozs7O0FDekJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdCQUFBOztJQUVBLFNBQUEsc0JBQUE7Ozs7OztBQ0xBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsa0JBQUE7Ozs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDZEQUFBLFNBQUEsUUFBQSxZQUFBLFlBQUEsS0FBQTs7RUFFQSxPQUFBLE9BQUEsVUFBQTtHQUNBLE9BQUEsV0FBQTtLQUNBLFNBQUEsUUFBQTtHQUNBLE9BQUEsZUFBQSxXQUFBOzs7RUFHQSxPQUFBLGNBQUEsV0FBQTtHQUNBLFdBQUEsUUFBQTs7Ozs7OztBQ1pBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFCQUFBOztDQUVBLFNBQUEsb0JBQUE7RUFDQSxJQUFBLEtBQUE7O0VBRUEsR0FBQSxzQkFBQTtFQUNBLEdBQUEsc0JBQUE7Ozs7O0FDVEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBO01BQ0EsV0FBQSw0REFBQSxVQUFBLFFBQUEsVUFBQSxZQUFBLE1BQUE7T0FDQSxPQUFBLGFBQUEsb0JBQUE7T0FDQSxPQUFBLGNBQUEsYUFBQTtPQUNBLE9BQUEsY0FBQSxVQUFBO1NBQ0EsT0FBQSxXQUFBLFNBQUE7Ozs7OztPQU1BLFNBQUEsU0FBQSxNQUFBLE1BQUEsU0FBQTtTQUNBLElBQUE7U0FDQSxPQUFBLFNBQUEsWUFBQTtXQUNBLElBQUEsVUFBQTtlQUNBLE9BQUEsTUFBQSxVQUFBLE1BQUEsS0FBQTtXQUNBLFNBQUEsT0FBQTtXQUNBLFFBQUEsU0FBQSxXQUFBO2FBQ0EsUUFBQTthQUNBLEtBQUEsTUFBQSxTQUFBO2NBQ0EsUUFBQTs7Ozs7OztPQU9BLFNBQUEsb0JBQUEsT0FBQTtTQUNBLE9BQUEsU0FBQSxXQUFBO1dBQ0EsV0FBQTtjQUNBO2NBQ0EsS0FBQSxZQUFBO2VBQ0EsS0FBQSxNQUFBLFlBQUEsUUFBQTs7WUFFQTs7T0FFQSxTQUFBLGFBQUEsT0FBQTtTQUNBLE9BQUEsV0FBQTtXQUNBLFdBQUE7Y0FDQTtjQUNBLEtBQUEsWUFBQTtlQUNBLEtBQUEsTUFBQSxZQUFBLFFBQUE7Ozs7O01BS0EsV0FBQSx5REFBQSxVQUFBLFFBQUEsVUFBQSxZQUFBLE1BQUE7T0FDQSxPQUFBLFFBQUEsWUFBQTtTQUNBLFdBQUEsUUFBQTtZQUNBLEtBQUEsWUFBQTthQUNBLEtBQUEsTUFBQTs7OztNQUlBLFdBQUEsMERBQUEsVUFBQSxRQUFBLFVBQUEsWUFBQSxNQUFBO09BQ0EsT0FBQSxRQUFBLFlBQUE7U0FDQSxXQUFBLFNBQUE7WUFDQSxLQUFBLFlBQUE7YUFDQSxLQUFBLE1BQUE7Ozs7O0FDN0RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDBCQUFBLFVBQUE7Ozs7OztBQ0hBLENBQUEsVUFBQTtJQUNBOzs7SUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQTs7O0lBR0EsU0FBQSx5QkFBQSxjQUFBOztRQUVBLEtBQUEsT0FBQSxVQUFBOzs7O1FBSUEsS0FBQSxPQUFBLFVBQUE7V0FDQSxjQUFBOzs7Ozs7O0FDYkEsQ0FBQSxVQUFBO0lBQ0E7OztJQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBOzs7SUFHQSxTQUFBLGdCQUFBLGNBQUE7O1FBRUEsS0FBQSxPQUFBLFVBQUE7Ozs7UUFJQSxLQUFBLE9BQUEsVUFBQTtXQUNBLGNBQUE7Ozs7Ozs7QUNiQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxZQUFBOztDQUVBLFNBQUEscUJBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNCQUFBOztDQUVBLFNBQUEsb0JBQUE7Ozs7OztBQ0xBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLGtCQUFBOztDQUVBLFNBQUEsMkJBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtFQUNBOzs7RUFFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3QkFBQTs7RUFFQSxTQUFBLHFCQUFBLGFBQUEsYUFBQTs7SUFFQSxLQUFBLFNBQUEsVUFBQTtNQUNBLElBQUEsT0FBQTtRQUNBLE1BQUEsS0FBQTtRQUNBLE9BQUEsS0FBQTs7O09BR0EsWUFBQSxJQUFBLFNBQUEsS0FBQSxNQUFBLEtBQUEsU0FBQSxTQUFBO1NBQ0EsYUFBQSxLQUFBOzs7Ozs7O0FDZEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsWUFBQTs7Q0FFQSxTQUFBLHFCQUFBO0VBQ0EsT0FBQTtHQUNBLFVBQUE7R0FDQSxhQUFBO0dBQ0EsWUFBQTtHQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQTs7Ozs7Ozs7QUNWQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzQkFBQTs7Q0FFQSxTQUFBLG9CQUFBOzs7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSxlQUFBOztDQUVBLFNBQUEsd0JBQUE7RUFDQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlCQUFBOztDQUVBLFNBQUEsdUJBQUE7Ozs7Ozs7QUNKQTs7QUFFQSxJQUFBLFVBQUEsUUFBQTtBQUNBLElBQUEsTUFBQTtBQUNBLElBQUEsYUFBQSxRQUFBO0FBQ0EsSUFBQSxVQUFBLFFBQUE7QUFDQSxJQUFBLFNBQUEsUUFBQTtBQUNBLElBQUEsT0FBQSxRQUFBLElBQUEsUUFBQTtBQUNBLElBQUEsWUFBQSxRQUFBOztBQUVBLElBQUEsY0FBQSxRQUFBLElBQUE7O0FBRUEsSUFBQSxJQUFBLFFBQUEsWUFBQTtBQUNBLElBQUEsSUFBQSxXQUFBLFdBQUEsQ0FBQSxVQUFBO0FBQ0EsSUFBQSxJQUFBLFdBQUE7QUFDQSxJQUFBLElBQUEsT0FBQTs7QUFFQSxJQUFBLElBQUEsUUFBQSxRQUFBOztBQUVBLFFBQUEsSUFBQTtBQUNBLFFBQUEsSUFBQSxVQUFBO0FBQ0EsUUFBQSxJQUFBLGNBQUE7O0FBRUEsUUFBQTtJQUNBLEtBQUE7UUFDQSxRQUFBLElBQUE7UUFDQSxJQUFBLElBQUEsUUFBQSxPQUFBOztRQUVBLElBQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxLQUFBLE1BQUE7WUFDQSxVQUFBLFFBQUEsS0FBQTs7O1FBR0EsSUFBQSxJQUFBLE1BQUEsUUFBQSxPQUFBO1FBQ0E7SUFDQTtRQUNBLFFBQUEsSUFBQTtRQUNBLElBQUEsSUFBQSxRQUFBLE9BQUE7UUFDQSxJQUFBLElBQUEsUUFBQSxPQUFBO1FBQ0EsSUFBQSxJQUFBLFFBQUEsT0FBQTs7UUFFQSxJQUFBLElBQUEsVUFBQSxTQUFBLEtBQUEsS0FBQSxNQUFBO1lBQ0EsVUFBQSxRQUFBLEtBQUE7OztRQUdBLElBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtRQUNBOzs7QUFHQSxJQUFBLE9BQUEsTUFBQSxXQUFBO0lBQ0EsUUFBQSxJQUFBLHNDQUFBO0lBQ0EsUUFBQSxJQUFBLFdBQUEsSUFBQSxJQUFBO1FBQ0EsbUJBQUE7UUFDQSxxQkFBQSxRQUFBOzs7QUNyREEsT0FBQSxVQUFBO0lBQ0EsUUFBQTs7O0FBR0EsU0FBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLENBQUEsSUFBQSxHQUFBLFdBQUEsUUFBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLFVBQUE7UUFDQSxDQUFBLElBQUEsR0FBQSxXQUFBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxVQUFBO1FBQ0EsQ0FBQSxJQUFBLEdBQUEsV0FBQSxXQUFBLFVBQUEsU0FBQSxLQUFBLElBQUEsVUFBQTtRQUNBLENBQUEsSUFBQSxHQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLFVBQUE7UUFDQSxDQUFBLElBQUEsR0FBQSxXQUFBLFFBQUEsVUFBQSxRQUFBLEtBQUEsSUFBQSxVQUFBO1FBQ0EsQ0FBQSxJQUFBLEdBQUEsV0FBQSxVQUFBLFVBQUEsU0FBQSxLQUFBLElBQUEsVUFBQTtRQUNBLENBQUEsSUFBQSxHQUFBLFdBQUEsU0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLFVBQUE7UUFDQSxDQUFBLElBQUEsR0FBQSxXQUFBLFNBQUEsVUFBQSxnQkFBQSxLQUFBLElBQUEsVUFBQTs7OztBQ2JBLElBQUEsU0FBQSxRQUFBLFdBQUE7QUFDQSxJQUFBLFlBQUEsUUFBQTtBQUNBLElBQUEsT0FBQSxRQUFBOztBQUVBLE9BQUEsSUFBQSxXQUFBO0FBQ0EsT0FBQSxJQUFBLGVBQUE7QUFDQSxPQUFBLElBQUEsTUFBQSxVQUFBOztBQUVBLE9BQUEsVUFBQTs7OztBQUlBLFNBQUEsVUFBQSxLQUFBLEtBQUEsTUFBQTtJQUNBLElBQUEsT0FBQSxLQUFBLEtBQUEsS0FBQTs7O0FBR0EsU0FBQSxVQUFBLEtBQUEsS0FBQSxNQUFBO0lBQ0EsSUFBQSxLQUFBLENBQUEsSUFBQSxPQUFBO0lBQ0EsSUFBQSxTQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsRUFBQSxPQUFBO09BQ0E7O0lBRUEsSUFBQSxRQUFBO1FBQ0EsSUFBQSxPQUFBLEtBQUEsS0FBQTtXQUNBO1FBQ0EsVUFBQSxRQUFBLEtBQUEsS0FBQSxZQUFBLEtBQUE7Ozs7QUN6QkEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLE9BQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFBLENBQUEsU0FBQSxVQUFBLE1BQUE7O0lBRUEsU0FBQSxVQUFBLE9BQUEsVUFBQSxPQUFBO1FBQ0EsSUFBQSxPQUFBLFNBQUEsWUFBQTs7O1lBR0EsSUFBQSxNQUFBO1lBQ0EsTUFBQSxJQUFBLFVBQUE7OztRQUdBLElBQUEsUUFBQSxNQUFBLFVBQUEsTUFBQSxLQUFBLFdBQUE7WUFDQSxVQUFBO1lBQ0EsV0FBQSxZQUFBO1lBQ0EsU0FBQSxZQUFBO2dCQUNBLE9BQUEsUUFBQSxNQUFBLGdCQUFBLFlBQUEsUUFBQSxPQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBLFVBQUEsTUFBQSxLQUFBOzs7UUFHQSxTQUFBLFlBQUEsS0FBQTtRQUNBLE9BQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7Ozs7O0FDM0JBLElBQUEsV0FBQSxDQUFBLFdBQUE7SUFDQSxPQUFBO1FBQ0EsZUFBQTtRQUNBLGVBQUE7OztJQUdBLFNBQUEsZ0JBQUE7UUFDQSxPQUFBO1lBQ0E7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBO29CQUNBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxPQUFBO29CQUNBLFVBQUE7d0JBQ0EsS0FBQTt3QkFDQSxTQUFBOzs7Ozs7O0lBT0EsU0FBQSxnQkFBQTtRQUNBLE9BQUE7WUFDQSxDQUFBLFdBQUEsUUFBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLFVBQUE7WUFDQSxDQUFBLFdBQUEsUUFBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLFVBQUE7WUFDQSxDQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLFVBQUE7WUFDQSxDQUFBLFdBQUEsV0FBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLFVBQUE7WUFDQSxDQUFBLFdBQUEsUUFBQSxVQUFBLFFBQUEsS0FBQSxJQUFBLFVBQUE7WUFDQSxDQUFBLFdBQUEsVUFBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLFVBQUE7WUFDQSxDQUFBLFdBQUEsU0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLFVBQUE7Ozs7O0FDaENBLE9BQUEsVUFBQSxZQUFBO0lBQ0EsSUFBQSxVQUFBO1FBQ0Esb0JBQUE7UUFDQSxTQUFBOztJQUVBLE9BQUE7O0lBRUEsU0FBQSxtQkFBQSxLQUFBLEtBQUEsTUFBQTtRQUNBLFFBQUEsS0FBQSxLQUFBOzs7SUFHQSxTQUFBLFFBQUEsS0FBQSxLQUFBLGFBQUE7UUFDQSxJQUFBLE9BQUE7WUFDQSxRQUFBO1lBQ0EsU0FBQTtZQUNBLGFBQUE7WUFDQSxLQUFBLElBQUE7O1FBRUEsSUFBQSxPQUFBO2FBQ0EsS0FBQTthQUNBOzs7O0FDcEJBLENBQUEsWUFBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsbUJBQUE7O0lBRUEsZ0JBQUEsVUFBQSxDQUFBOztJQUVBLFNBQUEsZ0JBQUEsUUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsUUFBQTs7UUFFQTs7UUFFQSxTQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUE7Ozs7OztBQ2ZBLFNBQUEsbUJBQUEsV0FBQTtJQUNBLElBQUE7O0lBRUEsV0FBQSxXQUFBO1FBQ0EsS0FBQSxVQUFBO1FBQ0EsS0FBQSxPQUFBLGVBQUEsUUFBQTs7O0lBR0EsV0FBQSxZQUFBO1FBQ0EsYUFBQSxZQUFBO1FBQ0EsV0FBQTs7O0lBR0EsS0FBQTs7SUFFQSxTQUFBLG9CQUFBLFdBQUE7UUFDQSxHQUFBLGtDQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUEsR0FBQSxHQUFBOzs7UUFHQSxTQUFBLGtCQUFBLFdBQUE7WUFDQSxH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UUFDQTs7O0FBR0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHQnYXBwLmZpbHRlcnMnLFxuXHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0J2FwcC5mZWF0dXJlcycsXG5cdFx0J2FwcC5yb3V0ZXMnLFxuXHRcdCdhcHAuY29uZmlnJyxcblx0XHQncGFydGlhbHNNb2R1bGUnLFxuXHRcdCdkYXRhdGFibGVzJyxcblx0XHQnbWdjcmVhLm5nc3RyYXAnLFxuXHRcdCduZ0FuaW1hdGUnLFxuXHRcdCd1aS5ib290c3RyYXAnLFxuXHRcdCduZ1Jlc291cmNlJyxcblx0XHQnbmdNYXRlcmlhbCdcblx0XHRdKTtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsJ25nUmVzb3VyY2UnXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFsnbmdNYXRlcmlhbCddLCBbJ3VpLmJvb3RzdHJhcCddKTtcblxufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsaWVudCA9ICcuL3NyYy9jbGllbnQvJztcbiAgICB2YXIgc2VydmVyID0gJy4vc3JjL3NlcnZlci8nO1xuICAgIHZhciBjbGllbnRBcHAgPSBjbGllbnQgKyAnYXBwLyc7XG4gICAgdmFyIHJlcG9ydCA9ICcuL3JlcG9ydC8nO1xuICAgIHZhciByb290ID0gJy4vJztcbiAgICB2YXIgc3BlY1J1bm5lckZpbGUgPSAnc3BlY3MuaHRtbCc7XG4gICAgdmFyIHRlbXAgPSAnLi8udG1wLyc7XG4gICAgdmFyIHdpcmVkZXAgPSByZXF1aXJlKCd3aXJlZGVwJyk7XG4gICAgdmFyIGJvd2VyRmlsZXMgPSB3aXJlZGVwKHtkZXZEZXBlbmRlbmNpZXM6IHRydWV9KVsnanMnXTtcbiAgICB2YXIgYm93ZXIgPSB7XG4gICAgICAgIGpzb246IHJlcXVpcmUoJy4vYm93ZXIuanNvbicpLFxuICAgICAgICBkaXJlY3Rvcnk6ICcuL2Jvd2VyX2NvbXBvbmVudHMvJyxcbiAgICAgICAgaWdub3JlUGF0aDogJy4uLy4uJ1xuICAgIH07XG4gICAgdmFyIG5vZGVNb2R1bGVzID0gJ25vZGVfbW9kdWxlcyc7XG5cbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogRmlsZSBwYXRoc1xuICAgICAgICAgKi9cbiAgICAgICAgLy8gYWxsIGphdmFzY3JpcHQgdGhhdCB3ZSB3YW50IHRvIHZldFxuICAgICAgICBhbGxqczogW1xuICAgICAgICAgICAgJy4vc3JjLyoqLyouanMnLFxuICAgICAgICAgICAgJy4vKi5qcydcbiAgICAgICAgXSxcbiAgICAgICAgYnVpbGQ6ICcuL2J1aWxkLycsXG4gICAgICAgIGNsaWVudDogY2xpZW50LFxuICAgICAgICBjc3M6IHRlbXAgKyAnc3R5bGVzLmNzcycsXG4gICAgICAgIGZvbnRzOiBib3dlci5kaXJlY3RvcnkgKyAnZm9udC1hd2Vzb21lL2ZvbnRzLyoqLyouKicsXG4gICAgICAgIGh0bWw6IGNsaWVudCArICcqKi8qLmh0bWwnLFxuICAgICAgICBodG1sdGVtcGxhdGVzOiBjbGllbnRBcHAgKyAnKiovKi5odG1sJyxcbiAgICAgICAgaW1hZ2VzOiBjbGllbnQgKyAnaW1hZ2VzLyoqLyouKicsXG4gICAgICAgIGluZGV4OiBjbGllbnQgKyAnaW5kZXguaHRtbCcsXG4gICAgICAgIC8vIGFwcCBqcywgd2l0aCBubyBzcGVjc1xuICAgICAgICBqczogW1xuICAgICAgICAgICAgY2xpZW50QXBwICsgJyoqLyoubW9kdWxlLmpzJyxcbiAgICAgICAgICAgIGNsaWVudEFwcCArICcqKi8qLmpzJyxcbiAgICAgICAgICAgICchJyArIGNsaWVudEFwcCArICcqKi8qLnNwZWMuanMnXG4gICAgICAgIF0sXG4gICAgICAgIGpzT3JkZXI6IFtcbiAgICAgICAgICAgICcqKi9hcHAubW9kdWxlLmpzJyxcbiAgICAgICAgICAgICcqKi8qLm1vZHVsZS5qcycsXG4gICAgICAgICAgICAnKiovKi5qcydcbiAgICAgICAgXSxcbiAgICAgICAgbGVzczogY2xpZW50ICsgJ3N0eWxlcy9zdHlsZXMubGVzcycsXG4gICAgICAgIHJlcG9ydDogcmVwb3J0LFxuICAgICAgICByb290OiByb290LFxuICAgICAgICBzZXJ2ZXI6IHNlcnZlcixcbiAgICAgICAgc291cmNlOiAnc3JjLycsXG4gICAgICAgIHN0dWJzanM6IFtcbiAgICAgICAgICAgIGJvd2VyLmRpcmVjdG9yeSArICdhbmd1bGFyLW1vY2tzL2FuZ3VsYXItbW9ja3MuanMnLFxuICAgICAgICAgICAgY2xpZW50ICsgJ3N0dWJzLyoqLyouanMnXG4gICAgICAgIF0sXG4gICAgICAgIHRlbXA6IHRlbXAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG9wdGltaXplZCBmaWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgb3B0aW1pemVkOiB7XG4gICAgICAgICAgICBhcHA6ICdhcHAuanMnLFxuICAgICAgICAgICAgbGliOiAnbGliLmpzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwbGF0b1xuICAgICAgICAgKi9cbiAgICAgICAgcGxhdG86IHtqczogY2xpZW50QXBwICsgJyoqLyouanMnfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogYnJvd3NlciBzeW5jXG4gICAgICAgICAqL1xuICAgICAgICBicm93c2VyUmVsb2FkRGVsYXk6IDEwMDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRlbXBsYXRlIGNhY2hlXG4gICAgICAgICAqL1xuICAgICAgICB0ZW1wbGF0ZUNhY2hlOiB7XG4gICAgICAgICAgICBmaWxlOiAndGVtcGxhdGVzLmpzJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBtb2R1bGU6ICdhcHAuY29yZScsXG4gICAgICAgICAgICAgICAgcm9vdDogJ2FwcC8nLFxuICAgICAgICAgICAgICAgIHN0YW5kYWxvbmU6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJvd2VyIGFuZCBOUE0gZmlsZXNcbiAgICAgICAgICovXG4gICAgICAgIGJvd2VyOiBib3dlcixcbiAgICAgICAgcGFja2FnZXM6IFtcbiAgICAgICAgICAgICcuL3BhY2thZ2UuanNvbicsXG4gICAgICAgICAgICAnLi9ib3dlci5qc29uJ1xuICAgICAgICBdLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzcGVjcy5odG1sLCBvdXIgSFRNTCBzcGVjIHJ1bm5lclxuICAgICAgICAgKi9cbiAgICAgICAgc3BlY1J1bm5lcjogY2xpZW50ICsgc3BlY1J1bm5lckZpbGUsXG4gICAgICAgIHNwZWNSdW5uZXJGaWxlOiBzcGVjUnVubmVyRmlsZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNlcXVlbmNlIG9mIHRoZSBpbmplY3Rpb25zIGludG8gc3BlY3MuaHRtbDpcbiAgICAgICAgICogIDEgdGVzdGxpYnJhcmllc1xuICAgICAgICAgKiAgICAgIG1vY2hhIHNldHVwXG4gICAgICAgICAqICAyIGJvd2VyXG4gICAgICAgICAqICAzIGpzXG4gICAgICAgICAqICA0IHNwZWNoZWxwZXJzXG4gICAgICAgICAqICA1IHNwZWNzXG4gICAgICAgICAqICA2IHRlbXBsYXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgdGVzdGxpYnJhcmllczogW1xuICAgICAgICAgICAgbm9kZU1vZHVsZXMgKyAnL21vY2hhL21vY2hhLmpzJyxcbiAgICAgICAgICAgIG5vZGVNb2R1bGVzICsgJy9jaGFpL2NoYWkuanMnLFxuICAgICAgICAgICAgbm9kZU1vZHVsZXMgKyAnL3Npbm9uLWNoYWkvbGliL3Npbm9uLWNoYWkuanMnXG4gICAgICAgIF0sXG4gICAgICAgIHNwZWNIZWxwZXJzOiBbY2xpZW50ICsgJ3Rlc3QtaGVscGVycy8qLmpzJ10sXG4gICAgICAgIHNwZWNzOiBbY2xpZW50QXBwICsgJyoqLyouc3BlYy5qcyddLFxuICAgICAgICBzZXJ2ZXJJbnRlZ3JhdGlvblNwZWNzOiBbY2xpZW50ICsgJy90ZXN0cy9zZXJ2ZXItaW50ZWdyYXRpb24vKiovKi5zcGVjLmpzJ10sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE5vZGUgc2V0dGluZ3NcbiAgICAgICAgICovXG4gICAgICAgIG5vZGVTZXJ2ZXI6IHNlcnZlciArICdhcHAuanMnLFxuICAgICAgICBkZWZhdWx0UG9ydDogJzgwMDEnXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHdpcmVkZXAgYW5kIGJvd2VyIHNldHRpbmdzXG4gICAgICovXG4gICAgY29uZmlnLmdldFdpcmVkZXBEZWZhdWx0T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGJvd2VySnNvbjogY29uZmlnLmJvd2VyLmpzb24sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IGNvbmZpZy5ib3dlci5kaXJlY3RvcnksXG4gICAgICAgICAgICBpZ25vcmVQYXRoOiBjb25maWcuYm93ZXIuaWdub3JlUGF0aFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICoga2FybWEgc2V0dGluZ3NcbiAgICAgKi9cbiAgICBjb25maWcua2FybWEgPSBnZXRLYXJtYU9wdGlvbnMoKTtcblxuICAgIHJldHVybiBjb25maWc7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vXG5cbiAgICBmdW5jdGlvbiBnZXRLYXJtYU9wdGlvbnMoKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgZmlsZXM6IFtdLmNvbmNhdChcbiAgICAgICAgICAgICAgICBib3dlckZpbGVzLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5zcGVjSGVscGVycyxcbiAgICAgICAgICAgICAgICBjbGllbnRBcHAgKyAnKiovKi5tb2R1bGUuanMnLFxuICAgICAgICAgICAgICAgIGNsaWVudEFwcCArICcqKi8qLmpzJyxcbiAgICAgICAgICAgICAgICB0ZW1wICsgY29uZmlnLnRlbXBsYXRlQ2FjaGUuZmlsZSxcbiAgICAgICAgICAgICAgICBjb25maWcuc2VydmVySW50ZWdyYXRpb25TcGVjc1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFtdLFxuICAgICAgICAgICAgY292ZXJhZ2U6IHtcbiAgICAgICAgICAgICAgICBkaXI6IHJlcG9ydCArICdjb3ZlcmFnZScsXG4gICAgICAgICAgICAgICAgcmVwb3J0ZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlcG9ydGVycyBub3Qgc3VwcG9ydGluZyB0aGUgYGZpbGVgIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIHt0eXBlOiAnaHRtbCcsIHN1YmRpcjogJ3JlcG9ydC1odG1sJ30sXG4gICAgICAgICAgICAgICAgICAgIHt0eXBlOiAnbGNvdicsIHN1YmRpcjogJ3JlcG9ydC1sY292J30sXG4gICAgICAgICAgICAgICAgICAgIHt0eXBlOiAndGV4dC1zdW1tYXJ5J30gLy8sIHN1YmRpcjogJy4nLCBmaWxlOiAndGV4dC1zdW1tYXJ5LnR4dCd9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZXByb2Nlc3NvcnM6IHt9XG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMucHJlcHJvY2Vzc29yc1tjbGllbnRBcHAgKyAnKiovISgqLnNwZWMpKyguanMpJ10gPSBbJ2NvdmVyYWdlJ107XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbn07XG4iLCJ2YXIgYXJncyA9IHJlcXVpcmUoJ3lhcmdzJykuYXJndjtcbnZhciBicm93c2VyU3luYyA9IHJlcXVpcmUoJ2Jyb3dzZXItc3luYycpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vZ3VscC5jb25maWcnKSgpO1xudmFyIGRlbCA9IHJlcXVpcmUoJ2RlbCcpO1xudmFyIGdsb2IgPSByZXF1aXJlKCdnbG9iJyk7XG52YXIgZ3VscCA9IHJlcXVpcmUoJ2d1bHAnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciAkID0gcmVxdWlyZSgnZ3VscC1sb2FkLXBsdWdpbnMnKSh7bGF6eTogdHJ1ZX0pO1xuXG52YXIgY29sb3JzID0gJC51dGlsLmNvbG9ycztcbnZhciBlbnZlbnYgPSAkLnV0aWwuZW52O1xudmFyIHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IGNvbmZpZy5kZWZhdWx0UG9ydDtcblxuLyoqXG4gKiB5YXJncyB2YXJpYWJsZXMgY2FuIGJlIHBhc3NlZCBpbiB0byBhbHRlciB0aGUgYmVoYXZpb3IsIHdoZW4gcHJlc2VudC5cbiAqIEV4YW1wbGU6IGd1bHAgc2VydmUtZGV2XG4gKlxuICogLS12ZXJib3NlICA6IFZhcmlvdXMgdGFza3Mgd2lsbCBwcm9kdWNlIG1vcmUgb3V0cHV0IHRvIHRoZSBjb25zb2xlLlxuICogLS1ub3N5bmMgICA6IERvbid0IGxhdW5jaCB0aGUgYnJvd3NlciB3aXRoIGJyb3dzZXItc3luYyB3aGVuIHNlcnZpbmcgY29kZS5cbiAqIC0tZGVidWcgICAgOiBMYXVuY2ggZGVidWdnZXIgd2l0aCBub2RlLWluc3BlY3Rvci5cbiAqIC0tZGVidWctYnJrOiBMYXVuY2ggZGVidWdnZXIgYW5kIGJyZWFrIG9uIDFzdCBsaW5lIHdpdGggbm9kZS1pbnNwZWN0b3IuXG4gKiAtLXN0YXJ0U2VydmVyczogV2lsbCBzdGFydCBzZXJ2ZXJzIGZvciBtaWR3YXkgdGVzdHMgb24gdGhlIHRlc3QgdGFzay5cbiAqL1xuXG4vKipcbiAqIExpc3QgdGhlIGF2YWlsYWJsZSBndWxwIHRhc2tzXG4gKi9cbmd1bHAudGFzaygnaGVscCcsICQudGFza0xpc3RpbmcpO1xuZ3VscC50YXNrKCdkZWZhdWx0JywgWydoZWxwJ10pO1xuXG4vKipcbiAqIHZldCB0aGUgY29kZSBhbmQgY3JlYXRlIGNvdmVyYWdlIHJlcG9ydFxuICogQHJldHVybiB7U3RyZWFtfVxuICovXG5ndWxwLnRhc2soJ3ZldCcsIGZ1bmN0aW9uKCkge1xuICAgIGxvZygnQW5hbHl6aW5nIHNvdXJjZSB3aXRoIEpTSGludCBhbmQgSlNDUycpO1xuXG4gICAgcmV0dXJuIGd1bHBcbiAgICAgICAgLnNyYyhjb25maWcuYWxsanMpXG4gICAgICAgIC5waXBlKCQuaWYoYXJncy52ZXJib3NlLCAkLnByaW50KCkpKVxuICAgICAgICAucGlwZSgkLmpzaGludCgpKVxuICAgICAgICAucGlwZSgkLmpzaGludC5yZXBvcnRlcignanNoaW50LXN0eWxpc2gnLCB7dmVyYm9zZTogdHJ1ZX0pKVxuICAgICAgICAucGlwZSgkLmpzaGludC5yZXBvcnRlcignZmFpbCcpKVxuICAgICAgICAucGlwZSgkLmpzY3MoKSk7XG59KTtcblxuLyoqXG4gKiBDcmVhdGUgYSB2aXN1YWxpemVyIHJlcG9ydFxuICovXG5ndWxwLnRhc2soJ3BsYXRvJywgZnVuY3Rpb24oZG9uZSkge1xuICAgIGxvZygnQW5hbHl6aW5nIHNvdXJjZSB3aXRoIFBsYXRvJyk7XG4gICAgbG9nKCdCcm93c2UgdG8gL3JlcG9ydC9wbGF0by9pbmRleC5odG1sIHRvIHNlZSBQbGF0byByZXN1bHRzJyk7XG5cbiAgICBzdGFydFBsYXRvVmlzdWFsaXplcihkb25lKTtcbn0pO1xuXG4vKipcbiAqIENvbXBpbGUgbGVzcyB0byBjc3NcbiAqIEByZXR1cm4ge1N0cmVhbX1cbiAqL1xuZ3VscC50YXNrKCdzdHlsZXMnLCBbJ2NsZWFuLXN0eWxlcyddLCBmdW5jdGlvbigpIHtcbiAgICBsb2coJ0NvbXBpbGluZyBMZXNzIC0tPiBDU1MnKTtcblxuICAgIHJldHVybiBndWxwXG4gICAgICAgIC5zcmMoY29uZmlnLmxlc3MpXG4gICAgICAgIC5waXBlKCQucGx1bWJlcigpKSAvLyBleGl0IGdyYWNlZnVsbHkgaWYgc29tZXRoaW5nIGZhaWxzIGFmdGVyIHRoaXNcbiAgICAgICAgLnBpcGUoJC5sZXNzKCkpXG4vLyAgICAgICAgLm9uKCdlcnJvcicsIGVycm9yTG9nZ2VyKSAvLyBtb3JlIHZlcmJvc2UgYW5kIGR1cGUgb3V0cHV0LiByZXF1aXJlcyBlbWl0LlxuICAgICAgICAucGlwZSgkLmF1dG9wcmVmaXhlcih7YnJvd3NlcnM6IFsnbGFzdCAyIHZlcnNpb24nLCAnPiA1JSddfSkpXG4gICAgICAgIC5waXBlKGd1bHAuZGVzdChjb25maWcudGVtcCkpO1xufSk7XG5cbi8qKlxuICogQ29weSBmb250c1xuICogQHJldHVybiB7U3RyZWFtfVxuICovXG5ndWxwLnRhc2soJ2ZvbnRzJywgWydjbGVhbi1mb250cyddLCBmdW5jdGlvbigpIHtcbiAgICBsb2coJ0NvcHlpbmcgZm9udHMnKTtcblxuICAgIHJldHVybiBndWxwXG4gICAgICAgIC5zcmMoY29uZmlnLmZvbnRzKVxuICAgICAgICAucGlwZShndWxwLmRlc3QoY29uZmlnLmJ1aWxkICsgJ2ZvbnRzJykpO1xufSk7XG5cbi8qKlxuICogQ29tcHJlc3MgaW1hZ2VzXG4gKiBAcmV0dXJuIHtTdHJlYW19XG4gKi9cbmd1bHAudGFzaygnaW1hZ2VzJywgWydjbGVhbi1pbWFnZXMnXSwgZnVuY3Rpb24oKSB7XG4gICAgbG9nKCdDb21wcmVzc2luZyBhbmQgY29weWluZyBpbWFnZXMnKTtcblxuICAgIHJldHVybiBndWxwXG4gICAgICAgIC5zcmMoY29uZmlnLmltYWdlcylcbiAgICAgICAgLnBpcGUoJC5pbWFnZW1pbih7b3B0aW1pemF0aW9uTGV2ZWw6IDR9KSlcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KGNvbmZpZy5idWlsZCArICdpbWFnZXMnKSk7XG59KTtcblxuZ3VscC50YXNrKCdsZXNzLXdhdGNoZXInLCBmdW5jdGlvbigpIHtcbiAgICBndWxwLndhdGNoKFtjb25maWcubGVzc10sIFsnc3R5bGVzJ10pO1xufSk7XG5cbi8qKlxuICogQ3JlYXRlICR0ZW1wbGF0ZUNhY2hlIGZyb20gdGhlIGh0bWwgdGVtcGxhdGVzXG4gKiBAcmV0dXJuIHtTdHJlYW19XG4gKi9cbmd1bHAudGFzaygndGVtcGxhdGVjYWNoZScsIFsnY2xlYW4tY29kZSddLCBmdW5jdGlvbigpIHtcbiAgICBsb2coJ0NyZWF0aW5nIGFuIEFuZ3VsYXJKUyAkdGVtcGxhdGVDYWNoZScpO1xuXG4gICAgcmV0dXJuIGd1bHBcbiAgICAgICAgLnNyYyhjb25maWcuaHRtbHRlbXBsYXRlcylcbiAgICAgICAgLnBpcGUoJC5pZihhcmdzLnZlcmJvc2UsICQuYnl0ZWRpZmYuc3RhcnQoKSkpXG4gICAgICAgIC5waXBlKCQubWluaWZ5SHRtbCh7ZW1wdHk6IHRydWV9KSlcbiAgICAgICAgLnBpcGUoJC5pZihhcmdzLnZlcmJvc2UsICQuYnl0ZWRpZmYuc3RvcChieXRlZGlmZkZvcm1hdHRlcikpKVxuICAgICAgICAucGlwZSgkLmFuZ3VsYXJUZW1wbGF0ZWNhY2hlKFxuICAgICAgICAgICAgY29uZmlnLnRlbXBsYXRlQ2FjaGUuZmlsZSxcbiAgICAgICAgICAgIGNvbmZpZy50ZW1wbGF0ZUNhY2hlLm9wdGlvbnNcbiAgICAgICAgKSlcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KGNvbmZpZy50ZW1wKSk7XG59KTtcblxuLyoqXG4gKiBXaXJlLXVwIHRoZSBib3dlciBkZXBlbmRlbmNpZXNcbiAqIEByZXR1cm4ge1N0cmVhbX1cbiAqL1xuZ3VscC50YXNrKCd3aXJlZGVwJywgZnVuY3Rpb24oKSB7XG4gICAgbG9nKCdXaXJpbmcgdGhlIGJvd2VyIGRlcGVuZGVuY2llcyBpbnRvIHRoZSBodG1sJyk7XG5cbiAgICB2YXIgd2lyZWRlcCA9IHJlcXVpcmUoJ3dpcmVkZXAnKS5zdHJlYW07XG4gICAgdmFyIG9wdGlvbnMgPSBjb25maWcuZ2V0V2lyZWRlcERlZmF1bHRPcHRpb25zKCk7XG5cbiAgICAvLyBPbmx5IGluY2x1ZGUgc3R1YnMgaWYgZmxhZyBpcyBlbmFibGVkXG4gICAgdmFyIGpzID0gYXJncy5zdHVicyA/IFtdLmNvbmNhdChjb25maWcuanMsIGNvbmZpZy5zdHVic2pzKSA6IGNvbmZpZy5qcztcblxuICAgIHJldHVybiBndWxwXG4gICAgICAgIC5zcmMoY29uZmlnLmluZGV4KVxuICAgICAgICAucGlwZSh3aXJlZGVwKG9wdGlvbnMpKVxuICAgICAgICAucGlwZShpbmplY3QoanMsICcnLCBjb25maWcuanNPcmRlcikpXG4gICAgICAgIC5waXBlKGd1bHAuZGVzdChjb25maWcuY2xpZW50KSk7XG59KTtcblxuZ3VscC50YXNrKCdpbmplY3QnLCBbJ3dpcmVkZXAnLCAnc3R5bGVzJywgJ3RlbXBsYXRlY2FjaGUnXSwgZnVuY3Rpb24oKSB7XG4gICAgbG9nKCdXaXJlIHVwIGNzcyBpbnRvIHRoZSBodG1sLCBhZnRlciBmaWxlcyBhcmUgcmVhZHknKTtcblxuICAgIHJldHVybiBndWxwXG4gICAgICAgIC5zcmMoY29uZmlnLmluZGV4KVxuICAgICAgICAucGlwZShpbmplY3QoY29uZmlnLmNzcykpXG4gICAgICAgIC5waXBlKGd1bHAuZGVzdChjb25maWcuY2xpZW50KSk7XG59KTtcblxuLyoqXG4gKiBSdW4gdGhlIHNwZWMgcnVubmVyXG4gKiBAcmV0dXJuIHtTdHJlYW19XG4gKi9cbmd1bHAudGFzaygnc2VydmUtc3BlY3MnLCBbJ2J1aWxkLXNwZWNzJ10sIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICBsb2coJ3J1biB0aGUgc3BlYyBydW5uZXInKTtcbiAgICBzZXJ2ZSh0cnVlIC8qIGlzRGV2ICovLCB0cnVlIC8qIHNwZWNSdW5uZXIgKi8pO1xuICAgIGRvbmUoKTtcbn0pO1xuXG4vKipcbiAqIEluamVjdCBhbGwgdGhlIHNwZWMgZmlsZXMgaW50byB0aGUgc3BlY3MuaHRtbFxuICogQHJldHVybiB7U3RyZWFtfVxuICovXG5ndWxwLnRhc2soJ2J1aWxkLXNwZWNzJywgWyd0ZW1wbGF0ZWNhY2hlJ10sIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICBsb2coJ2J1aWxkaW5nIHRoZSBzcGVjIHJ1bm5lcicpO1xuXG4gICAgdmFyIHdpcmVkZXAgPSByZXF1aXJlKCd3aXJlZGVwJykuc3RyZWFtO1xuICAgIHZhciB0ZW1wbGF0ZUNhY2hlID0gY29uZmlnLnRlbXAgKyBjb25maWcudGVtcGxhdGVDYWNoZS5maWxlO1xuICAgIHZhciBvcHRpb25zID0gY29uZmlnLmdldFdpcmVkZXBEZWZhdWx0T3B0aW9ucygpO1xuICAgIHZhciBzcGVjcyA9IGNvbmZpZy5zcGVjcztcblxuICAgIGlmIChhcmdzLnN0YXJ0U2VydmVycykge1xuICAgICAgICBzcGVjcyA9IFtdLmNvbmNhdChzcGVjcywgY29uZmlnLnNlcnZlckludGVncmF0aW9uU3BlY3MpO1xuICAgIH1cbiAgICBvcHRpb25zLmRldkRlcGVuZGVuY2llcyA9IHRydWU7XG5cbiAgICByZXR1cm4gZ3VscFxuICAgICAgICAuc3JjKGNvbmZpZy5zcGVjUnVubmVyKVxuICAgICAgICAucGlwZSh3aXJlZGVwKG9wdGlvbnMpKVxuICAgICAgICAucGlwZShpbmplY3QoY29uZmlnLmpzLCAnJywgY29uZmlnLmpzT3JkZXIpKVxuICAgICAgICAucGlwZShpbmplY3QoY29uZmlnLnRlc3RsaWJyYXJpZXMsICd0ZXN0bGlicmFyaWVzJykpXG4gICAgICAgIC5waXBlKGluamVjdChjb25maWcuc3BlY0hlbHBlcnMsICdzcGVjaGVscGVycycpKVxuICAgICAgICAucGlwZShpbmplY3Qoc3BlY3MsICdzcGVjcycsIFsnKiovKiddKSlcbiAgICAgICAgLnBpcGUoaW5qZWN0KHRlbXBsYXRlQ2FjaGUsICd0ZW1wbGF0ZXMnKSlcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KGNvbmZpZy5jbGllbnQpKTtcbn0pO1xuXG4vKipcbiAqIEJ1aWxkIGV2ZXJ5dGhpbmdcbiAqIFRoaXMgaXMgc2VwYXJhdGUgc28gd2UgY2FuIHJ1biB0ZXN0cyBvblxuICogb3B0aW1pemUgYmVmb3JlIGhhbmRsaW5nIGltYWdlIG9yIGZvbnRzXG4gKi9cbmd1bHAudGFzaygnYnVpbGQnLCBbJ29wdGltaXplJywgJ2ltYWdlcycsICdmb250cyddLCBmdW5jdGlvbigpIHtcbiAgICBsb2coJ0J1aWxkaW5nIGV2ZXJ5dGhpbmcnKTtcblxuICAgIHZhciBtc2cgPSB7XG4gICAgICAgIHRpdGxlOiAnZ3VscCBidWlsZCcsXG4gICAgICAgIHN1YnRpdGxlOiAnRGVwbG95ZWQgdG8gdGhlIGJ1aWxkIGZvbGRlcicsXG4gICAgICAgIG1lc3NhZ2U6ICdSdW5uaW5nIGBndWxwIHNlcnZlLWJ1aWxkYCdcbiAgICB9O1xuICAgIGRlbChjb25maWcudGVtcCk7XG4gICAgbG9nKG1zZyk7XG4gICAgbm90aWZ5KG1zZyk7XG59KTtcblxuLyoqXG4gKiBPcHRpbWl6ZSBhbGwgZmlsZXMsIG1vdmUgdG8gYSBidWlsZCBmb2xkZXIsXG4gKiBhbmQgaW5qZWN0IHRoZW0gaW50byB0aGUgbmV3IGluZGV4Lmh0bWxcbiAqIEByZXR1cm4ge1N0cmVhbX1cbiAqL1xuZ3VscC50YXNrKCdvcHRpbWl6ZScsIFsnaW5qZWN0JywgJ3Rlc3QnXSwgZnVuY3Rpb24oKSB7XG4gICAgbG9nKCdPcHRpbWl6aW5nIHRoZSBqcywgY3NzLCBhbmQgaHRtbCcpO1xuXG4gICAgdmFyIGFzc2V0cyA9ICQudXNlcmVmLmFzc2V0cyh7c2VhcmNoUGF0aDogJy4vJ30pO1xuICAgIC8vIEZpbHRlcnMgYXJlIG5hbWVkIGZvciB0aGUgZ3VscC11c2VyZWYgcGF0aFxuICAgIHZhciBjc3NGaWx0ZXIgPSAkLmZpbHRlcignKiovKi5jc3MnKTtcbiAgICB2YXIganNBcHBGaWx0ZXIgPSAkLmZpbHRlcignKiovJyArIGNvbmZpZy5vcHRpbWl6ZWQuYXBwKTtcbiAgICB2YXIganNsaWJGaWx0ZXIgPSAkLmZpbHRlcignKiovJyArIGNvbmZpZy5vcHRpbWl6ZWQubGliKTtcblxuICAgIHZhciB0ZW1wbGF0ZUNhY2hlID0gY29uZmlnLnRlbXAgKyBjb25maWcudGVtcGxhdGVDYWNoZS5maWxlO1xuXG4gICAgcmV0dXJuIGd1bHBcbiAgICAgICAgLnNyYyhjb25maWcuaW5kZXgpXG4gICAgICAgIC5waXBlKCQucGx1bWJlcigpKVxuICAgICAgICAucGlwZShpbmplY3QodGVtcGxhdGVDYWNoZSwgJ3RlbXBsYXRlcycpKVxuICAgICAgICAucGlwZShhc3NldHMpIC8vIEdhdGhlciBhbGwgYXNzZXRzIGZyb20gdGhlIGh0bWwgd2l0aCB1c2VyZWZcbiAgICAgICAgLy8gR2V0IHRoZSBjc3NcbiAgICAgICAgLnBpcGUoY3NzRmlsdGVyKVxuICAgICAgICAucGlwZSgkLm1pbmlmeUNzcygpKVxuICAgICAgICAucGlwZShjc3NGaWx0ZXIucmVzdG9yZSgpKVxuICAgICAgICAvLyBHZXQgdGhlIGN1c3RvbSBqYXZhc2NyaXB0XG4gICAgICAgIC5waXBlKGpzQXBwRmlsdGVyKVxuICAgICAgICAucGlwZSgkLm5nQW5ub3RhdGUoe2FkZDogdHJ1ZX0pKVxuICAgICAgICAucGlwZSgkLnVnbGlmeSgpKVxuICAgICAgICAucGlwZShnZXRIZWFkZXIoKSlcbiAgICAgICAgLnBpcGUoanNBcHBGaWx0ZXIucmVzdG9yZSgpKVxuICAgICAgICAvLyBHZXQgdGhlIHZlbmRvciBqYXZhc2NyaXB0XG4gICAgICAgIC5waXBlKGpzbGliRmlsdGVyKVxuICAgICAgICAucGlwZSgkLnVnbGlmeSgpKSAvLyBhbm90aGVyIG9wdGlvbiBpcyB0byBvdmVycmlkZSB3aXJlZGVwIHRvIHVzZSBtaW4gZmlsZXNcbiAgICAgICAgLnBpcGUoanNsaWJGaWx0ZXIucmVzdG9yZSgpKVxuICAgICAgICAvLyBUYWtlIGludmVudG9yeSBvZiB0aGUgZmlsZSBuYW1lcyBmb3IgZnV0dXJlIHJldiBudW1iZXJzXG4gICAgICAgIC5waXBlKCQucmV2KCkpXG4gICAgICAgIC8vIEFwcGx5IHRoZSBjb25jYXQgYW5kIGZpbGUgcmVwbGFjZW1lbnQgd2l0aCB1c2VyZWZcbiAgICAgICAgLnBpcGUoYXNzZXRzLnJlc3RvcmUoKSlcbiAgICAgICAgLnBpcGUoJC51c2VyZWYoKSlcbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgZmlsZSBuYW1lcyBpbiB0aGUgaHRtbCB3aXRoIHJldiBudW1iZXJzXG4gICAgICAgIC5waXBlKCQucmV2UmVwbGFjZSgpKVxuICAgICAgICAucGlwZShndWxwLmRlc3QoY29uZmlnLmJ1aWxkKSk7XG59KTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGZpbGVzIGZyb20gdGhlIGJ1aWxkLCB0ZW1wLCBhbmQgcmVwb3J0cyBmb2xkZXJzXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZG9uZSAtIGNhbGxiYWNrIHdoZW4gY29tcGxldGVcbiAqL1xuZ3VscC50YXNrKCdjbGVhbicsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICB2YXIgZGVsY29uZmlnID0gW10uY29uY2F0KGNvbmZpZy5idWlsZCwgY29uZmlnLnRlbXAsIGNvbmZpZy5yZXBvcnQpO1xuICAgIGxvZygnQ2xlYW5pbmc6ICcgKyAkLnV0aWwuY29sb3JzLmJsdWUoZGVsY29uZmlnKSk7XG4gICAgZGVsKGRlbGNvbmZpZywgZG9uZSk7XG59KTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGZvbnRzIGZyb20gdGhlIGJ1aWxkIGZvbGRlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGRvbmUgLSBjYWxsYmFjayB3aGVuIGNvbXBsZXRlXG4gKi9cbmd1bHAudGFzaygnY2xlYW4tZm9udHMnLCBmdW5jdGlvbihkb25lKSB7XG4gICAgY2xlYW4oY29uZmlnLmJ1aWxkICsgJ2ZvbnRzLyoqLyouKicsIGRvbmUpO1xufSk7XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBpbWFnZXMgZnJvbSB0aGUgYnVpbGQgZm9sZGVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZG9uZSAtIGNhbGxiYWNrIHdoZW4gY29tcGxldGVcbiAqL1xuZ3VscC50YXNrKCdjbGVhbi1pbWFnZXMnLCBmdW5jdGlvbihkb25lKSB7XG4gICAgY2xlYW4oY29uZmlnLmJ1aWxkICsgJ2ltYWdlcy8qKi8qLionLCBkb25lKTtcbn0pO1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgc3R5bGVzIGZyb20gdGhlIGJ1aWxkIGFuZCB0ZW1wIGZvbGRlcnNcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkb25lIC0gY2FsbGJhY2sgd2hlbiBjb21wbGV0ZVxuICovXG5ndWxwLnRhc2soJ2NsZWFuLXN0eWxlcycsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICB2YXIgZmlsZXMgPSBbXS5jb25jYXQoXG4gICAgICAgIGNvbmZpZy50ZW1wICsgJyoqLyouY3NzJyxcbiAgICAgICAgY29uZmlnLmJ1aWxkICsgJ3N0eWxlcy8qKi8qLmNzcydcbiAgICApO1xuICAgIGNsZWFuKGZpbGVzLCBkb25lKTtcbn0pO1xuXG4vKipcbiAqIFJlbW92ZSBhbGwganMgYW5kIGh0bWwgZnJvbSB0aGUgYnVpbGQgYW5kIHRlbXAgZm9sZGVyc1xuICogQHBhcmFtICB7RnVuY3Rpb259IGRvbmUgLSBjYWxsYmFjayB3aGVuIGNvbXBsZXRlXG4gKi9cbmd1bHAudGFzaygnY2xlYW4tY29kZScsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICB2YXIgZmlsZXMgPSBbXS5jb25jYXQoXG4gICAgICAgIGNvbmZpZy50ZW1wICsgJyoqLyouanMnLFxuICAgICAgICBjb25maWcuYnVpbGQgKyAnanMvKiovKi5qcycsXG4gICAgICAgIGNvbmZpZy5idWlsZCArICcqKi8qLmh0bWwnXG4gICAgKTtcbiAgICBjbGVhbihmaWxlcywgZG9uZSk7XG59KTtcblxuLyoqXG4gKiBSdW4gc3BlY3Mgb25jZSBhbmQgZXhpdFxuICogVG8gc3RhcnQgc2VydmVycyBhbmQgcnVuIG1pZHdheSBzcGVjcyBhcyB3ZWxsOlxuICogICAgZ3VscCB0ZXN0IC0tc3RhcnRTZXJ2ZXJzXG4gKiBAcmV0dXJuIHtTdHJlYW19XG4gKi9cbmd1bHAudGFzaygndGVzdCcsIFsndmV0JywgJ3RlbXBsYXRlY2FjaGUnXSwgZnVuY3Rpb24oZG9uZSkge1xuICAgIHN0YXJ0VGVzdHModHJ1ZSAvKnNpbmdsZVJ1biovICwgZG9uZSk7XG59KTtcblxuLyoqXG4gKiBSdW4gc3BlY3MgYW5kIHdhaXQuXG4gKiBXYXRjaCBmb3IgZmlsZSBjaGFuZ2VzIGFuZCByZS1ydW4gdGVzdHMgb24gZWFjaCBjaGFuZ2VcbiAqIFRvIHN0YXJ0IHNlcnZlcnMgYW5kIHJ1biBtaWR3YXkgc3BlY3MgYXMgd2VsbDpcbiAqICAgIGd1bHAgYXV0b3Rlc3QgLS1zdGFydFNlcnZlcnNcbiAqL1xuZ3VscC50YXNrKCdhdXRvdGVzdCcsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICBzdGFydFRlc3RzKGZhbHNlIC8qc2luZ2xlUnVuKi8gLCBkb25lKTtcbn0pO1xuXG4vKipcbiAqIHNlcnZlIHRoZSBkZXYgZW52aXJvbm1lbnRcbiAqIC0tZGVidWctYnJrIG9yIC0tZGVidWdcbiAqIC0tbm9zeW5jXG4gKi9cbmd1bHAudGFzaygnc2VydmUtZGV2JywgWydpbmplY3QnXSwgZnVuY3Rpb24oKSB7XG4gICAgc2VydmUodHJ1ZSAvKmlzRGV2Ki8pO1xufSk7XG5cbi8qKlxuICogc2VydmUgdGhlIGJ1aWxkIGVudmlyb25tZW50XG4gKiAtLWRlYnVnLWJyayBvciAtLWRlYnVnXG4gKiAtLW5vc3luY1xuICovXG5ndWxwLnRhc2soJ3NlcnZlLWJ1aWxkJywgWydidWlsZCddLCBmdW5jdGlvbigpIHtcbiAgICBzZXJ2ZShmYWxzZSAvKmlzRGV2Ki8pO1xufSk7XG5cbi8qKlxuICogQnVtcCB0aGUgdmVyc2lvblxuICogLS10eXBlPXByZSB3aWxsIGJ1bXAgdGhlIHByZXJlbGVhc2UgdmVyc2lvbiAqLiouKi14XG4gKiAtLXR5cGU9cGF0Y2ggb3Igbm8gZmxhZyB3aWxsIGJ1bXAgdGhlIHBhdGNoIHZlcnNpb24gKi4qLnhcbiAqIC0tdHlwZT1taW5vciB3aWxsIGJ1bXAgdGhlIG1pbm9yIHZlcnNpb24gKi54LipcbiAqIC0tdHlwZT1tYWpvciB3aWxsIGJ1bXAgdGhlIG1ham9yIHZlcnNpb24geC4qLipcbiAqIC0tdmVyc2lvbj0xLjIuMyB3aWxsIGJ1bXAgdG8gYSBzcGVjaWZpYyB2ZXJzaW9uIGFuZCBpZ25vcmUgb3RoZXIgZmxhZ3NcbiAqL1xuZ3VscC50YXNrKCdidW1wJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1zZyA9ICdCdW1waW5nIHZlcnNpb25zJztcbiAgICB2YXIgdHlwZSA9IGFyZ3MudHlwZTtcbiAgICB2YXIgdmVyc2lvbiA9IGFyZ3MudmVyO1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgaWYgKHZlcnNpb24pIHtcbiAgICAgICAgb3B0aW9ucy52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgbXNnICs9ICcgdG8gJyArIHZlcnNpb247XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy50eXBlID0gdHlwZTtcbiAgICAgICAgbXNnICs9ICcgZm9yIGEgJyArIHR5cGU7XG4gICAgfVxuICAgIGxvZyhtc2cpO1xuXG4gICAgcmV0dXJuIGd1bHBcbiAgICAgICAgLnNyYyhjb25maWcucGFja2FnZXMpXG4gICAgICAgIC5waXBlKCQucHJpbnQoKSlcbiAgICAgICAgLnBpcGUoJC5idW1wKG9wdGlvbnMpKVxuICAgICAgICAucGlwZShndWxwLmRlc3QoY29uZmlnLnJvb3QpKTtcbn0pO1xuXG4vKipcbiAqIE9wdGltaXplIHRoZSBjb2RlIGFuZCByZS1sb2FkIGJyb3dzZXJTeW5jXG4gKi9cbmd1bHAudGFzaygnYnJvd3NlclN5bmNSZWxvYWQnLCBbJ29wdGltaXplJ10sIGJyb3dzZXJTeW5jLnJlbG9hZCk7XG5cbi8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBXaGVuIGZpbGVzIGNoYW5nZSwgbG9nIGl0XG4gKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IC0gZXZlbnQgdGhhdCBmaXJlZFxuICovXG5mdW5jdGlvbiBjaGFuZ2VFdmVudChldmVudCkge1xuICAgIHZhciBzcmNQYXR0ZXJuID0gbmV3IFJlZ0V4cCgnLy4qKD89LycgKyBjb25maWcuc291cmNlICsgJykvJyk7XG4gICAgbG9nKCdGaWxlICcgKyBldmVudC5wYXRoLnJlcGxhY2Uoc3JjUGF0dGVybiwgJycpICsgJyAnICsgZXZlbnQudHlwZSk7XG59XG5cbi8qKlxuICogRGVsZXRlIGFsbCBmaWxlcyBpbiBhIGdpdmVuIHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAgIHBhdGggLSBhcnJheSBvZiBwYXRocyB0byBkZWxldGVcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkb25lIC0gY2FsbGJhY2sgd2hlbiBjb21wbGV0ZVxuICovXG5mdW5jdGlvbiBjbGVhbihwYXRoLCBkb25lKSB7XG4gICAgbG9nKCdDbGVhbmluZzogJyArICQudXRpbC5jb2xvcnMuYmx1ZShwYXRoKSk7XG4gICAgZGVsKHBhdGgsIGRvbmUpO1xufVxuXG4vKipcbiAqIEluamVjdCBmaWxlcyBpbiBhIHNvcnRlZCBzZXF1ZW5jZSBhdCBhIHNwZWNpZmllZCBpbmplY3QgbGFiZWxcbiAqIEBwYXJhbSAgIHtBcnJheX0gc3JjICAgZ2xvYiBwYXR0ZXJuIGZvciBzb3VyY2UgZmlsZXNcbiAqIEBwYXJhbSAgIHtTdHJpbmd9IGxhYmVsICAgVGhlIGxhYmVsIG5hbWVcbiAqIEBwYXJhbSAgIHtBcnJheX0gb3JkZXIgICBnbG9iIHBhdHRlcm4gZm9yIHNvcnQgb3JkZXIgb2YgdGhlIGZpbGVzXG4gKiBAcmV0dXJucyB7U3RyZWFtfSAgIFRoZSBzdHJlYW1cbiAqL1xuZnVuY3Rpb24gaW5qZWN0KHNyYywgbGFiZWwsIG9yZGVyKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7cmVhZDogZmFsc2V9O1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgICBvcHRpb25zLm5hbWUgPSAnaW5qZWN0OicgKyBsYWJlbDtcbiAgICB9XG5cbiAgICByZXR1cm4gJC5pbmplY3Qob3JkZXJTcmMoc3JjLCBvcmRlciksIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIE9yZGVyIGEgc3RyZWFtXG4gKiBAcGFyYW0gICB7U3RyZWFtfSBzcmMgICBUaGUgZ3VscC5zcmMgc3RyZWFtXG4gKiBAcGFyYW0gICB7QXJyYXl9IG9yZGVyIEdsb2IgYXJyYXkgcGF0dGVyblxuICogQHJldHVybnMge1N0cmVhbX0gVGhlIG9yZGVyZWQgc3RyZWFtXG4gKi9cbmZ1bmN0aW9uIG9yZGVyU3JjIChzcmMsIG9yZGVyKSB7XG4gICAgLy9vcmRlciA9IG9yZGVyIHx8IFsnKiovKiddO1xuICAgIHJldHVybiBndWxwXG4gICAgICAgIC5zcmMoc3JjKVxuICAgICAgICAucGlwZSgkLmlmKG9yZGVyLCAkLm9yZGVyKG9yZGVyKSkpO1xufVxuXG4vKipcbiAqIHNlcnZlIHRoZSBjb2RlXG4gKiAtLWRlYnVnLWJyayBvciAtLWRlYnVnXG4gKiAtLW5vc3luY1xuICogQHBhcmFtICB7Qm9vbGVhbn0gaXNEZXYgLSBkZXYgb3IgYnVpbGQgbW9kZVxuICogQHBhcmFtICB7Qm9vbGVhbn0gc3BlY1J1bm5lciAtIHNlcnZlciBzcGVjIHJ1bm5lciBodG1sXG4gKi9cbmZ1bmN0aW9uIHNlcnZlKGlzRGV2LCBzcGVjUnVubmVyKSB7XG4gICAgdmFyIGRlYnVnTW9kZSA9ICctLWRlYnVnJztcbiAgICB2YXIgbm9kZU9wdGlvbnMgPSBnZXROb2RlT3B0aW9ucyhpc0Rldik7XG5cbiAgICBub2RlT3B0aW9ucy5ub2RlQXJncyA9IFtkZWJ1Z01vZGUgKyAnPTU4NTgnXTtcblxuICAgIGlmIChhcmdzLnZlcmJvc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cobm9kZU9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiAkLm5vZGVtb24obm9kZU9wdGlvbnMpXG4gICAgICAgIC5vbigncmVzdGFydCcsIFsndmV0J10sIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBsb2coJyoqKiBub2RlbW9uIHJlc3RhcnRlZCcpO1xuICAgICAgICAgICAgbG9nKCdmaWxlcyBjaGFuZ2VkOlxcbicgKyBldik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGJyb3dzZXJTeW5jLm5vdGlmeSgncmVsb2FkaW5nIG5vdyAuLi4nKTtcbiAgICAgICAgICAgICAgICBicm93c2VyU3luYy5yZWxvYWQoe3N0cmVhbTogZmFsc2V9KTtcbiAgICAgICAgICAgIH0sIGNvbmZpZy5icm93c2VyUmVsb2FkRGVsYXkpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ3N0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9nKCcqKiogbm9kZW1vbiBzdGFydGVkJyk7XG4gICAgICAgICAgICBzdGFydEJyb3dzZXJTeW5jKGlzRGV2LCBzcGVjUnVubmVyKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjcmFzaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvZygnKioqIG5vZGVtb24gY3Jhc2hlZDogc2NyaXB0IGNyYXNoZWQgZm9yIHNvbWUgcmVhc29uJyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZXhpdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvZygnKioqIG5vZGVtb24gZXhpdGVkIGNsZWFubHknKTtcbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE5vZGVPcHRpb25zKGlzRGV2KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2NyaXB0OiBjb25maWcubm9kZVNlcnZlcixcbiAgICAgICAgZGVsYXlUaW1lOiAxLFxuICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgICdQT1JUJzogcG9ydCxcbiAgICAgICAgICAgICdOT0RFX0VOVic6IGlzRGV2ID8gJ2RldicgOiAnYnVpbGQnXG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiBbY29uZmlnLnNlcnZlcl1cbiAgICB9O1xufVxuXG4vL2Z1bmN0aW9uIHJ1bk5vZGVJbnNwZWN0b3IoKSB7XG4vLyAgICBsb2coJ1J1bm5pbmcgbm9kZS1pbnNwZWN0b3IuJyk7XG4vLyAgICBsb2coJ0Jyb3dzZSB0byBodHRwOi8vbG9jYWxob3N0OjgwODAvZGVidWc/cG9ydD01ODU4Jyk7XG4vLyAgICB2YXIgZXhlYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuLy8gICAgZXhlYygnbm9kZS1pbnNwZWN0b3InKTtcbi8vfVxuXG4vKipcbiAqIFN0YXJ0IEJyb3dzZXJTeW5jXG4gKiAtLW5vc3luYyB3aWxsIGF2b2lkIGJyb3dzZXJTeW5jXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0QnJvd3NlclN5bmMoaXNEZXYsIHNwZWNSdW5uZXIpIHtcbiAgICBpZiAoYXJncy5ub3N5bmMgfHwgYnJvd3NlclN5bmMuYWN0aXZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2coJ1N0YXJ0aW5nIEJyb3dzZXJTeW5jIG9uIHBvcnQgJyArIHBvcnQpO1xuXG4gICAgLy8gSWYgYnVpbGQ6IHdhdGNoZXMgdGhlIGZpbGVzLCBidWlsZHMsIGFuZCByZXN0YXJ0cyBicm93c2VyLXN5bmMuXG4gICAgLy8gSWYgZGV2OiB3YXRjaGVzIGxlc3MsIGNvbXBpbGVzIGl0IHRvIGNzcywgYnJvd3Nlci1zeW5jIGhhbmRsZXMgcmVsb2FkXG4gICAgaWYgKGlzRGV2KSB7XG4gICAgICAgIGd1bHAud2F0Y2goW2NvbmZpZy5sZXNzXSwgWydzdHlsZXMnXSlcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywgY2hhbmdlRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGd1bHAud2F0Y2goW2NvbmZpZy5sZXNzLCBjb25maWcuanMsIGNvbmZpZy5odG1sXSwgWydicm93c2VyU3luY1JlbG9hZCddKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBjaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHByb3h5OiAnbG9jYWxob3N0OicgKyBwb3J0LFxuICAgICAgICBwb3J0OiAzMDAwLFxuICAgICAgICBmaWxlczogaXNEZXYgPyBbXG4gICAgICAgICAgICBjb25maWcuY2xpZW50ICsgJyoqLyouKicsXG4gICAgICAgICAgICAnIScgKyBjb25maWcubGVzcyxcbiAgICAgICAgICAgIGNvbmZpZy50ZW1wICsgJyoqLyouY3NzJ1xuICAgICAgICBdIDogW10sXG4gICAgICAgIGdob3N0TW9kZTogeyAvLyB0aGVzZSBhcmUgdGhlIGRlZmF1bHRzIHQsZix0LHRcbiAgICAgICAgICAgIGNsaWNrczogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGZvcm1zOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGluamVjdENoYW5nZXM6IHRydWUsXG4gICAgICAgIGxvZ0ZpbGVDaGFuZ2VzOiB0cnVlLFxuICAgICAgICBsb2dMZXZlbDogJ2luZm8nLFxuICAgICAgICBsb2dQcmVmaXg6ICdob3R0b3dlbCcsXG4gICAgICAgIG5vdGlmeTogdHJ1ZSxcbiAgICAgICAgcmVsb2FkRGVsYXk6IDAgLy8xMDAwXG4gICAgfSA7XG4gICAgaWYgKHNwZWNSdW5uZXIpIHtcbiAgICAgICAgb3B0aW9ucy5zdGFydFBhdGggPSBjb25maWcuc3BlY1J1bm5lckZpbGU7XG4gICAgfVxuXG4gICAgYnJvd3NlclN5bmMob3B0aW9ucyk7XG59XG5cbi8qKlxuICogU3RhcnQgUGxhdG8gaW5zcGVjdG9yIGFuZCB2aXN1YWxpemVyXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0UGxhdG9WaXN1YWxpemVyKGRvbmUpIHtcbiAgICBsb2coJ1J1bm5pbmcgUGxhdG8nKTtcblxuICAgIHZhciBmaWxlcyA9IGdsb2Iuc3luYyhjb25maWcucGxhdG8uanMpO1xuICAgIHZhciBleGNsdWRlRmlsZXMgPSAvLipcXC5zcGVjXFwuanMvO1xuICAgIHZhciBwbGF0byA9IHJlcXVpcmUoJ3BsYXRvJyk7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgdGl0bGU6ICdQbGF0byBJbnNwZWN0aW9ucyBSZXBvcnQnLFxuICAgICAgICBleGNsdWRlOiBleGNsdWRlRmlsZXNcbiAgICB9O1xuICAgIHZhciBvdXRwdXREaXIgPSBjb25maWcucmVwb3J0ICsgJy9wbGF0byc7XG5cbiAgICBwbGF0by5pbnNwZWN0KGZpbGVzLCBvdXRwdXREaXIsIG9wdGlvbnMsIHBsYXRvQ29tcGxldGVkKTtcblxuICAgIGZ1bmN0aW9uIHBsYXRvQ29tcGxldGVkKHJlcG9ydCkge1xuICAgICAgICB2YXIgb3ZlcnZpZXcgPSBwbGF0by5nZXRPdmVydmlld1JlcG9ydChyZXBvcnQpO1xuICAgICAgICBpZiAoYXJncy52ZXJib3NlKSB7XG4gICAgICAgICAgICBsb2cob3ZlcnZpZXcuc3VtbWFyeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvbmUpIHsgZG9uZSgpOyB9XG4gICAgfVxufVxuXG4vKipcbiAqIFN0YXJ0IHRoZSB0ZXN0cyB1c2luZyBrYXJtYS5cbiAqIEBwYXJhbSAge2Jvb2xlYW59IHNpbmdsZVJ1biAtIFRydWUgbWVhbnMgcnVuIG9uY2UgYW5kIGVuZCAoQ0kpLCBvciBrZWVwIHJ1bm5pbmcgKGRldilcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkb25lIC0gQ2FsbGJhY2sgdG8gZmlyZSB3aGVuIGthcm1hIGlzIGRvbmVcbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gc3RhcnRUZXN0cyhzaW5nbGVSdW4sIGRvbmUpIHtcbiAgICB2YXIgY2hpbGQ7XG4gICAgdmFyIGV4Y2x1ZGVGaWxlcyA9IFtdO1xuICAgIHZhciBmb3JrID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmZvcms7XG4gICAgdmFyIGthcm1hID0gcmVxdWlyZSgna2FybWEnKS5zZXJ2ZXI7XG4gICAgdmFyIHNlcnZlclNwZWNzID0gY29uZmlnLnNlcnZlckludGVncmF0aW9uU3BlY3M7XG5cbiAgICBpZiAoYXJncy5zdGFydFNlcnZlcnMpIHtcbiAgICAgICAgbG9nKCdTdGFydGluZyBzZXJ2ZXJzJyk7XG4gICAgICAgIHZhciBzYXZlZEVudiA9IHByb2Nlc3MuZW52O1xuICAgICAgICBzYXZlZEVudi5OT0RFX0VOViA9ICdkZXYnO1xuICAgICAgICBzYXZlZEVudi5QT1JUID0gODg4ODtcbiAgICAgICAgY2hpbGQgPSBmb3JrKGNvbmZpZy5ub2RlU2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc2VydmVyU3BlY3MgJiYgc2VydmVyU3BlY3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBleGNsdWRlRmlsZXMgPSBzZXJ2ZXJTcGVjcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGthcm1hLnN0YXJ0KHtcbiAgICAgICAgY29uZmlnRmlsZTogX19kaXJuYW1lICsgJy9rYXJtYS5jb25mLmpzJyxcbiAgICAgICAgZXhjbHVkZTogZXhjbHVkZUZpbGVzLFxuICAgICAgICBzaW5nbGVSdW46ICEhc2luZ2xlUnVuXG4gICAgfSwga2FybWFDb21wbGV0ZWQpO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZnVuY3Rpb24ga2FybWFDb21wbGV0ZWQoa2FybWFSZXN1bHQpIHtcbiAgICAgICAgbG9nKCdLYXJtYSBjb21wbGV0ZWQnKTtcbiAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICBsb2coJ3NodXR0aW5nIGRvd24gdGhlIGNoaWxkIHByb2Nlc3MnKTtcbiAgICAgICAgICAgIGNoaWxkLmtpbGwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2FybWFSZXN1bHQgPT09IDEpIHtcbiAgICAgICAgICAgIGRvbmUoJ2thcm1hOiB0ZXN0cyBmYWlsZWQgd2l0aCBjb2RlICcgKyBrYXJtYVJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRm9ybWF0dGVyIGZvciBieXRlZGlmZiB0byBkaXNwbGF5IHRoZSBzaXplIGNoYW5nZXMgYWZ0ZXIgcHJvY2Vzc2luZ1xuICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIC0gYnl0ZSBkYXRhXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgRGlmZmVyZW5jZSBpbiBieXRlcywgZm9ybWF0dGVkXG4gKi9cbmZ1bmN0aW9uIGJ5dGVkaWZmRm9ybWF0dGVyKGRhdGEpIHtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IChkYXRhLnNhdmluZ3MgPiAwKSA/ICcgc21hbGxlci4nIDogJyBsYXJnZXIuJztcbiAgICByZXR1cm4gZGF0YS5maWxlTmFtZSArICcgd2VudCBmcm9tICcgK1xuICAgICAgICAoZGF0YS5zdGFydFNpemUgLyAxMDAwKS50b0ZpeGVkKDIpICsgJyBrQiB0byAnICtcbiAgICAgICAgKGRhdGEuZW5kU2l6ZSAvIDEwMDApLnRvRml4ZWQoMikgKyAnIGtCIGFuZCBpcyAnICtcbiAgICAgICAgZm9ybWF0UGVyY2VudCgxIC0gZGF0YS5wZXJjZW50LCAyKSArICclJyArIGRpZmZlcmVuY2U7XG59XG5cbi8qKlxuICogTG9nIGFuIGVycm9yIG1lc3NhZ2UgYW5kIGVtaXQgdGhlIGVuZCBvZiBhIHRhc2tcbiAqL1xuLy9mdW5jdGlvbiBlcnJvckxvZ2dlcihlcnJvcikge1xuLy8gICAgbG9nKCcqKiogU3RhcnQgb2YgRXJyb3IgKioqJyk7XG4vLyAgICBsb2coZXJyb3IpO1xuLy8gICAgbG9nKCcqKiogRW5kIG9mIEVycm9yICoqKicpO1xuLy8gICAgdGhpcy5lbWl0KCdlbmQnKTtcbi8vfVxuXG4vKipcbiAqIEZvcm1hdCBhIG51bWJlciBhcyBhIHBlcmNlbnRhZ2VcbiAqIEBwYXJhbSAge051bWJlcn0gbnVtICAgICAgIE51bWJlciB0byBmb3JtYXQgYXMgYSBwZXJjZW50XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHByZWNpc2lvbiBQcmVjaXNpb24gb2YgdGhlIGRlY2ltYWxcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIEZvcm1hdHRlZCBwZXJlbnRhZ2VcbiAqL1xuZnVuY3Rpb24gZm9ybWF0UGVyY2VudChudW0sIHByZWNpc2lvbikge1xuICAgIHJldHVybiAobnVtICogMTAwKS50b0ZpeGVkKHByZWNpc2lvbik7XG59XG5cbi8qKlxuICogRm9ybWF0IGFuZCByZXR1cm4gdGhlIGhlYWRlciBmb3IgZmlsZXNcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIEZvcm1hdHRlZCBmaWxlIGhlYWRlclxuICovXG5mdW5jdGlvbiBnZXRIZWFkZXIoKSB7XG4gICAgdmFyIHBrZyA9IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJyk7XG4gICAgdmFyIHRlbXBsYXRlID0gWycvKionLFxuICAgICAgICAnICogPCU9IHBrZy5uYW1lICU+IC0gPCU9IHBrZy5kZXNjcmlwdGlvbiAlPicsXG4gICAgICAgICcgKiBAYXV0aG9ycyA8JT0gcGtnLmF1dGhvcnMgJT4nLFxuICAgICAgICAnICogQHZlcnNpb24gdjwlPSBwa2cudmVyc2lvbiAlPicsXG4gICAgICAgICcgKiBAbGluayA8JT0gcGtnLmhvbWVwYWdlICU+JyxcbiAgICAgICAgJyAqIEBsaWNlbnNlIDwlPSBwa2cubGljZW5zZSAlPicsXG4gICAgICAgICcgKi8nLFxuICAgICAgICAnJ1xuICAgIF0uam9pbignXFxuJyk7XG4gICAgcmV0dXJuICQuaGVhZGVyKHRlbXBsYXRlLCB7XG4gICAgICAgIHBrZzogcGtnXG4gICAgfSk7XG59XG5cbi8qKlxuICogTG9nIGEgbWVzc2FnZSBvciBzZXJpZXMgb2YgbWVzc2FnZXMgdXNpbmcgY2hhbGsncyBibHVlIGNvbG9yLlxuICogQ2FuIHBhc3MgaW4gYSBzdHJpbmcsIG9iamVjdCBvciBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbG9nKG1zZykge1xuICAgIGlmICh0eXBlb2YobXNnKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBtc2cpIHtcbiAgICAgICAgICAgIGlmIChtc2cuaGFzT3duUHJvcGVydHkoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAkLnV0aWwubG9nKCQudXRpbC5jb2xvcnMuYmx1ZShtc2dbaXRlbV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgICQudXRpbC5sb2coJC51dGlsLmNvbG9ycy5ibHVlKG1zZykpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTaG93IE9TIGxldmVsIG5vdGlmaWNhdGlvbiB1c2luZyBub2RlLW5vdGlmaWVyXG4gKi9cbmZ1bmN0aW9uIG5vdGlmeShvcHRpb25zKSB7XG4gICAgdmFyIG5vdGlmaWVyID0gcmVxdWlyZSgnbm9kZS1ub3RpZmllcicpO1xuICAgIHZhciBub3RpZnlPcHRpb25zID0ge1xuICAgICAgICBzb3VuZDogJ0JvdHRsZScsXG4gICAgICAgIGNvbnRlbnRJbWFnZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2d1bHAucG5nJyksXG4gICAgICAgIGljb246IHBhdGguam9pbihfX2Rpcm5hbWUsICdndWxwLnBuZycpXG4gICAgfTtcbiAgICBfLmFzc2lnbihub3RpZnlPcHRpb25zLCBvcHRpb25zKTtcbiAgICBub3RpZmllci5ub3RpZnkobm90aWZ5T3B0aW9ucyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ3VscDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgdmFyIGd1bHBDb25maWcgPSByZXF1aXJlKCcuL2d1bHAuY29uZmlnJykoKTtcblxuICAgIGNvbmZpZy5zZXQoe1xuICAgICAgICAvLyBiYXNlIHBhdGggdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVzb2x2ZSBhbGwgcGF0dGVybnMgKGVnLiBmaWxlcywgZXhjbHVkZSlcbiAgICAgICAgYmFzZVBhdGg6ICcuLycsXG5cbiAgICAgICAgLy8gZnJhbWV3b3JrcyB0byB1c2VcbiAgICAgICAgLy8gc29tZSBhdmFpbGFibGUgZnJhbWV3b3JrczogaHR0cHM6Ly9ucG1qcy5vcmcvYnJvd3NlL2tleXdvcmQva2FybWEtYWRhcHRlclxuICAgICAgICBmcmFtZXdvcmtzOiBbJ21vY2hhJywgJ2NoYWknLCAnc2lub24nLCAnY2hhaS1zaW5vbiddLFxuXG4gICAgICAgIC8vIGxpc3Qgb2YgZmlsZXMgLyBwYXR0ZXJucyB0byBsb2FkIGluIHRoZSBicm93c2VyXG4gICAgICAgIGZpbGVzOiBndWxwQ29uZmlnLmthcm1hLmZpbGVzLFxuXG4gICAgICAgIC8vIGxpc3Qgb2YgZmlsZXMgdG8gZXhjbHVkZVxuICAgICAgICBleGNsdWRlOiBndWxwQ29uZmlnLmthcm1hLmV4Y2x1ZGUsXG5cbiAgICAgICAgcHJveGllczoge1xuICAgICAgICAgICAgJy8nOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4LydcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBwcmVwcm9jZXNzIG1hdGNoaW5nIGZpbGVzIGJlZm9yZSBzZXJ2aW5nIHRoZW0gdG8gdGhlIGJyb3dzZXJcbiAgICAgICAgLy8gYXZhaWxhYmxlIHByZXByb2Nlc3NvcnM6IGh0dHBzOi8vbnBtanMub3JnL2Jyb3dzZS9rZXl3b3JkL2thcm1hLXByZXByb2Nlc3NvclxuICAgICAgICBwcmVwcm9jZXNzb3JzOiBndWxwQ29uZmlnLmthcm1hLnByZXByb2Nlc3NvcnMsXG5cbiAgICAgICAgLy8gdGVzdCByZXN1bHRzIHJlcG9ydGVyIHRvIHVzZVxuICAgICAgICAvLyBwb3NzaWJsZSB2YWx1ZXM6ICdkb3RzJywgJ3Byb2dyZXNzJywgJ2NvdmVyYWdlJ1xuICAgICAgICAvLyBhdmFpbGFibGUgcmVwb3J0ZXJzOiBodHRwczovL25wbWpzLm9yZy9icm93c2Uva2V5d29yZC9rYXJtYS1yZXBvcnRlclxuICAgICAgICByZXBvcnRlcnM6IFsncHJvZ3Jlc3MnLCAnY292ZXJhZ2UnXSxcblxuICAgICAgICBjb3ZlcmFnZVJlcG9ydGVyOiB7XG4gICAgICAgICAgICBkaXI6IGd1bHBDb25maWcua2FybWEuY292ZXJhZ2UuZGlyLFxuICAgICAgICAgICAgcmVwb3J0ZXJzOiBndWxwQ29uZmlnLmthcm1hLmNvdmVyYWdlLnJlcG9ydGVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdlYiBzZXJ2ZXIgcG9ydFxuICAgICAgICBwb3J0OiA5ODc2LFxuXG4gICAgICAgIC8vIGVuYWJsZSAvIGRpc2FibGUgY29sb3JzIGluIHRoZSBvdXRwdXQgKHJlcG9ydGVycyBhbmQgbG9ncylcbiAgICAgICAgY29sb3JzOiB0cnVlLFxuXG4gICAgICAgIC8vIGxldmVsIG9mIGxvZ2dpbmdcbiAgICAgICAgLy8gcG9zc2libGUgdmFsdWVzOiBjb25maWcuTE9HX0RJU0FCTEUgfHwgY29uZmlnLkxPR19FUlJPUiB8fFxuICAgICAgICAvLyBjb25maWcuTE9HX1dBUk4gfHwgY29uZmlnLkxPR19JTkZPIHx8IGNvbmZpZy5MT0dfREVCVUdcbiAgICAgICAgbG9nTGV2ZWw6IGNvbmZpZy5MT0dfSU5GTyxcblxuICAgICAgICAvLyBlbmFibGUgLyBkaXNhYmxlIHdhdGNoaW5nIGZpbGUgYW5kIGV4ZWN1dGluZyB0ZXN0cyB3aGVuZXZlciBhbnkgZmlsZSBjaGFuZ2VzXG4gICAgICAgIGF1dG9XYXRjaDogdHJ1ZSxcblxuICAgICAgICAvLyBzdGFydCB0aGVzZSBicm93c2Vyc1xuICAgICAgICAvLyBhdmFpbGFibGUgYnJvd3NlciBsYXVuY2hlcnM6IGh0dHBzOi8vbnBtanMub3JnL2Jyb3dzZS9rZXl3b3JkL2thcm1hLWxhdW5jaGVyXG4gICAgICAgIC8vICAgICAgICBicm93c2VyczogWydDaHJvbWUnLCAnQ2hyb21lQ2FuYXJ5JywgJ0ZpcmVmb3hBdXJvcmEnLCAnU2FmYXJpJywgJ1BoYW50b21KUyddLFxuICAgICAgICBicm93c2VyczogWydQaGFudG9tSlMnXSxcblxuICAgICAgICAvLyBDb250aW51b3VzIEludGVncmF0aW9uIG1vZGVcbiAgICAgICAgLy8gaWYgdHJ1ZSwgS2FybWEgY2FwdHVyZXMgYnJvd3NlcnMsIHJ1bnMgdGhlIHRlc3RzIGFuZCBleGl0c1xuICAgICAgICBzaW5nbGVSdW46IGZhbHNlXG4gICAgfSk7XG59O1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xuXG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbih2aWV3TmFtZSl7XG5cdFx0XHRyZXR1cm4gJy4vdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCcvaGVhZGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNpZGViYXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCcvc2lkZWJhcicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb290ZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCcvZm9vdGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnT3ZlcnZpZXcnfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdFxuICAgICAgICB9KS5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBtYWluOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmb290ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXHRcdFxuXHRcdFx0LnN0YXRlKCdhcHAuaW5zdGFsbCcsIHtcblx0XHRcdFx0dXJsOiAnL2luc3RhbGwnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdJbnN0YWxsJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2luc3RhbGwnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnRhYnMnLCB7XG5cdFx0XHRcdHVybDogJy9mZWF0dXJlcycsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0ZlYXR1cmVzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3RhYnMnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmRlcGxveScsIHtcblx0XHRcdFx0dXJsOiAnL2RlcGxveScsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ0RlcGxveSd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdkZXBsb3knKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLnRoZW1lJywge1xuXHRcdFx0XHR1cmw6ICcvdGhlbWUnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdUaGVtZSd9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd0aGVtZScpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAudG9hc3RzJywge1xuXHRcdFx0XHR1cmw6ICcvdG9hc3RzJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnVG9hc3RzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3RvYXN0cycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZGlhbG9ncycsIHtcblx0XHRcdFx0dXJsOiAnL2RpYWxvZ3MnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdEaWFsb2dzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2RpYWxvZ3MnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmdlbmVyYXRvcnMnLCB7XG5cdFx0XHRcdHVybDogJy9nZW5lcmF0b3JzJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnQXJ0aXNhbiBnZW5lcmF0b3JzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2dlbmVyYXRvcnMnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5zdGF0ZSgnYXBwLmp3dF9hdXRoJywge1xuXHRcdFx0XHR1cmw6ICcvand0X2F1dGgnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdKU09OIFdlYiBUb2tlbiBBdXRoZW50aWNhdGlvbid9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdqd3RfYXV0aCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAuZWxpeGlyJywge1xuXHRcdFx0XHR1cmw6ICcvZWxpeGlyJyxcblx0XHRcdFx0ZGF0YToge3BhZ2VOYW1lOiAnRWxpeGlyJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2VsaXhpcicpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCdhcHAucmVzdF9hcGknLCB7XG5cdFx0XHRcdHVybDogJy9yZXN0X2FwaScsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ1JFU1QgQVBJJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Jlc3RfYXBpJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC51bnN1cHBvcnRlZF9icm93c2VyJywge1xuXHRcdFx0XHR1cmw6ICcvdW5zdXBwb3J0ZWRfYnJvd3NlcicsXG5cdFx0XHRcdGRhdGE6IHtwYWdlTmFtZTogJ1Vuc3VwcG9ydGVkIEJyb3dzZXInfSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5zdXBwb3J0ZWRfYnJvd3NlcicpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0XG5cdFx0XHQuc3RhdGUoJ2FwcC5jcmVhdGVfcG9zdCcsIHtcblx0XHQgICAgICAgIHVybDogJy9jcmVhdGUtcG9zdCcsXG5cdFx0ICAgICAgICB2aWV3czoge1xuXHRcdCAgICAgICAgICAnbWFpbkAnOiB7XG5cdFx0ICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2NyZWF0ZV9wb3N0Jylcblx0XHQgICAgICAgICAgfVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICAgIH0pXG5cdCAgICAgIFxuXHRcdFx0LnN0YXRlKCdhcHAubWlzYycsIHtcblx0XHRcdFx0dXJsOiAnL21pc2MnLFxuXHRcdFx0XHRkYXRhOiB7cGFnZU5hbWU6ICdNaXNjZWxsYW5lb3VzIGZlYXR1cmVzJ30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ21pc2MnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyICkge1xuXG4gICAgICAgIHZhciBnZXRWaWV3ID0gZnVuY3Rpb24oIHZpZXdOYW1lICl7XG4gICAgICAgICAgICByZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuICAgICAgICB9O1xuXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2xhbmRpbmcnLCB7XG4gICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgbWFpbjoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBtYWluOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmb290ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0gKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gIC8vIEV4dGVuZCB0aGUgcmVkIHRoZW1lIHdpdGggYSBmZXcgZGlmZmVyZW50IGNvbG9yc1xuICB2YXIgbmVvblJlZE1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdyZWQnLCB7XG4gICAgJzUwMCc6ICdmZjAwMDAnXG4gIH0pO1xuICAvLyBSZWdpc3RlciB0aGUgbmV3IGNvbG9yIHBhbGV0dGUgbWFwIHdpdGggdGhlIG5hbWUgPGNvZGU+bmVvblJlZDwvY29kZT5cbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ25lb25SZWQnLCBuZW9uUmVkTWFwKTtcbiAgLy8gVXNlIHRoYXQgdGhlbWUgZm9yIHRoZSBwcmltYXJ5IGludGVudGlvbnNcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgLnByaW1hcnlQYWxldHRlKCduZW9uUmVkJylcbiAgLmFjY2VudFBhbGV0dGUoJ2dyZXknKVxuICAud2FyblBhbGV0dGUoJ3JlZCcpO1xufSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdFx0cmV0dXJuIChpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQVBJJywgZnVuY3Rpb24oUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgJGxvY2FsU3RvcmFnZSkge1xuXG5cdFx0Ly9jb250ZW50IG5lZ290aWF0aW9uXG5cdFx0dmFyIGhlYWRlcnMgPSB7XG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0J0FjY2VwdCc6ICdhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvbidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLndpdGhDb25maWcoZnVuY3Rpb24oUmVzdGFuZ3VsYXJDb25maWd1cmVyKSB7XG5cdFx0XHRSZXN0YW5ndWxhckNvbmZpZ3VyZXJcblx0XHRcdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHRcdFx0LnNldERlZmF1bHRIZWFkZXJzKGhlYWRlcnMpXG5cdFx0XHRcdC5zZXRFcnJvckludGVyY2VwdG9yKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDIyKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBlcnJvciBpbiByZXNwb25zZS5kYXRhLmVycm9ycykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gVG9hc3RTZXJ2aWNlLmVycm9yKHJlc3BvbnNlLmRhdGEuZXJyb3JzW2Vycm9yXVswXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuYWRkRnVsbFJlcXVlc3RJbnRlcmNlcHRvcihmdW5jdGlvbihlbGVtZW50LCBvcGVyYXRpb24sIHdoYXQsIHVybCwgaGVhZGVycykge1xuXHRcdFx0XHRcdGlmICgkbG9jYWxTdG9yYWdlLmp3dCkge1xuXHRcdFx0XHRcdFx0aGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgJGxvY2FsU3RvcmFnZS5qd3Q7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdGNvbmZpcm06IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdFx0XHQuY2FuY2VsKCdDYW5jZWwnKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3JlYXRlUG9zdENvbnRyb2xsZXInLCBDcmVhdGVQb3N0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBDcmVhdGVQb3N0Q29udHJvbGxlcigpe1xuICAgICAgICAvL1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Zvb3RlckNvbnRyb2xsZXInLCBGb290ZXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoKXtcbiAgICAgICAgLy9cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRtZFNpZGVuYXYsICRsb2cpe1xuXG5cdFx0JHNjb3BlLiR3YXRjaChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRyb290U2NvcGUuY3VycmVudF9wYWdlO1xuXHRcdH0sIGZ1bmN0aW9uKG5ld1BhZ2Upe1xuXHRcdFx0JHNjb3BlLmN1cnJlbnRfcGFnZSA9IG5ld1BhZ2UgfHwgJ1BhZ2UgTmFtZSc7XG5cdFx0fSk7XG5cblx0XHQkc2NvcGUub3BlblNpZGVOYXYgPSBmdW5jdGlvbigpIHtcblx0XHRcdCRtZFNpZGVuYXYoJ2xlZnQnKS5vcGVuKCk7XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDb250cm9sbGVyJywgTGFuZGluZ0NvbnRyb2xsZXIpO1xuXG5cdGZ1bmN0aW9uIExhbmRpbmdDb250cm9sbGVyKCkge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5sYXJhdmVsX2Rlc2NyaXB0aW9uID0gJ1Jlc3BvbnNlIG1hY3JvcyBpbnRlZ3JhdGVkIHdpdGggeW91ciBBbmd1bGFyIGFwcCc7XG5cdFx0dm0uYW5ndWxhcl9kZXNjcmlwdGlvbiA9ICdRdWVyeSB5b3VyIEFQSSB3aXRob3V0IHdvcnJ5aW5nIGFib3V0IHZhbGlkYXRpb25zJztcblx0fVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJylcblx0ICAgIC5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkbWRTaWRlbmF2LCAkbG9nKSB7XG5cdCAgICAgICRzY29wZS50b2dnbGVMZWZ0ID0gYnVpbGREZWxheWVkVG9nZ2xlcignbGVmdCcpO1xuXHQgICAgICAkc2NvcGUudG9nZ2xlUmlnaHQgPSBidWlsZFRvZ2dsZXIoJ3JpZ2h0Jyk7XG5cdCAgICAgICRzY29wZS5pc09wZW5SaWdodCA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgcmV0dXJuICRtZFNpZGVuYXYoJ3JpZ2h0JykuaXNPcGVuKCk7XG5cdCAgICAgIH07XG5cdCAgICAgIC8qKlxuXHQgICAgICAgKiBTdXBwbGllcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjb250aW51ZSB0byBvcGVyYXRlIHVudGlsIHRoZVxuXHQgICAgICAgKiB0aW1lIGlzIHVwLlxuXHQgICAgICAgKi9cblx0ICAgICAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgY29udGV4dCkge1xuXHQgICAgICAgIHZhciB0aW1lcjtcblx0ICAgICAgICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuXHQgICAgICAgICAgdmFyIGNvbnRleHQgPSAkc2NvcGUsXG5cdCAgICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cdCAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuXHQgICAgICAgICAgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgdGltZXIgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdCAgICAgICAgICB9LCB3YWl0IHx8IDEwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cdCAgICAgIC8qKlxuXHQgICAgICAgKiBCdWlsZCBoYW5kbGVyIHRvIG9wZW4vY2xvc2UgYSBTaWRlTmF2OyB3aGVuIGFuaW1hdGlvbiBmaW5pc2hlc1xuXHQgICAgICAgKiByZXBvcnQgY29tcGxldGlvbiBpbiBjb25zb2xlXG5cdCAgICAgICAqL1xuXHQgICAgICBmdW5jdGlvbiBidWlsZERlbGF5ZWRUb2dnbGVyKG5hdklEKSB7XG5cdCAgICAgICAgcmV0dXJuIGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgJG1kU2lkZW5hdihuYXZJRClcblx0ICAgICAgICAgICAgLnRvZ2dsZSgpXG5cdCAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAkbG9nLmRlYnVnKFwidG9nZ2xlIFwiICsgbmF2SUQgKyBcIiBpcyBkb25lXCIpO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9LCAyMDApO1xuXHQgICAgICB9XG5cdCAgICAgIGZ1bmN0aW9uIGJ1aWxkVG9nZ2xlcihuYXZJRCkge1xuXHQgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICRtZFNpZGVuYXYobmF2SUQpXG5cdCAgICAgICAgICAgIC50b2dnbGUoKVxuXHQgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgJGxvZy5kZWJ1ZyhcInRvZ2dsZSBcIiArIG5hdklEICsgXCIgaXMgZG9uZVwiKTtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXHQgICAgfSlcblx0ICAgIC5jb250cm9sbGVyKCdMZWZ0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkbWRTaWRlbmF2LCAkbG9nKSB7XG5cdCAgICAgICRzY29wZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKVxuXHQgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAkbG9nLmRlYnVnKFwiY2xvc2UgTEVGVCBpcyBkb25lXCIpO1xuXHQgICAgICAgICAgfSk7XG5cdCAgICAgIH07XG5cdCAgICB9KVxuXHQgICAgLmNvbnRyb2xsZXIoJ1JpZ2h0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkbWRTaWRlbmF2LCAkbG9nKSB7XG5cdCAgICAgICRzY29wZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAkbWRTaWRlbmF2KCdyaWdodCcpLmNsb3NlKClcblx0ICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgJGxvZy5kZWJ1ZyhcImNsb3NlIFJJR0hUIGlzIGRvbmVcIik7XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgfTtcblx0ICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbnN1cHBvcnRlZEJyb3dzZXJDdHJsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NoYW5nZVBhc3N3b3JkQ29udHJvbGxlcicsIENoYW5nZVBhc3N3b3JkQ29udHJvbGxlcik7XG5cblxuICAgIGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkQ29udHJvbGxlcihEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICB0aGlzLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBMb2dpbkNvbnRyb2xsZXIpO1xuXG5cbiAgICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgdGhpcy5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnYWRkVXNlcnMnLCBhZGRVc2Vyc0RlZmluaXRpb24pO1xuXG5cdGZ1bmN0aW9uIGFkZFVzZXJzRGVmaW5pdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvYWRkX3VzZXJzL2FkZF91c2Vycy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdBZGRVc2Vyc0NvbnRyb2xsZXInLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDb250cm9sbGVyJywgQWRkVXNlcnNDb250cm9sbGVyKTtcblxuXHRmdW5jdGlvbiBBZGRVc2Vyc0NvbnRyb2xsZXIoKXtcblx0XHQvL1xuXHR9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjcmVhdGVQb3N0Rm9ybScsIGNyZWF0ZVBvc3RGb3JtRGVmaW5pdGlvbik7XG5cblx0ZnVuY3Rpb24gY3JlYXRlUG9zdEZvcm1EZWZpbml0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9jcmVhdGVfcG9zdF9mb3JtL2NyZWF0ZV9wb3N0X2Zvcm0uaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ3JlYXRlUG9zdEZvcm1Db250cm9sbGVyJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NyZWF0ZVBvc3RDb250cm9sbGVyJywgQ3JlYXRlUG9zdENvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIENyZWF0ZVBvc3RDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCBUb2FzdFNlcnZpY2Upe1xuXG4gICAgdGhpcy5zdWJtaXQgPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgdG9waWM6IHRoaXMudG9waWMsXG4gICAgICB9O1xuICAgICAgXG4gICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwb3N0cycpLnBvc3QoZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdygnUG9zdCBhZGRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICB9KTtcbiAgICB9O1xuICBcbiAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2VtcGxveWVlJywgZW1wbG95ZWVEZWZpbml0aW9uKTtcblxuXHRmdW5jdGlvbiBlbXBsb3llZURlZmluaXRpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2VtcGxveWVlL2VtcGxveWVlLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0VtcGxveWVlQ29udHJvbGxlcicsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFbXBsb3llZUNvbnRyb2xsZXInLCBFbXBsb3llZUNvbnRyb2xsZXIpO1xuXG5cdGZ1bmN0aW9uIEVtcGxveWVlQ29udHJvbGxlcigpe1xuXHRcdC8vXG5cdH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3VzZXJQcm9maWxlJywgdXNlclByb2ZpbGVEZWZpbml0aW9uKTtcblxuXHRmdW5jdGlvbiB1c2VyUHJvZmlsZURlZmluaXRpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3VzZXJfcHJvZmlsZS91c2VyX3Byb2ZpbGUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnVXNlclByb2ZpbGVDb250cm9sbGVyJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VzZXJQcm9maWxlQ29udHJvbGxlcicsIFVzZXJQcm9maWxlQ29udHJvbGxlcik7XG5cblx0ZnVuY3Rpb24gVXNlclByb2ZpbGVDb250cm9sbGVyKCl7XG5cdFx0Ly9cblx0fVxuXG59KSgpO1xuIiwiLypqc2hpbnQgbm9kZTp0cnVlKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG52YXIgYXBwID0gZXhwcmVzcygpO1xudmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpO1xudmFyIGZhdmljb24gPSByZXF1aXJlKCdzZXJ2ZS1mYXZpY29uJyk7XG52YXIgbG9nZ2VyID0gcmVxdWlyZSgnbW9yZ2FuJyk7XG52YXIgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgODAwMTtcbnZhciBmb3VyMGZvdXIgPSByZXF1aXJlKCcuL3V0aWxzLzQwNCcpKCk7XG5cbnZhciBlbnZpcm9ubWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuXG5hcHAudXNlKGZhdmljb24oX19kaXJuYW1lICsgJy9mYXZpY29uLmljbycpKTtcbmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHtleHRlbmRlZDogdHJ1ZX0pKTtcbmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuYXBwLnVzZShsb2dnZXIoJ2RldicpKTtcblxuYXBwLnVzZSgnL2FwaScsIHJlcXVpcmUoJy4vcm91dGVzJykpO1xuXG5jb25zb2xlLmxvZygnQWJvdXQgdG8gY3JhbmsgdXAgbm9kZScpO1xuY29uc29sZS5sb2coJ1BPUlQ9JyArIHBvcnQpO1xuY29uc29sZS5sb2coJ05PREVfRU5WPScgKyBlbnZpcm9ubWVudCk7XG5cbnN3aXRjaCAoZW52aXJvbm1lbnQpe1xuICAgIGNhc2UgJ2J1aWxkJzpcbiAgICAgICAgY29uc29sZS5sb2coJyoqIEJVSUxEICoqJyk7XG4gICAgICAgIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMoJy4vYnVpbGQvJykpO1xuICAgICAgICAvLyBBbnkgaW52YWxpZCBjYWxscyBmb3IgdGVtcGxhdGVVcmxzIGFyZSB1bmRlciBhcHAvKiBhbmQgc2hvdWxkIHJldHVybiA0MDRcbiAgICAgICAgYXBwLnVzZSgnL2FwcC8qJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICAgIGZvdXIwZm91ci5zZW5kNDA0KHJlcSwgcmVzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEFueSBkZWVwIGxpbmsgY2FsbHMgc2hvdWxkIHJldHVybiBpbmRleC5odG1sXG4gICAgICAgIGFwcC51c2UoJy8qJywgZXhwcmVzcy5zdGF0aWMoJy4vYnVpbGQvaW5kZXguaHRtbCcpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJyoqIERFViAqKicpO1xuICAgICAgICBhcHAudXNlKGV4cHJlc3Muc3RhdGljKCcuL3NyYy9jbGllbnQvJykpO1xuICAgICAgICBhcHAudXNlKGV4cHJlc3Muc3RhdGljKCcuLycpKTtcbiAgICAgICAgYXBwLnVzZShleHByZXNzLnN0YXRpYygnLi90bXAnKSk7XG4gICAgICAgIC8vIEFueSBpbnZhbGlkIGNhbGxzIGZvciB0ZW1wbGF0ZVVybHMgYXJlIHVuZGVyIGFwcC8qIGFuZCBzaG91bGQgcmV0dXJuIDQwNFxuICAgICAgICBhcHAudXNlKCcvYXBwLyonLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgZm91cjBmb3VyLnNlbmQ0MDQocmVxLCByZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQW55IGRlZXAgbGluayBjYWxscyBzaG91bGQgcmV0dXJuIGluZGV4Lmh0bWxcbiAgICAgICAgYXBwLnVzZSgnLyonLCBleHByZXNzLnN0YXRpYygnLi9zcmMvY2xpZW50L2luZGV4Lmh0bWwnKSk7XG4gICAgICAgIGJyZWFrO1xufVxuXG5hcHAubGlzdGVuKHBvcnQsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdFeHByZXNzIHNlcnZlciBsaXN0ZW5pbmcgb24gcG9ydCAnICsgcG9ydCk7XG4gICAgY29uc29sZS5sb2coJ2VudiA9ICcgKyBhcHAuZ2V0KCdlbnYnKSArXG4gICAgICAgICdcXG5fX2Rpcm5hbWUgPSAnICsgX19kaXJuYW1lICArXG4gICAgICAgICdcXG5wcm9jZXNzLmN3ZCA9ICcgKyBwcm9jZXNzLmN3ZCgpKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcGVvcGxlOiBnZXRQZW9wbGUoKVxufTtcblxuZnVuY3Rpb24gZ2V0UGVvcGxlKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHtpZDogMSwgZmlyc3ROYW1lOiAnSm9obicsIGxhc3ROYW1lOiAnUGFwYScsIGFnZTogMjUsIGxvY2F0aW9uOiAnRmxvcmlkYSd9LFxuICAgICAgICB7aWQ6IDIsIGZpcnN0TmFtZTogJ1dhcmQnLCBsYXN0TmFtZTogJ0JlbGwnLCBhZ2U6IDMxLCBsb2NhdGlvbjogJ0NhbGlmb3JuaWEnfSxcbiAgICAgICAge2lkOiAzLCBmaXJzdE5hbWU6ICdDb2xsZWVuJywgbGFzdE5hbWU6ICdKb25lcycsIGFnZTogMjEsIGxvY2F0aW9uOiAnTmV3IFlvcmsnfSxcbiAgICAgICAge2lkOiA0LCBmaXJzdE5hbWU6ICdNYWRlbHluJywgbGFzdE5hbWU6ICdHcmVlbicsIGFnZTogMTgsIGxvY2F0aW9uOiAnTm9ydGggRGFrb3RhJ30sXG4gICAgICAgIHtpZDogNSwgZmlyc3ROYW1lOiAnRWxsYScsIGxhc3ROYW1lOiAnSm9icycsIGFnZTogMTgsIGxvY2F0aW9uOiAnU291dGggRGFrb3RhJ30sXG4gICAgICAgIHtpZDogNiwgZmlyc3ROYW1lOiAnTGFuZG9uJywgbGFzdE5hbWU6ICdHYXRlcycsIGFnZTogMTEsIGxvY2F0aW9uOiAnU291dGggQ2Fyb2xpbmEnfSxcbiAgICAgICAge2lkOiA3LCBmaXJzdE5hbWU6ICdIYWxleScsIGxhc3ROYW1lOiAnR3V0aHJpZScsIGFnZTogMzUsIGxvY2F0aW9uOiAnV3lvbWluZyd9LFxuICAgICAgICB7aWQ6IDgsIGZpcnN0TmFtZTogJ0Fhcm9uJywgbGFzdE5hbWU6ICdKaW5nbGVoaWVtZXInLCBhZ2U6IDIyLCBsb2NhdGlvbjogJ1V0YWgnfVxuICAgIF07XG59XG4iLCJ2YXIgcm91dGVyID0gcmVxdWlyZSgnZXhwcmVzcycpLlJvdXRlcigpO1xudmFyIGZvdXIwZm91ciA9IHJlcXVpcmUoJy4vdXRpbHMvNDA0JykoKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG5cbnJvdXRlci5nZXQoJy9wZW9wbGUnLCBnZXRQZW9wbGUpO1xucm91dGVyLmdldCgnL3BlcnNvbi86aWQnLCBnZXRQZXJzb24pO1xucm91dGVyLmdldCgnLyonLCBmb3VyMGZvdXIubm90Rm91bmRNaWRkbGV3YXJlKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG5cbi8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGdldFBlb3BsZShyZXEsIHJlcywgbmV4dCkge1xuICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGRhdGEucGVvcGxlKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGlkID0gK3JlcS5wYXJhbXMuaWQ7XG4gICAgdmFyIHBlcnNvbiA9IGRhdGEucGVvcGxlLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgICAgIHJldHVybiBwLmlkID09PSBpZDtcbiAgICB9KVswXTtcblxuICAgIGlmIChwZXJzb24pIHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocGVyc29uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3VyMGZvdXIuc2VuZDQwNChyZXEsIHJlcywgJ3BlcnNvbiAnICsgaWQgKyAnIG5vdCBmb3VuZCcpO1xuICAgIH1cbn1cbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgJ2FwcC5jb3JlJyxcbiAgICAgICAgJ2FwcC53aWRnZXRzJyxcbiAgICAgICAgJ2FwcC5hZG1pbicsXG4gICAgICAgICdhcHAuZGFzaGJvYXJkJyxcbiAgICAgICAgJ2FwcC5sYXlvdXQnXG4gICAgXSk7XG5cbn0pKCk7XG4iLCIvKlxuICogIFBoYW50b20uanMgZG9lcyBub3Qgc3VwcG9ydCBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAoYXQgbGVhc3Qgbm90IGJlZm9yZSB2LjIuMFxuICogIFRoYXQncyBqdXN0IGNyYXp5LiBFdmVyeWJvZHkgc3VwcG9ydHMgYmluZC5cbiAqICBSZWFkIGFib3V0IGl0IGhlcmU6IGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyFtc2cvcGhhbnRvbWpzL3IwaFBPbW5DVXBjL3V4dXNxc2wyTE5vSlxuICogIFRoaXMgcG9seWZpbGwgaXMgY29waWVkIGRpcmVjdGx5IGZyb20gTUROXG4gKiAgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vYmluZCNDb21wYXRpYmlsaXR5XG4gKi9cbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICAvKmpzaGludCBmcmVlemU6IGZhbHNlICovXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAob1RoaXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBjbG9zZXN0IHRoaW5nIHBvc3NpYmxlIHRvIHRoZSBFQ01BU2NyaXB0IDVcbiAgICAgICAgICAgIC8vIGludGVybmFsIElzQ2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIHZhciBtc2cgPSAnRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgLSB3aGF0IGlzIHRyeWluZyB0byBiZSBib3VuZCBpcyBub3QgY2FsbGFibGUnO1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgICAgIGZUb0JpbmQgPSB0aGlzLFxuICAgICAgICAgICAgRnVuY05vT3AgPSBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgIGZCb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZlRvQmluZC5hcHBseSh0aGlzIGluc3RhbmNlb2YgRnVuY05vT3AgJiYgb1RoaXMgPyB0aGlzIDogb1RoaXMsXG4gICAgICAgICAgICAgICAgICAgIGFBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIEZ1bmNOb09wLnByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xuICAgICAgICBmQm91bmQucHJvdG90eXBlID0gbmV3IEZ1bmNOb09wKCk7XG5cbiAgICAgICAgcmV0dXJuIGZCb3VuZDtcbiAgICB9O1xufVxuIiwiLyoganNoaW50IC1XMDc5ICovXG52YXIgbW9ja0RhdGEgPSAoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0TW9ja1Blb3BsZTogZ2V0TW9ja1Blb3BsZSxcbiAgICAgICAgZ2V0TW9ja1N0YXRlczogZ2V0TW9ja1N0YXRlc1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNb2NrU3RhdGVzKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICc8aSBjbGFzcz1cImZhIGZhLWRhc2hib2FyZFwiPjwvaT4gRGFzaGJvYXJkJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1vY2tQZW9wbGUoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7Zmlyc3ROYW1lOiAnSm9obicsIGxhc3ROYW1lOiAnUGFwYScsIGFnZTogMjUsIGxvY2F0aW9uOiAnRmxvcmlkYSd9LFxuICAgICAgICAgICAge2ZpcnN0TmFtZTogJ1dhcmQnLCBsYXN0TmFtZTogJ0JlbGwnLCBhZ2U6IDMxLCBsb2NhdGlvbjogJ0NhbGlmb3JuaWEnfSxcbiAgICAgICAgICAgIHtmaXJzdE5hbWU6ICdDb2xsZWVuJywgbGFzdE5hbWU6ICdKb25lcycsIGFnZTogMjEsIGxvY2F0aW9uOiAnTmV3IFlvcmsnfSxcbiAgICAgICAgICAgIHtmaXJzdE5hbWU6ICdNYWRlbHluJywgbGFzdE5hbWU6ICdHcmVlbicsIGFnZTogMTgsIGxvY2F0aW9uOiAnTm9ydGggRGFrb3RhJ30sXG4gICAgICAgICAgICB7Zmlyc3ROYW1lOiAnRWxsYScsIGxhc3ROYW1lOiAnSm9icycsIGFnZTogMTgsIGxvY2F0aW9uOiAnU291dGggRGFrb3RhJ30sXG4gICAgICAgICAgICB7Zmlyc3ROYW1lOiAnTGFuZG9uJywgbGFzdE5hbWU6ICdHYXRlcycsIGFnZTogMTEsIGxvY2F0aW9uOiAnU291dGggQ2Fyb2xpbmEnfSxcbiAgICAgICAgICAgIHtmaXJzdE5hbWU6ICdIYWxleScsIGxhc3ROYW1lOiAnR3V0aHJpZScsIGFnZTogMzUsIGxvY2F0aW9uOiAnV3lvbWluZyd9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICBub3RGb3VuZE1pZGRsZXdhcmU6IG5vdEZvdW5kTWlkZGxld2FyZSxcbiAgICAgICAgc2VuZDQwNDogc2VuZDQwNFxuICAgIH07XG4gICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICBmdW5jdGlvbiBub3RGb3VuZE1pZGRsZXdhcmUocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgc2VuZDQwNChyZXEsIHJlcywgJ0FQSSBlbmRwb2ludCBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZW5kNDA0KHJlcSwgcmVzLCBkZXNjcmlwdGlvbikge1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogNDA0LFxuICAgICAgICAgICAgbWVzc2FnZTogJ05vdCBGb3VuZCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgICAgICB1cmw6IHJlcS51cmxcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDQpXG4gICAgICAgICAgICAuc2VuZChkYXRhKVxuICAgICAgICAgICAgLmVuZCgpO1xuICAgIH1cbn07XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFkbWluJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FkbWluQ29udHJvbGxlcicsIEFkbWluQ29udHJvbGxlcik7XG5cbiAgICBBZG1pbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnbG9nZ2VyJ107XG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQWRtaW5Db250cm9sbGVyKGxvZ2dlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS50aXRsZSA9ICdBZG1pbic7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdBY3RpdmF0ZWQgQWRtaW4gVmlldycpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIi8qIGpzaGludCAtVzExNywgLVcwMzAgKi9cbmRlc2NyaWJlKCdBZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udHJvbGxlcjtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGJhcmQuYXBwTW9kdWxlKCdhcHAuYWRtaW4nKTtcbiAgICAgICAgYmFyZC5pbmplY3QoJyRjb250cm9sbGVyJywgJyRsb2cnLCAnJHJvb3RTY29wZScpO1xuICAgIH0pO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcignQWRtaW5Db250cm9sbGVyJyk7XG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgfSk7XG5cbiAgICBiYXJkLnZlcmlmeU5vT3V0c3RhbmRpbmdIdHRwUmVxdWVzdHMoKTtcblxuICAgIGRlc2NyaWJlKCdBZG1pbiBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgYmUgY3JlYXRlZCBzdWNjZXNzZnVsbHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG8uYmUuZGVmaW5lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2FmdGVyIGFjdGl2YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgdGl0bGUgb2YgQWRtaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci50aXRsZSkudG8uZXF1YWwoJ0FkbWluJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGxvZ2dlZCBcIkFjdGl2YXRlZFwiJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCRsb2cuaW5mby5sb2dzKS50by5tYXRjaCgvQWN0aXZhdGVkLyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5hZG1pbicsIFtcbiAgICAgICAgJ2FwcC5jb3JlJyxcbiAgICAgICAgJ2FwcC53aWRnZXRzJ1xuICAgICAgXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWRtaW4nKVxuICAgICAgICAucnVuKGFwcFJ1bik7XG5cbiAgICBhcHBSdW4uJGluamVjdCA9IFsncm91dGVySGVscGVyJ107XG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcikge1xuICAgICAgICByb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdGF0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6ICdhZG1pbicsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hZG1pbicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2FkbWluL2FkbWluLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0FkbWluJyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICc8aSBjbGFzcz1cImZhIGZhLWxvY2tcIj48L2k+IEFkbWluJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cbn0pKCk7XG4iLCIvKiBqc2hpbnQgLVcxMTcsIC1XMDMwICovXG5kZXNjcmliZSgnYWRtaW4gcm91dGVzJywgZnVuY3Rpb24gKCkge1xuICAgIGRlc2NyaWJlKCdzdGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZpZXcgPSAnYXBwL2FkbWluL2FkbWluLmh0bWwnO1xuXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2R1bGUoJ2FwcC5hZG1pbicsIGJhcmQuZmFrZVRvYXN0cik7XG4gICAgICAgICAgICBiYXJkLmluamVjdCgnJGh0dHBCYWNrZW5kJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckdGVtcGxhdGVDYWNoZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHRlbXBsYXRlQ2FjaGUucHV0KHZpZXcsICcnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBtYXAgc3RhdGUgYWRtaW4gdG8gdXJsIC9hZG1pbiAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdCgkc3RhdGUuaHJlZignYWRtaW4nLCB7fSkpLnRvLmVxdWFsKCcvYWRtaW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBtYXAgL2FkbWluIHJvdXRlIHRvIGFkbWluIFZpZXcgdGVtcGxhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoJHN0YXRlLmdldCgnYWRtaW4nKS50ZW1wbGF0ZVVybCkudG8uZXF1YWwodmlldyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdvZiBhZG1pbiBzaG91bGQgd29yayB3aXRoICRzdGF0ZS5nbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYWRtaW4nKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoJHN0YXRlLmlzKCdhZG1pbicpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGNvcmUgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvcmUnKTtcblxuICAgIGNvcmUuY29uZmlnKHRvYXN0ckNvbmZpZyk7XG5cbiAgICB0b2FzdHJDb25maWcuJGluamVjdCA9IFsndG9hc3RyJ107XG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gdG9hc3RyQ29uZmlnKHRvYXN0cikge1xuICAgICAgICB0b2FzdHIub3B0aW9ucy50aW1lT3V0ID0gNDAwMDtcbiAgICAgICAgdG9hc3RyLm9wdGlvbnMucG9zaXRpb25DbGFzcyA9ICd0b2FzdC1ib3R0b20tcmlnaHQnO1xuICAgIH1cblxuICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgIGFwcEVycm9yUHJlZml4OiAnW2hlbGxvV29ybGQgRXJyb3JdICcsXG4gICAgICAgIGFwcFRpdGxlOiAnaGVsbG9Xb3JsZCdcbiAgICB9O1xuXG4gICAgY29yZS52YWx1ZSgnY29uZmlnJywgY29uZmlnKTtcblxuICAgIGNvcmUuY29uZmlnKGNvbmZpZ3VyZSk7XG5cbiAgICBjb25maWd1cmUuJGluamVjdCA9IFsnJGxvZ1Byb3ZpZGVyJywgJ3JvdXRlckhlbHBlclByb3ZpZGVyJywgJ2V4Y2VwdGlvbkhhbmRsZXJQcm92aWRlciddO1xuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGNvbmZpZ3VyZSgkbG9nUHJvdmlkZXIsIHJvdXRlckhlbHBlclByb3ZpZGVyLCBleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIpIHtcbiAgICAgICAgaWYgKCRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQpIHtcbiAgICAgICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyLmNvbmZpZ3VyZShjb25maWcuYXBwRXJyb3JQcmVmaXgpO1xuICAgICAgICByb3V0ZXJIZWxwZXJQcm92aWRlci5jb25maWd1cmUoe2RvY1RpdGxlOiBjb25maWcuYXBwVGl0bGUgKyAnOiAnfSk7XG4gICAgfVxuXG59KSgpO1xuIiwiLyogZ2xvYmFsIHRvYXN0cjpmYWxzZSwgbW9tZW50OmZhbHNlICovXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29yZScpXG4gICAgICAgIC5jb25zdGFudCgndG9hc3RyJywgdG9hc3RyKVxuICAgICAgICAuY29uc3RhbnQoJ21vbWVudCcsIG1vbWVudCk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJywgW1xuICAgICAgICAgICAgJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJyxcbiAgICAgICAgICAgICdibG9ja3MuZXhjZXB0aW9uJywgJ2Jsb2Nrcy5sb2dnZXInLCAnYmxvY2tzLnJvdXRlcicsXG4gICAgICAgICAgICAndWkucm91dGVyJywgJ25ncGx1cydcbiAgICAgICAgXSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvcmUnKVxuICAgICAgICAucnVuKGFwcFJ1bik7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKSB7XG4gICAgICAgIHZhciBvdGhlcndpc2UgPSAnLzQwNCc7XG4gICAgICAgIHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMoZ2V0U3RhdGVzKCksIG90aGVyd2lzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3RhdGVzKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiAnNDA0JyxcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLzQwNCcsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvcmUvNDA0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJzQwNCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTtcbiIsIi8qIGpzaGludCAtVzExNywgLVcwMzAgKi9cbmRlc2NyaWJlKCdjb3JlJywgZnVuY3Rpb24oKSB7XG4gICAgZGVzY3JpYmUoJ3N0YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2aWV3cyA9IHtcbiAgICAgICAgICAgIGZvdXIwZm91cjogJ2FwcC9jb3JlLzQwNC5odG1sJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2R1bGUoJ2FwcC5jb3JlJywgYmFyZC5mYWtlVG9hc3RyKTtcbiAgICAgICAgICAgIGJhcmQuaW5qZWN0KCckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHRlbXBsYXRlQ2FjaGUnKTtcbiAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCh2aWV3cy5jb3JlLCAnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbWFwIC80MDQgcm91dGUgdG8gNDA0IFZpZXcgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdCgkc3RhdGUuZ2V0KCc0MDQnKS50ZW1wbGF0ZVVybCkudG8uZXF1YWwodmlld3MuZm91cjBmb3VyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ29mIGRhc2hib2FyZCBzaG91bGQgd29yayB3aXRoICRzdGF0ZS5nbycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCc0MDQnKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoJHN0YXRlLmlzKCc0MDQnKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcm91dGUgL2ludmFsaWQgdG8gdGhlIG90aGVyd2lzZSAoNDA0KSByb3V0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pbnZhbGlkJyk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KCRzdGF0ZS5jdXJyZW50LnRlbXBsYXRlVXJsKS50by5lcXVhbCh2aWV3cy5mb3VyMGZvdXIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb3JlJylcbiAgICAgICAgLmZhY3RvcnkoJ2RhdGFzZXJ2aWNlJywgZGF0YXNlcnZpY2UpO1xuXG4gICAgZGF0YXNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnLCAnZXhjZXB0aW9uJywgJ2xvZ2dlciddO1xuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGRhdGFzZXJ2aWNlKCRodHRwLCAkcSwgZXhjZXB0aW9uLCBsb2dnZXIpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBnZXRQZW9wbGU6IGdldFBlb3BsZSxcbiAgICAgICAgICAgIGdldE1lc3NhZ2VDb3VudDogZ2V0TWVzc2FnZUNvdW50XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TWVzc2FnZUNvdW50KCkgeyByZXR1cm4gJHEud2hlbig3Mik7IH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRQZW9wbGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Blb3BsZScpXG4gICAgICAgICAgICAgICAgLnRoZW4oc3VjY2VzcylcbiAgICAgICAgICAgICAgICAuY2F0Y2goZmFpbCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4Y2VwdGlvbi5jYXRjaGVyKCdYSFIgRmFpbGVkIGZvciBnZXRQZW9wbGUnKShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmRhc2hib2FyZCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBEYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRxJywgJ2RhdGFzZXJ2aWNlJywgJ2xvZ2dlciddO1xuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIERhc2hib2FyZENvbnRyb2xsZXIoJHEsIGRhdGFzZXJ2aWNlLCBsb2dnZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubmV3cyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnaGVsbG9Xb3JsZCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0hvdCBUb3dlbCBBbmd1bGFyIGlzIGEgU1BBIHRlbXBsYXRlIGZvciBBbmd1bGFyIGRldmVsb3BlcnMuJ1xuICAgICAgICB9O1xuICAgICAgICB2bS5tZXNzYWdlQ291bnQgPSAwO1xuICAgICAgICB2bS5wZW9wbGUgPSBbXTtcbiAgICAgICAgdm0udGl0bGUgPSAnRGFzaGJvYXJkJztcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW2dldE1lc3NhZ2VDb3VudCgpLCBnZXRQZW9wbGUoKV07XG4gICAgICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdBY3RpdmF0ZWQgRGFzaGJvYXJkIFZpZXcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TWVzc2FnZUNvdW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFzZXJ2aWNlLmdldE1lc3NhZ2VDb3VudCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlQ291bnQgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5tZXNzYWdlQ291bnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFBlb3BsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhc2VydmljZS5nZXRQZW9wbGUoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVvcGxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ucGVvcGxlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiLyoganNoaW50IC1XMTE3LCAtVzAzMCAqL1xuZGVzY3JpYmUoJ0Rhc2hib2FyZENvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udHJvbGxlcjtcbiAgICB2YXIgcGVvcGxlID0gbW9ja0RhdGEuZ2V0TW9ja1Blb3BsZSgpO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgYmFyZC5hcHBNb2R1bGUoJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgYmFyZC5pbmplY3QoJyRjb250cm9sbGVyJywgJyRsb2cnLCAnJHEnLCAnJHJvb3RTY29wZScsICdkYXRhc2VydmljZScpO1xuICAgIH0pO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNpbm9uLnN0dWIoZGF0YXNlcnZpY2UsICdnZXRQZW9wbGUnKS5yZXR1cm5zKCRxLndoZW4ocGVvcGxlKSk7XG4gICAgICAgIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcignRGFzaGJvYXJkQ29udHJvbGxlcicpO1xuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgIH0pO1xuXG4gICAgYmFyZC52ZXJpZnlOb091dHN0YW5kaW5nSHR0cFJlcXVlc3RzKCk7XG5cbiAgICBkZXNjcmliZSgnRGFzaGJvYXJkIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBjcmVhdGVkIHN1Y2Nlc3NmdWxseScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50by5iZS5kZWZpbmVkO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnYWZ0ZXIgYWN0aXZhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSB0aXRsZSBvZiBEYXNoYm9hcmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIudGl0bGUpLnRvLmVxdWFsKCdEYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgbG9nZ2VkIFwiQWN0aXZhdGVkXCInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoJGxvZy5pbmZvLmxvZ3MpLnRvLm1hdGNoKC9BY3RpdmF0ZWQvKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgbmV3cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5uZXdzKS50by5ub3QuYmUuZW1wdHk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IDEgcGVyc29uJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLnBlb3BsZSkudG8uaGF2ZS5sZW5ndGguYWJvdmUoMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIHBlb3BsZSBjb3VudCBvZiA1JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLnBlb3BsZSkudG8uaGF2ZS5sZW5ndGgoNyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmRhc2hib2FyZCcsIFtcbiAgICAgICAgJ2FwcC5jb3JlJyxcbiAgICAgICAgJ2FwcC53aWRnZXRzJ1xuICAgICAgXSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmRhc2hib2FyZCcpXG4gICAgICAgIC5ydW4oYXBwUnVuKTtcblxuICAgIGFwcFJ1bi4kaW5qZWN0ID0gWydyb3V0ZXJIZWxwZXInXTtcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKSB7XG4gICAgICAgIHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMoZ2V0U3RhdGVzKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0YXRlcygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogJ2Rhc2hib2FyZCcsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGFzaGJvYXJkQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdkYXNoYm9hcmQnLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmF2OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJzxpIGNsYXNzPVwiZmEgZmEtZGFzaGJvYXJkXCI+PC9pPiBEYXNoYm9hcmQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTtcbiIsIi8qIGpzaGludCAtVzExNywgLVcwMzAgKi9cbmRlc2NyaWJlKCdkYXNoYm9hcmQgcm91dGVzJywgZnVuY3Rpb24gKCkge1xuICAgIGRlc2NyaWJlKCdzdGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZpZXcgPSAnYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCc7XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1vZHVsZSgnYXBwLmRhc2hib2FyZCcsIGJhcmQuZmFrZVRvYXN0cik7XG4gICAgICAgICAgICBiYXJkLmluamVjdCgnJGh0dHBCYWNrZW5kJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckdGVtcGxhdGVDYWNoZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHRlbXBsYXRlQ2FjaGUucHV0KHZpZXcsICcnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYmFyZC52ZXJpZnlOb091dHN0YW5kaW5nSHR0cFJlcXVlc3RzKCk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBtYXAgc3RhdGUgZGFzaGJvYXJkIHRvIHVybCAvICcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KCRzdGF0ZS5ocmVmKCdkYXNoYm9hcmQnLCB7fSkpLnRvLmVxdWFsKCcvJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbWFwIC9kYXNoYm9hcmQgcm91dGUgdG8gZGFzaGJvYXJkIFZpZXcgdGVtcGxhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoJHN0YXRlLmdldCgnZGFzaGJvYXJkJykudGVtcGxhdGVVcmwpLnRvLmVxdWFsKHZpZXcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnb2YgZGFzaGJvYXJkIHNob3VsZCB3b3JrIHdpdGggJHN0YXRlLmdvJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdkYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoJHN0YXRlLmlzKCdkYXNoYm9hcmQnKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAubGF5b3V0JylcbiAgICAgICAgLmRpcmVjdGl2ZSgnaHRTaWRlYmFyJywgaHRTaWRlYmFyKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGh0U2lkZWJhciAoKSB7XG4gICAgICAgIC8vIE9wZW5zIGFuZCBjbG9zZXMgdGhlIHNpZGViYXIgbWVudS5cbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vICA8ZGl2IGh0LXNpZGViYXJcIj5cbiAgICAgICAgLy8gIDxkaXYgaHQtc2lkZWJhciB3aGVuRG9uZUFuaW1hdGluZz1cInZtLnNpZGViYXJSZWFkeSgpXCI+XG4gICAgICAgIC8vIENyZWF0ZXM6XG4gICAgICAgIC8vICA8ZGl2IGh0LXNpZGViYXIgY2xhc3M9XCJzaWRlYmFyXCI+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHdoZW5Eb25lQW5pbWF0aW5nOiAnJj8nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciAkc2lkZWJhcklubmVyID0gZWxlbWVudC5maW5kKCcuc2lkZWJhci1pbm5lcicpO1xuICAgICAgICAgICAgdmFyICRkcm9wZG93bkVsZW1lbnQgPSBlbGVtZW50LmZpbmQoJy5zaWRlYmFyLWRyb3Bkb3duIGEnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3NpZGViYXInKTtcbiAgICAgICAgICAgICRkcm9wZG93bkVsZW1lbnQuY2xpY2soZHJvcGRvd24pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBkcm9wZG93bihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRyb3BDbGFzcyA9ICdkcm9weSc7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghJGRyb3Bkb3duRWxlbWVudC5oYXNDbGFzcyhkcm9wQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzaWRlYmFySW5uZXIuc2xpZGVEb3duKDM1MCwgc2NvcGUud2hlbkRvbmVBbmltYXRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd25FbGVtZW50LmFkZENsYXNzKGRyb3BDbGFzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkZHJvcGRvd25FbGVtZW50Lmhhc0NsYXNzKGRyb3BDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duRWxlbWVudC5yZW1vdmVDbGFzcyhkcm9wQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAkc2lkZWJhcklubmVyLnNsaWRlVXAoMzUwLCBzY29wZS53aGVuRG9uZUFuaW1hdGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIi8qIGpzaGludCAtVzExNywgLVcwMzAgKi9cbi8qIGpzaGludCBtdWx0aXN0cjp0cnVlICovXG5kZXNjcmliZSgnaHRTaWRlYmFyIGRpcmVjdGl2ZTogJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkcm9wZG93bkVsZW1lbnQ7XG4gICAgdmFyIGVsO1xuICAgIHZhciBpbm5lckVsZW1lbnQ7XG4gICAgdmFyIGlzT3BlbkNsYXNzID0gJ2Ryb3B5JztcbiAgICB2YXIgc2NvcGU7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSgnYXBwLmxheW91dCcpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRjb21waWxlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIC8vIFRoZSBtaW5pbXVtIG5lY2Vzc2FyeSB0ZW1wbGF0ZSBIVE1MIGZvciB0aGlzIHNwZWMuXG4gICAgICAgIC8vIFNpbXVsYXRlcyBhIG1lbnUgbGluayB0aGF0IG9wZW5zIGFuZCBjbG9zZXMgYSBkcm9wZG93biBvZiBtZW51IGl0ZW1zXG4gICAgICAgIC8vIFRoZSBgd2hlbi1kb25lLWFuaW1hdGluZ2AgYXR0cmlidXRlIGlzIG9wdGlvbmFsIChhcyBpcyB0aGUgdm0ncyBpbXBsZW1lbnRhdGlvbilcbiAgICAgICAgLy9cbiAgICAgICAgLy8gTi5CLjogdGhlIGF0dHJpYnV0ZSB2YWx1ZSBpcyBzdXBwb3NlZCB0byBiZSBhbiBleHByZXNzaW9uIHRoYXQgaW52b2tlcyBhICRzY29wZSBtZXRob2RcbiAgICAgICAgLy8gICAgICAgc28gbWFrZSBzdXJlIHRoZSBleHByZXNzaW9uIGluY2x1ZGVzICcoKScsIGUuZy4sIFwidm0uc2lkZWJhclJlYWR5KDQyKVwiXG4gICAgICAgIC8vICAgICAgIG5vIGhhcm0gaWYgdGhlIGV4cHJlc3Npb24gZmFpbHMgLi4uIGJ1dCB0aGVuIHNjb3BlLnNpZGViYXJSZWFkeSB3aWxsIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgLy8gICAgICAgQWxsIHBhcmFtZXRlcnMgaW4gdGhlIGV4cHJlc3Npb24gYXJlIHBhc3NlZCB0byB2bS5zaWRlYmFyUmVhZHkgLi4uIGlmIGl0IGV4aXN0c1xuICAgICAgICAvL1xuICAgICAgICAvLyBOLkIuOiBXZSBkbyBOT1QgYWRkIHRoaXMgZWxlbWVudCB0byB0aGUgYnJvd3NlciBET00gKGFsdGhvdWdoIHdlIGNvdWxkKS5cbiAgICAgICAgLy8gICAgICAgc3BlYyBydW5zIGZhc3RlciBpZiB3ZSBkb24ndCB0b3VjaCB0aGUgRE9NIChldmVuIHRoZSBQaGFudG9tSlMgRE9NKS5cbiAgICAgICAgZWwgPSBhbmd1bGFyLmVsZW1lbnQoXG4gICAgICAgICAgICAnPGh0LXNpZGViYXIgd2hlbi1kb25lLWFuaW1hdGluZz1cInZtLnNpZGViYXJSZWFkeSg0MilcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNpZGViYXItZHJvcGRvd25cIj48YSBocmVmPVwiXCI+TWVudTwvYT48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNpZGViYXItaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2h0LXNpZGViYXI+Jyk7XG5cbiAgICAgICAgLy8gVGhlIHNwZWMgZXhhbWluZXMgY2hhbmdlcyB0byB0aGVzZSB0ZW1wbGF0ZSBwYXJ0c1xuICAgICAgICBkcm9wZG93bkVsZW1lbnQgPSBlbC5maW5kKCcuc2lkZWJhci1kcm9wZG93biBhJyk7IC8vIHRoZSBsaW5rIHRvIGNsaWNrXG4gICAgICAgIGlubmVyRWxlbWVudCAgICA9IGVsLmZpbmQoJy5zaWRlYmFyLWlubmVyJyk7ICAgICAgLy8gY29udGFpbmVyIG9mIG1lbnUgaXRlbXNcblxuICAgICAgICAvLyBuZydzICRjb21waWxlIHNlcnZpY2UgcmVzb2x2ZXMgbmVzdGVkIGRpcmVjdGl2ZXMgKHRoZXJlIGFyZSBub25lIGluIHRoaXMgZXhhbXBsZSlcbiAgICAgICAgLy8gYW5kIGJpbmRzIHRoZSBlbGVtZW50IHRvIHRoZSBzY29wZSAod2hpY2ggbXVzdCBiZSBhIHJlYWwgbmcgc2NvcGUpXG4gICAgICAgIHNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgJGNvbXBpbGUoZWwpKHNjb3BlKTtcblxuICAgICAgICAvLyB0ZWxsIGFuZ3VsYXIgdG8gbG9vayBhdCB0aGUgc2NvcGUgdmFsdWVzIHJpZ2h0IG5vd1xuICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgfSkpO1xuXG4gICAgLy8vIHRlc3RzIC8vL1xuICAgIGRlc2NyaWJlKCd0aGUgaXNPcGVuQ2xhc3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KCdpcyBhYnNlbnQgZm9yIGEgY2xvc2VkIG1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBoYXNJc09wZW5DbGFzcyhmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdpcyBhZGRlZCB0byBhIGNsb3NlZCBtZW51IGFmdGVyIGNsaWNraW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xpY2tJdCgpO1xuICAgICAgICAgICAgaGFzSXNPcGVuQ2xhc3ModHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdpcyBwcmVzZW50IGZvciBhbiBvcGVuIG1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvcGVuRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGhhc0lzT3BlbkNsYXNzKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgcmVtb3ZlZCBmcm9tIGEgY2xvc2VkIG1lbnUgYWZ0ZXIgY2xpY2tpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvcGVuRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGNsaWNrSXQoKTtcbiAgICAgICAgICAgIGhhc0lzT3BlbkNsYXNzKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2hlbiBhbmltYXRpbmcgdy8galF1ZXJ5IGZ4IG9mZicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyByZW1lbWJlciBjdXJyZW50IHN0YXRlIG9mIGpRdWVyeSdzIGdsb2JhbCBGWCBkdXJhdGlvbiBzd2l0Y2hcbiAgICAgICAgICAgIHRoaXMub2xkRnhPZmYgPSAkLmZ4Lm9mZjtcbiAgICAgICAgICAgIC8vIHdoZW4galF1ZXJ5IGZ4IGFyZSBvZiwgdGhlcmUgaXMgemVybyBhbmltYXRpb24gdGltZTsgbm8gd2FpdGluZyBmb3IgYW5pbWF0aW9uIHRvIGNvbXBsZXRlXG4gICAgICAgICAgICAkLmZ4Lm9mZiA9IHRydWU7XG4gICAgICAgICAgICAvLyBtdXN0IGFkZCB0byBET00gd2hlbiB0ZXN0aW5nIGpRdWVyeSBhbmltYXRpb24gcmVzdWx0XG4gICAgICAgICAgICBlbC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQuZngub2ZmID0gdGhpcy5vbGRGeE9mZjtcbiAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZHJvcGRvd24gaXMgdmlzaWJsZSBhZnRlciBvcGVuaW5nIGEgY2xvc2VkIG1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkcm9wZG93bklzVmlzaWJsZShmYWxzZSk7IC8vIGhpZGRlbiBiZWZvcmUgY2xpY2tcbiAgICAgICAgICAgIGNsaWNrSXQoKTtcbiAgICAgICAgICAgIGRyb3Bkb3duSXNWaXNpYmxlKHRydWUpOyAvLyB2aXNpYmxlIGFmdGVyIGNsaWNrXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkcm9wZG93biBpcyBoaWRkZW4gYWZ0ZXIgY2xvc2luZyBhbiBvcGVuIG1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvcGVuRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGRyb3Bkb3duSXNWaXNpYmxlKHRydWUpOyAvLyB2aXNpYmxlIGJlZm9yZSBjbGlja1xuICAgICAgICAgICAgY2xpY2tJdCgpO1xuICAgICAgICAgICAgZHJvcGRvd25Jc1Zpc2libGUoZmFsc2UpOyAvLyBoaWRkZW4gYWZ0ZXIgY2xpY2tcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NsaWNrIHRyaWdnZXJzIFwid2hlbi1kb25lLWFuaW1hdGluZ1wiIGV4cHJlc3Npb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBzcHkgb24gZGlyZWN0aXZlJ3MgY2FsbGJhY2sgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmVcbiAgICAgICAgICAgIHZhciBzcHkgPSBzaW5vbi5zcHkoKTtcblxuICAgICAgICAgICAgLy8gUmVjYWxsIHRoZSBwZXJ0aW5lbnQgdGFnIGluIHRoZSB0ZW1wbGF0ZSAuLi5cbiAgICAgICAgICAgIC8vICcgICAgPGRpdiBodC1zaWRlYmFyICB3aGVuLWRvbmUtYW5pbWF0aW5nPVwidm0uc2lkZWJhclJlYWR5KDQyKVwiID5cbiAgICAgICAgICAgIC8vIHRoZXJlZm9yZSwgdGhlIGRpcmVjdGl2ZSBsb29rcyBmb3Igc2NvcGUudm0uc2lkZWJhclJlYWR5XG4gICAgICAgICAgICAvLyBhbmQgc2hvdWxkIGNhbGwgdGhhdCBtZXRob2Qgd2l0aCB0aGUgdmFsdWUgJzQyJ1xuICAgICAgICAgICAgc2NvcGUudm0gPSB7c2lkZWJhclJlYWR5OiBzcHl9O1xuXG4gICAgICAgICAgICAvLyB0ZWxsIGFuZ3VsYXIgdG8gbG9vayBhZ2FpbiBmb3IgdGhhdCB2bS5zaWRlYmFyUmVhZHkgcHJvcGVydHlcbiAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcblxuICAgICAgICAgICAgLy8gc3B5IG5vdCBjYWxsZWQgdW50aWwgYWZ0ZXIgY2xpY2sgd2hpY2ggdHJpZ2dlcnMgdGhlIGFuaW1hdGlvblxuICAgICAgICAgICAgZXhwZWN0KHNweSkubm90LnRvLmhhdmUuYmVlbi5jYWxsZWQ7XG5cbiAgICAgICAgICAgIC8vIHRoaXMgY2xpY2sgdHJpZ2dlcnMgYW4gYW5pbWF0aW9uXG4gICAgICAgICAgICBjbGlja0l0KCk7XG5cbiAgICAgICAgICAgIC8vIHZlcmlmeSB0aGF0IHRoZSB2bSdzIG1ldGhvZCAoc2lkZWJhclJlYWR5KSB3YXMgY2FsbGVkIHdpdGggJzQyJ1xuICAgICAgICAgICAgLy8gRllJOiBzcHkuYXJnc1swXSBpcyB0aGUgYXJyYXkgb2YgYXJncyBwYXNzZWQgdG8gc2lkZWJhclJlYWR5KClcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvLmhhdmUuYmVlbi5jYWxsZWQ7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50by5oYXZlLmJlZW4uY2FsbGVkV2l0aCg0Mik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8vLy8vLyBoZWxwZXJzIC8vLy8vL1xuXG4gICAgLy8gcHV0IHRoZSBkcm9wZG93biBpbiB0aGUgJ21lbnUgb3Blbicgc3RhdGVcbiAgICBmdW5jdGlvbiBvcGVuRHJvcGRvd24oKSB7XG4gICAgICAgIGRyb3Bkb3duRWxlbWVudC5hZGRDbGFzcyhpc09wZW5DbGFzcyk7XG4gICAgICAgIGlubmVyRWxlbWVudC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG5cbiAgICAvLyBjbGljayB0aGUgXCJtZW51XCIgbGlua1xuICAgIGZ1bmN0aW9uIGNsaWNrSXQoKSB7XG4gICAgICAgIGRyb3Bkb3duRWxlbWVudC50cmlnZ2VyKCdjbGljaycpO1xuICAgIH1cblxuICAgIC8vIGFzc2VydCB3aGV0aGVyIHRoZSBcIm1lbnVcIiBsaW5rIGhhcyB0aGUgY2xhc3MgdGhhdCBtZWFucyAnaXMgb3BlbidcbiAgICBmdW5jdGlvbiBoYXNJc09wZW5DbGFzcyhpc1RydWUpIHtcbiAgICAgICAgdmFyIGhhc0NsYXNzID0gZHJvcGRvd25FbGVtZW50Lmhhc0NsYXNzKGlzT3BlbkNsYXNzKTtcbiAgICAgICAgZXhwZWN0KGhhc0NsYXNzKS5lcXVhbCghIWlzVHJ1ZSxcbiAgICAgICAgICAgICdkcm9wZG93biBoYXMgdGhlIFwiaXMgb3BlblwiIGNsYXNzIGlzICcgKyBoYXNDbGFzcyk7XG4gICAgfVxuXG4gICAgLy8gYXNzZXJ0IHdoZXRoZXIgdGhlIGRyb3Bkb3duIGNvbnRhaW5lciBpcyAnYmxvY2snICh2aXNpYmxlKSBvciAnbm9uZScgKGhpZGRlbilcbiAgICBmdW5jdGlvbiBkcm9wZG93bklzVmlzaWJsZShpc1RydWUpIHtcbiAgICAgICAgdmFyIGRpc3BsYXkgPSBpbm5lckVsZW1lbnQuY3NzKCdkaXNwbGF5Jyk7XG4gICAgICAgIGV4cGVjdChkaXNwbGF5KS50by5lcXVhbChpc1RydWUgPyAnYmxvY2snIDogJ25vbmUnLFxuICAgICAgICAgICAgJ2lubmVyRWxlbWVudCBkaXNwbGF5IHZhbHVlIGlzICcgKyBkaXNwbGF5KTtcbiAgICB9XG59KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXQnKVxuICAgICAgICAuZGlyZWN0aXZlKCdodFRvcE5hdicsIGh0VG9wTmF2KTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGh0VG9wTmF2ICgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBUb3BOYXZDb250cm9sbGVyLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICduYXZsaW5lJzogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbGF5b3V0L2h0LXRvcC1uYXYuaHRtbCdcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAgICAgZnVuY3Rpb24gVG9wTmF2Q29udHJvbGxlcigpIHtcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5sYXlvdXQnLCBbJ2FwcC5jb3JlJ10pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXQnKVxuICAgICAgICAuY29udHJvbGxlcignU2hlbGxDb250cm9sbGVyJywgU2hlbGxDb250cm9sbGVyKTtcblxuICAgIFNoZWxsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgJ2NvbmZpZycsICdsb2dnZXInXTtcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBTaGVsbENvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHRpbWVvdXQsIGNvbmZpZywgbG9nZ2VyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmJ1c3lNZXNzYWdlID0gJ1BsZWFzZSB3YWl0IC4uLic7XG4gICAgICAgIHZtLmlzQnVzeSA9IHRydWU7XG4gICAgICAgICRyb290U2NvcGUuc2hvd1NwbGFzaCA9IHRydWU7XG4gICAgICAgIHZtLm5hdmxpbmUgPSB7XG4gICAgICAgICAgICB0aXRsZTogY29uZmlnLmFwcFRpdGxlLFxuICAgICAgICAgICAgdGV4dDogJ0NyZWF0ZWQgYnkgSm9obiBQYXBhJyxcbiAgICAgICAgICAgIGxpbms6ICdodHRwOi8vdHdpdHRlci5jb20vam9obl9wYXBhJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICBsb2dnZXIuc3VjY2Vzcyhjb25maWcuYXBwVGl0bGUgKyAnIGxvYWRlZCEnLCBudWxsKTtcbiAgICAgICAgICAgIGhpZGVTcGxhc2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhpZGVTcGxhc2goKSB7XG4gICAgICAgICAgICAvL0ZvcmNlIGEgMSBzZWNvbmQgZGVsYXkgc28gd2UgY2FuIHNlZSB0aGUgc3BsYXNoLlxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zaG93U3BsYXNoID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIvKiBqc2hpbnQgLVcxMTcsIC1XMDMwICovXG5kZXNjcmliZSgnU2hlbGxDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRyb2xsZXI7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBiYXJkLmFwcE1vZHVsZSgnYXBwLmxheW91dCcpO1xuICAgICAgICBiYXJkLmluamVjdCgnJGNvbnRyb2xsZXInLCAnJHEnLCAnJHJvb3RTY29wZScsICckdGltZW91dCcsICdkYXRhc2VydmljZScpO1xuICAgIH0pO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcignU2hlbGxDb250cm9sbGVyJyk7XG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgfSk7XG5cbiAgICBiYXJkLnZlcmlmeU5vT3V0c3RhbmRpbmdIdHRwUmVxdWVzdHMoKTtcblxuICAgIGRlc2NyaWJlKCdTaGVsbCBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgYmUgY3JlYXRlZCBzdWNjZXNzZnVsbHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG8uYmUuZGVmaW5lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzaG93IHNwbGFzaCBzY3JlZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoJHJvb3RTY29wZS5zaG93U3BsYXNoKS50by5iZS50cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGhpZGUgc3BsYXNoIHNjcmVlbiBhZnRlciB0aW1lb3V0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdCgkcm9vdFNjb3BlLnNob3dTcGxhc2gpLnRvLmJlLmZhbHNlO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXQnKVxuICAgICAgICAuY29udHJvbGxlcignU2lkZWJhckNvbnRyb2xsZXInLCBTaWRlYmFyQ29udHJvbGxlcik7XG5cbiAgICBTaWRlYmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc3RhdGUnLCAncm91dGVySGVscGVyJ107XG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gU2lkZWJhckNvbnRyb2xsZXIoJHN0YXRlLCByb3V0ZXJIZWxwZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlcyA9IHJvdXRlckhlbHBlci5nZXRTdGF0ZXMoKTtcbiAgICAgICAgdm0uaXNDdXJyZW50ID0gaXNDdXJyZW50O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7IGdldE5hdlJvdXRlcygpOyB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmF2Um91dGVzKCkge1xuICAgICAgICAgICAgdm0ubmF2Um91dGVzID0gc3RhdGVzLmZpbHRlcihmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuc2V0dGluZ3MgJiYgci5zZXR0aW5ncy5uYXY7XG4gICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uKHIxLCByMikge1xuICAgICAgICAgICAgICAgIHJldHVybiByMS5zZXR0aW5ncy5uYXYgLSByMi5zZXR0aW5ncy5uYXY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQ3VycmVudChyb3V0ZSkge1xuICAgICAgICAgICAgaWYgKCFyb3V0ZS50aXRsZSB8fCAhJHN0YXRlLmN1cnJlbnQgfHwgISRzdGF0ZS5jdXJyZW50LnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1lbnVOYW1lID0gcm91dGUudGl0bGU7XG4gICAgICAgICAgICByZXR1cm4gJHN0YXRlLmN1cnJlbnQudGl0bGUuc3Vic3RyKDAsIG1lbnVOYW1lLmxlbmd0aCkgPT09IG1lbnVOYW1lID8gJ2N1cnJlbnQnIDogJyc7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiLyoganNoaW50IC1XMTE3LCAtVzAzMCAqL1xuZGVzY3JpYmUoJ2xheW91dCcsIGZ1bmN0aW9uKCkge1xuICAgIGRlc2NyaWJlKCdzaWRlYmFyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250cm9sbGVyO1xuICAgICAgICB2YXIgdmlld3MgPSB7XG4gICAgICAgICAgICBkYXNoYm9hcmQ6ICdhcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sJyxcbiAgICAgICAgICAgIGN1c3RvbWVyczogJ2FwcC9jdXN0b21lcnMvY3VzdG9tZXJzLmh0bWwnXG4gICAgICAgIH07XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1vZHVsZSgnYXBwLmxheW91dCcsIGJhcmQuZmFrZVRvYXN0cik7XG4gICAgICAgICAgICBiYXJkLmluamVjdCgnJGNvbnRyb2xsZXInLCAnJGh0dHBCYWNrZW5kJywgJyRsb2NhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdyb3V0ZXJIZWxwZXInKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMobW9ja0RhdGEuZ2V0TW9ja1N0YXRlcygpLCAnLycpO1xuICAgICAgICAgICAgY29udHJvbGxlciA9ICRjb250cm9sbGVyKCdTaWRlYmFyQ29udHJvbGxlcicpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYmFyZC52ZXJpZnlOb091dHN0YW5kaW5nSHR0cFJlcXVlc3RzKCk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGlzQ3VycmVudCgpIGZvciAvIHRvIHJldHVybiBgY3VycmVudGAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5pc0N1cnJlbnQoJHN0YXRlLmN1cnJlbnQpKS50by5lcXVhbCgnY3VycmVudCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgaXNDdXJyZW50KCkgZm9yIC9jdXN0b21lcnMgdG8gcmV0dXJuIGBjdXJyZW50YCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jdXN0b21lcnMnKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmlzQ3VycmVudCgkc3RhdGUuY3VycmVudCkpLnRvLmVxdWFsKCdjdXJyZW50Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBpc0N1cnJlbnQoKSBmb3Igbm9uIHJvdXRlIG5vdCByZXR1cm4gYGN1cnJlbnRgJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ludmFsaWQnKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmlzQ3VycmVudCh7dGl0bGU6ICdpbnZhbGlkJ30pKS5ub3QudG8uZXF1YWwoJ2N1cnJlbnQnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAud2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2h0SW1nUGVyc29uJywgaHRJbWdQZXJzb24pO1xuXG4gICAgaHRJbWdQZXJzb24uJGluamVjdCA9IFsnY29uZmlnJ107XG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gaHRJbWdQZXJzb24gKGNvbmZpZykge1xuICAgICAgICAvL1VzYWdlOlxuICAgICAgICAvLzxpbWcgaHQtaW1nLXBlcnNvbj1cInt7cGVyc29uLmltYWdlU291cmNlfX1cIi8+XG4gICAgICAgIHZhciBiYXNlUGF0aCA9IGNvbmZpZy5pbWFnZUJhc2VQYXRoO1xuICAgICAgICB2YXIgdW5rbm93bkltYWdlID0gY29uZmlnLnVua25vd25QZXJzb25JbWFnZVNvdXJjZTtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdodEltZ1BlcnNvbicsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gYmFzZVBhdGggKyAodmFsdWUgfHwgdW5rbm93bkltYWdlKTtcbiAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCdzcmMnLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAud2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2h0V2lkZ2V0SGVhZGVyJywgaHRXaWRnZXRIZWFkZXIpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gaHRXaWRnZXRIZWFkZXIoKSB7XG4gICAgICAgIC8vVXNhZ2U6XG4gICAgICAgIC8vPGRpdiBodC13aWRnZXQtaGVhZGVyIHRpdGxlPVwidm0ubWFwLnRpdGxlXCI+PC9kaXY+XG4gICAgICAgIC8vIENyZWF0ZXM6XG4gICAgICAgIC8vIDxkaXYgaHQtd2lkZ2V0LWhlYWRlcj1cIlwiXG4gICAgICAgIC8vICAgICAgdGl0bGU9XCJNb3ZpZVwiXG4gICAgICAgIC8vICAgICAgYWxsb3ctY29sbGFwc2U9XCJ0cnVlXCIgPC9kaXY+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICd0aXRsZSc6ICdAJyxcbiAgICAgICAgICAgICAgICAnc3VidGl0bGUnOiAnQCcsXG4gICAgICAgICAgICAgICAgJ3JpZ2h0VGV4dCc6ICdAJyxcbiAgICAgICAgICAgICAgICAnYWxsb3dDb2xsYXBzZSc6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dpZGdldHMvd2lkZ2V0LWhlYWRlci5odG1sJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLndpZGdldHMnLCBbXSk7XG59KSgpO1xuIiwiLy8gSW5jbHVkZSBpbiBpbmRleC5odG1sIHNvIHRoYXQgYXBwIGxldmVsIGV4Y2VwdGlvbnMgYXJlIGhhbmRsZWQuXG4vLyBFeGNsdWRlIGZyb20gdGVzdFJ1bm5lci5odG1sIHdoaWNoIHNob3VsZCBydW4gZXhhY3RseSB3aGF0IGl0IHdhbnRzIHRvIHJ1blxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmxvY2tzLmV4Y2VwdGlvbicpXG4gICAgICAgIC5wcm92aWRlcignZXhjZXB0aW9uSGFuZGxlcicsIGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcilcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xuXG4gICAgLyoqXG4gICAgICogTXVzdCBjb25maWd1cmUgdGhlIGV4Y2VwdGlvbiBoYW5kbGluZ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcigpIHtcbiAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICAgICAgYXBwRXJyb3JQcmVmaXg6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY29uZmlndXJlID0gZnVuY3Rpb24gKGFwcEVycm9yUHJlZml4KSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5hcHBFcnJvclByZWZpeCA9IGFwcEVycm9yUHJlZml4O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtjb25maWc6IHRoaXMuY29uZmlnfTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25maWcuJGluamVjdCA9IFsnJHByb3ZpZGUnXTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyZSBieSBzZXR0aW5nIGFuIG9wdGlvbmFsIHN0cmluZyB2YWx1ZSBmb3IgYXBwRXJyb3JQcmVmaXguXG4gICAgICogQWNjZXNzaWJsZSB2aWEgY29uZmlnLmFwcEVycm9yUHJlZml4ICh2aWEgY29uZmlnIHZhbHVlKS5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICRwcm92aWRlXG4gICAgICovXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gY29uZmlnKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmRlY29yYXRvcignJGV4Y2VwdGlvbkhhbmRsZXInLCBleHRlbmRFeGNlcHRpb25IYW5kbGVyKTtcbiAgICB9XG5cbiAgICBleHRlbmRFeGNlcHRpb25IYW5kbGVyLiRpbmplY3QgPSBbJyRkZWxlZ2F0ZScsICdleGNlcHRpb25IYW5kbGVyJywgJ2xvZ2dlciddO1xuXG4gICAgLyoqXG4gICAgICogRXh0ZW5kIHRoZSAkZXhjZXB0aW9uSGFuZGxlciBzZXJ2aWNlIHRvIGFsc28gZGlzcGxheSBhIHRvYXN0LlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gJGRlbGVnYXRlXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBleGNlcHRpb25IYW5kbGVyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBsb2dnZXJcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGRlY29yYXRlZCAkZXhjZXB0aW9uSGFuZGxlciBzZXJ2aWNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXh0ZW5kRXhjZXB0aW9uSGFuZGxlcigkZGVsZWdhdGUsIGV4Y2VwdGlvbkhhbmRsZXIsIGxvZ2dlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXhjZXB0aW9uLCBjYXVzZSkge1xuICAgICAgICAgICAgdmFyIGFwcEVycm9yUHJlZml4ID0gZXhjZXB0aW9uSGFuZGxlci5jb25maWcuYXBwRXJyb3JQcmVmaXggfHwgJyc7XG4gICAgICAgICAgICB2YXIgZXJyb3JEYXRhID0ge2V4Y2VwdGlvbjogZXhjZXB0aW9uLCBjYXVzZTogY2F1c2V9O1xuICAgICAgICAgICAgZXhjZXB0aW9uLm1lc3NhZ2UgPSBhcHBFcnJvclByZWZpeCArIGV4Y2VwdGlvbi5tZXNzYWdlO1xuICAgICAgICAgICAgJGRlbGVnYXRlKGV4Y2VwdGlvbiwgY2F1c2UpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb3VsZCBhZGQgdGhlIGVycm9yIHRvIGEgc2VydmljZSdzIGNvbGxlY3Rpb24sXG4gICAgICAgICAgICAgKiBhZGQgZXJyb3JzIHRvICRyb290U2NvcGUsIGxvZyBlcnJvcnMgdG8gcmVtb3RlIHdlYiBzZXJ2ZXIsXG4gICAgICAgICAgICAgKiBvciBsb2cgbG9jYWxseS4gT3IgdGhyb3cgaGFyZC4gSXQgaXMgZW50aXJlbHkgdXAgdG8geW91LlxuICAgICAgICAgICAgICogdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiAgICAgdGhyb3cgeyBtZXNzYWdlOiAnZXJyb3IgbWVzc2FnZSB3ZSBhZGRlZCcgfTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGV4Y2VwdGlvbi5tZXNzYWdlLCBlcnJvckRhdGEpO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG4iLCIvKiBqc2hpbnQgLVcxMTcsIC1XMDMwICovXG5kZXNjcmliZSgnYmxvY2tzLmV4Y2VwdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBleGNlcHRpb25IYW5kbGVyUHJvdmlkZXI7XG4gICAgdmFyIG1vY2tzID0ge1xuICAgICAgICBlcnJvck1lc3NhZ2U6ICdmYWtlIGVycm9yJyxcbiAgICAgICAgcHJlZml4OiAnW1RFU1RdOiAnXG4gICAgfTtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGJhcmQuYXBwTW9kdWxlKCdibG9ja3MuZXhjZXB0aW9uJywgZnVuY3Rpb24oX2V4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcl8pIHtcbiAgICAgICAgICAgIGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlciA9IF9leGNlcHRpb25IYW5kbGVyUHJvdmlkZXJfO1xuICAgICAgICB9KTtcbiAgICAgICAgYmFyZC5pbmplY3QoJyRyb290U2NvcGUnKTtcbiAgICB9KTtcblxuICAgIGJhcmQudmVyaWZ5Tm9PdXRzdGFuZGluZ0h0dHBSZXF1ZXN0cygpO1xuXG4gICAgZGVzY3JpYmUoJ2V4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgYSBkdW1teSB0ZXN0JywgaW5qZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KHRydWUpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlciBkZWZpbmVkJywgaW5qZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcikudG8uYmUuZGVmaW5lZDtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBjb25maWd1cmF0aW9uJywgaW5qZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlci5jb25maWcpLnRvLmJlLmRlZmluZWQ7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgY29uZmlndXJhdGlvbicsIGluamVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIuY29uZmlndXJlKS50by5iZS5kZWZpbmVkO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYXBwRXJyb3JQcmVmaXgnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyLmNvbmZpZ3VyZShtb2Nrcy5wcmVmaXgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBhcHBFcnJvclByZWZpeCBkZWZpbmVkJywgaW5qZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIuJGdldCgpLmNvbmZpZy5hcHBFcnJvclByZWZpeCkudG8uYmUuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGFwcEVycm9yUHJlZml4IHNldCBwcm9wZXJseScsIGluamVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyLiRnZXQoKS5jb25maWcuYXBwRXJyb3JQcmVmaXgpXG4gICAgICAgICAgICAgICAgICAgIC50by5lcXVhbChtb2Nrcy5wcmVmaXgpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHRocm93IGFuIGVycm9yIHdoZW4gZm9yY2VkJywgaW5qZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvblRoYXRXaWxsVGhyb3cpLnRvLnRocm93KCk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGl0KCdtYW51YWwgZXJyb3IgaXMgaGFuZGxlZCBieSBkZWNvcmF0b3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhjZXB0aW9uO1xuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlci5jb25maWd1cmUobW9ja3MucHJlZml4KTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvblRoYXRXaWxsVGhyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhjZXB0aW9uID0gZXg7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChleC5tZXNzYWdlKS50by5lcXVhbChtb2Nrcy5wcmVmaXggKyBtb2Nrcy5lcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGZ1bmN0aW9uVGhhdFdpbGxUaHJvdygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1vY2tzLmVycm9yTWVzc2FnZSk7XG4gICAgfVxufSk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdibG9ja3MuZXhjZXB0aW9uJylcbiAgICAgICAgLmZhY3RvcnkoJ2V4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBleGNlcHRpb24oJHEsIGxvZ2dlcikge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGNhdGNoZXI6IGNhdGNoZXJcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgZnVuY3Rpb24gY2F0Y2hlcihtZXNzYWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciB0aHJvd25EZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgbmV3TWVzc2FnZTtcbiAgICAgICAgICAgICAgICBpZiAoZS5kYXRhICYmIGUuZGF0YS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd25EZXNjcmlwdGlvbiA9ICdcXG4nICsgZS5kYXRhLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICBuZXdNZXNzYWdlID0gbWVzc2FnZSArIHRocm93bkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlLmRhdGEuZGVzY3JpcHRpb24gPSBuZXdNZXNzYWdlO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihuZXdNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2Jsb2Nrcy5leGNlcHRpb24nLCBbJ2Jsb2Nrcy5sb2dnZXInXSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYmxvY2tzLmxvZ2dlcicpXG4gICAgICAgIC5mYWN0b3J5KCdsb2dnZXInLCBsb2dnZXIpO1xuXG4gICAgbG9nZ2VyLiRpbmplY3QgPSBbJyRsb2cnLCAndG9hc3RyJ107XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBsb2dnZXIoJGxvZywgdG9hc3RyKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgc2hvd1RvYXN0czogdHJ1ZSxcblxuICAgICAgICAgICAgZXJyb3IgICA6IGVycm9yLFxuICAgICAgICAgICAgaW5mbyAgICA6IGluZm8sXG4gICAgICAgICAgICBzdWNjZXNzIDogc3VjY2VzcyxcbiAgICAgICAgICAgIHdhcm5pbmcgOiB3YXJuaW5nLFxuXG4gICAgICAgICAgICAvLyBzdHJhaWdodCB0byBjb25zb2xlOyBieXBhc3MgdG9hc3RyXG4gICAgICAgICAgICBsb2cgICAgIDogJGxvZy5sb2dcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSwgZGF0YSwgdGl0bGUpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtZXNzYWdlLCB0aXRsZSk7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdFcnJvcjogJyArIG1lc3NhZ2UsIGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5mbyhtZXNzYWdlLCBkYXRhLCB0aXRsZSkge1xuICAgICAgICAgICAgdG9hc3RyLmluZm8obWVzc2FnZSwgdGl0bGUpO1xuICAgICAgICAgICAgJGxvZy5pbmZvKCdJbmZvOiAnICsgbWVzc2FnZSwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKG1lc3NhZ2UsIGRhdGEsIHRpdGxlKSB7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhtZXNzYWdlLCB0aXRsZSk7XG4gICAgICAgICAgICAkbG9nLmluZm8oJ1N1Y2Nlc3M6ICcgKyBtZXNzYWdlLCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZSwgZGF0YSwgdGl0bGUpIHtcbiAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKG1lc3NhZ2UsIHRpdGxlKTtcbiAgICAgICAgICAgICRsb2cud2FybignV2FybmluZzogJyArIG1lc3NhZ2UsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYmxvY2tzLmxvZ2dlcicsIFtdKTtcbn0pKCk7XG4iLCIvKiBIZWxwIGNvbmZpZ3VyZSB0aGUgc3RhdGUtYmFzZSB1aS5yb3V0ZXIgKi9cbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2Jsb2Nrcy5yb3V0ZXInKVxuICAgICAgICAucHJvdmlkZXIoJ3JvdXRlckhlbHBlcicsIHJvdXRlckhlbHBlclByb3ZpZGVyKTtcblxuICAgIHJvdXRlckhlbHBlclByb3ZpZGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIHJvdXRlckhlbHBlclByb3ZpZGVyKCRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgZG9jVGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHJlc29sdmVBbHdheXM6IHt9XG4gICAgICAgIH07XG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG4gICAgICAgIHRoaXMuY29uZmlndXJlID0gZnVuY3Rpb24oY2ZnKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChjb25maWcsIGNmZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gUm91dGVySGVscGVyO1xuICAgICAgICBSb3V0ZXJIZWxwZXIuJGluamVjdCA9IFsnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJ2xvZ2dlciddO1xuICAgICAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAgICAgZnVuY3Rpb24gUm91dGVySGVscGVyKCRsb2NhdGlvbiwgJHJvb3RTY29wZSwgJHN0YXRlLCBsb2dnZXIpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGluZ1N0YXRlQ2hhbmdlRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBoYXNPdGhlcndpc2UgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBzdGF0ZUNvdW50cyA9IHtcbiAgICAgICAgICAgICAgICBlcnJvcnM6IDAsXG4gICAgICAgICAgICAgICAgY2hhbmdlczogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJlU3RhdGVzOiBjb25maWd1cmVTdGF0ZXMsXG4gICAgICAgICAgICAgICAgZ2V0U3RhdGVzOiBnZXRTdGF0ZXMsXG4gICAgICAgICAgICAgICAgc3RhdGVDb3VudHM6IHN0YXRlQ291bnRzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgZnVuY3Rpb24gY29uZmlndXJlU3RhdGVzKHN0YXRlcywgb3RoZXJ3aXNlUGF0aCkge1xuICAgICAgICAgICAgICAgIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvbmZpZy5yZXNvbHZlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHN0YXRlLmNvbmZpZy5yZXNvbHZlIHx8IHt9LCBjb25maWcucmVzb2x2ZUFsd2F5cyk7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlLnN0YXRlLCBzdGF0ZS5jb25maWcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChvdGhlcndpc2VQYXRoICYmICFoYXNPdGhlcndpc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzT3RoZXJ3aXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShvdGhlcndpc2VQYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJvdXRpbmdFcnJvcnMoKSB7XG4gICAgICAgICAgICAgICAgLy8gUm91dGUgY2FuY2VsbGF0aW9uOlxuICAgICAgICAgICAgICAgIC8vIE9uIHJvdXRpbmcgZXJyb3IsIGdvIHRvIHRoZSBkYXNoYm9hcmQuXG4gICAgICAgICAgICAgICAgLy8gUHJvdmlkZSBhbiBleGl0IGNsYXVzZSBpZiBpdCB0cmllcyB0byBkbyBpdCB0d2ljZS5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGluZ1N0YXRlQ2hhbmdlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNvdW50cy5lcnJvcnMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsaW5nU3RhdGVDaGFuZ2VFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdGluYXRpb24gPSAodG9TdGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b1N0YXRlLnRpdGxlIHx8IHRvU3RhdGUubmFtZSB8fCB0b1N0YXRlLmxvYWRlZFRlbXBsYXRlVXJsKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndW5rbm93biB0YXJnZXQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9ICdFcnJvciByb3V0aW5nIHRvICcgKyBkZXN0aW5hdGlvbiArICcuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvci5kYXRhIHx8ICcnKSArICcuIDxici8+JyArIChlcnJvci5zdGF0dXNUZXh0IHx8ICcnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzogJyArIChlcnJvci5zdGF0dXMgfHwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcobXNnLCBbdG9TdGF0ZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlUm91dGluZ0Vycm9ycygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZURvY1RpdGxlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlcygpIHsgcmV0dXJuICRzdGF0ZS5nZXQoKTsgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVEb2NUaXRsZSgpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZUNvdW50cy5jaGFuZ2VzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGluZ1N0YXRlQ2hhbmdlRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IGNvbmZpZy5kb2NUaXRsZSArICcgJyArICh0b1N0YXRlLnRpdGxlIHx8ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudGl0bGUgPSB0aXRsZTsgLy8gZGF0YSBiaW5kIHRvIDx0aXRsZT5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdibG9ja3Mucm91dGVyJywgW1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ2Jsb2Nrcy5sb2dnZXInXG4gICAgXSk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
