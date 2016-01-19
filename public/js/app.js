(function(){
	"use strict";

	angular.module('app',
		[
        // Angular modules
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
				'partialsModule',
				'ngMessages',
				'angular-locker',
				'angular-oauth2',

        // Custom modules
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)

				// local Party Modules
				'app.controllers',
				'app.filters',
				'app.services',
				'app.directives',
				'app.routes',
				'app.config',
		]);

	angular.module('app.routes', ['ui.router']);
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'angular-loading-bar', 'angular-locker', 'angular-oauth2']);
	angular.module('app.filters', []);
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.config', []);
});

(function(routes){
  "use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return './views/' + viewName + '/' + viewName + '.html';
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
      })
      .state('app.home', {
        url: '/',
        data: {},
        views: {
          'main@': {
            templateUrl: getView('home')
          }
        }
      })
			.state('app.login', {
				url: '/',
				data: {},
				views: {
					'main@': {
						templateUrl: getView('login')
					}
				}
			});

	}]);
})();

(function(){
	"use strict";

	angular.module('app.routes').run(["$rootScope", "$mdSidenav", function($rootScope, $mdSidenav){
		$rootScope.$on("$stateChangeStart", function(event, toState){

			if (toState.data && toState.data.pageName){
				$rootScope.current_page = toState.data.pageName;
			}

		});
		$rootScope.$on("$viewContentLoaded", function(event, toState){
			window.Prism.highlightAll();
		});

		$rootScope.$on("$stateChangeSuccess", function(event, toState){
			$mdSidenav('left').close();
		});
	}]);

})();

(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

var app = angular.module('app', ['ngRoute', 'angular-oauth2', 'app.controllers']);

app.config(['$routeProvider', 'OAuthProvider', function ($routeProvider, OAuthProvider) {
        $routeProvider
                .when('/login', {
                    templateUrl: 'views/login/login.html',
                    controller: 'LoginController'
                })
                .when('/home', {
                    templateUrl: 'views/home/home.html',
                    controller: 'HomeController'
                });
        OAuthProvider.configure({
            baseUrl: 'http://larangular',
            clientId: 'app1',
            clientSecret: 'secret', // optional
            grantPath: 'oauth/access_token',
        });
    }]);

app.run(['$rootScope', '$window', 'OAuth', function ($rootScope, $window, OAuth) {
        $rootScope.$on('oauth:error', function (event, rejection) {
            // Ignore `invalid_grant` error - should be catched on `LoginController`.
            if ('invalid_grant' === rejection.data.error) {
                return;
            }

            // Refresh token when a `invalid_token` error occurs.
            if ('invalid_token' === rejection.data.error) {
                return OAuth.getRefreshToken();
            }

            // Redirect to `/login` with the `error_reason`.
            return $window.location.href = '/login?error_reason=' + rejection.data.error;
        });
    }]);

(function(){
	"use strict";

	ngjs.module('app.config').config(function($mdThemingProvider) {
		/* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */
		$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('grey')
		.warnPalette('red');
	});

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
'use strict';

angular.module('app.version.interpolate-filter', [])

.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);

'use strict';

describe('app.version module', function() {
  beforeEach(module('app.version'));

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

angular.module('app.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

'use strict';

describe('app.version module', function() {
  beforeEach(module('app.version'));

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

angular.module('app.version', [
  'app.version.interpolate-filter',
  'app.version.version-directive'
])

.value('version', '0.1');

'use strict';

describe('app.version module', function() {
  beforeEach(module('app.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

(function(){
    "use strict";

    angular.module('app.controllers').controller('AddUsersCtrl', ["$scope", "DialogService", function($scope, DialogService){

        $scope.save = function(){
	        //do something useful
            DialogService.hide();
        };

        $scope.hide = function(){
        	DialogService.hide();
        };

    }]);

})();

(function(){
	"use strict";

	angular.module( 'app.controllers' ).controller( 'DataListingCtrl', function(){
		//
    });

})();

(function(){
	"use strict";

	angular.module('app.directives').directive( 'dataListing', function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/directives/data_listing/data_listing.html',
			controller: 'DataListingCtrl',
			link: function( scope, element, attrs ){
				//
			}
		};

	});

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

angular.module('app.controllers')
        .controller('HomeController', ['$scope',function($scope){
            
        }
    ]);
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
angular.module('app.controllers')
        .controller('LoginController', ['$scope', 'OAuth', '$location', function ($scope, OAuth, $location) {
                $scope.user = {
                    username: '',
                    password: ''
                };
                $scope.error = {
                    message: '',
                    error: false
                };

                $scope.login = function () {
                    if ($scope.loginForm.$valid) {
                        OAuth.getAccessToken($scope.user)
                                .then(function () {
                                    $location.path('home');
                                }, function (data) {
                                    $scope.error.error = true;
                                    $scope.error.message = data.data.error_description;
                                });
                    }
                };

            }
        ]);
(function () {
	"use strict";
    angular
        .module('app')
        .controller('ControlPanelController', [
            '$mdDialog', '$interval',
            ControlPanelController
        ]);

    function ControlPanelController($mdDialog, $interval) {
        var vm = this;

        vm.buttonEnabled = false;
        vm.showProgress = false;
        vm.reloadServer = 'Staging';
        vm.performProgress = performProgress;
        vm.determinateValue = 10;

        function performProgress() {
            vm.showProgress = true;
            interval = $interval(function() {
                vm.determinateValue += 1;
                if (vm.determinateValue > 100) {
                    vm.determinateValue = 10;
                    vm.showProgress = false;
                    showAlert();
                    $interval.cancel(interval);
                }
            }, 50, 0, true);
        }

        function showAlert() {
            alert = $mdDialog.alert({
                title: 'Reloading done!',
                content: vm.reloadServer + " server reloaded.",
                ok: 'Close'
            });
            $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }
    }

})();

(function(){
"use strict";
  angular
       .module('app')
       .controller('MainController', [
          'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast',
          MainController
       ]);

  function MainController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast) {
    var vm = this;

    vm.menuItems = [ ];
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    vm.showActions = showActions;
    vm.title = $state.current.data.title;
    vm.showSimpleToast = showSimpleToast;

    navService
      .loadAllItems()
      .then(function(menuItems) {
        vm.menuItems = [].concat(menuItems);
      });

    function toggleItemsList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    function selectItem (item) {
      vm.title = item.name;
      vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    }

    function showActions($event) {
        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: 'app/views/partials/bottomSheet.html',
          controller: [ '$mdBottomSheet', SheetController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        function SheetController( $mdBottomSheet ) {
          var vm = this;

          vm.actions = [
            { name: 'Share', icon: 'share', url: 'https://twitter.com/intent/tweet?text=Angular%20Material%20Dashboard%20https://github.com/flatlogic/angular-material-dashboard%20via%20@flatlogicinc' },
            { name: 'Star', icon: 'star', url: 'https://github.com/flatlogic/angular-material-dashboard/stargazers' }
          ];

          vm.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

    function showSimpleToast(title) {
      $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(2000)
          .position('top right')
      );
    }
  }

})();

(function () {
  "use strict";
    angular
        .module('app')
        .controller('MemoryController', [
            MemoryController
        ]);

    function MemoryController() {
        var vm = this;

        // TODO: move data to the service
        vm.memoryChartData = [ {key: 'memory', y: 42}, { key: 'free', y: 58} ];

        vm.chartOptions = {
            chart: {
                type: 'pieChart',
                height: 210,
                donut: true,
                pie: {
                    startAngle: function (d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function (d) { return d.endAngle/2 -Math.PI/2 }
                },
                x: function (d) { return d.key; },
                y: function (d) { return d.y; },
                valueFormat: (d3.format(".0f")),
                color: ['rgb(0, 150, 136)', 'rgb(191, 191, 191)'],
                showLabels: false,
                showLegend: false,
                tooltips: false,
                title: '42%',
                titleOffset: -10,
                margin: { bottom: -80, left: -20, right: -20 }
            }
        };
    }
})();

(function(){
"use strict";
  angular
    .module('app')
    .controller('MessagesController', [
      'messagesService',
      MessagesController
    ]);

  function MessagesController(messagesService) {
    var vm = this;

    vm.messages = [];

    messagesService
      .loadAllItems()
      .then(function(messages) {
        vm.messages = [].concat(messages);
      });
  }

})();

(function () {
  "use strict";
    angular
        .module('app')
        .controller('PerformanceController', [
            'performanceService', '$q',
            PerformanceController
        ]);

    function PerformanceController(performanceService, $q) {
        var vm = this;

        vm.chartOptions = {
            chart: {
                type: 'stackedAreaChart',
                height: 350,
                margin: { left: -15, right: -15 },
                x: function (d) { return d[0] },
                y: function (d) { return d[1] },
                showLabels: false,
                showLegend: false,
                title: 'Over 9K',
                showYAxis: false,
                showXAxis: false,
                color: ['rgb(0, 150, 136)', 'rgb(204, 203, 203)', 'rgb(149, 149, 149)', 'rgb(44, 44, 44)']
            }
        };

        vm.performanceChartData = [];
        vm.performancePeriod = 'week';
        vm.changePeriod = changePeriod;

        activate();

        function activate() {
            var queries = [loadData()];
            $q.all(queries);
        }


        function loadData() {
            vm.performanceChartData = performanceService.getPerformanceData(vm.performancePeriod);
        }

        function changePeriod() {
            loadData();
        }
    }
})();

(function(){
"use strict";
  angular
    .module('app')
    .controller('ProfileController', [
      ProfileController
    ]);

  function ProfileController() {
    var vm = this;

    vm.user = {
      title: 'Admin',
      email: 'contact@flatlogic.com',
      firstName: '',
      lastName: '' ,
      company: 'FlatLogic Inc.' ,
      address: 'Fabritsiusa str, 4' ,
      city: 'Minsk' ,
      state: '' ,
      biography: 'We are young and ambitious full service design and technology company. ' +
      'Our focus is JavaScript development and User Interface design.',
      postalCode : '220007'
    };
  }

})();

(function(){
"use strict";
  angular
    .module('app')
    .controller('SearchController', [
      '$timeout', '$q', 'countriesService',
      SearchController
    ]);

  function SearchController($timeout, $q, countriesService) {
    var vm = this;

    vm.countries = countriesService.loadAll();
    vm.selectedCountry = null;
    vm.searchText = null;
    vm.querySearch = querySearch;
    vm.disableCaching = true;

    function querySearch (query) {
      var results = query ? vm.countries.filter( createFilterFor(query) ) : [],
        deferred;
      deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();

(function(){
"use strict";
  angular
    .module('app')
    .controller('TableController', [
      'tableService',
      TableController
    ]);

  function TableController(tableService) {
    var vm = this;

    vm.tableData = [];

    tableService
      .loadAllItems()
      .then(function(tableData) {
        vm.tableData = [].concat(tableData);
      });
  }

})();

(function () {
  "use strict";
    angular
        .module('app')
        .controller('TodoController', [
            'todoListService',
            TodoController
        ]);

    function TodoController(todoListService) {
        var vm = this;

        vm.addTodo = addTodo;
        vm.remaining = remaining;
        vm.archive = archive;
        vm.toggleAll = toggleAll;
        vm.todos = [];

        todoListService
            .loadAllItems()
            .then(function (todos) {
                vm.todos = [].concat(todos);
            });

        function addTodo() {
            vm.todos.push({text: vm.todoText, done: false});
            vm.todoText = '';
        }

        function remaining() {
            var count = 0;
            angular.forEach(vm.todos, function (todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        }

        function archive(e) {
            // Prevent from submitting
            e.preventDefault();
            var oldTodos = vm.todos;
            vm.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) vm.todos.push(todo);
            });
        }

        function toggleAll() {
            if (remaining() == 0) {
                angular.forEach(vm.todos, function (todo) {
                    todo.done = false;
                });
            } else {
                angular.forEach(vm.todos, function (todo) {
                    todo.done = true;
                });
            }
        }
    }
})();

(function () {
  "use strict";
    angular
        .module('app')
        .controller('UsageController', [
            UsageController
        ]);

    function UsageController() {
        var vm = this;

        // TODO: move data to the service
        vm.ramChartData = [{key: 'Memory', y: 768660}, { key: 'Cache', y: 367404}, {key: 'Swap', y: 41924 }];
        vm.storageChartData = [{key: 'System', y: 126560}, {key: 'Other', y: 224365 }];

        vm.chartOptions = {
            chart: {
                type: 'pieChart',
                height: 130,
                donut: true,
                x: function (d) { return d.key; },
                y: function (d) { return d.y; },
                valueFormat: (d3.format(".0f")),
                color: ['rgb(0, 150, 136)', '#E75753', 'rgb(235, 235, 235)'],
                showLabels: false,
                showLegend: false,
                title: '83%',
                margin: { top: -10, left: -20, right: -20 }
            }
        };
    }
})();

(function () {
  "use strict";
    angular
        .module('app')
        .controller('VisitorsController', [
            VisitorsController
        ]);

    function VisitorsController() {
        var vm = this;

        // TODO: move data to the service
        vm.visitorsChartData = [ {key: 'Mobile', y: 5264}, { key: 'Desktop', y: 3872} ];

        vm.chartOptions = {
            chart: {
                type: 'pieChart',
                height: 210,
                donut: true,
                x: function (d) { return d.key; },
                y: function (d) { return d.y; },
                valueFormat: (d3.format(".0f")),
                color: ['rgb(0, 150, 136)', '#E75753'],
                showLabels: false,
                showLegend: false,
                title: 'Over 9K',
                margin: { top: -10 }
            }
        };
    }
})();

(function () {
  "use strict";
    angular
        .module('app')
        .controller('WarningsController', [
            WarningsController
        ]);

    function WarningsController() {
        var vm = this;

        // TODO: move data to the service
        vm.warningsChartData = warningFunction;

        function warningFunction() {
            var sin = [];
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.abs(Math.cos(i/10) *0.25*i + 0.9 - 0.4*i)});
            }
            return [ { values: sin, color: 'rgb(0, 150, 136)', area: true } ];
        }

        vm.chartOptions = {
            chart: {
                type: 'lineChart',
                height: 210,
                margin: { top: -10, left: -20, right: -20 },
                x: function (d) { return d.x },
                y: function (d) { return d.y },
                showLabels: false,
                showLegend: false,
                title: 'Over 9K',
                showYAxis: false,
                showXAxis: false,
                tooltip: { contentGenerator: function (d) { return '<span class="custom-tooltip">' + Math.round(d.point.y) + '</span>' } }
            }
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2xvYWRpbmdfYmFyLmNvbmZpZy5qcyIsImNvbmZpZy9zdGFydC5jb25maWcuanMiLCJjb25maWcvdGhlbWUuY29uZmlnLmpzIiwiZTJlLXRlc3RzL3Byb3RyYWN0b3IuY29uZi5qcyIsImUyZS10ZXN0cy9zY2VuYXJpb3MuanMiLCJmaWx0ZXJzL2NhcGl0YWxpemUuZmlsdGVyLmpzIiwiZmlsdGVycy9odW1hbl9yZWFkYWJsZS5maWx0ZXIuanMiLCJmaWx0ZXJzL3RydW5jYXRlX2NoYXJhY3RlcnMuZmlsdGVyLmpzIiwiZmlsdGVycy90cnVuY2F0ZV93b3Jkcy5qcyIsImZpbHRlcnMvdHJ1c3RfaHRtbC5maWx0ZXIuanMiLCJmaWx0ZXJzL3VjZmlyc3QuZmlsdGVyLmpzIiwic2VydmljZXMvQVBJLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb21tb24uanMiLCJzZXJ2aWNlcy9kYXRhY29udGV4dC5qcyIsInNlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlLmpzIiwic2VydmljZXMvZGlyZWN0aXZlcy5qcyIsInNlcnZpY2VzL2xvZ2dlci5qcyIsInNlcnZpY2VzL3NwaW5uZXIuanMiLCJzZXJ2aWNlcy90b2FzdC5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL2ludGVycG9sYXRlLWZpbHRlci5qcyIsImNvbXBvbmVudHMvdmVyc2lvbi9pbnRlcnBvbGF0ZS1maWx0ZXJfdGVzdC5qcyIsImNvbXBvbmVudHMvdmVyc2lvbi92ZXJzaW9uLWRpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvdmVyc2lvbi92ZXJzaW9uLWRpcmVjdGl2ZV90ZXN0LmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL3ZlcnNpb24uanMiLCJjb21wb25lbnRzL3ZlcnNpb24vdmVyc2lvbl90ZXN0LmpzIiwiZGlhbG9ncy9hZGRfdXNlcnMvYWRkX3VzZXJzLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGF0YV9saXN0aW5nLmpzIiwiZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGVmaW5pdGlvbi5qcyIsImFwcC92aWV3cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmpzIiwiYXBwL3ZpZXdzL2Zvb3Rlci9mb290ZXIuY29udHJvbGxlci5qcyIsImFwcC92aWV3cy9oZWFkZXIvaGVhZGVyLmNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvaG9tZS9ob21lLmpzIiwiYXBwL3ZpZXdzL2xhbmRpbmcvbGFuZGluZy5jb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL2xheW91dC9zaGVsbC5qcyIsImFwcC92aWV3cy9sb2dpbi9sb2dpbi5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9Db250cm9sUGFuZWxDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL01haW5Db250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL01lbW9yeUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvTWVzc2FnZXNDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL1BlcmZvcm1hbmNlQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9Qcm9maWxlQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9TZWFyY2hDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL1RhYmxlQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9Ub2RvQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9Vc2FnZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvVmlzaXRvcnNDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL1dhcm5pbmdzQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9zaWRlYmFyL3NpZGViYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBO0VBQ0E7O1FBRUE7UUFD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LFdBQUE7SUFDQSxRQUFBLElBQUE7SUFDQSxPQUFBLFFBQUEscUJBQUEsUUFBQTs7OztFQUlBLFNBQUEsU0FBQSxXQUFBOztJQUVBLFdBQUEsV0FBQTtNQUNBLFFBQUEsSUFBQTs7OztJQUlBLEdBQUEscURBQUEsV0FBQTtNQUNBLE9BQUEsUUFBQSxJQUFBLEdBQUEsSUFBQSxnQkFBQSxRQUFBO1FBQ0EsUUFBQTs7Ozs7O0VBTUEsU0FBQSxTQUFBLFdBQUE7O0lBRUEsV0FBQSxXQUFBO01BQ0EsUUFBQSxJQUFBOzs7O0lBSUEsR0FBQSxxREFBQSxXQUFBO01BQ0EsT0FBQSxRQUFBLElBQUEsR0FBQSxJQUFBLGdCQUFBLFFBQUE7UUFDQSxRQUFBOzs7Ozs7QUNyQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxjQUFBLFVBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQTtHQUNBLE9BQUEsQ0FBQSxTQUFBLE1BQUEsUUFBQSxzQkFBQSxTQUFBLElBQUE7SUFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO1FBQ0E7Ozs7O0FDUEEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGVBQUEsUUFBQSxpQkFBQSxVQUFBO0VBQ0EsT0FBQSxTQUFBLFNBQUEsS0FBQTtHQUNBLEtBQUEsQ0FBQSxLQUFBO0lBQ0EsT0FBQTs7R0FFQSxJQUFBLFFBQUEsSUFBQSxNQUFBO0dBQ0EsS0FBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsUUFBQSxLQUFBO0lBQ0EsTUFBQSxLQUFBLE1BQUEsR0FBQSxPQUFBLEdBQUEsZ0JBQUEsTUFBQSxHQUFBLE1BQUE7O0dBRUEsT0FBQSxNQUFBLEtBQUE7Ozs7QUNaQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLHNCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLGFBQUE7WUFDQSxJQUFBLE1BQUEsUUFBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxHQUFBO2dCQUNBLE9B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QSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLE1BQUEsS0FBQSxRQUFBO1lBQ0EsTUFBQSxLQUFBO1lBQ0EsUUFBQSxNQUFBOztZQUVBLFNBQUEsUUFBQSxHQUFBO2dCQUNBLEVBQUE7Z0JBQ0EsUUFBQSxTQUFBLFNBQUEsU0FBQSxLQUFBOzs7OztJQUtBLElBQUEsVUFBQSxvQkFBQSxZQUFBOzs7OztRQUtBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTs7WUFFQSxNQUFBLEtBQUEsUUFBQTtZQUNBLE1BQUEsS0FBQTtZQUNBLFFBQUEsTUFBQTs7WUFFQSxTQUFBLFNBQUEsR0FBQTtnQkFDQSxFQUFBO2dCQUNBLElBQUEsWUFBQSxRQUFBLFNBQUEsU0FBQSxLQUFBO2dCQUNBLElBQUEsV0FBQSxRQUFBLFNBQUE7Z0JBQ0EsSUFBQSxVQUFBLEdBQUEsYUFBQTtvQkFDQSxTQUFBLFlBQUE7b0JBQ0EsU0FBQSxTQUFBO3VCQUNBO29CQUNBLFNBQUEsWUFBQTtvQkFDQSxTQUFBLFNBQUE7O2dCQUVBLFVBQUEsT0FBQTs7Ozs7SUFLQSxJQUFBLFVBQUEsaUJBQUEsQ0FBQTs7Ozs7OztRQU9BLFVBQUEsU0FBQTtZQUNBLElBQUEsWUFBQTtnQkFDQSxNQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsVUFBQTs7WUFFQSxPQUFBOztZQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtnQkFDQSxJQUFBLE9BQUEsRUFBQTtnQkFDQSxRQUFBLFNBQUE7Z0JBQ0EsS0FBQSxPQUFBOztnQkFFQSxRQUFBLEtBQUEsS0FBQSxNQUFBLFVBQUEsR0FBQTtvQkFDQSxFQUFBOzs7b0JBR0EsRUFBQSxRQUFBLFFBQUEsRUFBQSxXQUFBLEtBQUE7OztnQkFHQSxTQUFBLGFBQUE7b0JBQ0EsSUFBQSxLQUFBLGNBQUEsS0FBQTt3QkFDQSxRQUFBOzJCQUNBO3dCQUNBLFFBQUE7Ozs7Ozs7SUFPQSxJQUFBLFVBQUEsYUFBQSxDQUFBLFdBQUEsVUFBQSxTQUFBOzs7OztRQUtBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0EsTUFBQSxVQUFBO1lBQ0EsTUFBQSxPQUFBLE1BQUEsV0FBQSxVQUFBLFNBQUE7Z0JBQ0EsSUFBQSxNQUFBLFNBQUE7b0JBQ0EsTUFBQSxRQUFBOztnQkFFQSxNQUFBLFVBQUEsSUFBQSxRQUFBLFFBQUE7Z0JBQ0EsTUFBQSxRQUFBLEtBQUEsUUFBQTtlQUNBOzs7O0lBSUEsSUFBQSxVQUFBLGtCQUFBLFlBQUE7OztRQUdBLElBQUEsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO2dCQUNBLFNBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxhQUFBO2dCQUNBLGlCQUFBOztZQUVBLGFBQUE7WUFDQSxVQUFBOztRQUVBLE9BQUE7O1FBRUEsU0FBQSxLQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0EsTUFBQSxLQUFBLFNBQUE7Ozs7QUN6TUEsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLFVBQUEsUUFBQSxVQUFBLENBQUEsUUFBQTs7SUFFQSxTQUFBLE9BQUEsTUFBQTtRQUNBLElBQUEsVUFBQTtZQUNBLFVBQUE7WUFDQSxLQUFBO1lBQ0EsVUFBQTtZQUNBLFlBQUE7WUFDQSxZQUFBOzs7UUFHQSxPQUFBOztRQUVBLFNBQUEsU0FBQSxVQUFBLFFBQUE7WUFDQSxTQUFBLFVBQUE7WUFDQSxRQUFBLE9BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxTQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsU0FBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLFNBQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxTQUFBO29CQUNBOzs7WUFHQSxJQUFBLFFBQUEsUUFBQSxXQUFBLFFBQUE7WUFDQSxPQUFBLFVBQUEsS0FBQSxNQUFBLFdBQUE7Z0JBQ0EsTUFBQSxLQUFBLE1BQUEsVUFBQSxDQUFBLGNBQUEsYUFBQSxPQUFBOzs7O1FBSUEsU0FBQSxJQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7WUFDQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7OztRQUdBLFNBQUEsV0FBQSxTQUFBLE1BQUEsUUFBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBOzs7UUFHQSxTQUFBLFdBQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTs7O1FBR0EsU0FBQSxTQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7WUFDQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7OztRQUdBLFNBQUEsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBLFdBQUE7WUFDQSxJQUFBLFFBQUEsQ0FBQSxjQUFBLFdBQUEsS0FBQSxRQUFBLEtBQUE7WUFDQSxTQUFBLFNBQUEsTUFBQSxTQUFBLE9BQUE7WUFDQSxNQUFBLFFBQUEsU0FBQTtZQUNBLElBQUEsV0FBQTtnQkFDQSxJQUFBLGNBQUEsU0FBQTtvQkFDQSxPQUFBLE1BQUE7dUJBQ0EsSUFBQSxjQUFBLFdBQUE7b0JBQ0EsT0FBQSxRQUFBO3VCQUNBLElBQUEsY0FBQSxXQUFBO29CQUNBLE9BQUEsUUFBQTt1QkFDQTtvQkFDQSxPQUFBLEtBQUE7Ozs7OztBQ25FQSxDQUFBLFlBQUE7SUFDQTs7Ozs7SUFLQSxRQUFBLE9BQUE7U0FDQSxRQUFBLFdBQUEsQ0FBQSxVQUFBLGdCQUFBOztJQUVBLFNBQUEsUUFBQSxRQUFBLGNBQUE7UUFDQSxJQUFBLFVBQUE7WUFDQSxhQUFBO1lBQ0EsYUFBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLGNBQUE7WUFDQSxjQUFBOzs7UUFHQSxTQUFBLGNBQUE7WUFDQSxjQUFBOzs7UUFHQSxTQUFBLGNBQUEsTUFBQTtZQUNBLE9BQUEsV0FBQSxhQUFBLE9BQUEsb0JBQUEsRUFBQSxNQUFBOzs7O0FDMUJBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLDZCQUFBLFNBQUEsU0FBQTs7RUFFQSxJQUFBLFFBQUE7R0FDQSxXQUFBO0dBQ0EsU0FBQTs7RUFFQSxPQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUE7SUFDQSxJQUFBLENBQUEsUUFBQTtLQUNBLE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0E7O0FBRUEsUUFBQSxPQUFBLGtDQUFBOztDQUVBLE9BQUEsZUFBQSxDQUFBLFdBQUEsU0FBQSxTQUFBO0VBQ0EsT0FBQSxTQUFBLE1BQUE7SUFDQSxPQUFBLE9BQUEsTUFBQSxRQUFBLGlCQUFBOzs7O0FDTkE7O0FBRUEsU0FBQSxzQkFBQSxXQUFBO0VBQ0EsV0FBQSxPQUFBOztFQUVBLFNBQUEsc0JBQUEsV0FBQTtJQUNBLFdBQUEsT0FBQSxTQUFBLFVBQUE7TUFDQSxTQUFBLE1BQUEsV0FBQTs7O0lBR0EsR0FBQSwwQkFBQSxPQUFBLFNBQUEsbUJBQUE7TUFDQSxPQUFBLGtCQUFBLDJCQUFBLFFBQUE7Ozs7O0FDWEE7O0FBRUEsUUFBQSxPQUFBLGlDQUFBOztDQUVBLFVBQUEsY0FBQSxDQUFBLFdBQUEsU0FBQSxTQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUEsS0FBQSxPQUFBO0lBQ0EsSUFBQSxLQUFBOzs7O0FDTkE7O0FBRUEsU0FBQSxzQkFBQSxXQUFBO0VBQ0EsV0FBQSxPQUFBOztFQUVBLFNBQUEseUJBQUEsV0FBQTtJQUNBLEdBQUEsZ0NBQUEsV0FBQTtNQUNBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsU0FBQSxNQUFBLFdBQUE7O01BRUEsT0FBQSxTQUFBLFVBQUEsWUFBQTtRQUNBLElBQUEsVUFBQSxTQUFBLDZCQUFBO1FBQ0EsT0FBQSxRQUFBLFFBQUEsUUFBQTs7Ozs7O0FDWkE7O0FBRUEsUUFB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QSxHQUFBLGlCQUFBOztJQUVBLFNBQUEsYUFBQSxPQUFBO01BQ0EsSUFBQSxVQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUEsZ0JBQUEsV0FBQTtRQUNBO01BQ0EsV0FBQSxHQUFBO01BQ0EsU0FBQSxZQUFBLEVBQUEsU0FBQSxTQUFBLGNBQUEsS0FBQSxXQUFBLE1BQUE7TUFDQSxPQUFBLFNBQUE7OztJQUdBLFNBQUEsZ0JBQUEsT0FBQTtNQUNBLElBQUEsaUJBQUEsUUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLFNBQUEsT0FBQTtRQUNBLFFBQUEsTUFBQSxNQUFBLFFBQUEsb0JBQUE7Ozs7OztBQzdCQSxDQUFBLFVBQUE7QUFDQTtFQUNBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsbUJBQUE7TUFDQTtNQUNBOzs7RUFHQSxTQUFBLGdCQUFBLGNBQUE7SUFDQSxJQUFBLEtBQUE7O0lBRUEsR0FBQSxZQUFBOztJQUVBO09BQ0E7T0FDQSxLQUFBLFNBQUEsV0FBQTtRQUNBLEdBQUEsWUFBQSxHQUFBLE9BQUE7Ozs7OztBQ2pCQSxDQUFBLFlBQUE7RUFDQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7WUFDQTtZQUNBOzs7SUFHQSxTQUFBLGVBQUEsaUJBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxRQUFBOztRQUVBO2FBQ0E7YUFDQSxLQUFBLFVBQUEsT0FBQTtnQkFDQSxHQUFBLFFBQUEsR0FBQSxPQUFBOzs7UUFHQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE1BQUEsS0FBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLE1BQUE7WUFDQSxHQUFBLFdBQUE7OztRQUdBLFNBQUEsWUFBQTtZQUNBLElBQUEsUUFBQTtZQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsVUFBQSxNQUFBO2dCQUNBLFNBQUEsS0FBQSxPQUFBLElBQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxRQUFBLEdBQUE7O1lBRUEsRUFBQTtZQUNBLElBQUEsV0FBQSxHQUFBO1lBQ0EsR0FBQSxRQUFBO1lBQ0EsUUFBQSxRQUFBLFVBQUEsVUFBQSxNQUFBO2dCQUNBLElBQUEsQ0FBQSxLQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUE7Ozs7UUFJQSxTQUFBLFlBQUE7WUFDQSxJQUFBLGVBQUEsR0FBQTtnQkFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFVBQUEsTUFBQTtvQkFDQSxLQUFBLE9BQUE7O21CQUVBO2dCQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsVUFBQSxNQUFBO29CQUNBLEtBQUEsT0FBQTs7Ozs7OztBQ3REQSxDQUFBLFlBQUE7RUFDQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsbUJBQUE7WUFDQTs7O0lBR0EsU0FBQSxrQkFBQTtRQUNBLElBQUEsS0FBQTs7O1FBR0EsR0FBQSxlQUFBLENBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxTQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsU0FBQSxDQUFBLEtBQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxtQkFBQSxDQUFBLENBQUEsS0FBQSxVQUFBLEdBQUEsU0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFBOztRQUVBLEdBQUEsZUFBQTtZQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsR0FBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7Z0JBQ0EsR0FBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7Z0JBQ0EsY0FBQSxHQUFBLE9BQUE7Z0JBQ0EsT0FBQSxDQUFBLG9CQUFBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQTs7Ozs7O0FDM0JBLENBQUEsWUFBQTtFQUNBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTtZQUNBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLG9CQUFBLEVBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBLEVBQUEsS0FBQSxXQUFBLEdBQUE7O1FBRUEsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxjQUFBLEdBQUEsT0FBQTtnQkFDQSxPQUFBLENBQUEsb0JBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQTs7Ozs7O0FDMUJBLENBQUEsWUFBQTtFQUNBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTtZQUNBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLG9CQUFBOztRQUVBLFNBQUEsa0JBQUE7WUFDQSxJQUFBLE1BQUE7WUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxLQUFBO2dCQUNBLElBQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsSUFBQSxNQUFBLElBQUE7O1lBRUEsT0FBQSxFQUFBLEVBQUEsUUFBQSxLQUFBLE9BQUEsb0JBQUEsTUFBQTs7O1FBR0EsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxZQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxXQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsU0FBQSxFQUFBLGtCQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsa0NBQUEsS0FBQSxNQUFBLEVBQUEsTUFBQSxLQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxlQUFBO0lBQ0EsUUFBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLENBQUEsVUFBQSxVQUFBOztJQUVBLFNBQUEsUUFBQSxRQUFBLFFBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQSxFQUFBOztRQUVBLFNBQUEsZUFBQTtZQUNBLEdBQUEsWUFBQSxPQUFBLE9BQUEsU0FBQSxHQUFBO2dCQUNBLE9BQUEsRUFBQSxPQUFBLFlBQUEsRUFBQSxPQUFBLFNBQUE7ZUFDQSxLQUFBLFNBQUEsSUFBQSxJQUFBO2dCQUNBLE9BQUEsR0FBQSxPQUFBLFNBQUEsTUFBQSxHQUFBLE9BQUEsU0FBQTs7OztRQUlBLFNBQUEsVUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE1BQUEsT0FBQSxTQUFBLENBQUEsT0FBQSxXQUFBLENBQUEsT0FBQSxRQUFBLE9BQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFdBQUEsTUFBQSxPQUFBO1lBQ0EsT0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEdBQUEsU0FBQSxZQUFBLFdBQUEsWUFBQTs7O0tBR0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxuXHRcdFtcbiAgICAgICAgLy8gQW5ndWxhciBtb2R1bGVzXG4gICAgICAgICduZ0FuaW1hdGUnLCAgICAgICAgLy8gYW5pbWF0aW9uc1xuICAgICAgICAnbmdSb3V0ZScsICAgICAgICAgIC8vIHJvdXRpbmdcbiAgICAgICAgJ25nU2FuaXRpemUnLCAgICAgICAvLyBzYW5pdGl6ZXMgaHRtbCBiaW5kaW5ncyAoZXg6IHNpZGViYXIuanMpXG5cdFx0XHRcdCdwYXJ0aWFsc01vZHVsZScsXG5cdFx0XHRcdCduZ01lc3NhZ2VzJyxcblx0XHRcdFx0J2FuZ3VsYXItbG9ja2VyJyxcblx0XHRcdFx0J2FuZ3VsYXItb2F1dGgyJyxcblxuICAgICAgICAvLyBDdXN0b20gbW9kdWxlc1xuICAgICAgICAnY29tbW9uJywgICAgICAgICAgIC8vIGNvbW1vbiBmdW5jdGlvbnMsIGxvZ2dlciwgc3Bpbm5lclxuICAgICAgICAnY29tbW9uLmJvb3RzdHJhcCcsIC8vIGJvb3RzdHJhcCBkaWFsb2cgd3JhcHBlciBmdW5jdGlvbnNcblxuICAgICAgICAvLyAzcmQgUGFydHkgTW9kdWxlc1xuICAgICAgICAndWkuYm9vdHN0cmFwJywgICAgICAvLyB1aS1ib290c3RyYXAgKGV4OiBjYXJvdXNlbCwgcGFnaW5hdGlvbiwgZGlhbG9nKVxuXG5cdFx0XHRcdC8vIGxvY2FsIFBhcnR5IE1vZHVsZXNcblx0XHRcdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0XHRcdCdhcHAuZmlsdGVycycsXG5cdFx0XHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdFx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdFx0XHQnYXBwLnJvdXRlcycsXG5cdFx0XHRcdCdhcHAuY29uZmlnJyxcblx0XHRdKTtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICduZ1N0b3JhZ2UnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICdhbmd1bGFyLWxvY2tlcicsICdhbmd1bGFyLW9hdXRoMiddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xufSk7XG4iLCIoZnVuY3Rpb24ocm91dGVzKXtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG5cblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKXtcblx0XHRcdHJldHVybiAnLi92aWV3cy8nICsgdmlld05hbWUgKyAnLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XG5cdFx0fTtcblxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cdFx0XHQuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvb3Rlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtYWluOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuICAgICAgLnN0YXRlKCdhcHAubGFuZGluZycsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIGRhdGE6IHt9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICdtYWluQCc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgZGF0YToge30sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ21haW5AJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hvbWUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblx0XHRcdC5zdGF0ZSgnYXBwLmxvZ2luJywge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0ZGF0YToge30sXG5cdFx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdFx0J21haW5AJzoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbWRTaWRlbmF2KXtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpe1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblx0XHRcdHdpbmRvdy5QcmlzbS5oaWdobGlnaHRBbGwoKTtcblx0XHR9KTtcblxuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ2FuZ3VsYXItb2F1dGgyJywgJ2FwcC5jb250cm9sbGVycyddKTtcblxuYXBwLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJ09BdXRoUHJvdmlkZXInLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIsIE9BdXRoUHJvdmlkZXIpIHtcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignL2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9ob21lJywge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBPQXV0aFByb3ZpZGVyLmNvbmZpZ3VyZSh7XG4gICAgICAgICAgICBiYXNlVXJsOiAnaHR0cDovL2xhcmFuZ3VsYXInLFxuICAgICAgICAgICAgY2xpZW50SWQ6ICdhcHAxJyxcbiAgICAgICAgICAgIGNsaWVudFNlY3JldDogJ3NlY3JldCcsIC8vIG9wdGlvbmFsXG4gICAgICAgICAgICBncmFudFBhdGg6ICdvYXV0aC9hY2Nlc3NfdG9rZW4nLFxuICAgICAgICB9KTtcbiAgICB9XSk7XG5cbmFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyR3aW5kb3cnLCAnT0F1dGgnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHdpbmRvdywgT0F1dGgpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ29hdXRoOmVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCByZWplY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBgaW52YWxpZF9ncmFudGAgZXJyb3IgLSBzaG91bGQgYmUgY2F0Y2hlZCBvbiBgTG9naW5Db250cm9sbGVyYC5cbiAgICAgICAgICAgIGlmICgnaW52YWxpZF9ncmFudCcgPT09IHJlamVjdGlvbi5kYXRhLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZWZyZXNoIHRva2VuIHdoZW4gYSBgaW52YWxpZF90b2tlbmAgZXJyb3Igb2NjdXJzLlxuICAgICAgICAgICAgaWYgKCdpbnZhbGlkX3Rva2VuJyA9PT0gcmVqZWN0aW9uLmRhdGEuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT0F1dGguZ2V0UmVmcmVzaFRva2VuKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlZGlyZWN0IHRvIGAvbG9naW5gIHdpdGggdGhlIGBlcnJvcl9yZWFzb25gLlxuICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbG9naW4/ZXJyb3JfcmVhc29uPScgKyByZWplY3Rpb24uZGF0YS5lcnJvcjtcbiAgICAgICAgfSk7XG4gICAgfV0pO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdG5nanMubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xuXHRcdC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2luZGlnbycpXG5cdFx0LmFjY2VudFBhbGV0dGUoJ2dyZXknKVxuXHRcdC53YXJuUGFsZXR0ZSgncmVkJyk7XG5cdH0pO1xuXG59KSgpO1xuIiwiZXhwb3J0cy5jb25maWcgPSB7XG4gIGFsbFNjcmlwdHNUaW1lb3V0OiAxMTAwMCxcblxuICBzcGVjczogW1xuICAgICcqLmpzJ1xuICBdLFxuXG4gIGNhcGFiaWxpdGllczoge1xuICAgICdicm93c2VyTmFtZSc6ICdjaHJvbWUnXG4gIH0sXG5cbiAgYmFzZVVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcHAvJyxcblxuICBmcmFtZXdvcms6ICdqYXNtaW5lJyxcblxuICBqYXNtaW5lTm9kZU9wdHM6IHtcbiAgICBkZWZhdWx0VGltZW91dEludGVydmFsOiAzMDAwMFxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9wcm90cmFjdG9yL2Jsb2IvbWFzdGVyL2RvY3MvdG9jLm1kICovXG5cbmRlc2NyaWJlKCdteSBhcHAnLCBmdW5jdGlvbigpIHtcblxuXG4gIGl0KCdzaG91bGQgYXV0b21hdGljYWxseSByZWRpcmVjdCB0byAvdmlldzEgd2hlbiBsb2NhdGlvbiBoYXNoL2ZyYWdtZW50IGlzIGVtcHR5JywgZnVuY3Rpb24oKSB7XG4gICAgYnJvd3Nlci5nZXQoJ2luZGV4Lmh0bWwnKTtcbiAgICBleHBlY3QoYnJvd3Nlci5nZXRMb2NhdGlvbkFic1VybCgpKS50b01hdGNoKFwiL3ZpZXcxXCIpO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCd2aWV3MScsIGZ1bmN0aW9uKCkge1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGJyb3dzZXIuZ2V0KCdpbmRleC5odG1sIy92aWV3MScpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB2aWV3MSB3aGVuIHVzZXIgbmF2aWdhdGVzIHRvIC92aWV3MScsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KGVsZW1lbnQuYWxsKGJ5LmNzcygnW25nLXZpZXddIHAnKSkuZmlyc3QoKS5nZXRUZXh0KCkpLlxuICAgICAgICB0b01hdGNoKC9wYXJ0aWFsIGZvciB2aWV3IDEvKTtcbiAgICB9KTtcblxuICB9KTtcblxuXG4gIGRlc2NyaWJlKCd2aWV3MicsIGZ1bmN0aW9uKCkge1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGJyb3dzZXIuZ2V0KCdpbmRleC5odG1sIy92aWV3MicpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB2aWV3MiB3aGVuIHVzZXIgbmF2aWdhdGVzIHRvIC92aWV3MicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KGVsZW1lbnQuYWxsKGJ5LmNzcygnW25nLXZpZXddIHAnKSkuZmlyc3QoKS5nZXRUZXh0KCkpLlxuICAgICAgICB0b01hdGNoKC9wYXJ0aWFsIGZvciB2aWV3IDIvKTtcbiAgICB9KTtcblxuICB9KTtcbn0pO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdFx0cmV0dXJuIChpbnB1dCkgPyBpbnB1dC5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLGZ1bmN0aW9uKHR4dCl7XG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR9KSA6ICcnO1xuXHRcdH07XG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdodW1hblJlYWRhYmxlJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XG5cdFx0XHRpZiAoICFzdHIgKXtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWdzID0gc3RyLnNwbGl0KCdfJyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdzLmpvaW4oJyAnKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZUNoYXJhY3RlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNoYXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFicmVha09uV29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RzcGFjZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aC0xKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd0cnVuY2F0ZVdvcmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3b3JkcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0V29yZHMgPSBpbnB1dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAndHJ1c3RIdG1sJywgZnVuY3Rpb24oICRzY2UgKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGh0bWwgKXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmICggIWlucHV0ICl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlucHV0LnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHRcdH07XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgnQVBJJywgZnVuY3Rpb24oUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgJGxvY2FsU3RvcmFnZSkge1xuXG5cdFx0Ly9jb250ZW50IG5lZ290aWF0aW9uXG5cdFx0dmFyIGhlYWRlcnMgPSB7XG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0J0FjY2VwdCc6ICdhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvbidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLndpdGhDb25maWcoZnVuY3Rpb24oUmVzdGFuZ3VsYXJDb25maWd1cmVyKSB7XG5cdFx0XHRSZXN0YW5ndWxhckNvbmZpZ3VyZXJcblx0XHRcdFx0LnNldEJhc2VVcmwoJy9hcGkvJylcblx0XHRcdFx0LnNldERlZmF1bHRIZWFkZXJzKGhlYWRlcnMpXG5cdFx0XHRcdC5zZXRFcnJvckludGVyY2VwdG9yKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDIyKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBlcnJvciBpbiByZXNwb25zZS5kYXRhLmVycm9ycykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gVG9hc3RTZXJ2aWNlLmVycm9yKHJlc3BvbnNlLmRhdGEuZXJyb3JzW2Vycm9yXVswXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuYWRkRnVsbFJlcXVlc3RJbnRlcmNlcHRvcihmdW5jdGlvbihlbGVtZW50LCBvcGVyYXRpb24sIHdoYXQsIHVybCwgaGVhZGVycykge1xuXHRcdFx0XHRcdGlmICgkbG9jYWxTdG9yYWdlLmp3dCkge1xuXHRcdFx0XHRcdFx0aGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgJGxvY2FsU3RvcmFnZS5qd3Q7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIERlZmluZSB0aGUgY29tbW9uIG1vZHVsZVxuICAgIC8vIENvbnRhaW5zIHNlcnZpY2VzOlxuICAgIC8vICAtIGNvbW1vblxuICAgIC8vICAtIGxvZ2dlclxuICAgIC8vICAtIHNwaW5uZXJcbiAgICB2YXIgY29tbW9uTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2NvbW1vbicsIFtdKTtcblxuICAgIC8vIE11c3QgY29uZmlndXJlIHRoZSBjb21tb24gc2VydmljZSBhbmQgc2V0IGl0c1xuICAgIC8vIGV2ZW50cyB2aWEgdGhlIGNvbW1vbkNvbmZpZ1Byb3ZpZGVyXG4gICAgY29tbW9uTW9kdWxlLnByb3ZpZGVyKCdjb21tb25Db25maWcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICAgICAgLy8gVGhlc2UgYXJlIHRoZSBwcm9wZXJ0aWVzIHdlIG5lZWQgdG8gc2V0XG4gICAgICAgICAgICAvL2NvbnRyb2xsZXJBY3RpdmF0ZVN1Y2Nlc3NFdmVudDogJycsXG4gICAgICAgICAgICAvL3NwaW5uZXJUb2dnbGVFdmVudDogJydcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jb25maWdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBjb21tb25Nb2R1bGUuZmFjdG9yeSgnY29tbW9uJyxcbiAgICAgICAgWyckcScsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgJ2NvbW1vbkNvbmZpZycsICdsb2dnZXInLCBjb21tb25dKTtcblxuICAgIGZ1bmN0aW9uIGNvbW1vbigkcSwgJHJvb3RTY29wZSwgJHRpbWVvdXQsIGNvbW1vbkNvbmZpZywgbG9nZ2VyKSB7XG4gICAgICAgIHZhciB0aHJvdHRsZXMgPSB7fTtcblxuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIC8vIGNvbW1vbiBhbmd1bGFyIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgJGJyb2FkY2FzdDogJGJyb2FkY2FzdCxcbiAgICAgICAgICAgICRxOiAkcSxcbiAgICAgICAgICAgICR0aW1lb3V0OiAkdGltZW91dCxcbiAgICAgICAgICAgIC8vIGdlbmVyaWNcbiAgICAgICAgICAgIGFjdGl2YXRlQ29udHJvbGxlcjogYWN0aXZhdGVDb250cm9sbGVyLFxuICAgICAgICAgICAgY3JlYXRlU2VhcmNoVGhyb3R0bGU6IGNyZWF0ZVNlYXJjaFRocm90dGxlLFxuICAgICAgICAgICAgZGVib3VuY2VkVGhyb3R0bGU6IGRlYm91bmNlZFRocm90dGxlLFxuICAgICAgICAgICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICAgICAgICAgICAgbG9nZ2VyOiBsb2dnZXIsIC8vIGZvciBhY2Nlc3NpYmlsaXR5XG4gICAgICAgICAgICB0ZXh0Q29udGFpbnM6IHRleHRDb250YWluc1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlQ29udHJvbGxlcihwcm9taXNlcywgY29udHJvbGxlcklkKSB7XG4gICAgICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uIChldmVudEFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHsgY29udHJvbGxlcklkOiBjb250cm9sbGVySWQgfTtcbiAgICAgICAgICAgICAgICAkYnJvYWRjYXN0KGNvbW1vbkNvbmZpZy5jb25maWcuY29udHJvbGxlckFjdGl2YXRlU3VjY2Vzc0V2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gJGJyb2FkY2FzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLiRicm9hZGNhc3QuYXBwbHkoJHJvb3RTY29wZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVNlYXJjaFRocm90dGxlKHZpZXdtb2RlbCwgbGlzdCwgZmlsdGVyZWRMaXN0LCBmaWx0ZXIsIGRlbGF5KSB7XG4gICAgICAgICAgICAvLyBBZnRlciBhIGRlbGF5LCBzZWFyY2ggYSB2aWV3bW9kZWwncyBsaXN0IHVzaW5nXG4gICAgICAgICAgICAvLyBhIGZpbHRlciBmdW5jdGlvbiwgYW5kIHJldHVybiBhIGZpbHRlcmVkTGlzdC5cblxuICAgICAgICAgICAgLy8gY3VzdG9tIGRlbGF5IG9yIHVzZSBkZWZhdWx0XG4gICAgICAgICAgICBkZWxheSA9ICtkZWxheSB8fCAzMDA7XG4gICAgICAgICAgICAvLyBpZiBvbmx5IHZtIGFuZCBsaXN0IHBhcmFtZXRlcnMgd2VyZSBwYXNzZWQsIHNldCBvdGhlcnMgYnkgbmFtaW5nIGNvbnZlbnRpb25cbiAgICAgICAgICAgIGlmICghZmlsdGVyZWRMaXN0KSB7XG4gICAgICAgICAgICAgICAgLy8gYXNzdW1pbmcgbGlzdCBpcyBuYW1lZCBzZXNzaW9ucywgZmlsdGVyZWRMaXN0IGlzIGZpbHRlcmVkU2Vzc2lvbnNcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZExpc3QgPSAnZmlsdGVyZWQnICsgbGlzdFswXS50b1VwcGVyQ2FzZSgpICsgbGlzdC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTsgLy8gc3RyaW5nXG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyIGZ1bmN0aW9uIGlzIG5hbWVkIHNlc3Npb25GaWx0ZXJcbiAgICAgICAgICAgICAgICBmaWx0ZXIgPSBsaXN0ICsgJ0ZpbHRlcic7IC8vIGZ1bmN0aW9uIGluIHN0cmluZyBmb3JtXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgZmlsdGVyaW5nIGZ1bmN0aW9uIHdlIHdpbGwgY2FsbCBmcm9tIGhlcmVcbiAgICAgICAgICAgIHZhciBmaWx0ZXJGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB0cmFuc2xhdGVzIHRvIC4uLlxuICAgICAgICAgICAgICAgIC8vIHZtLmZpbHRlcmVkU2Vzc2lvbnNcbiAgICAgICAgICAgICAgICAvLyAgICAgID0gdm0uc2Vzc2lvbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0oIHsgcmV0dXJucyB2bS5zZXNzaW9uRmlsdGVyIChpdGVtKSB9ICk7XG4gICAgICAgICAgICAgICAgdmlld21vZGVsW2ZpbHRlcmVkTGlzdF0gPSB2aWV3bW9kZWxbbGlzdF0uZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2aWV3bW9kZWxbZmlsdGVyXShpdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gb3V0ZXIgSUZGRSBzbyB3ZSBjYW4gdXNlIGNsb3N1cmVcbiAgICAgICAgICAgICAgICAvLyBvdmVyIGZpbHRlcklucHV0VGltZW91dCB3aGljaCByZWZlcmVuY2VzIHRoZSB0aW1lb3V0XG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcklucHV0VGltZW91dDtcblxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB3aGF0IGJlY29tZXMgdGhlICdhcHBseUZpbHRlcicgZnVuY3Rpb24gaW4gdGhlIGNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNlYXJjaE5vdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVySW5wdXRUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwoZmlsdGVySW5wdXRUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcklucHV0VGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaE5vdyB8fCAhZGVsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckZuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJJbnB1dFRpbWVvdXQgPSAkdGltZW91dChmaWx0ZXJGbiwgZGVsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWJvdW5jZWRUaHJvdHRsZShrZXksIGNhbGxiYWNrLCBkZWxheSwgaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHNvbWUgYWN0aW9uIChjYWxsYmFjaykgYWZ0ZXIgYSBkZWxheS5cbiAgICAgICAgICAgIC8vIFRyYWNrIHRoZSBjYWxsYmFjayBieSBrZXksIHNvIGlmIHRoZSBzYW1lIGNhbGxiYWNrXG4gICAgICAgICAgICAvLyBpcyBpc3N1ZWQgYWdhaW4sIHJlc3RhcnQgdGhlIGRlbGF5LlxuXG4gICAgICAgICAgICB2YXIgZGVmYXVsdERlbGF5ID0gMTAwMDtcbiAgICAgICAgICAgIGRlbGF5ID0gZGVsYXkgfHwgZGVmYXVsdERlbGF5O1xuICAgICAgICAgICAgaWYgKHRocm90dGxlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRocm90dGxlc1trZXldKTtcbiAgICAgICAgICAgICAgICB0aHJvdHRsZXNba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdHRsZXNba2V5XSA9ICR0aW1lb3V0KGNhbGxiYWNrLCBkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgICAgICAgICAgIC8vIG5lZ2F0aXZlIG9yIHBvc2l0aXZlXG4gICAgICAgICAgICByZXR1cm4gKC9eWy1dP1xcZCskLykudGVzdCh2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdGV4dENvbnRhaW5zKHRleHQsIHNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0ICYmIC0xICE9PSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hUZXh0LnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBzZXJ2aWNlSWQgPSAnZGF0YWNvbnRleHQnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZmFjdG9yeShzZXJ2aWNlSWQsIFsnJGh0dHAnLCAnY29tbW9uJywgZGF0YWNvbnRleHRdKTtcblxuICAgIGZ1bmN0aW9uIGRhdGFjb250ZXh0KCRodHRwLCBjb21tb24pIHtcbiAgICAgICAgdmFyICRxID0gY29tbW9uLiRxO1xuXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgZ2V0QXZlbmdlcnNDYXN0OiBnZXRBdmVuZ2Vyc0Nhc3QsXG4gICAgICAgICAgICBnZXRBdmVuZ2VyQ291bnQ6IGdldEF2ZW5nZXJDb3VudCxcbiAgICAgICAgICAgIGdldE1BQTogZ2V0TUFBXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TUFBKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnL2RhdGEvbWFhJ30pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuZGF0YVswXS5kYXRhLnJlc3VsdHM7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgcmV0dXJuICRxLndoZW4ocmVzdWx0cyk7XG4vLyAgICAgICAgICAgIHZhciByZXN1bHRzID0ge2RhdGE6IG51bGx9O1xuLy8gICAgICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9tYWEnfSlcbi8vICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5kYXRhID0gZGF0YVswXS5kYXRhLnJlc3VsdHM7XG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICByZXR1cm4gJHEud2hlbihyZXN1bHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJDb3VudCgpIHtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gZ2V0QXZlbmdlcnNDYXN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvdW50ID0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oY291bnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBdmVuZ2Vyc0Nhc3QoKSB7XG4gICAgICAgICAgICB2YXIgY2FzdCA9IFtcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1JvYmVydCBEb3duZXkgSnIuJywgY2hhcmFjdGVyOiAnVG9ueSBTdGFyayAvIElyb24gTWFuJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdDaHJpcyBIZW1zd29ydGgnLCBjaGFyYWN0ZXI6ICdUaG9yJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdDaHJpcyBFdmFucycsIGNoYXJhY3RlcjogJ1N0ZXZlIFJvZ2VycyAvIENhcHRhaW4gQW1lcmljYSd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnTWFyayBSdWZmYWxvJywgY2hhcmFjdGVyOiAnQnJ1Y2UgQmFubmVyIC8gVGhlIEh1bGsnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1NjYXJsZXR0IEpvaGFuc3NvbicsIGNoYXJhY3RlcjogJ05hdGFzaGEgUm9tYW5vZmYgLyBCbGFjayBXaWRvdyd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnSmVyZW15IFJlbm5lcicsIGNoYXJhY3RlcjogJ0NsaW50IEJhcnRvbiAvIEhhd2tleWUnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0d3eW5ldGggUGFsdHJvdycsIGNoYXJhY3RlcjogJ1BlcHBlciBQb3R0cyd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnU2FtdWVsIEwuIEphY2tzb24nLCBjaGFyYWN0ZXI6ICdOaWNrIEZ1cnknfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1BhdWwgQmV0dGFueScsIGNoYXJhY3RlcjogJ0phcnZpcyd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnVG9tIEhpZGRsZXN0b24nLCBjaGFyYWN0ZXI6ICdMb2tpJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdDbGFyayBHcmVnZycsIGNoYXJhY3RlcjogJ0FnZW50IFBoaWwgQ291bHNvbid9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oY2FzdCk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oJG1kRGlhbG9nKXtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCAkc2NvcGUpe1xuXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgkc2NvcGUpe1xuXHRcdFx0XHRcdG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xuXHRcdFx0fSxcblxuXHRcdFx0aGlkZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuYWxlcnQoKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5jb25maXJtKClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjSW1nUGVyc29uJywgWydjb25maWcnLCBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIC8vVXNhZ2U6XG4gICAgICAgIC8vPGltZyBkYXRhLWNjLWltZy1wZXJzb249XCJ7e3Muc3BlYWtlci5pbWFnZVNvdXJjZX19XCIvPlxuICAgICAgICB2YXIgYmFzZVBhdGggPSBjb25maWcuaW1hZ2VTZXR0aW5ncy5pbWFnZUJhc2VQYXRoO1xuICAgICAgICB2YXIgdW5rbm93bkltYWdlID0gY29uZmlnLmltYWdlU2V0dGluZ3MudW5rbm93blBlcnNvbkltYWdlU291cmNlO1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUoJ2NjSW1nUGVyc29uJywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBiYXNlUGF0aCArICh2YWx1ZSB8fCB1bmtub3duSW1hZ2UpO1xuICAgICAgICAgICAgICAgIGF0dHJzLiRzZXQoJ3NyYycsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NTaWRlYmFyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBPcGVucyBhbmQgY2xzb2VzIHRoZSBzaWRlYmFyIG1lbnUuXG4gICAgICAgIC8vIFVzYWdlOlxuICAgICAgICAvLyAgPGRpdiBkYXRhLWNjLXNpZGViYXI+XG4gICAgICAgIC8vIENyZWF0ZXM6XG4gICAgICAgIC8vICA8ZGl2IGRhdGEtY2Mtc2lkZWJhciBjbGFzcz1cInNpZGViYXJcIj5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciAkc2lkZWJhcklubmVyID0gZWxlbWVudC5maW5kKCcuc2lkZWJhci1pbm5lcicpO1xuICAgICAgICAgICAgdmFyICRkcm9wZG93bkVsZW1lbnQgPSBlbGVtZW50LmZpbmQoJy5zaWRlYmFyLWRyb3Bkb3duIGEnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3NpZGViYXInKTtcbiAgICAgICAgICAgICRkcm9wZG93bkVsZW1lbnQuY2xpY2soZHJvcGRvd24pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBkcm9wZG93bihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRyb3BDbGFzcyA9ICdkcm9weSc7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghJGRyb3Bkb3duRWxlbWVudC5oYXNDbGFzcyhkcm9wQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVBbGxTaWRlYmFycygpO1xuICAgICAgICAgICAgICAgICAgICAkc2lkZWJhcklubmVyLnNsaWRlRG93bigzNTApO1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd25FbGVtZW50LmFkZENsYXNzKGRyb3BDbGFzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkZHJvcGRvd25FbGVtZW50Lmhhc0NsYXNzKGRyb3BDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duRWxlbWVudC5yZW1vdmVDbGFzcyhkcm9wQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAkc2lkZWJhcklubmVyLnNsaWRlVXAoMzUwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoaWRlQWxsU2lkZWJhcnMoKSB7XG4gICAgICAgICAgICAgICAgICAgICRzaWRlYmFySW5uZXIuc2xpZGVVcCgzNTApO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1kcm9wZG93biBhJykucmVtb3ZlQ2xhc3MoZHJvcENsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NXaWRnZXRDbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vIDxhIGRhdGEtY2Mtd2lkZ2V0LWNsb3NlPjwvYT5cbiAgICAgICAgLy8gQ3JlYXRlczpcbiAgICAgICAgLy8gPGEgZGF0YS1jYy13aWRnZXQtY2xvc2U9XCJcIiBocmVmPVwiI1wiIGNsYXNzPVwid2Nsb3NlXCI+XG4gICAgICAgIC8vICAgICA8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiPjwvaT5cbiAgICAgICAgLy8gPC9hPlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGkgY2xhc3M9XCJmYSBmYS1yZW1vdmVcIj48L2k+JyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnaHJlZicsICcjJyk7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCd3Y2xvc2UnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xpY2soY2xvc2VFbCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlRWwoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmhpZGUoMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NXaWRnZXRNaW5pbWl6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vIDxhIGRhdGEtY2Mtd2lkZ2V0LW1pbmltaXplPjwvYT5cbiAgICAgICAgLy8gQ3JlYXRlczpcbiAgICAgICAgLy8gPGEgZGF0YS1jYy13aWRnZXQtbWluaW1pemU9XCJcIiBocmVmPVwiI1wiPjxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi11cFwiPjwvaT48L2E+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tdXBcIj48L2k+JyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgLy8kKCdib2R5Jykub24oJ2NsaWNrJywgJy53aWRnZXQgLndtaW5pbWl6ZScsIG1pbmltaXplKTtcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnd21pbmltaXplJyk7XG4gICAgICAgICAgICBlbGVtZW50LmNsaWNrKG1pbmltaXplKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbWluaW1pemUoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgJHdjb250ZW50ID0gZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCcud2lkZ2V0LWNvbnRlbnQnKTtcbiAgICAgICAgICAgICAgICB2YXIgaUVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuKCdpJyk7XG4gICAgICAgICAgICAgICAgaWYgKCR3Y29udGVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcygnZmEgZmEtY2hldnJvbi11cCcpO1xuICAgICAgICAgICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcygnZmEgZmEtY2hldnJvbi1kb3duJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaUVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhIGZhLWNoZXZyb24tZG93bicpO1xuICAgICAgICAgICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcygnZmEgZmEtY2hldnJvbi11cCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkd2NvbnRlbnQudG9nZ2xlKDUwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjU2Nyb2xsVG9Ub3AnLCBbJyR3aW5kb3cnLFxuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gPHNwYW4gZGF0YS1jYy1zY3JvbGwtdG8tdG9wPjwvc3Bhbj5cbiAgICAgICAgLy8gQ3JlYXRlczpcbiAgICAgICAgLy8gPHNwYW4gZGF0YS1jYy1zY3JvbGwtdG8tdG9wPVwiXCIgY2xhc3M9XCJ0b3RvcFwiPlxuICAgICAgICAvLyAgICAgIDxhIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXVwXCI+PC9pPjwvYT5cbiAgICAgICAgLy8gPC9zcGFuPlxuICAgICAgICBmdW5jdGlvbiAoJHdpbmRvdykge1xuICAgICAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tdXBcIj48L2k+PC9hPicsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyICR3aW4gPSAkKCR3aW5kb3cpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3RvdG9wJyk7XG4gICAgICAgICAgICAgICAgJHdpbi5zY3JvbGwodG9nZ2xlSWNvbik7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJ2EnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIExlYXJuaW5nIFBvaW50OiAkYW5jaG9yU2Nyb2xsIHdvcmtzLCBidXQgbm8gYW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgICAgIC8vJGFuY2hvclNjcm9sbCgpO1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gdG9nZ2xlSWNvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR3aW4uc2Nyb2xsVG9wKCkgPiAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2xpZGVEb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNsaWRlVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NTcGlubmVyJywgWyckd2luZG93JywgZnVuY3Rpb24gKCR3aW5kb3cpIHtcbiAgICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAgIC8vICBDcmVhdGVzIGEgbmV3IFNwaW5uZXIgYW5kIHNldHMgaXRzIG9wdGlvbnNcbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vICA8ZGl2IGRhdGEtY2Mtc3Bpbm5lcj1cInZtLnNwaW5uZXJPcHRpb25zXCI+PC9kaXY+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBzY29wZS5zcGlubmVyID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5jY1NwaW5uZXIsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLnNwaW5uZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNjb3BlLnNwaW5uZXIgPSBuZXcgJHdpbmRvdy5TcGlubmVyKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnNwaW5uZXIuc3BpbihlbGVtZW50WzBdKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NXaWRnZXRIZWFkZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vVXNhZ2U6XG4gICAgICAgIC8vPGRpdiBkYXRhLWNjLXdpZGdldC1oZWFkZXIgdGl0bGU9XCJ2bS5tYXAudGl0bGVcIj48L2Rpdj5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICd0aXRsZSc6ICdAJyxcbiAgICAgICAgICAgICAgICAnc3VidGl0bGUnOiAnQCcsXG4gICAgICAgICAgICAgICAgJ3JpZ2h0VGV4dCc6ICdAJyxcbiAgICAgICAgICAgICAgICAnYWxsb3dDb2xsYXBzZSc6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2xheW91dC93aWRnZXRoZWFkZXIuaHRtbCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoJ2NsYXNzJywgJ3dpZGdldC1oZWFkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29tbW9uJykuZmFjdG9yeSgnbG9nZ2VyJywgWyckbG9nJywgbG9nZ2VyXSk7XG5cbiAgICBmdW5jdGlvbiBsb2dnZXIoJGxvZykge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldExvZ0ZuOiBnZXRMb2dGbixcbiAgICAgICAgICAgIGxvZzogbG9nLFxuICAgICAgICAgICAgbG9nRXJyb3I6IGxvZ0Vycm9yLFxuICAgICAgICAgICAgbG9nU3VjY2VzczogbG9nU3VjY2VzcyxcbiAgICAgICAgICAgIGxvZ1dhcm5pbmc6IGxvZ1dhcm5pbmdcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRMb2dGbihtb2R1bGVJZCwgZm5OYW1lKSB7XG4gICAgICAgICAgICBmbk5hbWUgPSBmbk5hbWUgfHwgJ2xvZyc7XG4gICAgICAgICAgICBzd2l0Y2ggKGZuTmFtZS50b0xvd2VyQ2FzZSgpKSB7IC8vIGNvbnZlcnQgYWxpYXNlc1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgICAgICAgICAgICAgICBmbk5hbWUgPSAnbG9nU3VjY2Vzcyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgICAgICAgICAgZm5OYW1lID0gJ2xvZ0Vycm9yJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgICAgICAgICAgICAgIGZuTmFtZSA9ICdsb2dXYXJuaW5nJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2FybmluZyc6XG4gICAgICAgICAgICAgICAgICAgIGZuTmFtZSA9ICdsb2dXYXJuaW5nJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsb2dGbiA9IHNlcnZpY2VbZm5OYW1lXSB8fCBzZXJ2aWNlLmxvZztcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobXNnLCBkYXRhLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgICAgICBsb2dGbihtc2csIGRhdGEsIG1vZHVsZUlkLCAoc2hvd1RvYXN0ID09PSB1bmRlZmluZWQpID8gdHJ1ZSA6IHNob3dUb2FzdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nKG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICBsb2dJdChtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCwgJ2luZm8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ1dhcm5pbmcobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgIGxvZ0l0KG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0LCAnd2FybmluZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nU3VjY2VzcyhtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsICdzdWNjZXNzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dFcnJvcihtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsICdlcnJvcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsIHRvYXN0VHlwZSkge1xuICAgICAgICAgICAgdmFyIHdyaXRlID0gKHRvYXN0VHlwZSA9PT0gJ2Vycm9yJykgPyAkbG9nLmVycm9yIDogJGxvZy5sb2c7XG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UgPyAnWycgKyBzb3VyY2UgKyAnXSAnIDogJyc7XG4gICAgICAgICAgICB3cml0ZShzb3VyY2UsIG1lc3NhZ2UsIGRhdGEpO1xuICAgICAgICAgICAgaWYgKHNob3dUb2FzdCkge1xuICAgICAgICAgICAgICAgIGlmICh0b2FzdFR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9hc3RUeXBlID09PSAnd2FybmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gTXVzdCBjb25maWd1cmUgdGhlIGNvbW1vbiBzZXJ2aWNlIGFuZCBzZXQgaXRzXG4gICAgLy8gZXZlbnRzIHZpYSB0aGUgY29tbW9uQ29uZmlnUHJvdmlkZXJcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjb21tb24nKVxuICAgICAgICAuZmFjdG9yeSgnc3Bpbm5lcicsIFsnY29tbW9uJywgJ2NvbW1vbkNvbmZpZycsIHNwaW5uZXJdKTtcblxuICAgIGZ1bmN0aW9uIHNwaW5uZXIoY29tbW9uLCBjb21tb25Db25maWcpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBzcGlubmVySGlkZTogc3Bpbm5lckhpZGUsXG4gICAgICAgICAgICBzcGlubmVyU2hvdzogc3Bpbm5lclNob3dcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBzcGlubmVySGlkZSgpIHtcbiAgICAgICAgICAgIHNwaW5uZXJUb2dnbGUoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3Bpbm5lclNob3coKSB7XG4gICAgICAgICAgICBzcGlubmVyVG9nZ2xlKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3Bpbm5lclRvZ2dsZShzaG93KSB7XG4gICAgICAgICAgICBjb21tb24uJGJyb2FkY2FzdChjb21tb25Db25maWcuY29uZmlnLnNwaW5uZXJUb2dnbGVFdmVudCwgeyBzaG93OiBzaG93IH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xuXG5cdFx0dmFyIGRlbGF5ID0gNjAwMCxcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXG5cdFx0XHRhY3Rpb24gPSAnT0snO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC50aGVtZSgnd2FybicpXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC52ZXJzaW9uLmludGVycG9sYXRlLWZpbHRlcicsIFtdKVxuXG4uZmlsdGVyKCdpbnRlcnBvbGF0ZScsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICB9O1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnYXBwLnZlcnNpb24gbW9kdWxlJywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2gobW9kdWxlKCdhcHAudmVyc2lvbicpKTtcblxuICBkZXNjcmliZSgnaW50ZXJwb2xhdGUgZmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICRwcm92aWRlLnZhbHVlKCd2ZXJzaW9uJywgJ1RFU1RfVkVSJyk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIFZFUlNJT04nLCBpbmplY3QoZnVuY3Rpb24oaW50ZXJwb2xhdGVGaWx0ZXIpIHtcbiAgICAgIGV4cGVjdChpbnRlcnBvbGF0ZUZpbHRlcignYmVmb3JlICVWRVJTSU9OJSBhZnRlcicpKS50b0VxdWFsKCdiZWZvcmUgVEVTVF9WRVIgYWZ0ZXInKTtcbiAgICB9KSk7XG4gIH0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAudmVyc2lvbi52ZXJzaW9uLWRpcmVjdGl2ZScsIFtdKVxuXG4uZGlyZWN0aXZlKCdhcHBWZXJzaW9uJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMpIHtcbiAgICBlbG0udGV4dCh2ZXJzaW9uKTtcbiAgfTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZGVzY3JpYmUoJ2FwcC52ZXJzaW9uIG1vZHVsZScsIGZ1bmN0aW9uKCkge1xuICBiZWZvcmVFYWNoKG1vZHVsZSgnYXBwLnZlcnNpb24nKSk7XG5cbiAgZGVzY3JpYmUoJ2FwcC12ZXJzaW9uIGRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJpbnQgY3VycmVudCB2ZXJzaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICAgJHByb3ZpZGUudmFsdWUoJ3ZlcnNpb24nLCAnVEVTVF9WRVInKTtcbiAgICAgIH0pO1xuICAgICAgaW5qZWN0KGZ1bmN0aW9uKCRjb21waWxlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gJGNvbXBpbGUoJzxzcGFuIGFwcC12ZXJzaW9uPjwvc3Bhbj4nKSgkcm9vdFNjb3BlKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQudGV4dCgpKS50b0VxdWFsKCdURVNUX1ZFUicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAudmVyc2lvbicsIFtcbiAgJ2FwcC52ZXJzaW9uLmludGVycG9sYXRlLWZpbHRlcicsXG4gICdhcHAudmVyc2lvbi52ZXJzaW9uLWRpcmVjdGl2ZSdcbl0pXG5cbi52YWx1ZSgndmVyc2lvbicsICcwLjEnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZGVzY3JpYmUoJ2FwcC52ZXJzaW9uIG1vZHVsZScsIGZ1bmN0aW9uKCkge1xuICBiZWZvcmVFYWNoKG1vZHVsZSgnYXBwLnZlcnNpb24nKSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnNpb24gc2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGN1cnJlbnQgdmVyc2lvbicsIGluamVjdChmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgICBleHBlY3QodmVyc2lvbikudG9FcXVhbCgnMC4xJyk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEaWFsb2dTZXJ2aWNlKXtcblxuICAgICAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgLy9kbyBzb21ldGhpbmcgdXNlZnVsXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFx0RGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSggJ2FwcC5jb250cm9sbGVycycgKS5jb250cm9sbGVyKCAnRGF0YUxpc3RpbmdDdHJsJywgZnVuY3Rpb24oKXtcblx0XHQvL1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSggJ2RhdGFMaXN0aW5nJywgZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZGF0YV9saXN0aW5nL2RhdGFfbGlzdGluZy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdEYXRhTGlzdGluZ0N0cmwnLFxuXHRcdFx0bGluazogZnVuY3Rpb24oIHNjb3BlLCBlbGVtZW50LCBhdHRycyApe1xuXHRcdFx0XHQvL1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgY29udHJvbGxlcklkID0gJ2Rhc2hib2FyZCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLCBbJ2NvbW1vbicsICdkYXRhY29udGV4dCcsIGRhc2hib2FyZF0pO1xuXG4gICAgZnVuY3Rpb24gZGFzaGJvYXJkKGNvbW1vbiwgZGF0YWNvbnRleHQpIHtcbiAgICAgICAgdmFyIGdldExvZ0ZuID0gY29tbW9uLmxvZ2dlci5nZXRMb2dGbjtcbiAgICAgICAgdmFyIGxvZyA9IGdldExvZ0ZuKGNvbnRyb2xsZXJJZCk7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubmV3cyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnTWFydmVsIEF2ZW5nZXJzJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFydmVsIEF2ZW5nZXJzIDIgaXMgbm93IGluIHByb2R1Y3Rpb24hJ1xuICAgICAgICB9O1xuICAgICAgICB2bS5hdmVuZ2VyQ291bnQgPSAwO1xuICAgICAgICB2bS5hdmVuZ2VycyA9IFtdO1xuICAgICAgICB2bS50aXRsZSA9ICdEYXNoYm9hcmQnO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbZ2V0QXZlbmdlckNvdW50KCksIGdldEF2ZW5nZXJzQ2FzdCgpXTtcbiAgICAgICAgICAgIGNvbW1vbi5hY3RpdmF0ZUNvbnRyb2xsZXIocHJvbWlzZXMsIGNvbnRyb2xsZXJJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7IGxvZygnQWN0aXZhdGVkIERhc2hib2FyZCBWaWV3Jyk7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFjb250ZXh0LmdldEF2ZW5nZXJDb3VudCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5hdmVuZ2VyQ291bnQgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VyQ291bnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhY29udGV4dC5nZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYXZlbmdlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VycztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGb290ZXJDb250cm9sbGVyJywgRm9vdGVyQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCl7XG4gICAgICAgIC8vXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIEhlYWRlckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigpe1xuICAgICAgICAvL1xuICAgIH1cblxufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBbJyRzY29wZScsZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgXSk7IiwiKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTGFuZGluZ0NvbnRyb2xsZXInLCBMYW5kaW5nQ29udHJvbGxlcik7XG5cblx0ZnVuY3Rpb24gTGFuZGluZ0NvbnRyb2xsZXIoKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdHZtLmxhcmF2ZWxfZGVzY3JpcHRpb24gPSAnUmVzcG9uc2UgbWFjcm9zIGludGVncmF0ZWQgd2l0aCB5b3VyIEFuZ3VsYXIgYXBwJztcblx0XHR2bS5hbmd1bGFyX2Rlc2NyaXB0aW9uID0gJ1F1ZXJ5IHlvdXIgQVBJIHdpdGhvdXQgd29ycnlpbmcgYWJvdXQgdmFsaWRhdGlvbnMnO1xuXG5cdFx0Lypcblx0XHRUaGlzIGlzIGEgdGVycmlibGUgdGVtcG9yYXJ5IGhhY2ssXG5cdFx0dG8gZml4IGxheW91dCBpc3N1ZXMgd2l0aCBmbGV4IG9uIGlPUyAoY2hyb21lICYgc2FmYXJpKVxuXHRcdE1ha2Ugc3VyZSB0byByZW1vdmUgdGhpcyB3aGVuIHlvdSBtb2RpZnkgdGhpcyBkZW1vXG5cdFx0Ki9cblx0XHR2bS5pT1MgPSAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblx0fVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgY29udHJvbGxlcklkID0gJ3NoZWxsJztcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29udHJvbGxlcihjb250cm9sbGVySWQsXG4gICAgICAgIFsnJHJvb3RTY29wZScsICdjb21tb24nLCAnY29uZmlnJywgc2hlbGxdKTtcblxuICAgIGZ1bmN0aW9uIHNoZWxsKCRyb290U2NvcGUsIGNvbW1vbiwgY29uZmlnKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBsb2dTdWNjZXNzID0gY29tbW9uLmxvZ2dlci5nZXRMb2dGbihjb250cm9sbGVySWQsICdzdWNjZXNzJyk7XG4gICAgICAgIHZhciBldmVudHMgPSBjb25maWcuZXZlbnRzO1xuICAgICAgICB2bS50aXRsZSA9ICdHcnVudCBhbmQgR3VscCc7XG4gICAgICAgIHZtLmJ1c3lNZXNzYWdlID0gJ1BsZWFzZSB3YWl0IC4uLic7XG4gICAgICAgIHZtLmlzQnVzeSA9IHRydWU7XG4gICAgICAgIHZtLnNwaW5uZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgcmFkaXVzOiA0MCxcbiAgICAgICAgICAgIGxpbmVzOiA3LFxuICAgICAgICAgICAgbGVuZ3RoOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICAgICAgc3BlZWQ6IDEuNyxcbiAgICAgICAgICAgIGNvcm5lcnM6IDEuMCxcbiAgICAgICAgICAgIHRyYWlsOiAxMDAsXG4gICAgICAgICAgICBjb2xvcjogJyNGNThBMDAnXG4gICAgICAgIH07XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIGxvZ1N1Y2Nlc3MoJ0dydW50IGFuZCBHdWxwIHdpdGggQW5ndWxhciBsb2FkZWQhJywgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICBjb21tb24uYWN0aXZhdGVDb250cm9sbGVyKFtdLCBjb250cm9sbGVySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlU3Bpbm5lcihvbikgeyB2bS5pc0J1c3kgPSBvbjsgfVxuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHsgdG9nZ2xlU3Bpbm5lcih0cnVlKTsgfVxuICAgICAgICApO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKGV2ZW50cy5jb250cm9sbGVyQWN0aXZhdGVTdWNjZXNzLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHsgdG9nZ2xlU3Bpbm5lcihmYWxzZSk7IH1cbiAgICAgICAgKTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihldmVudHMuc3Bpbm5lclRvZ2dsZSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7IHRvZ2dsZVNwaW5uZXIoZGF0YS5zaG93KTsgfVxuICAgICAgICApO1xuICAgIH1cbn0pKCk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdPQXV0aCcsICckbG9jYXRpb24nLCBmdW5jdGlvbiAoJHNjb3BlLCBPQXV0aCwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICcnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmxvZ2luRm9ybS4kdmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9BdXRoLmdldEFjY2Vzc1Rva2VuKCRzY29wZS51c2VyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnaG9tZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yLmVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvci5tZXNzYWdlID0gZGF0YS5kYXRhLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7IiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQ29udHJvbFBhbmVsQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAgICckbWREaWFsb2cnLCAnJGludGVydmFsJyxcbiAgICAgICAgICAgIENvbnRyb2xQYW5lbENvbnRyb2xsZXJcbiAgICAgICAgXSk7XG5cbiAgICBmdW5jdGlvbiBDb250cm9sUGFuZWxDb250cm9sbGVyKCRtZERpYWxvZywgJGludGVydmFsKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uYnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB2bS5zaG93UHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdm0ucmVsb2FkU2VydmVyID0gJ1N0YWdpbmcnO1xuICAgICAgICB2bS5wZXJmb3JtUHJvZ3Jlc3MgPSBwZXJmb3JtUHJvZ3Jlc3M7XG4gICAgICAgIHZtLmRldGVybWluYXRlVmFsdWUgPSAxMDtcblxuICAgICAgICBmdW5jdGlvbiBwZXJmb3JtUHJvZ3Jlc3MoKSB7XG4gICAgICAgICAgICB2bS5zaG93UHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgaW50ZXJ2YWwgPSAkaW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdm0uZGV0ZXJtaW5hdGVWYWx1ZSArPSAxO1xuICAgICAgICAgICAgICAgIGlmICh2bS5kZXRlcm1pbmF0ZVZhbHVlID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmRldGVybWluYXRlVmFsdWUgPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1Byb2dyZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGVydCgpO1xuICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MCwgMCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzaG93QWxlcnQoKSB7XG4gICAgICAgICAgICBhbGVydCA9ICRtZERpYWxvZy5hbGVydCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZWxvYWRpbmcgZG9uZSEnLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHZtLnJlbG9hZFNlcnZlciArIFwiIHNlcnZlciByZWxvYWRlZC5cIixcbiAgICAgICAgICAgICAgICBvazogJ0Nsb3NlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkbWREaWFsb2dcbiAgICAgICAgICAgICAgICAuc2hvdyhhbGVydClcbiAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcbiAgYW5ndWxhclxuICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgW1xuICAgICAgICAgICduYXZTZXJ2aWNlJywgJyRtZFNpZGVuYXYnLCAnJG1kQm90dG9tU2hlZXQnLCAnJGxvZycsICckcScsICckc3RhdGUnLCAnJG1kVG9hc3QnLFxuICAgICAgICAgIE1haW5Db250cm9sbGVyXG4gICAgICAgXSk7XG5cbiAgZnVuY3Rpb24gTWFpbkNvbnRyb2xsZXIobmF2U2VydmljZSwgJG1kU2lkZW5hdiwgJG1kQm90dG9tU2hlZXQsICRsb2csICRxLCAkc3RhdGUsICRtZFRvYXN0KSB7XG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHZtLm1lbnVJdGVtcyA9IFsgXTtcbiAgICB2bS5zZWxlY3RJdGVtID0gc2VsZWN0SXRlbTtcbiAgICB2bS50b2dnbGVJdGVtc0xpc3QgPSB0b2dnbGVJdGVtc0xpc3Q7XG4gICAgdm0uc2hvd0FjdGlvbnMgPSBzaG93QWN0aW9ucztcbiAgICB2bS50aXRsZSA9ICRzdGF0ZS5jdXJyZW50LmRhdGEudGl0bGU7XG4gICAgdm0uc2hvd1NpbXBsZVRvYXN0ID0gc2hvd1NpbXBsZVRvYXN0O1xuXG4gICAgbmF2U2VydmljZVxuICAgICAgLmxvYWRBbGxJdGVtcygpXG4gICAgICAudGhlbihmdW5jdGlvbihtZW51SXRlbXMpIHtcbiAgICAgICAgdm0ubWVudUl0ZW1zID0gW10uY29uY2F0KG1lbnVJdGVtcyk7XG4gICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUl0ZW1zTGlzdCgpIHtcbiAgICAgIHZhciBwZW5kaW5nID0gJG1kQm90dG9tU2hlZXQuaGlkZSgpIHx8ICRxLndoZW4odHJ1ZSk7XG5cbiAgICAgIHBlbmRpbmcudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAkbWRTaWRlbmF2KCdsZWZ0JykudG9nZ2xlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RJdGVtIChpdGVtKSB7XG4gICAgICB2bS50aXRsZSA9IGl0ZW0ubmFtZTtcbiAgICAgIHZtLnRvZ2dsZUl0ZW1zTGlzdCgpO1xuICAgICAgdm0uc2hvd1NpbXBsZVRvYXN0KHZtLnRpdGxlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93QWN0aW9ucygkZXZlbnQpIHtcbiAgICAgICAgJG1kQm90dG9tU2hlZXQuc2hvdyh7XG4gICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSksXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdmlld3MvcGFydGlhbHMvYm90dG9tU2hlZXQuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogWyAnJG1kQm90dG9tU2hlZXQnLCBTaGVldENvbnRyb2xsZXJdLFxuICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJ2bVwiLFxuICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgOiB0cnVlLFxuICAgICAgICAgIHRhcmdldEV2ZW50OiAkZXZlbnRcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihjbGlja2VkSXRlbSkge1xuICAgICAgICAgIGNsaWNrZWRJdGVtICYmICRsb2cuZGVidWcoIGNsaWNrZWRJdGVtLm5hbWUgKyAnIGNsaWNrZWQhJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIFNoZWV0Q29udHJvbGxlciggJG1kQm90dG9tU2hlZXQgKSB7XG4gICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgIHZtLmFjdGlvbnMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6ICdTaGFyZScsIGljb246ICdzaGFyZScsIHVybDogJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9QW5ndWxhciUyME1hdGVyaWFsJTIwRGFzaGJvYXJkJTIwaHR0cHM6Ly9naXRodWIuY29tL2ZsYXRsb2dpYy9hbmd1bGFyLW1hdGVyaWFsLWRhc2hib2FyZCUyMHZpYSUyMEBmbGF0bG9naWNpbmMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdTdGFyJywgaWNvbjogJ3N0YXInLCB1cmw6ICdodHRwczovL2dpdGh1Yi5jb20vZmxhdGxvZ2ljL2FuZ3VsYXItbWF0ZXJpYWwtZGFzaGJvYXJkL3N0YXJnYXplcnMnIH1cbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgdm0ucGVyZm9ybUFjdGlvbiA9IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgICAgICAgJG1kQm90dG9tU2hlZXQuaGlkZShhY3Rpb24pO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93U2ltcGxlVG9hc3QodGl0bGUpIHtcbiAgICAgICRtZFRvYXN0LnNob3coXG4gICAgICAgICRtZFRvYXN0LnNpbXBsZSgpXG4gICAgICAgICAgLmNvbnRlbnQodGl0bGUpXG4gICAgICAgICAgLmhpZGVEZWxheSgyMDAwKVxuICAgICAgICAgIC5wb3NpdGlvbigndG9wIHJpZ2h0JylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdNZW1vcnlDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgTWVtb3J5Q29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIE1lbW9yeUNvbnRyb2xsZXIoKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLy8gVE9ETzogbW92ZSBkYXRhIHRvIHRoZSBzZXJ2aWNlXG4gICAgICAgIHZtLm1lbW9yeUNoYXJ0RGF0YSA9IFsge2tleTogJ21lbW9yeScsIHk6IDQyfSwgeyBrZXk6ICdmcmVlJywgeTogNTh9IF07XG5cbiAgICAgICAgdm0uY2hhcnRPcHRpb25zID0ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjEwLFxuICAgICAgICAgICAgICAgIGRvbnV0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBpZToge1xuICAgICAgICAgICAgICAgICAgICBzdGFydEFuZ2xlOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5zdGFydEFuZ2xlLzIgLU1hdGguUEkvMiB9LFxuICAgICAgICAgICAgICAgICAgICBlbmRBbmdsZTogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZW5kQW5nbGUvMiAtTWF0aC5QSS8yIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC55OyB9LFxuICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiAoZDMuZm9ybWF0KFwiLjBmXCIpKSxcbiAgICAgICAgICAgICAgICBjb2xvcjogWydyZ2IoMCwgMTUwLCAxMzYpJywgJ3JnYigxOTEsIDE5MSwgMTkxKSddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJzQyJScsXG4gICAgICAgICAgICAgICAgdGl0bGVPZmZzZXQ6IC0xMCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHsgYm90dG9tOiAtODAsIGxlZnQ6IC0yMCwgcmlnaHQ6IC0yMCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdNZXNzYWdlc0NvbnRyb2xsZXInLCBbXG4gICAgICAnbWVzc2FnZXNTZXJ2aWNlJyxcbiAgICAgIE1lc3NhZ2VzQ29udHJvbGxlclxuICAgIF0pO1xuXG4gIGZ1bmN0aW9uIE1lc3NhZ2VzQ29udHJvbGxlcihtZXNzYWdlc1NlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubWVzc2FnZXMgPSBbXTtcblxuICAgIG1lc3NhZ2VzU2VydmljZVxuICAgICAgLmxvYWRBbGxJdGVtcygpXG4gICAgICAudGhlbihmdW5jdGlvbihtZXNzYWdlcykge1xuICAgICAgICB2bS5tZXNzYWdlcyA9IFtdLmNvbmNhdChtZXNzYWdlcyk7XG4gICAgICB9KTtcbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignUGVyZm9ybWFuY2VDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgJ3BlcmZvcm1hbmNlU2VydmljZScsICckcScsXG4gICAgICAgICAgICBQZXJmb3JtYW5jZUNvbnRyb2xsZXJcbiAgICAgICAgXSk7XG5cbiAgICBmdW5jdGlvbiBQZXJmb3JtYW5jZUNvbnRyb2xsZXIocGVyZm9ybWFuY2VTZXJ2aWNlLCAkcSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmNoYXJ0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0YWNrZWRBcmVhQ2hhcnQnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUwLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogeyBsZWZ0OiAtMTUsIHJpZ2h0OiAtMTUgfSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZFswXSB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkWzFdIH0sXG4gICAgICAgICAgICAgICAgc2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdPdmVyIDlLJyxcbiAgICAgICAgICAgICAgICBzaG93WUF4aXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dYQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29sb3I6IFsncmdiKDAsIDE1MCwgMTM2KScsICdyZ2IoMjA0LCAyMDMsIDIwMyknLCAncmdiKDE0OSwgMTQ5LCAxNDkpJywgJ3JnYig0NCwgNDQsIDQ0KSddXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ucGVyZm9ybWFuY2VDaGFydERhdGEgPSBbXTtcbiAgICAgICAgdm0ucGVyZm9ybWFuY2VQZXJpb2QgPSAnd2Vlayc7XG4gICAgICAgIHZtLmNoYW5nZVBlcmlvZCA9IGNoYW5nZVBlcmlvZDtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJpZXMgPSBbbG9hZERhdGEoKV07XG4gICAgICAgICAgICAkcS5hbGwocXVlcmllcyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWREYXRhKCkge1xuICAgICAgICAgICAgdm0ucGVyZm9ybWFuY2VDaGFydERhdGEgPSBwZXJmb3JtYW5jZVNlcnZpY2UuZ2V0UGVyZm9ybWFuY2VEYXRhKHZtLnBlcmZvcm1hbmNlUGVyaW9kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVBlcmlvZCgpIHtcbiAgICAgICAgICAgIGxvYWREYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgW1xuICAgICAgUHJvZmlsZUNvbnRyb2xsZXJcbiAgICBdKTtcblxuICBmdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcigpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udXNlciA9IHtcbiAgICAgIHRpdGxlOiAnQWRtaW4nLFxuICAgICAgZW1haWw6ICdjb250YWN0QGZsYXRsb2dpYy5jb20nLFxuICAgICAgZmlyc3ROYW1lOiAnJyxcbiAgICAgIGxhc3ROYW1lOiAnJyAsXG4gICAgICBjb21wYW55OiAnRmxhdExvZ2ljIEluYy4nICxcbiAgICAgIGFkZHJlc3M6ICdGYWJyaXRzaXVzYSBzdHIsIDQnICxcbiAgICAgIGNpdHk6ICdNaW5zaycgLFxuICAgICAgc3RhdGU6ICcnICxcbiAgICAgIGJpb2dyYXBoeTogJ1dlIGFyZSB5b3VuZyBhbmQgYW1iaXRpb3VzIGZ1bGwgc2VydmljZSBkZXNpZ24gYW5kIHRlY2hub2xvZ3kgY29tcGFueS4gJyArXG4gICAgICAnT3VyIGZvY3VzIGlzIEphdmFTY3JpcHQgZGV2ZWxvcG1lbnQgYW5kIFVzZXIgSW50ZXJmYWNlIGRlc2lnbi4nLFxuICAgICAgcG9zdGFsQ29kZSA6ICcyMjAwMDcnXG4gICAgfTtcbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnJHEnLCAnY291bnRyaWVzU2VydmljZScsXG4gICAgICBTZWFyY2hDb250cm9sbGVyXG4gICAgXSk7XG5cbiAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkdGltZW91dCwgJHEsIGNvdW50cmllc1NlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0uY291bnRyaWVzID0gY291bnRyaWVzU2VydmljZS5sb2FkQWxsKCk7XG4gICAgdm0uc2VsZWN0ZWRDb3VudHJ5ID0gbnVsbDtcbiAgICB2bS5zZWFyY2hUZXh0ID0gbnVsbDtcbiAgICB2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuICAgIHZtLmRpc2FibGVDYWNoaW5nID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoIChxdWVyeSkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBxdWVyeSA/IHZtLmNvdW50cmllcy5maWx0ZXIoIGNyZWF0ZUZpbHRlckZvcihxdWVyeSkgKSA6IFtdLFxuICAgICAgICBkZWZlcnJlZDtcbiAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVmZXJyZWQucmVzb2x2ZSggcmVzdWx0cyApOyB9LCBNYXRoLnJhbmRvbSgpICogMTAwMCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSB7XG4gICAgICB2YXIgbG93ZXJjYXNlUXVlcnkgPSBhbmd1bGFyLmxvd2VyY2FzZShxdWVyeSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gZmlsdGVyRm4oc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIChzdGF0ZS52YWx1ZS5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSA9PT0gMCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdUYWJsZUNvbnRyb2xsZXInLCBbXG4gICAgICAndGFibGVTZXJ2aWNlJyxcbiAgICAgIFRhYmxlQ29udHJvbGxlclxuICAgIF0pO1xuXG4gIGZ1bmN0aW9uIFRhYmxlQ29udHJvbGxlcih0YWJsZVNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udGFibGVEYXRhID0gW107XG5cbiAgICB0YWJsZVNlcnZpY2VcbiAgICAgIC5sb2FkQWxsSXRlbXMoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24odGFibGVEYXRhKSB7XG4gICAgICAgIHZtLnRhYmxlRGF0YSA9IFtdLmNvbmNhdCh0YWJsZURhdGEpO1xuICAgICAgfSk7XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RvZG9Db250cm9sbGVyJywgW1xuICAgICAgICAgICAgJ3RvZG9MaXN0U2VydmljZScsXG4gICAgICAgICAgICBUb2RvQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFRvZG9Db250cm9sbGVyKHRvZG9MaXN0U2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmFkZFRvZG8gPSBhZGRUb2RvO1xuICAgICAgICB2bS5yZW1haW5pbmcgPSByZW1haW5pbmc7XG4gICAgICAgIHZtLmFyY2hpdmUgPSBhcmNoaXZlO1xuICAgICAgICB2bS50b2dnbGVBbGwgPSB0b2dnbGVBbGw7XG4gICAgICAgIHZtLnRvZG9zID0gW107XG5cbiAgICAgICAgdG9kb0xpc3RTZXJ2aWNlXG4gICAgICAgICAgICAubG9hZEFsbEl0ZW1zKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0b2Rvcykge1xuICAgICAgICAgICAgICAgIHZtLnRvZG9zID0gW10uY29uY2F0KHRvZG9zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvZG8oKSB7XG4gICAgICAgICAgICB2bS50b2Rvcy5wdXNoKHt0ZXh0OiB2bS50b2RvVGV4dCwgZG9uZTogZmFsc2V9KTtcbiAgICAgICAgICAgIHZtLnRvZG9UZXh0ID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1haW5pbmcoKSB7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRvZG9zLCBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICAgICAgICAgIGNvdW50ICs9IHRvZG8uZG9uZSA/IDAgOiAxO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhcmNoaXZlKGUpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZnJvbSBzdWJtaXR0aW5nXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgb2xkVG9kb3MgPSB2bS50b2RvcztcbiAgICAgICAgICAgIHZtLnRvZG9zID0gW107XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gob2xkVG9kb3MsIGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2RvLmRvbmUpIHZtLnRvZG9zLnB1c2godG9kbyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUFsbCgpIHtcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRvZG9zLCBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICAgICAgICAgICAgICB0b2RvLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRvZG9zLCBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICAgICAgICAgICAgICB0b2RvLmRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzYWdlQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAgIFVzYWdlQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFVzYWdlQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGRhdGEgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgdm0ucmFtQ2hhcnREYXRhID0gW3trZXk6ICdNZW1vcnknLCB5OiA3Njg2NjB9LCB7IGtleTogJ0NhY2hlJywgeTogMzY3NDA0fSwge2tleTogJ1N3YXAnLCB5OiA0MTkyNCB9XTtcbiAgICAgICAgdm0uc3RvcmFnZUNoYXJ0RGF0YSA9IFt7a2V5OiAnU3lzdGVtJywgeTogMTI2NTYwfSwge2tleTogJ090aGVyJywgeTogMjI0MzY1IH1dO1xuXG4gICAgICAgIHZtLmNoYXJ0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3BpZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEzMCxcbiAgICAgICAgICAgICAgICBkb251dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZUZvcm1hdDogKGQzLmZvcm1hdChcIi4wZlwiKSksXG4gICAgICAgICAgICAgICAgY29sb3I6IFsncmdiKDAsIDE1MCwgMTM2KScsICcjRTc1NzUzJywgJ3JnYigyMzUsIDIzNSwgMjM1KSddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnODMlJyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHsgdG9wOiAtMTAsIGxlZnQ6IC0yMCwgcmlnaHQ6IC0yMCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Zpc2l0b3JzQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAgIFZpc2l0b3JzQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFZpc2l0b3JzQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGRhdGEgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgdm0udmlzaXRvcnNDaGFydERhdGEgPSBbIHtrZXk6ICdNb2JpbGUnLCB5OiA1MjY0fSwgeyBrZXk6ICdEZXNrdG9wJywgeTogMzg3Mn0gXTtcblxuICAgICAgICB2bS5jaGFydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMTAsXG4gICAgICAgICAgICAgICAgZG9udXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgdmFsdWVGb3JtYXQ6IChkMy5mb3JtYXQoXCIuMGZcIikpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBbJ3JnYigwLCAxNTAsIDEzNiknLCAnI0U3NTc1MyddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT3ZlciA5SycsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB7IHRvcDogLTEwIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignV2FybmluZ3NDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgV2FybmluZ3NDb250cm9sbGVyXG4gICAgICAgIF0pO1xuXG4gICAgZnVuY3Rpb24gV2FybmluZ3NDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFRPRE86IG1vdmUgZGF0YSB0byB0aGUgc2VydmljZVxuICAgICAgICB2bS53YXJuaW5nc0NoYXJ0RGF0YSA9IHdhcm5pbmdGdW5jdGlvbjtcblxuICAgICAgICBmdW5jdGlvbiB3YXJuaW5nRnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2luID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2luLnB1c2goe3g6IGksIHk6IE1hdGguYWJzKE1hdGguY29zKGkvMTApICowLjI1KmkgKyAwLjkgLSAwLjQqaSl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbIHsgdmFsdWVzOiBzaW4sIGNvbG9yOiAncmdiKDAsIDE1MCwgMTM2KScsIGFyZWE6IHRydWUgfSBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uY2hhcnRPcHRpb25zID0ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIxMCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHsgdG9wOiAtMTAsIGxlZnQ6IC0yMCwgcmlnaHQ6IC0yMCB9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnggfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC55IH0sXG4gICAgICAgICAgICAgICAgc2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdPdmVyIDlLJyxcbiAgICAgICAgICAgICAgICBzaG93WUF4aXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dYQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogeyBjb250ZW50R2VuZXJhdG9yOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gJzxzcGFuIGNsYXNzPVwiY3VzdG9tLXRvb2x0aXBcIj4nICsgTWF0aC5yb3VuZChkLnBvaW50LnkpICsgJzwvc3Bhbj4nIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb250cm9sbGVySWQgPSAnc2lkZWJhcic7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLFxuICAgICAgICBbJyRyb3V0ZScsICdyb3V0ZXMnLCBzaWRlYmFyXSk7XG5cbiAgICBmdW5jdGlvbiBzaWRlYmFyKCRyb3V0ZSwgcm91dGVzKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uaXNDdXJyZW50ID0gaXNDdXJyZW50O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7IGdldE5hdlJvdXRlcygpOyB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmF2Um91dGVzKCkge1xuICAgICAgICAgICAgdm0ubmF2Um91dGVzID0gcm91dGVzLmZpbHRlcihmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuY29uZmlnLnNldHRpbmdzICYmIHIuY29uZmlnLnNldHRpbmdzLm5hdjtcbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24ocjEsIHIyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIxLmNvbmZpZy5zZXR0aW5ncy5uYXYgLSByMi5jb25maWcuc2V0dGluZ3MubmF2O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0N1cnJlbnQocm91dGUpIHtcbiAgICAgICAgICAgIGlmICghcm91dGUuY29uZmlnLnRpdGxlIHx8ICEkcm91dGUuY3VycmVudCB8fCAhJHJvdXRlLmN1cnJlbnQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWVudU5hbWUgPSByb3V0ZS5jb25maWcudGl0bGU7XG4gICAgICAgICAgICByZXR1cm4gJHJvdXRlLmN1cnJlbnQudGl0bGUuc3Vic3RyKDAsIG1lbnVOYW1lLmxlbmd0aCkgPT09IG1lbnVOYW1lID8gJ2N1cnJlbnQnIDogJyc7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
