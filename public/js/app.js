(function(){
	"use strict";

	angular.module('app',
		[
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.routes',
		'app.config',
		'partialsModule'
		]);

	angular.module('app.routes', []);
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'angular-loading-bar']);
	angular.module('app.filters', []);
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.config', []);

})();

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
						templateUrl: getView('header')
					},
					footer: {
						templateUrl: getView('footer')
					},
					main: {}
				}
			})
			.state('app.landing', {
				url: '/',
				data: {},
				views: {
					'main@': {
						templateUrl: getView('landing')
					}
				}
			});

	}]);
})();

/*
 * Create references
 */
var gulp = require('gulp');
var pkg = require('./package.json');
var common = require('./common.js');

/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();

/*
 * Load common utilities for gulp
 */
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/*
 * Create comments for minified files
 */
var commentHeader = common.createComments(gutil);

/*
 * Could use a product/development switch.
 * Run `gulp --production`
 */
var type = gutil.env.production ? 'production' : 'development';
gutil.log( 'Building for', gutil.colors.magenta(type) );
gutil.beep();

/*
 * Lint the code
 */
gulp.task('jshint', function () {
    return gulp.src(pkg.paths.source.js)
        .pipe(plug.jshint('jshintrc.json'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});

/*
 * Minify and bundle the JavaScript
 */
gulp.task('bundlejs', ['jshint'], function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = {newLine: ';'};

    return gulp.src(pkg.paths.source.js)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.uglify())
        .pipe(plug.concat(bundlefile, opt))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dest.js))
        .pipe(plug.size({showFiles: true}));
});


/*
 * Minify and bundle the CSS
 */
gulp.task('bundlecss', function () {
    return gulp.src(pkg.paths.source.css)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.minifyCss({}))
        .pipe(plug.concat(pkg.name + ".min.css"))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dest.css))
        .pipe(plug.size({showFiles: true}));
});

/*
 * Compress images
 */
gulp.task('images', function () {
    return gulp.src(pkg.paths.source.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dest.images));
});

/*
 * Bundle the JS, CSS, and compress images.
 * Then copy files to production and show a toast.
 */
gulp.task('default', ['bundlejs', 'bundlecss', 'images'], function () {
    // Copy the CSS to prod
    return gulp.src(pkg.paths.dest.css + '/**/*')
        .pipe(gulp.dest(pkg.paths.production + '/content/'))

        // Copy the js files to prod
        .pipe(gulp.src(pkg.paths.dest.js + '/*.js'))
        .pipe(gulp.dest(pkg.paths.production + '/app/'))

        // Notify we are done
        .pipe(plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        }));
});

/*
 * Remove all files from the output folder
 */
gulp.task('cleanOutput', function(){
    return gulp.src([
            pkg.paths.dest.base,
            pkg.paths.production])
        .pipe(plug.clean({force: true}))
});
/*
 * Watch file and re-run the linter
 */
gulp.task('build-watcher', function() {
    var jsWatcher = gulp.watch(pkg.paths.source.js, ['jshint']);

    /*
     * Rebuild when any files changes
     */
//    gulp.watch([pkg.paths.source.css,
//        pkg.paths.source.js,
//        pkg.paths.source.images], ['default']);

    jsWatcher.on('change', function(event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'app.view1',
  'app.view2',
  'app.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap'      // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);

    // Handle routing errors and success events
    app.run(['$route', function ($route) {
        // Include $route to kick start the router.
    }]);
})();
// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function () {
    'use strict';
    
    var app = angular.module('app');

    // Configure by setting an optional string value for appErrorPrefix.
    // Accessible via config.appErrorPrefix (via config value).

    app.config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler',
            ['$delegate', 'config', 'logger', extendExceptionHandler]);
    }]);
    
    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, config, logger) {
        var appErrorPrefix = config.appErrorPrefix;
        var logError = logger.getLogFn('app', 'error');
        return function (exception, cause) {
            $delegate(exception, cause);
            if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) { return; }

            var errorData = { exception: exception, cause: cause };
            var msg = appErrorPrefix + exception.message;
            logError(msg, errorData, true);
        };
    }
})();
(function () {
    'use strict';

    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = 'breeze/Breeze';

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[HT Error] ', //Configure the exceptionHandler decorator
        docTitle: 'HotTowel: ',
        events: events,
        remoteServiceName: remoteServiceName,
        version: '2.1.0'
    };

    app.value('config', config);
    
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);
    
    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion
})();
(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }, {
                url: '/avengers',
                config: {
                    title: 'Avengers',
                    templateUrl: 'app/avengers/avengers.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Avengers'
                    }
                }
            }
        ];
    }
})();
document.write("It works.");
(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config(["$mdThemingProvider", function($mdThemingProvider) {
		/* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */
		$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('grey')
		.warnPalette('red');
	}]);

})();

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000/app/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};

'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/view1');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});

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

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.theme('warn')
						.action(action)
						.hideDelay(delay)
				);
			}
		};
	}]);
})();
(function () {
    'use strict';
    var controllerId = 'avengers';
    angular.module('app')
        .controller(controllerId,
            ['common', 'datacontext', avengers]);

    function avengers(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.avengers = [];
        vm.maa = [];
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengersCast(), getMAA()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Avengers View');
                });
        }

        function getMAA() {
            return datacontext.getMAA().then(function (data) {
//                vm.maa = data.data[0].data.results;
                vm.maa = data;
                return vm.maa;
            });
        }

        function getAvengersCast() {
            return datacontext.getAvengersCast().then(function (data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }
})();
(function () {
    'use strict';

    var bootstrapModule = angular.module('common.bootstrap', ['ui.bootstrap']);

    bootstrapModule.factory('bootstrap.dialog', ['$modal', '$templateCache', modalDialog]);

    function modalDialog($modal, $templateCache) {
        var service = {
            deleteDialog: deleteDialog,
            confirmationDialog: confirmationDialog
        };

        $templateCache.put('modalDialog.tpl.html',
            '<div>' +
                '    <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" ' +
                '            aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
                '        <h3>{{title}}</h3>' +
                '    </div>' +
                '    <div class="modal-body">' +
                '        <p>{{message}}</p>' +
                '    </div>' +
                '    <div class="modal-footer">' +
                '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
                '        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>' +
                '    </div>' +
                '</div>');

        return service;

        function deleteDialog(itemName) {
            var title = 'Confirm Delete';
            itemName = itemName || 'item';
            var msg = 'Delete ' + itemName + '?';

            return confirmationDialog(title, msg);
        }

        function confirmationDialog(title, msg, okText, cancelText) {

            var modalOptions = {
                templateUrl: 'modalDialog.tpl.html',
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText
                        };
                    }
                }
            };

            return $modal.open(modalOptions).result;
        }
    }

    var ModalInstance = ['$scope', '$modalInstance', 'options',
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || 'Title';
            $scope.message = options.message || '';
            $scope.okText = options.okText || 'OK';
            $scope.cancelText = options.cancelText || 'Cancel';
            $scope.ok = function () {
                $modalInstance.close('ok');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }];
})();
(function () {
    'use strict';

    // Define the common module
    // Contains services:
    //  - common
    //  - logger
    //  - spinner
    var commonModule = angular.module('common', []);

    // Must configure the common service and set its
    // events via the commonConfigProvider
    commonModule.provider('commonConfig', function () {
        this.config = {
            // These are the properties we need to set
            //controllerActivateSuccessEvent: '',
            //spinnerToggleEvent: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    commonModule.factory('common',
        ['$q', '$rootScope', '$timeout', 'commonConfig', 'logger', common]);

    function common($q, $rootScope, $timeout, commonConfig, logger) {
        var throttles = {};

        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            // generic
            activateController: activateController,
            createSearchThrottle: createSearchThrottle,
            debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            logger: logger, // for accessibility
            textContains: textContains
        };

        return service;

        function activateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {
                var data = { controllerId: controllerId };
                $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
            });
        }

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function createSearchThrottle(viewmodel, list, filteredList, filter, delay) {
            // After a delay, search a viewmodel's list using
            // a filter function, and return a filteredList.

            // custom delay or use default
            delay = +delay || 300;
            // if only vm and list parameters were passed, set others by naming convention
            if (!filteredList) {
                // assuming list is named sessions, filteredList is filteredSessions
                filteredList = 'filtered' + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
                // filter function is named sessionFilter
                filter = list + 'Filter'; // function in string form
            }

            // create the filtering function we will call from here
            var filterFn = function () {
                // translates to ...
                // vm.filteredSessions
                //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
                viewmodel[filteredList] = viewmodel[list].filter(function (item) {
                    return viewmodel[filter](item);
                });
            };

            return (function () {
                // Wrapped in outer IFFE so we can use closure
                // over filterInputTimeout which references the timeout
                var filterInputTimeout;

                // return what becomes the 'applyFilter' function in the controller
                return function (searchNow) {
                    if (filterInputTimeout) {
                        $timeout.cancel(filterInputTimeout);
                        filterInputTimeout = null;
                    }
                    if (searchNow || !delay) {
                        filterFn();
                    } else {
                        filterInputTimeout = $timeout(filterFn, delay);
                    }
                };
            })();
        }

        function debouncedThrottle(key, callback, delay, immediate) {
            // Perform some action (callback) after a delay.
            // Track the callback by key, so if the same callback
            // is issued again, restart the delay.

            var defaultDelay = 1000;
            delay = delay || defaultDelay;
            if (throttles[key]) {
                $timeout.cancel(throttles[key]);
                throttles[key] = undefined;
            }
            if (immediate) {
                callback();
            } else {
                throttles[key] = $timeout(callback, delay);
            }
        }

        function isNumber(val) {
            // negative or positive
            return (/^[-]?\d+$/).test(val);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }
    }
})();
(function () {
    'use strict';

    angular.module('common').factory('logger', ['$log', logger]);

    function logger($log) {
        var service = {
            getLogFn: getLogFn,
            log: log,
            logError: logError,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        function getLogFn(moduleId, fnName) {
            fnName = fnName || 'log';
            switch (fnName.toLowerCase()) { // convert aliases
                case 'success':
                    fnName = 'logSuccess';
                    break;
                case 'error':
                    fnName = 'logError';
                    break;
                case 'warn':
                    fnName = 'logWarning';
                    break;
                case 'warning':
                    fnName = 'logWarning';
                    break;
            }

            var logFn = service[fnName] || service.log;
            return function (msg, data, showToast) {
                logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);
            };
        }

        function log(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'info');
        }

        function logWarning(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'warning');
        }

        function logSuccess(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'success');
        }

        function logError(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'error');
        }

        function logIt(message, data, source, showToast, toastType) {
            var write = (toastType === 'error') ? $log.error : $log.log;
            source = source ? '[' + source + '] ' : '';
            write(source, message, data);
            if (showToast) {
                if (toastType === 'error') {
                    toastr.error(message);
                } else if (toastType === 'warning') {
                    toastr.warning(message);
                } else if (toastType === 'success') {
                    toastr.success(message);
                } else {
                    toastr.info(message);
                }
            }
        }
    }
})();
(function () {
    'use strict';

    // Must configure the common service and set its
    // events via the commonConfigProvider

    angular.module('common')
        .factory('spinner', ['common', 'commonConfig', spinner]);

    function spinner(common, commonConfig) {
        var service = {
            spinnerHide: spinnerHide,
            spinnerShow: spinnerShow
        };

        return service;

        function spinnerHide() {
            spinnerToggle(false);
        }

        function spinnerShow() {
            spinnerToggle(true);
        }

        function spinnerToggle(show) {
            common.$broadcast(commonConfig.config.spinnerToggleEvent, { show: show });
        }
    }
})();
(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.news = {
            title: 'Marvel Avengers',
            description: 'Marvel Avengers 2 is now in production!'
        };
        vm.avengerCount = 0;
        vm.avengers = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getAvengerCount(), getAvengersCast()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getAvengerCount() {
            return datacontext.getAvengerCount().then(function (data) {
                vm.avengerCount = data;
                return vm.avengerCount;
            });
        }

        function getAvengersCast() {
            return datacontext.getAvengersCast().then(function (data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }
})();
(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', 'config', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;
        vm.title = 'Grunt and Gulp';
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate() {
            logSuccess('Grunt and Gulp with Angular loaded!', null, true);
            common.activateController([], controllerId);
        }

        function toggleSpinner(on) { vm.isBusy = on; }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { toggleSpinner(true); }
        );

        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { toggleSpinner(false); }
        );

        $rootScope.$on(events.spinnerToggle,
            function (data) { toggleSpinner(data.show); }
        );
    }
})();
(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$route', 'routes', sidebar]);

    function sidebar($route, routes) {
        var vm = this;

        vm.isCurrent = isCurrent;

        activate();

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
})();
(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app')
        .factory(serviceId, ['$http', 'common', datacontext]);

    function datacontext($http, common) {
        var $q = common.$q;

        var service = {
            getAvengersCast: getAvengersCast,
            getAvengerCount: getAvengerCount,
            getMAA: getMAA
        };

        return service;

        function getMAA() {
            return $http({ method: 'GET', url: '/data/maa'})
                .then(function(data, status, headers, config) {
                    return data.data[0].data.results;
                }, function(error){
                    console.log(error);
                    return error;
                });
//            return $q.when(results);
//            var results = {data: null};
//            $http({ method: 'GET', url: '/maa'})
//                .success(function(data, status, headers, config) {
//                    results.data = data[0].data.results;
//                })
//            return $q.when(results);
        }

        function getAvengerCount() {
            var count = 0;
            return getAvengersCast().then(function (data) {
                count = data.length;
                return $q.when(count);
            });
        }

        function getAvengersCast() {
            var cast = [
                {name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man'},
                {name: 'Chris Hemsworth', character: 'Thor'},
                {name: 'Chris Evans', character: 'Steve Rogers / Captain America'},
                {name: 'Mark Ruffalo', character: 'Bruce Banner / The Hulk'},
                {name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow'},
                {name: 'Jeremy Renner', character: 'Clint Barton / Hawkeye'},
                {name: 'Gwyneth Paltrow', character: 'Pepper Potts'},
                {name: 'Samuel L. Jackson', character: 'Nick Fury'},
                {name: 'Paul Bettany', character: 'Jarvis'},
                {name: 'Tom Hiddleston', character: 'Loki'},
                {name: 'Clark Gregg', character: 'Agent Phil Coulson'}
            ];
            return $q.when(cast);
        }
    }
})();
(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);

    app.directive('ccSidebar', function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
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
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });


    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(closeEl);

            function closeEl(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    if ($win.scrollTop() > 300) {
                        element.slideDown();
                    } else {
                        element.slideUp();
                    }
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: 'app/layout/widgetheader.html',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });
})();
(function () {
    'use strict';

    var bootstrapModule = angular.module('common.bootstrap', ['ui.bootstrap']);

    bootstrapModule.factory('bootstrap.dialog', ['$modal', '$templateCache', modalDialog]);

    function modalDialog($modal, $templateCache) {
        var service = {
            deleteDialog: deleteDialog,
            confirmationDialog: confirmationDialog
        };

        $templateCache.put('modalDialog.tpl.html',
            '<div>' +
                '    <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" ' +
                '            aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
                '        <h3>{{title}}</h3>' +
                '    </div>' +
                '    <div class="modal-body">' +
                '        <p>{{message}}</p>' +
                '    </div>' +
                '    <div class="modal-footer">' +
                '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
                '        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>' +
                '    </div>' +
                '</div>');

        return service;

        function deleteDialog(itemName) {
            var title = 'Confirm Delete';
            itemName = itemName || 'item';
            var msg = 'Delete ' + itemName + '?';

            return confirmationDialog(title, msg);
        }

        function confirmationDialog(title, msg, okText, cancelText) {

            var modalOptions = {
                templateUrl: 'modalDialog.tpl.html',
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText
                        };
                    }
                }
            };

            return $modal.open(modalOptions).result;
        }
    }

    var ModalInstance = ['$scope', '$modalInstance', 'options',
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || 'Title';
            $scope.message = options.message || '';
            $scope.okText = options.okText || 'OK';
            $scope.cancelText = options.cancelText || 'Cancel';
            $scope.ok = function () {
                $modalInstance.close('ok');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }];
})();
'use strict';

angular.module('myApp.version.interpolate-filter', [])

.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);

'use strict';

describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('interpolate filter', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });
});

'use strict';

angular.module('myApp.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

'use strict';

describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('app-version directive', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});

'use strict';

angular.module('myApp.version', [
  'myApp.version.interpolate-filter',
  'myApp.version.version-directive'
])

.value('version', '0.1');

'use strict';

describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

(function(){
    "use strict";

    angular.module('app.controllers').controller('FooterController', FooterController);

    function FooterController(){
        //
    }

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('HeaderController', HeaderController);

    function HeaderController(){
        //
    }

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('LandingController', LandingController);

	function LandingController() {
		var vm = this;

		vm.laravel_description = 'Response macros integrated with your Angular app';
		vm.angular_description = 'Query your API without worrying about validations';

		/*
		This is a terrible temporary hack,
		to fix layout issues with flex on iOS (chrome & safari)
		Make sure to remove this when you modify this demo
		*/
		vm.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	}

})();

'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);
'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});
'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);
'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view2'));

  describe('view2 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('View2Ctrl');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJfc2FmZS9ndWxwZmlsZS5qcyIsImFwcC9hcHAuanMiLCJhcHAvY29uZmlnLmV4Y2VwdGlvbkhhbmRsZXIuanMiLCJhcHAvY29uZmlnLmpzIiwiYXBwL2NvbmZpZy5yb3V0ZS5qcyIsImFwcC9lbnRyeS5qcyIsImNvbmZpZy9sb2FkaW5nX2Jhci5jb25maWcuanMiLCJjb25maWcvdGhlbWUuY29uZmlnLmpzIiwiZTJlLXRlc3RzL3Byb3RyYWN0b3IuY29uZi5qcyIsImUyZS10ZXN0cy9zY2VuYXJpb3MuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuZmlsdGVyLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5maWx0ZXIuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuZmlsdGVyLmpzIiwiZmlsdGVycy90cnVuY2F0ZV93b3Jkcy5qcyIsImZpbHRlcnMvdHJ1c3RfaHRtbC5maWx0ZXIuanMiLCJmaWx0ZXJzL3VjZmlyc3QuZmlsdGVyLmpzIiwic2VydmljZXMvQVBJLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kaWFsb2cuc2VydmljZS5qcyIsInNlcnZpY2VzL3RvYXN0LnNlcnZpY2UuanMiLCJhcHAvYXZlbmdlcnMvYXZlbmdlcnMuanMiLCJhcHAvY29tbW9uL2Jvb3RzdHJhcC5kaWFsb2cuanMiLCJhcHAvY29tbW9uL2NvbW1vbi5qcyIsImFwcC9jb21tb24vbG9nZ2VyLmpzIiwiYXBwL2NvbW1vbi9zcGlubmVyLmpzIiwiYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuanMiLCJhcHAvbGF5b3V0L3NoZWxsLmpzIiwiYXBwL2xheW91dC9zaWRlYmFyLmpzIiwiYXBwL3NlcnZpY2VzL2RhdGFjb250ZXh0LmpzIiwiYXBwL3NlcnZpY2VzL2RpcmVjdGl2ZXMuanMiLCJhcHAvY29tbW9uL2Jvb3RzdHJhcC9ib290c3RyYXAuZGlhbG9nLmpzIiwiYXBwL2NvbXBvbmVudHMvdmVyc2lvbi9pbnRlcnBvbGF0ZS1maWx0ZXIuanMiLCJhcHAvY29tcG9uZW50cy92ZXJzaW9uL2ludGVycG9sYXRlLWZpbHRlcl90ZXN0LmpzIiwiYXBwL2NvbXBvbmVudHMvdmVyc2lvbi92ZXJzaW9uLWRpcmVjdGl2ZS5qcyIsImFwcC9jb21wb25lbnRzL3ZlcnNpb24vdmVyc2lvbi1kaXJlY3RpdmVfdGVzdC5qcyIsImFwcC9jb21wb25lbnRzL3ZlcnNpb24vdmVyc2lvbi5qcyIsImFwcC9jb21wb25lbnRzL3ZlcnNpb24vdmVyc2lvbl90ZXN0LmpzIiwiYXBwL3ZpZXdzL2Zvb3Rlci9mb290ZXIuY29udHJvbGxlci5qcyIsImFwcC92aWV3cy9oZWFkZXIvaGVhZGVyLmNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvbGFuZGluZy9sYW5kaW5nLmNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvdmlldzEvdmlldzEuanMiLCJhcHAvdmlld3MvdmlldzEvdmlldzFfdGVzdC5qcyIsImFwcC92aWV3cy92aWV3Mi92aWV3Mi5qcyIsImFwcC92aWV3cy92aWV3Mi92aWV3Ml90ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztDQUdBLFFBQUEsT0FBQSxjQUFBO0NBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsYUFBQSxjQUFBLGFBQUEsZUFBQTtDQUNBLFFBQUEsT0FBQSxlQUFBO0NBQ0EsUUFBQSxPQUFBLGdCQUFBO0NBQ0EsUUFBQSxPQUFBLGtCQUFBO0NBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsU0FBQSxnQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxpQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxRQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7OztJQUdBLE1BQUEsZUFBQTtJQUNBLEtBQUE7SUFDQSxNQUFBO0lBQ0EsT0FBQTtLQUNBLFNBQUE7TUFDQSxhQUFBLFFBQUE7Ozs7Ozs7Ozs7O0FDMUJBLElBQUEsT0FBQSxRQUFBO0FBQ0EsSUFBQSxNQUFBLFFBQUE7QUFDQSxJQUFBLFNBQUEsUUFBQTs7Ozs7QUFLQSxJQUFBLGtCQUFBLFFBQUE7QUFDQSxJQUFBLE9BQUE7Ozs7O0FBS0EsSUFBQSxRQUFBLEtBQUEsVUFBQSxDQUFBLFVBQUEsT0FBQSxPQUFBOzs7OztBQUtBLElBQUEsZ0JBQUEsT0FBQSxlQUFBOzs7Ozs7QUFNQSxJQUFBLE9BQUEsTUFBQSxJQUFBLGFBQUEsZUFBQTtBQUNBLE1BQUEsS0FBQSxnQkFBQSxNQUFBLE9BQUEsUUFBQTtBQUNBLE1BQUE7Ozs7O0FBS0EsS0FBQSxLQUFBLFVBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBLE9BQUE7O1NBRUEsS0FBQSxLQUFBLE9BQUEsU0FBQTs7Ozs7O0FBTUEsS0FBQSxLQUFBLFlBQUEsQ0FBQSxXQUFBLFlBQUE7SUFDQSxJQUFBLGFBQUEsSUFBQSxPQUFBO0lBQ0EsSUFBQSxNQUFBLENBQUEsU0FBQTs7SUFFQSxPQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsT0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLENBQUEsV0FBQTtTQUNBLEtBQUEsS0FBQTtTQUNBLEtBQUEsS0FBQSxPQUFBLFlBQUE7U0FDQSxLQUFBLEtBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxLQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsQ0FBQSxXQUFBOzs7Ozs7O0FBT0EsS0FBQSxLQUFBLGFBQUEsWUFBQTtJQUNBLE9BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxPQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsQ0FBQSxXQUFBO1NBQ0EsS0FBQSxLQUFBLFVBQUE7U0FDQSxLQUFBLEtBQUEsT0FBQSxJQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUEsT0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxLQUFBO1NBQ0EsS0FBQSxLQUFBLEtBQUEsQ0FBQSxXQUFBOzs7Ozs7QUFNQSxLQUFBLEtBQUEsVUFBQSxZQUFBO0lBQ0EsT0FBQSxLQUFBLElBQUEsSUFBQSxNQUFBLE9BQUE7U0FDQSxLQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsQ0FBQSxtQkFBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxLQUFBOzs7Ozs7O0FBT0EsS0FBQSxLQUFBLFdBQUEsQ0FBQSxZQUFBLGFBQUEsV0FBQSxZQUFBOztJQUVBLE9BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUE7U0FDQSxLQUFBLEtBQUEsS0FBQSxJQUFBLE1BQUEsYUFBQTs7O1NBR0EsS0FBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQTtTQUNBLEtBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxhQUFBOzs7U0FHQSxLQUFBLEtBQUEsT0FBQTtZQUNBLFFBQUE7WUFDQSxTQUFBOzs7Ozs7O0FBT0EsS0FBQSxLQUFBLGVBQUEsVUFBQTtJQUNBLE9BQUEsS0FBQSxJQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUE7WUFDQSxJQUFBLE1BQUE7U0FDQSxLQUFBLEtBQUEsTUFBQSxDQUFBLE9BQUE7Ozs7O0FBS0EsS0FBQSxLQUFBLGlCQUFBLFdBQUE7SUFDQSxJQUFBLFlBQUEsS0FBQSxNQUFBLElBQUEsTUFBQSxPQUFBLElBQUEsQ0FBQTs7Ozs7Ozs7O0lBU0EsVUFBQSxHQUFBLFVBQUEsU0FBQSxPQUFBO1FBQ0EsUUFBQSxJQUFBLGNBQUEsTUFBQSxPQUFBLFVBQUEsTUFBQSxPQUFBOzs7OztBQzNIQTs7O0FBR0EsUUFBQSxPQUFBLFNBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQSxPQUFBLENBQUEsa0JBQUEsU0FBQSxnQkFBQTtFQUNBLGVBQUEsVUFBQSxDQUFBLFlBQUE7O0FBRUEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7O1FBR0E7Ozs7SUFJQSxJQUFBLElBQUEsQ0FBQSxVQUFBLFVBQUEsUUFBQTs7Ozs7O0FDNUJBLENBQUEsWUFBQTtJQUNBOztJQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7Ozs7O0lBS0EsSUFBQSxPQUFBLENBQUEsWUFBQSxVQUFBLFVBQUE7UUFDQSxTQUFBLFVBQUE7WUFDQSxDQUFBLGFBQUEsVUFBQSxVQUFBOzs7O0lBSUEsU0FBQSx1QkFBQSxXQUFBLFFBQUEsUUFBQTtRQUNBLElBQUEsaUJBQUEsT0FBQTtRQUNBLElBQUEsV0FBQSxPQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLE9BQUE7WUFDQSxVQUFBLFdBQUE7WUFDQSxJQUFBLGtCQUFBLFVBQUEsUUFBQSxRQUFBLG9CQUFBLEdBQUEsRUFBQTs7WUFFQSxJQUFBLFlBQUEsRUFBQSxXQUFBLFdBQUEsT0FBQTtZQUNBLElBQUEsTUFBQSxpQkFBQSxVQUFBO1lBQ0EsU0FBQSxLQUFBLFdBQUE7Ozs7QUN6QkEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTs7O0lBR0EsT0FBQSxRQUFBLFVBQUE7SUFDQSxPQUFBLFFBQUEsZ0JBQUE7OztJQUdBLElBQUEsb0JBQUE7O0lBRUEsSUFBQSxTQUFBO1FBQ0EsMkJBQUE7UUFDQSxlQUFBOzs7SUFHQSxJQUFBLFNBQUE7UUFDQSxnQkFBQTtRQUNBLFVBQUE7UUFDQSxRQUFBO1FBQ0EsbUJBQUE7UUFDQSxTQUFBOzs7SUFHQSxJQUFBLE1BQUEsVUFBQTs7SUFFQSxJQUFBLE9BQUEsQ0FBQSxnQkFBQSxVQUFBLGNBQUE7O1FBRUEsSUFBQSxhQUFBLGNBQUE7WUFDQSxhQUFBLGFBQUE7Ozs7O0lBS0EsSUFBQSxPQUFBLENBQUEsd0JBQUEsVUFBQSxLQUFBO1FBQ0EsSUFBQSxPQUFBLGlDQUFBLE9B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QUNBLElBQUEsTUFBQSxZQUFBLFdBQUE7O1lBRUEsT0FBQSxtQkFBQSxPQUFBOzs7UUFHQSxTQUFBLG1CQUFBLE9BQUEsS0FBQSxRQUFBLFlBQUE7O1lBRUEsSUFBQSxlQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxVQUFBO2dCQUNBLFNBQUE7b0JBQ0EsU0FBQSxZQUFBO3dCQUNBLE9BQUE7NEJBQ0EsT0FBQTs0QkFDQSxTQUFBOzRCQUNBLFFBQUE7NEJBQ0EsWUFBQTs7Ozs7O1lBTUEsT0FBQSxPQUFBLEtBQUEsY0FBQTs7OztJQUlBLElBQUEsZ0JBQUEsQ0FBQSxVQUFBLGtCQUFBO1FBQ0EsVUFBQSxRQUFBLGdCQUFBLFNBQUE7WUFDQSxPQUFBLFFBQUEsUUFBQSxTQUFBO1lBQ0EsT0FBQSxVQUFBLFFBQUEsV0FBQTtZQUNBLE9BQUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBLGFBQUEsUUFBQSxjQUFBO1lBQ0EsT0FBQSxLQUFBLFlBQUE7Z0JBQ0EsZUFBQSxNQUFBOztZQUVBLE9BQUEsU0FBQSxZQUFBO2dCQUNBLGVBQUEsUUFBQTs7OztBQ3ZFQSxDQUFBLFlBQUE7SUFDQTs7Ozs7OztJQU9BLElBQUEsZUFBQSxRQUFBLE9BQUEsVUFBQTs7OztJQUlBLGFBQUEsU0FBQSxnQkFBQSxZQUFBO1FBQ0EsS0FBQSxTQUFBOzs7Ozs7UUFNQSxLQUFBLE9BQUEsWUFBQTtZQUNBLE9BQUE7Z0JBQ0EsUUFBQSxLQUFBOzs7OztJQUtBLGFBQUEsUUFBQTtRQUNBLENBQUEsTUFBQSxjQUFBLFlBQUEsZ0JBQUEsVUFBQTs7SUFFQSxTQUFBLE9BQUEsSUFBQSxZQUFBLFVBQUEsY0FBQSxRQUFBO1FBQ0EsSUFBQSxZQUFBOztRQUVBLElBQUEsVUFBQTs7WUFFQSxZQUFBO1lBQ0EsSUFBQTtZQUNBLFVBQUE7O1lBRUEsb0JBQUE7WUFDQSxzQkFBQTtZQUNBLG1CQUFBO1lBQ0EsVUFBQTtZQUNBLFFBQUE7WUFDQSxjQUFBOzs7UUFHQSxPQUFBOztRQUVBLFNBQUEsbUJBQUEsVUFBQSxjQUFBO1lBQ0EsT0FBQSxHQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsV0FBQTtnQkFDQSxJQUFBLE9BQUEsRUFBQSxjQUFBO2dCQUNBLFdBQUEsYUFBQSxPQUFBLGdDQUFBOzs7O1FBSUEsU0FBQSxhQUFBO1lBQ0EsT0FBQSxXQUFBLFdBQUEsTUFBQSxZQUFBOzs7UUFHQSxTQUFBLHFCQUFBLFdBQUEsTUFBQSxjQUFBLFFBQUEsT0FBQTs7Ozs7WUFLQSxRQUFBLENBQUEsU0FBQTs7WUFFQSxJQUFBLENBQUEsY0FBQTs7Z0JBRUEsZUFBQSxhQUFBLEtBQUEsR0FBQSxnQkFBQSxLQUFBLE9BQUEsR0FBQTs7Z0JBRUEsU0FBQSxPQUFBOzs7O1lBSUEsSUFBQSxXQUFBLFlBQUE7Ozs7Z0JBSUEsVUFBQSxnQkFBQSxVQUFBLE1BQUEsT0FBQSxVQUFBLE1BQUE7b0JBQ0EsT0FBQSxVQUFBLFFBQUE7Ozs7WUFJQSxPQUFBLENBQUEsWUFBQTs7O2dCQUdBLElBQUE7OztnQkFHQSxPQUFBLFVBQUEsV0FBQTtvQkFDQSxJQUFBLG9CQUFBO3dCQUNBLFNBQUEsT0FBQTt3QkFDQSxxQkFBQTs7b0JBRUEsSUFBQSxhQUFBLENBQUEsT0FBQTt3QkFDQTsyQkFDQTt3QkFDQSxxQkFBQSxTQUFBLFVBQUE7Ozs7OztRQU1BLFNBQUEsa0JBQUEsS0FBQSxVQUFBLE9BQUEsV0FBQTs7Ozs7WUFLQSxJQUFBLGVBQUE7WUFDQSxRQUFBLFNBQUE7WUFDQSxJQUFBLFVBQUEsTUFBQTtnQkFDQSxTQUFBLE9BQUEsVUFBQTtnQkFDQSxVQUFBLE9BQUE7O1lBRUEsSUFBQSxXQUFBO2dCQUNBO21CQUNBO2dCQUNBLFVBQUEsT0FBQSxTQUFBLFVBQUE7Ozs7UUFJQSxTQUFBLFNBQUEsS0FBQTs7WUFFQSxPQUFBLENBQUEsYUFBQSxLQUFBOzs7UUFHQSxTQUFBLGFBQUEsTUFBQSxZQUFBO1lBQ0EsT0FBQSxRQUFBLENBQUEsTUFBQSxLQUFBLGNBQUEsUUFBQSxXQUFBOzs7O0FDL0hBLENBQUEsWUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxVQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUE7O0lBRUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxJQUFBLFVBQUE7WUFDQSxVQUFBO1lBQ0EsS0FBQTtZQUNBLFVBQUE7WUFDQSxZQUFBO1lBQ0EsWUFBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLFNBQUEsVUFBQSxRQUFBO1lBQ0EsU0FBQSxVQUFBO1lBQ0EsUUFBQSxPQUFBO2dCQUNBLEtBQUE7b0JBQ0EsU0FBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLFNBQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxTQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsU0FBQTtvQkFDQTs7O1lBR0EsSUFBQSxRQUFBLFFBQUEsV0FBQSxRQUFBO1lBQ0EsT0FBQSxVQUFBLEtBQUEsTUFBQSxXQUFBO2dCQUNBLE1BQUEsS0FBQSxNQUFBLFVBQUEsQ0FBQSxjQUFBLGFBQUEsT0FBQTs7OztRQUlBLFNBQUEsSUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBOzs7UUFHQSxTQUFBLFdBQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTs7O1FBR0EsU0FBQSxXQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7WUFDQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7OztRQUdBLFNBQUEsU0FBQSxTQUFBLE1BQUEsUUFBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBOzs7UUFHQSxTQUFBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQSxXQUFBO1lBQ0EsSUFBQSxRQUFBLENBQUEsY0FBQSxXQUFBLEtBQUEsUUFBQSxLQUFBO1lBQ0EsU0FBQSxTQUFBLE1BQUEsU0FBQSxPQUFBO1lBQ0EsTUFBQSxRQUFBLFNBQUE7WUFDQSxJQUFBLFdBQUE7Z0JBQ0EsSUFBQSxjQUFBLFNBQUE7b0JBQ0EsT0FBQSxNQUFBO3VCQUNBLElBQUEsY0FBQSxXQUFBO29CQUNBLE9BQUEsUUFBQTt1QkFDQSxJQUFBLGNBQUEsV0FBQTtvQkFDQSxPQUFBLFFBQUE7dUJBQ0E7b0JBQ0EsT0FBQSxLQUFBOzs7Ozs7QUNuRUEsQ0FBQSxZQUFBO0lBQ0E7Ozs7O0lBS0EsUUFBQSxPQUFBO1NBQ0EsUUFBQSxXQUFBLENBQUEsVUFBQSxnQkFBQTs7SUFFQSxTQUFBLFFBQUEsUUFBQSxjQUFBO1FBQ0EsSUFBQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLGFBQUE7OztRQUdBLE9BQUE7O1FBRUEsU0FBQSxjQUFBO1lBQ0EsY0FBQTs7O1FBR0EsU0FBQSxjQUFBO1lBQ0EsY0FBQTs7O1FBR0EsU0FBQSxjQUFBLE1BQUE7WUFDQSxPQUFBLFdBQUEsYUFBQSxPQUFBLG9CQUFBLEVBQUEsTUFBQTs7OztBQzFCQSxDQUFBLFlBQUE7SUFDQTtJQUNBLElBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQSxPQUFBLFdBQUEsY0FBQSxDQUFBLFVBQUEsZUFBQTs7SUFFQSxTQUFBLFVBQUEsUUFBQSxhQUFBO1FBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsTUFBQSxTQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQTtZQUNBLE9BQUE7WUFDQSxhQUFBOztRQUVBLEdBQUEsZUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsUUFBQTs7UUFFQTs7UUFFQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFdBQUEsQ0FBQSxtQkFBQTtZQUNBLE9BQUEsbUJBQUEsVUFBQTtpQkFDQSxLQUFBLFlBQUEsRUFBQSxJQUFBOzs7UUFHQSxTQUFBLGtCQUFBO1lBQ0EsT0FBQSxZQUFBLGtCQUFBLEtBQUEsVUFBQSxNQUFBO2dCQUNBLEdBQUEsZUFBQTtnQkFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxTQUFBLGtCQUFBO1lBQ0EsT0FBQSxZQUFBLGtCQUFBLEtBQUEsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxPQUFBLEdBQUE7Ozs7O0FDcENBLENBQUEsWUFBQTtJQUNBOztJQUVBLElBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQSxPQUFBLFdBQUE7UUFDQSxDQUFBLGNBQUEsVUFBQSxVQUFBOztJQUVBLFNBQUEsTUFBQSxZQUFBLFFBQUEsUUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLElBQUEsYUFBQSxPQUFBLE9BQUEsU0FBQSxjQUFBO1FBQ0EsSUFBQSxTQUFBLE9BQUE7UUFDQSxHQUFBLFFBQUE7UUFDQSxHQUFBLGNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLGlCQUFBO1lBQ0EsUUFBQTtZQUNBLE9BQUE7WUFDQSxRQUFBO1lBQ0EsT0FBQTtZQUNBLE9BQUE7WUFDQSxTQUFBO1lBQ0EsT0FBQTtZQUNBLE9BQUE7OztRQUdBOztRQUVBLFNBQUEsV0FBQTtZQUNBLFdBQUEsdUNBQUEsTUFBQTtZQUNBLE9BQUEsbUJBQUEsSUFBQTs7O1FBR0EsU0FBQSxjQUFBLElBQUEsRUFBQSxHQUFBLFNBQUE7O1FBRUEsV0FBQSxJQUFBO1lBQ0EsVUFBQSxPQUFBLE1BQUEsU0FBQSxFQUFBLGNBQUE7OztRQUdBLFdBQUEsSUFBQSxPQUFBO1lBQ0EsVUFBQSxNQUFBLEVBQUEsY0FBQTs7O1FBR0EsV0FBQSxJQUFBLE9BQUE7WUFDQSxVQUFBLE1BQUEsRUFBQSxjQUFBLEtBQUE7Ozs7QUMzQ0EsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxlQUFBO0lBQ0EsUUFBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLENBQUEsVUFBQSxVQUFBOztJQUVBLFNBQUEsUUFBQSxRQUFBLFFBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQSxFQUFBOztRQUVBLFNBQUEsZUFBQTtZQUNBLEdBQUEsWUFBQSxPQUFBLE9BQUEsU0FBQSxHQUFBO2dCQUNBLE9BQUEsRUFBQSxPQUFBLFlBQUEsRUFBQSxPQUFBLFNBQUE7ZUFDQSxLQUFBLFNBQUEsSUFBQSxJQUFBO2dCQUNBLE9BQUEsR0FBQSxPQUFBLFNBQUEsTUFBQSxHQUFBLE9BQUEsU0FBQTs7OztRQUlBLFNBQUEsVUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE1BQUEsT0FBQSxTQUFBLENBQUEsT0FBQSxXQUFBLENBQUEsT0FBQSxRQUFBLE9BQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFdBQUEsTUFBQSxPQUFBO1lBQ0EsT0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEdBQUEsU0FBQSxZQUFBLFdBQUEsWUFBQTs7OztBQzdCQSxDQUFBLFlBQUE7SUFDQTs7SUFFQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUE7U0FDQSxRQUFBLFdBQUEsQ0FBQSxTQUFBLFVBQUE7O0lBRUEsU0FBQSxZQUFBLE9BQUEsUUFBQTtRQUNBLElBQUEsS0FBQSxPQUFBOztRQUVBLElBQUEsVUFBQTtZQUNBLGlCQUFBO1lBQ0EsaUJBQUE7WUFDQSxRQUFBOzs7UUFHQSxPQUFBOztRQUVBLFNBQUEsU0FBQTtZQUNBLE9BQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxLQUFBO2lCQUNBLEtBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO29CQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTttQkFDQSxTQUFBLE1BQUE7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE9BQUE7Ozs7Ozs7Ozs7O1FBV0EsU0FBQSxrQkFBQTtZQUNBLElBQUEsUUFBQTtZQUNBLE9BQUEsa0JBQUEsS0FBQSxVQUFBLE1BQUE7Z0JBQ0EsUUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQSxLQUFBOzs7O1FBSUEsU0FBQSxrQkFBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxDQUFBLE1BQUEscUJBQUEsV0FBQTtnQkFDQSxDQUFBLE1BQUEsbUJBQUEsV0FBQTtnQkFDQSxDQUFBLE1BQUEsZUFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxnQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxzQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxpQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxtQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxxQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxnQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxrQkFBQSxXQUFBO2dCQUNBLENBQUEs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QUE7OztBQ1hBOztBQUVBLFNBQUEsc0JBQUEsV0FBQTs7RUFFQSxXQUFBLE9BQUE7O0VBRUEsU0FBQSxvQkFBQSxVQUFBOztJQUVBLEdBQUEsZUFBQSxPQUFBLFNBQUEsYUFBQTs7TUFFQSxJQUFBLFlBQUEsWUFBQTtNQUNBLE9BQUEsV0FBQTs7OztHQUlBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJyxcblx0XHRbXG5cdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0J2FwcC5maWx0ZXJzJyxcblx0XHQnYXBwLnNlcnZpY2VzJyxcblx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdCdhcHAucm91dGVzJyxcblx0XHQnYXBwLmNvbmZpZycsXG5cdFx0J3BhcnRpYWxzTW9kdWxlJ1xuXHRcdF0pO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1sb2FkaW5nLWJhciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xuXG5cdFx0dmFyIGdldFZpZXcgPSBmdW5jdGlvbih2aWV3TmFtZSl7XG5cdFx0XHRyZXR1cm4gJy4vdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9vdGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZm9vdGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0ZGF0YToge30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xhbmRpbmcnKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0fSk7XG59KSgpO1xuIiwiLypcbiAqIENyZWF0ZSByZWZlcmVuY2VzXG4gKi9cbnZhciBndWxwID0gcmVxdWlyZSgnZ3VscCcpO1xudmFyIHBrZyA9IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcblxuLypcbiAqIEF1dG8gbG9hZCBhbGwgZ3VscCBwbHVnaW5zXG4gKi9cbnZhciBndWxwTG9hZFBsdWdpbnMgPSByZXF1aXJlKFwiZ3VscC1sb2FkLXBsdWdpbnNcIik7XG52YXIgcGx1ZyA9IGd1bHBMb2FkUGx1Z2lucygpO1xuXG4vKlxuICogTG9hZCBjb21tb24gdXRpbGl0aWVzIGZvciBndWxwXG4gKi9cbnZhciBndXRpbCA9IHBsdWcubG9hZFV0aWxzKFsnY29sb3JzJywgJ2VudicsICdsb2cnLCAnZGF0ZSddKTtcblxuLypcbiAqIENyZWF0ZSBjb21tZW50cyBmb3IgbWluaWZpZWQgZmlsZXNcbiAqL1xudmFyIGNvbW1lbnRIZWFkZXIgPSBjb21tb24uY3JlYXRlQ29tbWVudHMoZ3V0aWwpO1xuXG4vKlxuICogQ291bGQgdXNlIGEgcHJvZHVjdC9kZXZlbG9wbWVudCBzd2l0Y2guXG4gKiBSdW4gYGd1bHAgLS1wcm9kdWN0aW9uYFxuICovXG52YXIgdHlwZSA9IGd1dGlsLmVudi5wcm9kdWN0aW9uID8gJ3Byb2R1Y3Rpb24nIDogJ2RldmVsb3BtZW50Jztcbmd1dGlsLmxvZyggJ0J1aWxkaW5nIGZvcicsIGd1dGlsLmNvbG9ycy5tYWdlbnRhKHR5cGUpICk7XG5ndXRpbC5iZWVwKCk7XG5cbi8qXG4gKiBMaW50IHRoZSBjb2RlXG4gKi9cbmd1bHAudGFzaygnanNoaW50JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBndWxwLnNyYyhwa2cucGF0aHMuc291cmNlLmpzKVxuICAgICAgICAucGlwZShwbHVnLmpzaGludCgnanNoaW50cmMuanNvbicpKVxuLy8gICAgICAgIC5waXBlKHBsdWcuanNoaW50LnJlcG9ydGVyKCdkZWZhdWx0JykpO1xuICAgICAgICAucGlwZShwbHVnLmpzaGludC5yZXBvcnRlcignanNoaW50LXN0eWxpc2gnKSk7XG59KTtcblxuLypcbiAqIE1pbmlmeSBhbmQgYnVuZGxlIHRoZSBKYXZhU2NyaXB0XG4gKi9cbmd1bHAudGFzaygnYnVuZGxlanMnLCBbJ2pzaGludCddLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1bmRsZWZpbGUgPSBwa2cubmFtZSArIFwiLm1pbi5qc1wiO1xuICAgIHZhciBvcHQgPSB7bmV3TGluZTogJzsnfTtcblxuICAgIHJldHVybiBndWxwLnNyYyhwa2cucGF0aHMuc291cmNlLmpzKVxuICAgICAgICAucGlwZShwbHVnLnNpemUoe3Nob3dGaWxlczogdHJ1ZX0pKVxuICAgICAgICAucGlwZShwbHVnLnVnbGlmeSgpKVxuICAgICAgICAucGlwZShwbHVnLmNvbmNhdChidW5kbGVmaWxlLCBvcHQpKVxuICAgICAgICAucGlwZShwbHVnLmhlYWRlcihjb21tZW50SGVhZGVyKSlcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KHBrZy5wYXRocy5kZXN0LmpzKSlcbiAgICAgICAgLnBpcGUocGx1Zy5zaXplKHtzaG93RmlsZXM6IHRydWV9KSk7XG59KTtcblxuXG4vKlxuICogTWluaWZ5IGFuZCBidW5kbGUgdGhlIENTU1xuICovXG5ndWxwLnRhc2soJ2J1bmRsZWNzcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ3VscC5zcmMocGtnLnBhdGhzLnNvdXJjZS5jc3MpXG4gICAgICAgIC5waXBlKHBsdWcuc2l6ZSh7c2hvd0ZpbGVzOiB0cnVlfSkpXG4gICAgICAgIC5waXBlKHBsdWcubWluaWZ5Q3NzKHt9KSlcbiAgICAgICAgLnBpcGUocGx1Zy5jb25jYXQocGtnLm5hbWUgKyBcIi5taW4uY3NzXCIpKVxuICAgICAgICAucGlwZShwbHVnLmhlYWRlcihjb21tZW50SGVhZGVyKSlcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KHBrZy5wYXRocy5kZXN0LmNzcykpXG4gICAgICAgIC5waXBlKHBsdWcuc2l6ZSh7c2hvd0ZpbGVzOiB0cnVlfSkpO1xufSk7XG5cbi8qXG4gKiBDb21wcmVzcyBpbWFnZXNcbiAqL1xuZ3VscC50YXNrKCdpbWFnZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGd1bHAuc3JjKHBrZy5wYXRocy5zb3VyY2UuaW1hZ2VzKVxuICAgICAgICAucGlwZShwbHVnLmNhY2hlKHBsdWcuaW1hZ2VtaW4oe29wdGltaXphdGlvbkxldmVsOiAzfSkpKVxuICAgICAgICAucGlwZShndWxwLmRlc3QocGtnLnBhdGhzLmRlc3QuaW1hZ2VzKSk7XG59KTtcblxuLypcbiAqIEJ1bmRsZSB0aGUgSlMsIENTUywgYW5kIGNvbXByZXNzIGltYWdlcy5cbiAqIFRoZW4gY29weSBmaWxlcyB0byBwcm9kdWN0aW9uIGFuZCBzaG93IGEgdG9hc3QuXG4gKi9cbmd1bHAudGFzaygnZGVmYXVsdCcsIFsnYnVuZGxlanMnLCAnYnVuZGxlY3NzJywgJ2ltYWdlcyddLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ29weSB0aGUgQ1NTIHRvIHByb2RcbiAgICByZXR1cm4gZ3VscC5zcmMocGtnLnBhdGhzLmRlc3QuY3NzICsgJy8qKi8qJylcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KHBrZy5wYXRocy5wcm9kdWN0aW9uICsgJy9jb250ZW50LycpKVxuXG4gICAgICAgIC8vIENvcHkgdGhlIGpzIGZpbGVzIHRvIHByb2RcbiAgICAgICAgLnBpcGUoZ3VscC5zcmMocGtnLnBhdGhzLmRlc3QuanMgKyAnLyouanMnKSlcbiAgICAgICAgLnBpcGUoZ3VscC5kZXN0KHBrZy5wYXRocy5wcm9kdWN0aW9uICsgJy9hcHAvJykpXG5cbiAgICAgICAgLy8gTm90aWZ5IHdlIGFyZSBkb25lXG4gICAgICAgIC5waXBlKHBsdWcubm90aWZ5KHtcbiAgICAgICAgICAgIG9uTGFzdDogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwibGludGVkLCBidW5kbGVkLCBhbmQgaW1hZ2VzIGNvbXByZXNzZWQhXCJcbiAgICAgICAgfSkpO1xufSk7XG5cbi8qXG4gKiBSZW1vdmUgYWxsIGZpbGVzIGZyb20gdGhlIG91dHB1dCBmb2xkZXJcbiAqL1xuZ3VscC50YXNrKCdjbGVhbk91dHB1dCcsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGd1bHAuc3JjKFtcbiAgICAgICAgICAgIHBrZy5wYXRocy5kZXN0LmJhc2UsXG4gICAgICAgICAgICBwa2cucGF0aHMucHJvZHVjdGlvbl0pXG4gICAgICAgIC5waXBlKHBsdWcuY2xlYW4oe2ZvcmNlOiB0cnVlfSkpXG59KTtcbi8qXG4gKiBXYXRjaCBmaWxlIGFuZCByZS1ydW4gdGhlIGxpbnRlclxuICovXG5ndWxwLnRhc2soJ2J1aWxkLXdhdGNoZXInLCBmdW5jdGlvbigpIHtcbiAgICB2YXIganNXYXRjaGVyID0gZ3VscC53YXRjaChwa2cucGF0aHMuc291cmNlLmpzLCBbJ2pzaGludCddKTtcblxuICAgIC8qXG4gICAgICogUmVidWlsZCB3aGVuIGFueSBmaWxlcyBjaGFuZ2VzXG4gICAgICovXG4vLyAgICBndWxwLndhdGNoKFtwa2cucGF0aHMuc291cmNlLmNzcyxcbi8vICAgICAgICBwa2cucGF0aHMuc291cmNlLmpzLFxuLy8gICAgICAgIHBrZy5wYXRocy5zb3VyY2UuaW1hZ2VzXSwgWydkZWZhdWx0J10pO1xuXG4gICAganNXYXRjaGVyLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnKioqIEZpbGUgJyArIGV2ZW50LnBhdGggKyAnIHdhcyAnICsgZXZlbnQudHlwZSArICcsIHJ1bm5pbmcgdGFza3MuLi4nKTtcbiAgICB9KTtcbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIERlY2xhcmUgYXBwIGxldmVsIG1vZHVsZSB3aGljaCBkZXBlbmRzIG9uIHZpZXdzLCBhbmQgY29tcG9uZW50c1xuYW5ndWxhci5tb2R1bGUoJ215QXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICdhcHAudmlldzEnLFxuICAnYXBwLnZpZXcyJyxcbiAgJ2FwcC52ZXJzaW9uJ1xuXSkuXG5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogJy92aWV3MSd9KTtcbn1dKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgIC8vIEFuZ3VsYXIgbW9kdWxlc1xuICAgICAgICAnbmdBbmltYXRlJywgICAgICAgIC8vIGFuaW1hdGlvbnNcbiAgICAgICAgJ25nUm91dGUnLCAgICAgICAgICAvLyByb3V0aW5nXG4gICAgICAgICduZ1Nhbml0aXplJywgICAgICAgLy8gc2FuaXRpemVzIGh0bWwgYmluZGluZ3MgKGV4OiBzaWRlYmFyLmpzKVxuXG4gICAgICAgIC8vIEN1c3RvbSBtb2R1bGVzXG4gICAgICAgICdjb21tb24nLCAgICAgICAgICAgLy8gY29tbW9uIGZ1bmN0aW9ucywgbG9nZ2VyLCBzcGlubmVyXG4gICAgICAgICdjb21tb24uYm9vdHN0cmFwJywgLy8gYm9vdHN0cmFwIGRpYWxvZyB3cmFwcGVyIGZ1bmN0aW9uc1xuXG4gICAgICAgIC8vIDNyZCBQYXJ0eSBNb2R1bGVzXG4gICAgICAgICd1aS5ib290c3RyYXAnICAgICAgLy8gdWktYm9vdHN0cmFwIChleDogY2Fyb3VzZWwsIHBhZ2luYXRpb24sIGRpYWxvZylcbiAgICBdKTtcblxuICAgIC8vIEhhbmRsZSByb3V0aW5nIGVycm9ycyBhbmQgc3VjY2VzcyBldmVudHNcbiAgICBhcHAucnVuKFsnJHJvdXRlJywgZnVuY3Rpb24gKCRyb3V0ZSkge1xuICAgICAgICAvLyBJbmNsdWRlICRyb3V0ZSB0byBraWNrIHN0YXJ0IHRoZSByb3V0ZXIuXG4gICAgfV0pO1xufSkoKTsiLCIvLyBJbmNsdWRlIGluIGluZGV4Lmh0bWwgc28gdGhhdCBhcHAgbGV2ZWwgZXhjZXB0aW9ucyBhcmUgaGFuZGxlZC5cbi8vIEV4Y2x1ZGUgZnJvbSB0ZXN0UnVubmVyLmh0bWwgd2hpY2ggc2hvdWxkIHJ1biBleGFjdGx5IHdoYXQgaXQgd2FudHMgdG8gcnVuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xuXG4gICAgLy8gQ29uZmlndXJlIGJ5IHNldHRpbmcgYW4gb3B0aW9uYWwgc3RyaW5nIHZhbHVlIGZvciBhcHBFcnJvclByZWZpeC5cbiAgICAvLyBBY2Nlc3NpYmxlIHZpYSBjb25maWcuYXBwRXJyb3JQcmVmaXggKHZpYSBjb25maWcgdmFsdWUpLlxuXG4gICAgYXBwLmNvbmZpZyhbJyRwcm92aWRlJywgZnVuY3Rpb24gKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmRlY29yYXRvcignJGV4Y2VwdGlvbkhhbmRsZXInLFxuICAgICAgICAgICAgWyckZGVsZWdhdGUnLCAnY29uZmlnJywgJ2xvZ2dlcicsIGV4dGVuZEV4Y2VwdGlvbkhhbmRsZXJdKTtcbiAgICB9XSk7XG4gICAgXG4gICAgLy8gRXh0ZW5kIHRoZSAkZXhjZXB0aW9uSGFuZGxlciBzZXJ2aWNlIHRvIGFsc28gZGlzcGxheSBhIHRvYXN0LlxuICAgIGZ1bmN0aW9uIGV4dGVuZEV4Y2VwdGlvbkhhbmRsZXIoJGRlbGVnYXRlLCBjb25maWcsIGxvZ2dlcikge1xuICAgICAgICB2YXIgYXBwRXJyb3JQcmVmaXggPSBjb25maWcuYXBwRXJyb3JQcmVmaXg7XG4gICAgICAgIHZhciBsb2dFcnJvciA9IGxvZ2dlci5nZXRMb2dGbignYXBwJywgJ2Vycm9yJyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXhjZXB0aW9uLCBjYXVzZSkge1xuICAgICAgICAgICAgJGRlbGVnYXRlKGV4Y2VwdGlvbiwgY2F1c2UpO1xuICAgICAgICAgICAgaWYgKGFwcEVycm9yUHJlZml4ICYmIGV4Y2VwdGlvbi5tZXNzYWdlLmluZGV4T2YoYXBwRXJyb3JQcmVmaXgpID09PSAwKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICB2YXIgZXJyb3JEYXRhID0geyBleGNlcHRpb246IGV4Y2VwdGlvbiwgY2F1c2U6IGNhdXNlIH07XG4gICAgICAgICAgICB2YXIgbXNnID0gYXBwRXJyb3JQcmVmaXggKyBleGNlcHRpb24ubWVzc2FnZTtcbiAgICAgICAgICAgIGxvZ0Vycm9yKG1zZywgZXJyb3JEYXRhLCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcblxuICAgIC8vIENvbmZpZ3VyZSBUb2FzdHJcbiAgICB0b2FzdHIub3B0aW9ucy50aW1lT3V0ID0gNDAwMDtcbiAgICB0b2FzdHIub3B0aW9ucy5wb3NpdGlvbkNsYXNzID0gJ3RvYXN0LWJvdHRvbS1yaWdodCc7XG5cbiAgICAvLyBGb3IgdXNlIHdpdGggdGhlIEhvdFRvd2VsLUFuZ3VsYXItQnJlZXplIGFkZC1vbiB0aGF0IHVzZXMgQnJlZXplXG4gICAgdmFyIHJlbW90ZVNlcnZpY2VOYW1lID0gJ2JyZWV6ZS9CcmVlemUnO1xuXG4gICAgdmFyIGV2ZW50cyA9IHtcbiAgICAgICAgY29udHJvbGxlckFjdGl2YXRlU3VjY2VzczogJ2NvbnRyb2xsZXIuYWN0aXZhdGVTdWNjZXNzJyxcbiAgICAgICAgc3Bpbm5lclRvZ2dsZTogJ3NwaW5uZXIudG9nZ2xlJ1xuICAgIH07XG5cbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBhcHBFcnJvclByZWZpeDogJ1tIVCBFcnJvcl0gJywgLy9Db25maWd1cmUgdGhlIGV4Y2VwdGlvbkhhbmRsZXIgZGVjb3JhdG9yXG4gICAgICAgIGRvY1RpdGxlOiAnSG90VG93ZWw6ICcsXG4gICAgICAgIGV2ZW50czogZXZlbnRzLFxuICAgICAgICByZW1vdGVTZXJ2aWNlTmFtZTogcmVtb3RlU2VydmljZU5hbWUsXG4gICAgICAgIHZlcnNpb246ICcyLjEuMCdcbiAgICB9O1xuXG4gICAgYXBwLnZhbHVlKCdjb25maWcnLCBjb25maWcpO1xuICAgIFxuICAgIGFwcC5jb25maWcoWyckbG9nUHJvdmlkZXInLCBmdW5jdGlvbiAoJGxvZ1Byb3ZpZGVyKSB7XG4gICAgICAgIC8vIHR1cm4gZGVidWdnaW5nIG9mZi9vbiAobm8gaW5mbyBvciB3YXJuKVxuICAgICAgICBpZiAoJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCkge1xuICAgICAgICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBcbiAgICAvLyNyZWdpb24gQ29uZmlndXJlIHRoZSBjb21tb24gc2VydmljZXMgdmlhIGNvbW1vbkNvbmZpZ1xuICAgIGFwcC5jb25maWcoWydjb21tb25Db25maWdQcm92aWRlcicsIGZ1bmN0aW9uIChjZmcpIHtcbiAgICAgICAgY2ZnLmNvbmZpZy5jb250cm9sbGVyQWN0aXZhdGVTdWNjZXNzRXZlbnQgPSBjb25maWcuZXZlbnRzLmNvbnRyb2xsZXJBY3RpdmF0ZVN1Y2Nlc3M7XG4gICAgICAgIGNmZy5jb25maWcuc3Bpbm5lclRvZ2dsZUV2ZW50ID0gY29uZmlnLmV2ZW50cy5zcGlubmVyVG9nZ2xlO1xuICAgIH1dKTtcbiAgICAvLyNlbmRyZWdpb25cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xuXG4gICAgLy8gQ29sbGVjdCB0aGUgcm91dGVzXG4gICAgYXBwLmNvbnN0YW50KCdyb3V0ZXMnLCBnZXRSb3V0ZXMoKSk7XG5cbiAgICAvLyBDb25maWd1cmUgdGhlIHJvdXRlcyBhbmQgcm91dGUgcmVzb2x2ZXJzXG4gICAgYXBwLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJ3JvdXRlcycsIHJvdXRlQ29uZmlndXJhdG9yXSk7XG4gICAgZnVuY3Rpb24gcm91dGVDb25maWd1cmF0b3IoJHJvdXRlUHJvdmlkZXIsIHJvdXRlcykge1xuXG4gICAgICAgIHJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKHIudXJsLCByLmNvbmZpZyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkcm91dGVQcm92aWRlci5vdGhlcndpc2UoeyByZWRpcmVjdFRvOiAnLycgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSByb3V0ZXNcbiAgICBmdW5jdGlvbiBnZXRSb3V0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICc8aSBjbGFzcz1cImZhIGZhLWRhc2hib2FyZFwiPjwvaT4gRGFzaGJvYXJkJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHVybDogJy9hdmVuZ2VycycsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQXZlbmdlcnMnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hdmVuZ2Vycy9hdmVuZ2Vycy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICc8aSBjbGFzcz1cImZhIGZhLWxvY2tcIj48L2k+IEF2ZW5nZXJzJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cbn0pKCk7IiwiZG9jdW1lbnQud3JpdGUoXCJJdCB3b3Jrcy5cIik7IiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnaW5kaWdvJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblx0fSk7XG5cbn0pKCk7XG4iLCJleHBvcnRzLmNvbmZpZyA9IHtcbiAgYWxsU2NyaXB0c1RpbWVvdXQ6IDExMDAwLFxuXG4gIHNwZWNzOiBbXG4gICAgJyouanMnXG4gIF0sXG5cbiAgY2FwYWJpbGl0aWVzOiB7XG4gICAgJ2Jyb3dzZXJOYW1lJzogJ2Nocm9tZSdcbiAgfSxcblxuICBiYXNlVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FwcC8nLFxuXG4gIGZyYW1ld29yazogJ2phc21pbmUnLFxuXG4gIGphc21pbmVOb2RlT3B0czoge1xuICAgIGRlZmF1bHRUaW1lb3V0SW50ZXJ2YWw6IDMwMDAwXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3Byb3RyYWN0b3IvYmxvYi9tYXN0ZXIvZG9jcy90b2MubWQgKi9cblxuZGVzY3JpYmUoJ215IGFwcCcsIGZ1bmN0aW9uKCkge1xuXG5cbiAgaXQoJ3Nob3VsZCBhdXRvbWF0aWNhbGx5IHJlZGlyZWN0IHRvIC92aWV3MSB3aGVuIGxvY2F0aW9uIGhhc2gvZnJhZ21lbnQgaXMgZW1wdHknLCBmdW5jdGlvbigpIHtcbiAgICBicm93c2VyLmdldCgnaW5kZXguaHRtbCcpO1xuICAgIGV4cGVjdChicm93c2VyLmdldExvY2F0aW9uQWJzVXJsKCkpLnRvTWF0Y2goXCIvdmlldzFcIik7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ3ZpZXcxJywgZnVuY3Rpb24oKSB7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgYnJvd3Nlci5nZXQoJ2luZGV4Lmh0bWwjL3ZpZXcxJyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHZpZXcxIHdoZW4gdXNlciBuYXZpZ2F0ZXMgdG8gL3ZpZXcxJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoZWxlbWVudC5hbGwoYnkuY3NzKCdbbmctdmlld10gcCcpKS5maXJzdCgpLmdldFRleHQoKSkuXG4gICAgICAgIHRvTWF0Y2goL3BhcnRpYWwgZm9yIHZpZXcgMS8pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ3ZpZXcyJywgZnVuY3Rpb24oKSB7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgYnJvd3Nlci5nZXQoJ2luZGV4Lmh0bWwjL3ZpZXcyJyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHZpZXcyIHdoZW4gdXNlciBuYXZpZ2F0ZXMgdG8gL3ZpZXcyJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoZWxlbWVudC5hbGwoYnkuY3NzKCdbbmctdmlld10gcCcpKS5maXJzdCgpLmdldFRleHQoKSkuXG4gICAgICAgIHRvTWF0Y2goL3BhcnRpYWwgZm9yIHZpZXcgMi8pO1xuICAgIH0pO1xuXG4gIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0XHRyZXR1cm4gKGlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdBUEknLCBmdW5jdGlvbihSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlKSB7XG5cblx0XHQvL2NvbnRlbnQgbmVnb3RpYXRpb25cblx0XHR2YXIgaGVhZGVycyA9IHtcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHQnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uJ1xuXHRcdH07XG5cblx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIud2l0aENvbmZpZyhmdW5jdGlvbihSZXN0YW5ndWxhckNvbmZpZ3VyZXIpIHtcblx0XHRcdFJlc3Rhbmd1bGFyQ29uZmlndXJlclxuXHRcdFx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdFx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoaGVhZGVycylcblx0XHRcdFx0LnNldEVycm9ySW50ZXJjZXB0b3IoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MjIpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIGVycm9yIGluIHJlc3BvbnNlLmRhdGEuZXJyb3JzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBUb2FzdFNlcnZpY2UuZXJyb3IocmVzcG9uc2UuZGF0YS5lcnJvcnNbZXJyb3JdWzBdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5hZGRGdWxsUmVxdWVzdEludGVyY2VwdG9yKGZ1bmN0aW9uKGVsZW1lbnQsIG9wZXJhdGlvbiwgd2hhdCwgdXJsLCBoZWFkZXJzKSB7XG5cdFx0XHRcdFx0aWYgKCRsb2NhbFN0b3JhZ2Uuand0KSB7XG5cdFx0XHRcdFx0XHRoZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyAkbG9jYWxTdG9yYWdlLmp3dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGNvbnRyb2xsZXJJZCA9ICdhdmVuZ2Vycyc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKGNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgIFsnY29tbW9uJywgJ2RhdGFjb250ZXh0JywgYXZlbmdlcnNdKTtcblxuICAgIGZ1bmN0aW9uIGF2ZW5nZXJzKGNvbW1vbiwgZGF0YWNvbnRleHQpIHtcbiAgICAgICAgdmFyIGdldExvZ0ZuID0gY29tbW9uLmxvZ2dlci5nZXRMb2dGbjtcbiAgICAgICAgdmFyIGxvZyA9IGdldExvZ0ZuKGNvbnRyb2xsZXJJZCk7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uYXZlbmdlcnMgPSBbXTtcbiAgICAgICAgdm0ubWFhID0gW107XG4gICAgICAgIHZtLnRpdGxlID0gJ0F2ZW5nZXJzJztcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW2dldEF2ZW5nZXJzQ2FzdCgpLCBnZXRNQUEoKV07XG4gICAgICAgICAgICBjb21tb24uYWN0aXZhdGVDb250cm9sbGVyKHByb21pc2VzLCBjb250cm9sbGVySWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsb2coJ0FjdGl2YXRlZCBBdmVuZ2VycyBWaWV3Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRNQUEoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YWNvbnRleHQuZ2V0TUFBKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuLy8gICAgICAgICAgICAgICAgdm0ubWFhID0gZGF0YS5kYXRhWzBdLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgICAgICB2bS5tYWEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5tYWE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhY29udGV4dC5nZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYXZlbmdlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VycztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBib290c3RyYXBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnY29tbW9uLmJvb3RzdHJhcCcsIFsndWkuYm9vdHN0cmFwJ10pO1xuXG4gICAgYm9vdHN0cmFwTW9kdWxlLmZhY3RvcnkoJ2Jvb3RzdHJhcC5kaWFsb2cnLCBbJyRtb2RhbCcsICckdGVtcGxhdGVDYWNoZScsIG1vZGFsRGlhbG9nXSk7XG5cbiAgICBmdW5jdGlvbiBtb2RhbERpYWxvZygkbW9kYWwsICR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgZGVsZXRlRGlhbG9nOiBkZWxldGVEaWFsb2csXG4gICAgICAgICAgICBjb25maXJtYXRpb25EaWFsb2c6IGNvbmZpcm1hdGlvbkRpYWxvZ1xuICAgICAgICB9O1xuXG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbW9kYWxEaWFsb2cudHBsLmh0bWwnLFxuICAgICAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgJyAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICAgJyAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgJyArXG4gICAgICAgICAgICAgICAgJyAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRhdGEtbmctY2xpY2s9XCJjYW5jZWwoKVwiPiZ0aW1lczs8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgICA8aDM+e3t0aXRsZX19PC9oMz4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvZGl2PicgK1xuICAgICAgICAgICAgICAgICcgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgICA8cD57e21lc3NhZ2V9fTwvcD4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvZGl2PicgK1xuICAgICAgICAgICAgICAgICcgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgICAgICcgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLW5nLWNsaWNrPVwib2soKVwiPnt7b2tUZXh0fX08L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pbmZvXCIgZGF0YS1uZy1jbGljaz1cImNhbmNlbCgpXCI+e3tjYW5jZWxUZXh0fX08L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBkZWxldGVEaWFsb2coaXRlbU5hbWUpIHtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9ICdDb25maXJtIERlbGV0ZSc7XG4gICAgICAgICAgICBpdGVtTmFtZSA9IGl0ZW1OYW1lIHx8ICdpdGVtJztcbiAgICAgICAgICAgIHZhciBtc2cgPSAnRGVsZXRlICcgKyBpdGVtTmFtZSArICc/JztcblxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpcm1hdGlvbkRpYWxvZyh0aXRsZSwgbXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbmZpcm1hdGlvbkRpYWxvZyh0aXRsZSwgbXNnLCBva1RleHQsIGNhbmNlbFRleHQpIHtcblxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21vZGFsRGlhbG9nLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBNb2RhbEluc3RhbmNlLFxuICAgICAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rVGV4dDogb2tUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6IGNhbmNlbFRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gJG1vZGFsLm9wZW4obW9kYWxPcHRpb25zKS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgTW9kYWxJbnN0YW5jZSA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ29wdGlvbnMnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCAnVGl0bGUnO1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgJyc7XG4gICAgICAgICAgICAkc2NvcGUub2tUZXh0ID0gb3B0aW9ucy5va1RleHQgfHwgJ09LJztcbiAgICAgICAgICAgICRzY29wZS5jYW5jZWxUZXh0ID0gb3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdDYW5jZWwnO1xuICAgICAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCdvaycpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBEZWZpbmUgdGhlIGNvbW1vbiBtb2R1bGVcbiAgICAvLyBDb250YWlucyBzZXJ2aWNlczpcbiAgICAvLyAgLSBjb21tb25cbiAgICAvLyAgLSBsb2dnZXJcbiAgICAvLyAgLSBzcGlubmVyXG4gICAgdmFyIGNvbW1vbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdjb21tb24nLCBbXSk7XG5cbiAgICAvLyBNdXN0IGNvbmZpZ3VyZSB0aGUgY29tbW9uIHNlcnZpY2UgYW5kIHNldCBpdHNcbiAgICAvLyBldmVudHMgdmlhIHRoZSBjb21tb25Db25maWdQcm92aWRlclxuICAgIGNvbW1vbk1vZHVsZS5wcm92aWRlcignY29tbW9uQ29uZmlnJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgcHJvcGVydGllcyB3ZSBuZWVkIHRvIHNldFxuICAgICAgICAgICAgLy9jb250cm9sbGVyQWN0aXZhdGVTdWNjZXNzRXZlbnQ6ICcnLFxuICAgICAgICAgICAgLy9zcGlubmVyVG9nZ2xlRXZlbnQ6ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY29uZmlnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgY29tbW9uTW9kdWxlLmZhY3RvcnkoJ2NvbW1vbicsXG4gICAgICAgIFsnJHEnLCAnJHJvb3RTY29wZScsICckdGltZW91dCcsICdjb21tb25Db25maWcnLCAnbG9nZ2VyJywgY29tbW9uXSk7XG5cbiAgICBmdW5jdGlvbiBjb21tb24oJHEsICRyb290U2NvcGUsICR0aW1lb3V0LCBjb21tb25Db25maWcsIGxvZ2dlcikge1xuICAgICAgICB2YXIgdGhyb3R0bGVzID0ge307XG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICAvLyBjb21tb24gYW5ndWxhciBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICRicm9hZGNhc3Q6ICRicm9hZGNhc3QsXG4gICAgICAgICAgICAkcTogJHEsXG4gICAgICAgICAgICAkdGltZW91dDogJHRpbWVvdXQsXG4gICAgICAgICAgICAvLyBnZW5lcmljXG4gICAgICAgICAgICBhY3RpdmF0ZUNvbnRyb2xsZXI6IGFjdGl2YXRlQ29udHJvbGxlcixcbiAgICAgICAgICAgIGNyZWF0ZVNlYXJjaFRocm90dGxlOiBjcmVhdGVTZWFyY2hUaHJvdHRsZSxcbiAgICAgICAgICAgIGRlYm91bmNlZFRocm90dGxlOiBkZWJvdW5jZWRUaHJvdHRsZSxcbiAgICAgICAgICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICAgICAgICAgIGxvZ2dlcjogbG9nZ2VyLCAvLyBmb3IgYWNjZXNzaWJpbGl0eVxuICAgICAgICAgICAgdGV4dENvbnRhaW5zOiB0ZXh0Q29udGFpbnNcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZUNvbnRyb2xsZXIocHJvbWlzZXMsIGNvbnRyb2xsZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAoZXZlbnRBcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB7IGNvbnRyb2xsZXJJZDogY29udHJvbGxlcklkIH07XG4gICAgICAgICAgICAgICAgJGJyb2FkY2FzdChjb21tb25Db25maWcuY29uZmlnLmNvbnRyb2xsZXJBY3RpdmF0ZVN1Y2Nlc3NFdmVudCwgZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uICRicm9hZGNhc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0LmFwcGx5KCRyb290U2NvcGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVTZWFyY2hUaHJvdHRsZSh2aWV3bW9kZWwsIGxpc3QsIGZpbHRlcmVkTGlzdCwgZmlsdGVyLCBkZWxheSkge1xuICAgICAgICAgICAgLy8gQWZ0ZXIgYSBkZWxheSwgc2VhcmNoIGEgdmlld21vZGVsJ3MgbGlzdCB1c2luZ1xuICAgICAgICAgICAgLy8gYSBmaWx0ZXIgZnVuY3Rpb24sIGFuZCByZXR1cm4gYSBmaWx0ZXJlZExpc3QuXG5cbiAgICAgICAgICAgIC8vIGN1c3RvbSBkZWxheSBvciB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgZGVsYXkgPSArZGVsYXkgfHwgMzAwO1xuICAgICAgICAgICAgLy8gaWYgb25seSB2bSBhbmQgbGlzdCBwYXJhbWV0ZXJzIHdlcmUgcGFzc2VkLCBzZXQgb3RoZXJzIGJ5IG5hbWluZyBjb252ZW50aW9uXG4gICAgICAgICAgICBpZiAoIWZpbHRlcmVkTGlzdCkge1xuICAgICAgICAgICAgICAgIC8vIGFzc3VtaW5nIGxpc3QgaXMgbmFtZWQgc2Vzc2lvbnMsIGZpbHRlcmVkTGlzdCBpcyBmaWx0ZXJlZFNlc3Npb25zXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRMaXN0ID0gJ2ZpbHRlcmVkJyArIGxpc3RbMF0udG9VcHBlckNhc2UoKSArIGxpc3Quc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7IC8vIHN0cmluZ1xuICAgICAgICAgICAgICAgIC8vIGZpbHRlciBmdW5jdGlvbiBpcyBuYW1lZCBzZXNzaW9uRmlsdGVyXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gbGlzdCArICdGaWx0ZXInOyAvLyBmdW5jdGlvbiBpbiBzdHJpbmcgZm9ybVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGZpbHRlcmluZyBmdW5jdGlvbiB3ZSB3aWxsIGNhbGwgZnJvbSBoZXJlXG4gICAgICAgICAgICB2YXIgZmlsdGVyRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJhbnNsYXRlcyB0byAuLi5cbiAgICAgICAgICAgICAgICAvLyB2bS5maWx0ZXJlZFNlc3Npb25zXG4gICAgICAgICAgICAgICAgLy8gICAgICA9IHZtLnNlc3Npb25zLmZpbHRlcihmdW5jdGlvbihpdGVtKCB7IHJldHVybnMgdm0uc2Vzc2lvbkZpbHRlciAoaXRlbSkgfSApO1xuICAgICAgICAgICAgICAgIHZpZXdtb2RlbFtmaWx0ZXJlZExpc3RdID0gdmlld21vZGVsW2xpc3RdLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlld21vZGVsW2ZpbHRlcl0oaXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIG91dGVyIElGRkUgc28gd2UgY2FuIHVzZSBjbG9zdXJlXG4gICAgICAgICAgICAgICAgLy8gb3ZlciBmaWx0ZXJJbnB1dFRpbWVvdXQgd2hpY2ggcmVmZXJlbmNlcyB0aGUgdGltZW91dFxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJJbnB1dFRpbWVvdXQ7XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gd2hhdCBiZWNvbWVzIHRoZSAnYXBwbHlGaWx0ZXInIGZ1bmN0aW9uIGluIHRoZSBjb250cm9sbGVyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWFyY2hOb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcklucHV0VGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKGZpbHRlcklucHV0VGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJJbnB1dFRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hOb3cgfHwgIWRlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJGbigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVySW5wdXRUaW1lb3V0ID0gJHRpbWVvdXQoZmlsdGVyRm4sIGRlbGF5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVib3VuY2VkVGhyb3R0bGUoa2V5LCBjYWxsYmFjaywgZGVsYXksIGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgLy8gUGVyZm9ybSBzb21lIGFjdGlvbiAoY2FsbGJhY2spIGFmdGVyIGEgZGVsYXkuXG4gICAgICAgICAgICAvLyBUcmFjayB0aGUgY2FsbGJhY2sgYnkga2V5LCBzbyBpZiB0aGUgc2FtZSBjYWxsYmFja1xuICAgICAgICAgICAgLy8gaXMgaXNzdWVkIGFnYWluLCByZXN0YXJ0IHRoZSBkZWxheS5cblxuICAgICAgICAgICAgdmFyIGRlZmF1bHREZWxheSA9IDEwMDA7XG4gICAgICAgICAgICBkZWxheSA9IGRlbGF5IHx8IGRlZmF1bHREZWxheTtcbiAgICAgICAgICAgIGlmICh0aHJvdHRsZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aHJvdHRsZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgdGhyb3R0bGVzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3R0bGVzW2tleV0gPSAkdGltZW91dChjYWxsYmFjaywgZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gICAgICAgICAgICAvLyBuZWdhdGl2ZSBvciBwb3NpdGl2ZVxuICAgICAgICAgICAgcmV0dXJuICgvXlstXT9cXGQrJC8pLnRlc3QodmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRleHRDb250YWlucyh0ZXh0LCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dCAmJiAtMSAhPT0gdGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoVGV4dC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29tbW9uJykuZmFjdG9yeSgnbG9nZ2VyJywgWyckbG9nJywgbG9nZ2VyXSk7XG5cbiAgICBmdW5jdGlvbiBsb2dnZXIoJGxvZykge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldExvZ0ZuOiBnZXRMb2dGbixcbiAgICAgICAgICAgIGxvZzogbG9nLFxuICAgICAgICAgICAgbG9nRXJyb3I6IGxvZ0Vycm9yLFxuICAgICAgICAgICAgbG9nU3VjY2VzczogbG9nU3VjY2VzcyxcbiAgICAgICAgICAgIGxvZ1dhcm5pbmc6IGxvZ1dhcm5pbmdcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRMb2dGbihtb2R1bGVJZCwgZm5OYW1lKSB7XG4gICAgICAgICAgICBmbk5hbWUgPSBmbk5hbWUgfHwgJ2xvZyc7XG4gICAgICAgICAgICBzd2l0Y2ggKGZuTmFtZS50b0xvd2VyQ2FzZSgpKSB7IC8vIGNvbnZlcnQgYWxpYXNlc1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgICAgICAgICAgICAgICBmbk5hbWUgPSAnbG9nU3VjY2Vzcyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgICAgICAgICAgZm5OYW1lID0gJ2xvZ0Vycm9yJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgICAgICAgICAgICAgIGZuTmFtZSA9ICdsb2dXYXJuaW5nJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2FybmluZyc6XG4gICAgICAgICAgICAgICAgICAgIGZuTmFtZSA9ICdsb2dXYXJuaW5nJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsb2dGbiA9IHNlcnZpY2VbZm5OYW1lXSB8fCBzZXJ2aWNlLmxvZztcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobXNnLCBkYXRhLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgICAgICBsb2dGbihtc2csIGRhdGEsIG1vZHVsZUlkLCAoc2hvd1RvYXN0ID09PSB1bmRlZmluZWQpID8gdHJ1ZSA6IHNob3dUb2FzdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nKG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICBsb2dJdChtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCwgJ2luZm8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ1dhcm5pbmcobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgIGxvZ0l0KG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0LCAnd2FybmluZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nU3VjY2VzcyhtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsICdzdWNjZXNzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dFcnJvcihtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsICdlcnJvcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsIHRvYXN0VHlwZSkge1xuICAgICAgICAgICAgdmFyIHdyaXRlID0gKHRvYXN0VHlwZSA9PT0gJ2Vycm9yJykgPyAkbG9nLmVycm9yIDogJGxvZy5sb2c7XG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UgPyAnWycgKyBzb3VyY2UgKyAnXSAnIDogJyc7XG4gICAgICAgICAgICB3cml0ZShzb3VyY2UsIG1lc3NhZ2UsIGRhdGEpO1xuICAgICAgICAgICAgaWYgKHNob3dUb2FzdCkge1xuICAgICAgICAgICAgICAgIGlmICh0b2FzdFR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9hc3RUeXBlID09PSAnd2FybmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gTXVzdCBjb25maWd1cmUgdGhlIGNvbW1vbiBzZXJ2aWNlIGFuZCBzZXQgaXRzXG4gICAgLy8gZXZlbnRzIHZpYSB0aGUgY29tbW9uQ29uZmlnUHJvdmlkZXJcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjb21tb24nKVxuICAgICAgICAuZmFjdG9yeSgnc3Bpbm5lcicsIFsnY29tbW9uJywgJ2NvbW1vbkNvbmZpZycsIHNwaW5uZXJdKTtcblxuICAgIGZ1bmN0aW9uIHNwaW5uZXIoY29tbW9uLCBjb21tb25Db25maWcpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBzcGlubmVySGlkZTogc3Bpbm5lckhpZGUsXG4gICAgICAgICAgICBzcGlubmVyU2hvdzogc3Bpbm5lclNob3dcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBzcGlubmVySGlkZSgpIHtcbiAgICAgICAgICAgIHNwaW5uZXJUb2dnbGUoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3Bpbm5lclNob3coKSB7XG4gICAgICAgICAgICBzcGlubmVyVG9nZ2xlKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3Bpbm5lclRvZ2dsZShzaG93KSB7XG4gICAgICAgICAgICBjb21tb24uJGJyb2FkY2FzdChjb21tb25Db25maWcuY29uZmlnLnNwaW5uZXJUb2dnbGVFdmVudCwgeyBzaG93OiBzaG93IH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgY29udHJvbGxlcklkID0gJ2Rhc2hib2FyZCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLCBbJ2NvbW1vbicsICdkYXRhY29udGV4dCcsIGRhc2hib2FyZF0pO1xuXG4gICAgZnVuY3Rpb24gZGFzaGJvYXJkKGNvbW1vbiwgZGF0YWNvbnRleHQpIHtcbiAgICAgICAgdmFyIGdldExvZ0ZuID0gY29tbW9uLmxvZ2dlci5nZXRMb2dGbjtcbiAgICAgICAgdmFyIGxvZyA9IGdldExvZ0ZuKGNvbnRyb2xsZXJJZCk7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubmV3cyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnTWFydmVsIEF2ZW5nZXJzJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFydmVsIEF2ZW5nZXJzIDIgaXMgbm93IGluIHByb2R1Y3Rpb24hJ1xuICAgICAgICB9O1xuICAgICAgICB2bS5hdmVuZ2VyQ291bnQgPSAwO1xuICAgICAgICB2bS5hdmVuZ2VycyA9IFtdO1xuICAgICAgICB2bS50aXRsZSA9ICdEYXNoYm9hcmQnO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbZ2V0QXZlbmdlckNvdW50KCksIGdldEF2ZW5nZXJzQ2FzdCgpXTtcbiAgICAgICAgICAgIGNvbW1vbi5hY3RpdmF0ZUNvbnRyb2xsZXIocHJvbWlzZXMsIGNvbnRyb2xsZXJJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7IGxvZygnQWN0aXZhdGVkIERhc2hib2FyZCBWaWV3Jyk7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFjb250ZXh0LmdldEF2ZW5nZXJDb3VudCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5hdmVuZ2VyQ291bnQgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VyQ291bnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhY29udGV4dC5nZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYXZlbmdlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VycztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb250cm9sbGVySWQgPSAnc2hlbGwnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb250cm9sbGVyKGNvbnRyb2xsZXJJZCxcbiAgICAgICAgWyckcm9vdFNjb3BlJywgJ2NvbW1vbicsICdjb25maWcnLCBzaGVsbF0pO1xuXG4gICAgZnVuY3Rpb24gc2hlbGwoJHJvb3RTY29wZSwgY29tbW9uLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIGxvZ1N1Y2Nlc3MgPSBjb21tb24ubG9nZ2VyLmdldExvZ0ZuKGNvbnRyb2xsZXJJZCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgdmFyIGV2ZW50cyA9IGNvbmZpZy5ldmVudHM7XG4gICAgICAgIHZtLnRpdGxlID0gJ0dydW50IGFuZCBHdWxwJztcbiAgICAgICAgdm0uYnVzeU1lc3NhZ2UgPSAnUGxlYXNlIHdhaXQgLi4uJztcbiAgICAgICAgdm0uaXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgdm0uc3Bpbm5lck9wdGlvbnMgPSB7XG4gICAgICAgICAgICByYWRpdXM6IDQwLFxuICAgICAgICAgICAgbGluZXM6IDcsXG4gICAgICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgICAgICBzcGVlZDogMS43LFxuICAgICAgICAgICAgY29ybmVyczogMS4wLFxuICAgICAgICAgICAgdHJhaWw6IDEwMCxcbiAgICAgICAgICAgIGNvbG9yOiAnI0Y1OEEwMCdcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgbG9nU3VjY2VzcygnR3J1bnQgYW5kIEd1bHAgd2l0aCBBbmd1bGFyIGxvYWRlZCEnLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbW1vbi5hY3RpdmF0ZUNvbnRyb2xsZXIoW10sIGNvbnRyb2xsZXJJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTcGlubmVyKG9uKSB7IHZtLmlzQnVzeSA9IG9uOyB9XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JyxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkgeyB0b2dnbGVTcGlubmVyKHRydWUpOyB9XG4gICAgICAgICk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oZXZlbnRzLmNvbnRyb2xsZXJBY3RpdmF0ZVN1Y2Nlc3MsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkgeyB0b2dnbGVTcGlubmVyKGZhbHNlKTsgfVxuICAgICAgICApO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKGV2ZW50cy5zcGlubmVyVG9nZ2xlLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHsgdG9nZ2xlU3Bpbm5lcihkYXRhLnNob3cpOyB9XG4gICAgICAgICk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb250cm9sbGVySWQgPSAnc2lkZWJhcic7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLFxuICAgICAgICBbJyRyb3V0ZScsICdyb3V0ZXMnLCBzaWRlYmFyXSk7XG5cbiAgICBmdW5jdGlvbiBzaWRlYmFyKCRyb3V0ZSwgcm91dGVzKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uaXNDdXJyZW50ID0gaXNDdXJyZW50O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7IGdldE5hdlJvdXRlcygpOyB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmF2Um91dGVzKCkge1xuICAgICAgICAgICAgdm0ubmF2Um91dGVzID0gcm91dGVzLmZpbHRlcihmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuY29uZmlnLnNldHRpbmdzICYmIHIuY29uZmlnLnNldHRpbmdzLm5hdjtcbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24ocjEsIHIyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIxLmNvbmZpZy5zZXR0aW5ncy5uYXYgLSByMi5jb25maWcuc2V0dGluZ3MubmF2O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0N1cnJlbnQocm91dGUpIHtcbiAgICAgICAgICAgIGlmICghcm91dGUuY29uZmlnLnRpdGxlIHx8ICEkcm91dGUuY3VycmVudCB8fCAhJHJvdXRlLmN1cnJlbnQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWVudU5hbWUgPSByb3V0ZS5jb25maWcudGl0bGU7XG4gICAgICAgICAgICByZXR1cm4gJHJvdXRlLmN1cnJlbnQudGl0bGUuc3Vic3RyKDAsIG1lbnVOYW1lLmxlbmd0aCkgPT09IG1lbnVOYW1lID8gJ2N1cnJlbnQnIDogJyc7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHNlcnZpY2VJZCA9ICdkYXRhY29udGV4dCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5mYWN0b3J5KHNlcnZpY2VJZCwgWyckaHR0cCcsICdjb21tb24nLCBkYXRhY29udGV4dF0pO1xuXG4gICAgZnVuY3Rpb24gZGF0YWNvbnRleHQoJGh0dHAsIGNvbW1vbikge1xuICAgICAgICB2YXIgJHEgPSBjb21tb24uJHE7XG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBnZXRBdmVuZ2Vyc0Nhc3Q6IGdldEF2ZW5nZXJzQ2FzdCxcbiAgICAgICAgICAgIGdldEF2ZW5nZXJDb3VudDogZ2V0QXZlbmdlckNvdW50LFxuICAgICAgICAgICAgZ2V0TUFBOiBnZXRNQUFcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRNQUEoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICcvZGF0YS9tYWEnfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhWzBdLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICByZXR1cm4gJHEud2hlbihyZXN1bHRzKTtcbi8vICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSB7ZGF0YTogbnVsbH07XG4vLyAgICAgICAgICAgICRodHRwKHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnL21hYSd9KVxuLy8gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbi8vICAgICAgICAgICAgICAgICAgICByZXN1bHRzLmRhdGEgPSBkYXRhWzBdLmRhdGEucmVzdWx0cztcbi8vICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHJlc3VsdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgIHJldHVybiBnZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY291bnQgPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihjb3VudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHZhciBjYXN0ID0gW1xuICAgICAgICAgICAgICAgIHtuYW1lOiAnUm9iZXJ0IERvd25leSBKci4nLCBjaGFyYWN0ZXI6ICdUb255IFN0YXJrIC8gSXJvbiBNYW4nfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NocmlzIEhlbXN3b3J0aCcsIGNoYXJhY3RlcjogJ1Rob3InfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NocmlzIEV2YW5zJywgY2hhcmFjdGVyOiAnU3RldmUgUm9nZXJzIC8gQ2FwdGFpbiBBbWVyaWNhJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdNYXJrIFJ1ZmZhbG8nLCBjaGFyYWN0ZXI6ICdCcnVjZSBCYW5uZXIgLyBUaGUgSHVsayd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnU2NhcmxldHQgSm9oYW5zc29uJywgY2hhcmFjdGVyOiAnTmF0YXNoYSBSb21hbm9mZiAvIEJsYWNrIFdpZG93J30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdKZXJlbXkgUmVubmVyJywgY2hhcmFjdGVyOiAnQ2xpbnQgQmFydG9uIC8gSGF3a2V5ZSd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnR3d5bmV0aCBQYWx0cm93JywgY2hhcmFjdGVyOiAnUGVwcGVyIFBvdHRzJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdTYW11ZWwgTC4gSmFja3NvbicsIGNoYXJhY3RlcjogJ05pY2sgRnVyeSd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnUGF1bCBCZXR0YW55JywgY2hhcmFjdGVyOiAnSmFydmlzJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdUb20gSGlkZGxlc3RvbicsIGNoYXJhY3RlcjogJ0xva2knfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NsYXJrIEdyZWdnJywgY2hhcmFjdGVyOiAnQWdlbnQgUGhpbCBDb3Vsc29uJ31cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gJHEud2hlbihjYXN0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NJbWdQZXJzb24nLCBbJ2NvbmZpZycsIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgLy9Vc2FnZTpcbiAgICAgICAgLy88aW1nIGRhdGEtY2MtaW1nLXBlcnNvbj1cInt7cy5zcGVha2VyLmltYWdlU291cmNlfX1cIi8+XG4gICAgICAgIHZhciBiYXNlUGF0aCA9IGNvbmZpZy5pbWFnZVNldHRpbmdzLmltYWdlQmFzZVBhdGg7XG4gICAgICAgIHZhciB1bmtub3duSW1hZ2UgPSBjb25maWcuaW1hZ2VTZXR0aW5ncy51bmtub3duUGVyc29uSW1hZ2VTb3VyY2U7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnY2NJbWdQZXJzb24nLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGJhc2VQYXRoICsgKHZhbHVlIHx8IHVua25vd25JbWFnZSk7XG4gICAgICAgICAgICAgICAgYXR0cnMuJHNldCgnc3JjJywgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1NpZGViYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE9wZW5zIGFuZCBjbHNvZXMgdGhlIHNpZGViYXIgbWVudS5cbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vICA8ZGl2IGRhdGEtY2Mtc2lkZWJhcj5cbiAgICAgICAgLy8gQ3JlYXRlczpcbiAgICAgICAgLy8gIDxkaXYgZGF0YS1jYy1zaWRlYmFyIGNsYXNzPVwic2lkZWJhclwiPlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyICRzaWRlYmFySW5uZXIgPSBlbGVtZW50LmZpbmQoJy5zaWRlYmFyLWlubmVyJyk7XG4gICAgICAgICAgICB2YXIgJGRyb3Bkb3duRWxlbWVudCA9IGVsZW1lbnQuZmluZCgnLnNpZGViYXItZHJvcGRvd24gYScpO1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnc2lkZWJhcicpO1xuICAgICAgICAgICAgJGRyb3Bkb3duRWxlbWVudC5jbGljayhkcm9wZG93bik7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRyb3Bkb3duKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZHJvcENsYXNzID0gJ2Ryb3B5JztcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEkZHJvcGRvd25FbGVtZW50Lmhhc0NsYXNzKGRyb3BDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZUFsbFNpZGViYXJzKCk7XG4gICAgICAgICAgICAgICAgICAgICRzaWRlYmFySW5uZXIuc2xpZGVEb3duKDM1MCk7XG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bkVsZW1lbnQuYWRkQ2xhc3MoZHJvcENsYXNzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRkcm9wZG93bkVsZW1lbnQuaGFzQ2xhc3MoZHJvcENsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd25FbGVtZW50LnJlbW92ZUNsYXNzKGRyb3BDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICRzaWRlYmFySW5uZXIuc2xpZGVVcCgzNTApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhpZGVBbGxTaWRlYmFycygpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNpZGViYXJJbm5lci5zbGlkZVVwKDM1MCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLWRyb3Bkb3duIGEnKS5yZW1vdmVDbGFzcyhkcm9wQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1dpZGdldENsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gPGEgZGF0YS1jYy13aWRnZXQtY2xvc2U+PC9hPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyA8YSBkYXRhLWNjLXdpZGdldC1jbG9zZT1cIlwiIGhyZWY9XCIjXCIgY2xhc3M9XCJ3Y2xvc2VcIj5cbiAgICAgICAgLy8gICAgIDxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCI+PC9pPlxuICAgICAgICAvLyA8L2E+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiPjwvaT4nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoJ3djbG9zZScpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGljayhjbG9zZUVsKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xvc2VFbChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaGlkZSgxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1dpZGdldE1pbmltaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gPGEgZGF0YS1jYy13aWRnZXQtbWluaW1pemU+PC9hPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyA8YSBkYXRhLWNjLXdpZGdldC1taW5pbWl6ZT1cIlwiIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXVwXCI+PC9pPjwvYT5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi11cFwiPjwvaT4nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAvLyQoJ2JvZHknKS5vbignY2xpY2snLCAnLndpZGdldCAud21pbmltaXplJywgbWluaW1pemUpO1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnaHJlZicsICcjJyk7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCd3bWluaW1pemUnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xpY2sobWluaW1pemUpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBtaW5pbWl6ZShlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciAkd2NvbnRlbnQgPSBlbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLm5leHQoJy53aWRnZXQtY29udGVudCcpO1xuICAgICAgICAgICAgICAgIHZhciBpRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oJ2knKTtcbiAgICAgICAgICAgICAgICBpZiAoJHdjb250ZW50LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKCdmYSBmYS1jaGV2cm9uLXVwJyk7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LmFkZENsYXNzKCdmYSBmYS1jaGV2cm9uLWRvd24nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcygnZmEgZmEtY2hldnJvbi1kb3duJyk7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LmFkZENsYXNzKCdmYSBmYS1jaGV2cm9uLXVwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICR3Y29udGVudC50b2dnbGUoNTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NTY3JvbGxUb1RvcCcsIFsnJHdpbmRvdycsXG4gICAgICAgIC8vIFVzYWdlOlxuICAgICAgICAvLyA8c3BhbiBkYXRhLWNjLXNjcm9sbC10by10b3A+PC9zcGFuPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyA8c3BhbiBkYXRhLWNjLXNjcm9sbC10by10b3A9XCJcIiBjbGFzcz1cInRvdG9wXCI+XG4gICAgICAgIC8vICAgICAgPGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tdXBcIj48L2k+PC9hPlxuICAgICAgICAvLyA8L3NwYW4+XG4gICAgICAgIGZ1bmN0aW9uICgkd2luZG93KSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8YSBocmVmPVwiI1wiPjxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi11cFwiPjwvaT48L2E+JyxcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHdpbiA9ICQoJHdpbmRvdyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygndG90b3AnKTtcbiAgICAgICAgICAgICAgICAkd2luLnNjcm9sbCh0b2dnbGVJY29uKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnYScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTGVhcm5pbmcgUG9pbnQ6ICRhbmNob3JTY3JvbGwgd29ya3MsIGJ1dCBubyBhbmltYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLy8kYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB0b2dnbGVJY29uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHdpbi5zY3JvbGxUb3AoKSA+IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2xpZGVVcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1NwaW5uZXInLCBbJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHdpbmRvdykge1xuICAgICAgICAvLyBEZXNjcmlwdGlvbjpcbiAgICAgICAgLy8gIENyZWF0ZXMgYSBuZXcgU3Bpbm5lciBhbmQgc2V0cyBpdHMgb3B0aW9uc1xuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gIDxkaXYgZGF0YS1jYy1zcGlubmVyPVwidm0uc3Bpbm5lck9wdGlvbnNcIj48L2Rpdj5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHNjb3BlLnNwaW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLmNjU3Bpbm5lciwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuc3Bpbm5lcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NvcGUuc3Bpbm5lciA9IG5ldyAkd2luZG93LlNwaW5uZXIob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgc2NvcGUuc3Bpbm5lci5zcGluKGVsZW1lbnRbMF0pO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1dpZGdldEhlYWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9Vc2FnZTpcbiAgICAgICAgLy88ZGl2IGRhdGEtY2Mtd2lkZ2V0LWhlYWRlciB0aXRsZT1cInZtLm1hcC50aXRsZVwiPjwvZGl2PlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogJ0AnLFxuICAgICAgICAgICAgICAgICdzdWJ0aXRsZSc6ICdAJyxcbiAgICAgICAgICAgICAgICAncmlnaHRUZXh0JzogJ0AnLFxuICAgICAgICAgICAgICAgICdhbGxvd0NvbGxhcHNlJzogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbGF5b3V0L3dpZGdldGhlYWRlci5odG1sJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnY2xhc3MnLCAnd2lkZ2V0LWhlYWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBib290c3RyYXBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnY29tbW9uLmJvb3RzdHJhcCcsIFsndWkuYm9vdHN0cmFwJ10pO1xuXG4gICAgYm9vdHN0cmFwTW9kdWxlLmZhY3RvcnkoJ2Jvb3RzdHJhcC5kaWFsb2cnLCBbJyRtb2RhbCcsICckdGVtcGxhdGVDYWNoZScsIG1vZGFsRGlhbG9nXSk7XG5cbiAgICBmdW5jdGlvbiBtb2RhbERpYWxvZygkbW9kYWwsICR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgZGVsZXRlRGlhbG9nOiBkZWxldGVEaWFsb2csXG4gICAgICAgICAgICBjb25maXJtYXRpb25EaWFsb2c6IGNvbmZpcm1hdGlvbkRpYWxvZ1xuICAgICAgICB9O1xuXG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbW9kYWxEaWFsb2cudHBsLmh0bWwnLFxuICAgICAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgJyAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICAgJyAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgJyArXG4gICAgICAgICAgICAgICAgJyAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRhdGEtbmctY2xpY2s9XCJjYW5jZWwoKVwiPiZ0aW1lczs8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgICA8aDM+e3t0aXRsZX19PC9oMz4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvZGl2PicgK1xuICAgICAgICAgICAgICAgICcgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgICA8cD57e21lc3NhZ2V9fTwvcD4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvZGl2PicgK1xuICAgICAgICAgICAgICAgICcgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgICAgICcgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLW5nLWNsaWNrPVwib2soKVwiPnt7b2tUZXh0fX08L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pbmZvXCIgZGF0YS1uZy1jbGljaz1cImNhbmNlbCgpXCI+e3tjYW5jZWxUZXh0fX08L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnICAgIDwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBkZWxldGVEaWFsb2coaXRlbU5hbWUpIHtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9ICdDb25maXJtIERlbGV0ZSc7XG4gICAgICAgICAgICBpdGVtTmFtZSA9IGl0ZW1OYW1lIHx8ICdpdGVtJztcbiAgICAgICAgICAgIHZhciBtc2cgPSAnRGVsZXRlICcgKyBpdGVtTmFtZSArICc/JztcblxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpcm1hdGlvbkRpYWxvZyh0aXRsZSwgbXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbmZpcm1hdGlvbkRpYWxvZyh0aXRsZSwgbXNnLCBva1RleHQsIGNhbmNlbFRleHQpIHtcblxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21vZGFsRGlhbG9nLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBNb2RhbEluc3RhbmNlLFxuICAgICAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rVGV4dDogb2tUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6IGNhbmNlbFRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gJG1vZGFsLm9wZW4obW9kYWxPcHRpb25zKS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgTW9kYWxJbnN0YW5jZSA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ29wdGlvbnMnLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCAnVGl0bGUnO1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgJyc7XG4gICAgICAgICAgICAkc2NvcGUub2tUZXh0ID0gb3B0aW9ucy5va1RleHQgfHwgJ09LJztcbiAgICAgICAgICAgICRzY29wZS5jYW5jZWxUZXh0ID0gb3B0aW9ucy5jYW5jZWxUZXh0IHx8ICdDYW5jZWwnO1xuICAgICAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCdvaycpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnbXlBcHAudmVyc2lvbi5pbnRlcnBvbGF0ZS1maWx0ZXInLCBbXSlcblxuLmZpbHRlcignaW50ZXJwb2xhdGUnLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZyh0ZXh0KS5yZXBsYWNlKC9cXCVWRVJTSU9OXFwlL21nLCB2ZXJzaW9uKTtcbiAgfTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZGVzY3JpYmUoJ215QXBwLnZlcnNpb24gbW9kdWxlJywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2gobW9kdWxlKCdteUFwcC52ZXJzaW9uJykpO1xuXG4gIGRlc2NyaWJlKCdpbnRlcnBvbGF0ZSBmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgJHByb3ZpZGUudmFsdWUoJ3ZlcnNpb24nLCAnVEVTVF9WRVInKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgVkVSU0lPTicsIGluamVjdChmdW5jdGlvbihpbnRlcnBvbGF0ZUZpbHRlcikge1xuICAgICAgZXhwZWN0KGludGVycG9sYXRlRmlsdGVyKCdiZWZvcmUgJVZFUlNJT04lIGFmdGVyJykpLnRvRXF1YWwoJ2JlZm9yZSBURVNUX1ZFUiBhZnRlcicpO1xuICAgIH0pKTtcbiAgfSk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ215QXBwLnZlcnNpb24udmVyc2lvbi1kaXJlY3RpdmUnLCBbXSlcblxuLmRpcmVjdGl2ZSgnYXBwVmVyc2lvbicsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzKSB7XG4gICAgZWxtLnRleHQodmVyc2lvbik7XG4gIH07XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmRlc2NyaWJlKCdteUFwcC52ZXJzaW9uIG1vZHVsZScsIGZ1bmN0aW9uKCkge1xuICBiZWZvcmVFYWNoKG1vZHVsZSgnbXlBcHAudmVyc2lvbicpKTtcblxuICBkZXNjcmliZSgnYXBwLXZlcnNpb24gZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcmludCBjdXJyZW50IHZlcnNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS52YWx1ZSgndmVyc2lvbicsICdURVNUX1ZFUicpO1xuICAgICAgfSk7XG4gICAgICBpbmplY3QoZnVuY3Rpb24oJGNvbXBpbGUsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkY29tcGlsZSgnPHNwYW4gYXBwLXZlcnNpb24+PC9zcGFuPicpKCRyb290U2NvcGUpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC50ZXh0KCkpLnRvRXF1YWwoJ1RFU1RfVkVSJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ215QXBwLnZlcnNpb24nLCBbXG4gICdteUFwcC52ZXJzaW9uLmludGVycG9sYXRlLWZpbHRlcicsXG4gICdteUFwcC52ZXJzaW9uLnZlcnNpb24tZGlyZWN0aXZlJ1xuXSlcblxuLnZhbHVlKCd2ZXJzaW9uJywgJzAuMScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnbXlBcHAudmVyc2lvbiBtb2R1bGUnLCBmdW5jdGlvbigpIHtcbiAgYmVmb3JlRWFjaChtb2R1bGUoJ215QXBwLnZlcnNpb24nKSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnNpb24gc2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGN1cnJlbnQgdmVyc2lvbicsIGluamVjdChmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgICBleHBlY3QodmVyc2lvbikudG9FcXVhbCgnMC4xJyk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIEZvb3RlckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigpe1xuICAgICAgICAvL1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBIZWFkZXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEhlYWRlckNvbnRyb2xsZXIoKXtcbiAgICAgICAgLy9cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ29udHJvbGxlcicsIExhbmRpbmdDb250cm9sbGVyKTtcblxuXHRmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0ubGFyYXZlbF9kZXNjcmlwdGlvbiA9ICdSZXNwb25zZSBtYWNyb3MgaW50ZWdyYXRlZCB3aXRoIHlvdXIgQW5ndWxhciBhcHAnO1xuXHRcdHZtLmFuZ3VsYXJfZGVzY3JpcHRpb24gPSAnUXVlcnkgeW91ciBBUEkgd2l0aG91dCB3b3JyeWluZyBhYm91dCB2YWxpZGF0aW9ucyc7XG5cblx0XHQvKlxuXHRcdFRoaXMgaXMgYSB0ZXJyaWJsZSB0ZW1wb3JhcnkgaGFjayxcblx0XHR0byBmaXggbGF5b3V0IGlzc3VlcyB3aXRoIGZsZXggb24gaU9TIChjaHJvbWUgJiBzYWZhcmkpXG5cdFx0TWFrZSBzdXJlIHRvIHJlbW92ZSB0aGlzIHdoZW4geW91IG1vZGlmeSB0aGlzIGRlbW9cblx0XHQqL1xuXHRcdHZtLmlPUyA9IC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXHR9XG5cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdteUFwcC52aWV3MScsIFsnbmdSb3V0ZSddKVxuXG4uY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvdmlldzEnLCB7XG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3MS92aWV3MS5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnVmlldzFDdHJsJ1xuICB9KTtcbn1dKVxuXG4uY29udHJvbGxlcignVmlldzFDdHJsJywgW2Z1bmN0aW9uKCkge1xuXG59XSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnbXlBcHAudmlldzEgbW9kdWxlJywgZnVuY3Rpb24oKSB7XG5cbiAgYmVmb3JlRWFjaChtb2R1bGUoJ215QXBwLnZpZXcxJykpO1xuXG4gIGRlc2NyaWJlKCd2aWV3MSBjb250cm9sbGVyJywgZnVuY3Rpb24oKXtcblxuICAgIGl0KCdzaG91bGQgLi4uLicsIGluamVjdChmdW5jdGlvbigkY29udHJvbGxlcikge1xuICAgICAgLy9zcGVjIGJvZHlcbiAgICAgIHZhciB2aWV3MUN0cmwgPSAkY29udHJvbGxlcignVmlldzFDdHJsJyk7XG4gICAgICBleHBlY3QodmlldzFDdHJsKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pKTtcblxuICB9KTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ215QXBwLnZpZXcyJywgWyduZ1JvdXRlJ10pXG5cbi5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy92aWV3MicsIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3ZpZXcyL3ZpZXcyLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdWaWV3MkN0cmwnXG4gIH0pO1xufV0pXG5cbi5jb250cm9sbGVyKCdWaWV3MkN0cmwnLCBbZnVuY3Rpb24oKSB7XG5cbn1dKTsiLCIndXNlIHN0cmljdCc7XG5cbmRlc2NyaWJlKCdteUFwcC52aWV3MiBtb2R1bGUnLCBmdW5jdGlvbigpIHtcblxuICBiZWZvcmVFYWNoKG1vZHVsZSgnbXlBcHAudmlldzInKSk7XG5cbiAgZGVzY3JpYmUoJ3ZpZXcyIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpe1xuXG4gICAgaXQoJ3Nob3VsZCAuLi4uJywgaW5qZWN0KGZ1bmN0aW9uKCRjb250cm9sbGVyKSB7XG4gICAgICAvL3NwZWMgYm9keVxuICAgICAgdmFyIHZpZXcyQ3RybCA9ICRjb250cm9sbGVyKCdWaWV3MkN0cmwnKTtcbiAgICAgIGV4cGVjdCh2aWV3MkN0cmwpLnRvQmVEZWZpbmVkKCk7XG4gICAgfSkpO1xuXG4gIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
