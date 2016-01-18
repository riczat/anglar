(function(){
	"use strict";

	angular.module('app',
		[
        // Angular modules
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
				'partialsModule',
				'angular-locker',

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
				'app.config'
		]);

	angular.module('app.routes', ['ui.router']);
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'angular-loading-bar', 'angular-locker']);
	angular.module('app.filters', []);
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.config', []);

})();

(function(routes){
  "use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return './build/views/' + viewName + '/' + viewName + '.html';
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
      .state('app.landing', {
        url: '/app/dashboard/dashboard.html',
        data: {},
        views: {
          'main@': {
            templateUrl: getView('landing')
          }
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
                color: ['rgb(0, 150, 136)', 'rgb(204, 203, 203)', 'rgb(149, 149, 149)', 'rgb(44, 44, 44)'],
                tooltip: { contentGenerator: function (d) { return '<div class="custom-tooltip">' + d.point.y + '%</div>' + '<div class="custom-tooltip">' + d.series[0].key + '</div>' } },
                showControls: false
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
(function () {
   'use strict';
   angular.module('app.view1', ['ngRoute'])

   .config(['$routeProvider', function($routeProvider) {
     $routeProvider.when('/view1', {
       templateUrl: 'view1/view1.html',
       controller: 'View1Ctrl'
     });
   }])

   .controller('View1Ctrl', [function() {

   }]);}());

(function () {
   'use strict';
   describe('app.view1 module', function() {

     beforeEach(module('app.view1'));

     describe('view1 controller', function(){

       it('should ....', inject(function($controller) {
         //spec body
         var view1Ctrl = $controller('View1Ctrl');
         expect(view1Ctrl).toBeDefined();
       }));

     });
   });}());

(function () {
'use strict';

angular.module('app.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);
}());

(function () {
   'use strict';
   describe('app.view2 module', function() {

     beforeEach(module('app.view2'));

     describe('view2 controller', function(){

       it('should ....', inject(function($controller) {
         //spec body
         var view2Ctrl = $controller('View2Ctrl');
         expect(view2Ctrl).toBeDefined();
       }));

     });
   });
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2xvYWRpbmdfYmFyLmNvbmZpZy5qcyIsImNvbmZpZy90aGVtZS5jb25maWcuanMiLCJlMmUtdGVzdHMvcHJvdHJhY3Rvci5jb25mLmpzIiwiZTJlLXRlc3RzL3NjZW5hcmlvcy5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5maWx0ZXIuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmZpbHRlci5qcyIsImZpbHRlcnMvdHJ1bmNhdGVfY2hhcmFjdGVycy5maWx0ZXIuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmZpbHRlci5qcyIsImZpbHRlcnMvdWNmaXJzdC5maWx0ZXIuanMiLCJzZXJ2aWNlcy9BUEkuc2VydmljZS5qcyIsInNlcnZpY2VzL2NvbW1vbi5qcyIsInNlcnZpY2VzL2RhdGFjb250ZXh0LmpzIiwic2VydmljZXMvZGlhbG9nLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kaXJlY3RpdmVzLmpzIiwic2VydmljZXMvbG9nZ2VyLmpzIiwic2VydmljZXMvc3Bpbm5lci5qcyIsInNlcnZpY2VzL3RvYXN0LnNlcnZpY2UuanMiLCJjb21wb25lbnRzL3ZlcnNpb24vaW50ZXJwb2xhdGUtZmlsdGVyLmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL2ludGVycG9sYXRlLWZpbHRlcl90ZXN0LmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL3ZlcnNpb24tZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL3ZlcnNpb24tZGlyZWN0aXZlX3Rlc3QuanMiLCJjb21wb25lbnRzL3ZlcnNpb24vdmVyc2lvbi5qcyIsImNvbXBvbmVudHMvdmVyc2lvbi92ZXJzaW9uX3Rlc3QuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaXJlY3RpdmVzL2RhdGFfbGlzdGluZy9kYXRhX2xpc3RpbmcuanMiLCJkaXJlY3RpdmVzL2RhdGFfbGlzdGluZy9kZWZpbml0aW9uLmpzIiwiYXBwL3ZpZXdzL2F2ZW5nZXJzL2F2ZW5nZXJzLmpzIiwiYXBwL3ZpZXdzL2Rhc2hib2FyZC9kYXNoYm9hcmQuanMiLCJhcHAvdmlld3MvZm9vdGVyL2Zvb3Rlci5jb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL2hlYWRlci9oZWFkZXIuY29udHJvbGxlci5qcyIsImFwcC92aWV3cy9sYW5kaW5nL2xhbmRpbmcuY29udHJvbGxlci5qcyIsImFwcC92aWV3cy9sYXlvdXQvc2hlbGwuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvQ29udHJvbFBhbmVsQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9NYWluQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9NZW1vcnlDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL01lc3NhZ2VzQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9QZXJmb3JtYW5jZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvUHJvZmlsZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvU2VhcmNoQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9UYWJsZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvVG9kb0NvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvVXNhZ2VDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL1Zpc2l0b3JzQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9XYXJuaW5nc0NvbnRyb2xsZXIuanMiLCJhcHAvdmlld3Mvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3ZpZXdzL3ZpZXcxL3ZpZXcxLmpzIiwiYXBwL3ZpZXdzL3ZpZXcxL3ZpZXcxX3Rlc3QuanMiLCJhcHAvdmlld3MvdmlldzIvdmlldzIuanMiLCJhcHAvdmlld3MvdmlldzIvdmlldzJfdGVzdC5qcyJd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QUEsU0FBQSxNQUFBLFFBQUEsc0JBQUEsU0FBQSxJQUFBO0lBQ0EsT0FBQSxJQUFBLE9BQUEsR0FBQSxnQkFBQSxJQUFBLE9BQUEsR0FBQTtRQUNBOzs7OztBQ1BBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxlQUFBLFFBQUEsaUJBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxTQUFBLEtBQUE7R0FDQSxLQUFBLENBQUEsS0FBQTtJQUNBLE9BQUE7O0dBRUEsSUFBQSxRQUFBLElBQUEsTUFBQTtHQUNBLEtBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLFFBQUEsS0FBQTtJQUNBLE1BQUEsS0FBQSxNQUFBLEdBQUEsT0FBQSxHQUFBLGdCQUFBLE1BQUEsR0FBQSxNQUFBOztHQUVBLE9BQUEsTUFBQSxLQUFBOzs7O0FDWkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxzQkFBQSxZQUFBO1FBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxhQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLE1BQUEsVUFBQSxHQUFBOztnQkFFQSxJQUFBLENBQUEsYUFBQTtvQkFDQSxJQUFBLFlBQUEsTUFBQSxZQUFBOztvQkFFQSxJQUFBLGNBQUEsQ0FBQSxHQUFBO3dCQUNBLFFBQUEsTUFBQSxPQUFBLEdBQUE7O3VCQUVBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsUUFBQSxNQUFBLE9BQUEsR0FBQSxNQUFBLFNBQUE7OztnQkFHQSxPQUFBLFFBQUE7O1lBRUEsT0FBQTs7OztBQzNCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBOztZQUVBLElBQUEsT0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQSxNQUFBO2dCQUNBLElBQUEsV0FBQSxTQUFBLE9BQUE7b0JBQ0EsUUFBQSxXQUFBLE1BQUEsR0FBQSxPQUFBLEtBQUEsT0FBQTs7O1lBR0EsT0FBQTs7OztBQ2pCQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLHNCQUFBLFVBQUEsTUFBQTtFQUNBLE9BQUEsVUFBQSxNQUFBO0dBQ0EsT0FBQSxLQUFBLFlBQUE7Ozs7QUNMQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxPQUFBLFdBQUEsV0FBQTtFQUNBLE9BQUEsVUFBQSxRQUFBO0dBQ0EsS0FBQSxDQUFBLE9BQUE7SUFDQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxnQkFBQSxNQUFBLFVBQUE7Ozs7OztBQ1JBLENBQUEsV0FBQTtDQUNBOztDQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLHdEQUFBLFNBQUEsYUFBQSxjQUFBLGVBQUE7OztFQUdBLElBQUEsVUFBQTtHQUNBLGdCQUFBO0dBQ0EsVUFBQTs7O0VBR0EsT0FBQSxZQUFBLFdBQUEsU0FBQSx1QkFBQTtHQUNBO0tBQ0EsV0FBQTtLQUNBLGtCQUFBO0tBQ0Esb0JBQUEsU0FBQSxVQUFBO0tBQ0EsSUFBQSxTQUFBLFdBQUEsS0FBQTtNQUNBLEtBQUEsSUFBQSxTQUFBLFNBQUEsS0FBQSxRQUFBO09BQ0EsT0FBQSxhQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUEsT0FBQTs7OztLQUlBLDBCQUFBLFNBQUEsU0FBQSxXQUFBLE1BQUEsS0FBQSxTQUFBO0tBQ0EsSUFBQSxjQUFBLEtBQUE7TUFDQSxRQUFBLGdCQUFBLFlBQUEsY0FBQTs7Ozs7Ozs7QUN4QkEsQ0FBQSxZQUFBO0lBQ0E7Ozs7Ozs7SUFPQSxJQUFBLGVBQUEsUUFBQSxPQUFBLFVBQUE7Ozs7SUFJQSxhQUFBLFNBQUEsZ0JBQUEsWUFBQTtRQUNBLEtBQUEsU0FBQTs7Ozs7O1FBTUEsS0FBQSxPQUFBLFlBQUE7WUFDQSxPQUFBO2dCQUNBLFFBQUEsS0FBQTs7Ozs7SUFLQSxhQUFBLFFBQUE7UUFDQSxDQUFBLE1BQUEsY0FBQSxZQUFBLGdCQUFBLFVBQUE7O0lBRUEsU0FBQSxPQUFBLElBQUEsWUFBQSxVQUFBLGNBQUEsUUFBQTtRQUNBLElBQUEsWUFBQTs7UUFFQSxJQUFBLFVBQUE7O1lBRUEsWUFBQTtZQUNBLElBQUE7WUFDQSxVQUFBOztZQUVBLG9CQUFBO1lBQ0Esc0JBQUE7WUFDQSxtQkFBQTtZQUNBLFVBQUE7WUFDQSxRQUFBO1lBQ0EsY0FBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLG1CQUFBLFVBQUEsY0FBQTtZQUNBLE9BQUEsR0FBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFdBQUE7Z0JBQ0EsSUFBQSxPQUFBLEVBQUEsY0FBQTtnQkFDQSxXQUFBLGFBQUEsT0FBQSxnQ0FBQTs7OztRQUlBLFNBQUEsYUFBQTtZQUNBLE9BQUEsV0FBQSxXQUFBLE1BQUEsWUFBQTs7O1FBR0EsU0FBQSxxQkFBQSxXQUFBLE1BQUEsY0FBQSxRQUFBLE9BQUE7Ozs7O1lBS0EsUUFBQSxDQUFBLFNBQUE7O1lBRUEsSUFBQSxDQUFBLGNBQUE7O2dCQUVBLGVBQUEsYUFBQSxLQUFBLEdBQUEsZ0JBQUEsS0FBQSxPQUFBLEdBQUE7O2dCQUVBLFNBQUEsT0FBQTs7OztZQUlBLElBQUEsV0FBQSxZQUFBOzs7O2dCQUlBLFVBQUEsZ0JBQUEsVUFBQSxNQUFBLE9BQUEsVUFBQSxNQUFBO29CQUNBLE9BQUEsVUFBQSxRQUFBOzs7O1lBSUEsT0FBQSxDQUFBLFlBQUE7OztnQkFHQSxJQUFBOzs7Z0JBR0EsT0FBQSxVQUFBLFdBQUE7b0JBQ0EsSUFBQSxvQkFBQTt3QkFDQSxTQUFBLE9BQUE7d0JBQ0EscUJBQUE7O29CQUVBLElBQUEsYUFBQSxDQUFBLE9BQUE7d0JBQ0E7MkJBQ0E7d0JBQ0EscUJBQUEsU0FBQSxVQUFBOzs7Ozs7UUFNQSxTQUFBLGtCQUFBLEtBQUEsVUFBQSxPQUFBLFdBQUE7Ozs7O1lBS0EsSUFBQSxlQUFBO1lBQ0EsUUFBQSxTQUFBO1lBQ0EsSUFBQSxVQUFBLE1BQUE7Z0JBQ0EsU0FBQSxPQUFBLFVBQUE7Z0JBQ0EsVUFBQSxPQUFBOztZQUVBLElBQUEsV0FBQTtnQkFDQTttQkFDQTtnQkFDQSxVQUFBLE9BQUEsU0FBQSxVQUFBOzs7O1FBSUEsU0FBQSxTQUFBLEtBQUE7O1lBRUEsT0FBQSxDQUFBLGFBQUEsS0FBQTs7O1FBR0EsU0FBQSxhQUFBLE1BQUEsWUFBQTtZQUNBLE9BQUEsUUFBQSxDQUFBLE1BQUEsS0FBQSxjQUFBLFFBQUEsV0FBQTs7OztBQy9IQSxDQUFBLFlBQUE7SUFDQTs7SUFFQSxJQUFBLFlBQUE7SUFDQSxRQUFBLE9BQUE7U0FDQSxRQUFBLFdBQUEsQ0FBQSxTQUFBLFVBQUE7O0lBRUEsU0FBQSxZQUFBLE9BQUEsUUFBQTtRQUNBLElBQUEsS0FBQSxPQUFBOztRQUVBLElBQUEsVUFBQTtZQUNBLGlCQUFBO1lBQ0EsaUJBQUE7WUFDQSxRQUFBOzs7UUFHQSxPQUFBOztRQUVBLFNBQUEsU0FBQTtZQUNBLE9BQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxLQUFBO2lCQUNBLEtBQUEsU0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO29CQUNBLE9BQUEsS0FBQSxLQUFBLEdBQUEsS0FBQTttQkFDQSxTQUFBLE1BQUE7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE9BQUE7Ozs7Ozs7Ozs7O1FBV0EsU0FBQSxrQkFBQTtZQUNBLElBQUEsUUFBQTtZQUNBLE9BQUEsa0JBQUEsS0FBQSxVQUFBLE1BQUE7Z0JBQ0EsUUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQSxLQUFBOzs7O1FBSUEsU0FBQSxrQkFBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxDQUFBLE1BQUEscUJBQUEsV0FBQTtnQkFDQSxDQUFBLE1BQUEsbUJBQUEsV0FBQTtnQkFDQSxDQUFBLE1BQUEsZUFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxnQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxzQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxpQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxtQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxxQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxnQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxrQkFBQSxXQUFBO2dCQUNBLENBQUEsTUFBQSxlQUFBLFdBQUE7O1lBRUEsT0FBQSxHQUFBLEtBQUE7Ozs7QUN6REEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsK0JBQUEsU0FBQSxVQUFBOztFQUVBLE9BQUE7R0FDQSxjQUFBLFNBQUEsVUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQTtLQUNBLGFBQUEscUJBQUEsV0FBQSxNQUFBLFdBQUE7OztJQUdBLElBQUEsT0FBQTtLQUNBLFFBQUEsUUFBQSxPQUFBOzs7SUFHQSxPQUFBLFVBQUEsS0FBQTs7O0dBR0EsTUFBQSxVQUFBO0lBQ0EsT0FBQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsT0FBQSxRQUFBO0lBQ0EsVUFBQTtLQUNBLFVBQUE7T0FDQSxNQUFBO09BQ0EsUUFBQTtPQUNBLEdBQUE7Ozs7R0FJQSxTQUFBLFNBQUEsT0FBQSxTQUFBO0lBQ0EsT0FBQSxVQUFBO0tBQ0EsVUFBQTtPQUNBLE1BQUE7T0FDQSxRQUFBO09BQ0EsR0FBQTtPQUNBLE9BQUE7Ozs7OztBQ3RDQSxDQUFBLFlBQUE7SUFDQTs7SUFFQSxJQUFBLE1BQUEsUUFBQSxPQUFBOztJQUVBLElBQUEsVUFBQSxlQUFBLENBQUEsVUFBQSxVQUFBLFFBQUE7OztRQUdBLElBQUEsV0FBQSxPQUFBLGNBQUE7UUFDQSxJQUFBLGVBQUEsT0FBQSxjQUFBO1FBQ0EsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxNQUFBLFNBQUEsZUFBQSxVQUFBLE9BQUE7Z0JBQ0EsUUFBQSxZQUFBLFNBQUE7Z0JBQ0EsTUFBQSxLQUFBLE9BQUE7Ozs7O0lBS0EsSUFBQSxVQUFBLGFBQUEsWUFBQTs7Ozs7O1FBTUEsSUFBQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxJQUFBLGdCQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsbUJBQUEsUUFBQSxLQUFBO1lBQ0EsUUFBQSxTQUFBO1lBQ0EsaUJBQUEsTUFBQTs7WUFFQSxTQUFBLFNBQUEsR0FBQTtnQkFDQSxJQUFBLFlBQUE7Z0JBQ0EsRUFBQTtnQkFDQSxJQUFBLENBQUEsaUJBQUEsU0FBQSxZQUFBO29CQUNBO29CQUNBLGNBQUEsVUFBQTtvQkFDQSxpQkFBQSxTQUFBO3VCQUNBLElBQUEsaUJBQUEsU0FBQSxZQUFBO29CQUNBLGlCQUFBLFlBQUE7b0JBQ0EsY0FBQSxRQUFBOzs7Z0JBR0EsU0FBQSxrQkFBQTtvQkFDQSxjQUFBLFFBQUE7b0JBQ0EsRUFBQSx1QkFBQSxZQUFBOzs7Ozs7O0lBT0EsSUFBQSxVQUFBLGlCQUFBLFlBQUE7Ozs7Ozs7UUFPQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxNQUFBLEtBQUEsUUFBQTtZQUNBLE1BQUEsS0FBQTtZQUNBLFFBQUEsTUFBQTs7WUFFQSxTQUFBLFFBQUEsR0FBQTtnQkFDQSxFQUFBO2dCQUNBLFFBQUEsU0FBQSxTQUFBLFNBQUEsS0FBQTs7Ozs7SUFLQSxJQUFBLFVBQUEsb0JBQUEsWUFBQTs7Ozs7UUFLQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7O1FBRUEsT0FBQTs7UUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7O1lBRUEsTUFBQSxLQUFBLFFBQUE7WUFDQSxNQUFBLEtBQUE7WUFDQSxRQUFBLE1BQUE7O1lBRUEsU0FBQSxTQUFBLEdBQUE7Z0JBQ0EsRUFBQTtnQkFDQSxJQUFBLFlBQUEsUUFBQSxTQUFBLFNBQUEsS0FBQTtnQkFDQSxJQUFBLFdBQUEsUUFBQSxTQUFBO2dCQUNBLElBQUEsVUFBQSxHQUFBLGFBQUE7b0JBQ0EsU0FBQSxZQUFBO29CQUNBLFNBQUEsU0FBQTt1QkFDQTtvQkFDQSxTQUFBLFlBQUE7b0JBQ0EsU0FBQSxTQUFBOztnQkFFQSxVQUFBLE9BQUE7Ozs7O0lBS0EsSUFBQSxVQUFBLGlCQUFBLENBQUE7Ozs7Ozs7UUFPQSxVQUFBLFNBQUE7WUFDQSxJQUFBLFlBQUE7Z0JBQ0EsTUFBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUE7O1lBRUEsT0FBQTs7WUFFQSxTQUFBLEtBQUEsT0FBQSxTQUFBLE9BQUE7Z0JBQ0EsSUFBQSxPQUFBLEVBQUE7Z0JBQ0EsUUFBQSxTQUFBO2dCQUNBLEtBQUEsT0FBQTs7Z0JBRUEsUUFBQSxLQUFBLEtBQUEsTUFBQSxVQUFBLEdBQUE7b0JBQ0EsRUFBQTs7O29CQUdBLEVBQUEsUUFBQSxRQUFBLEVBQUEsV0FBQSxLQUFBOzs7Z0JBR0EsU0FBQSxhQUFBO29CQUNBLElBQUEsS0FBQSxjQUFBLEtBQUE7d0JBQ0EsUUFBQTsyQkFDQTt3QkFDQSxRQUFBOzs7Ozs7O0lBT0EsSUFBQSxVQUFBLGFBQUEsQ0FBQSxXQUFBLFVBQUEsU0FBQTs7Ozs7UUFLQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLE1BQUEsVUFBQTtZQUNBLE1BQUEsT0FBQSxNQUFBLFdBQUEsVUFBQSxTQUFBO2dCQUNBLElBQUEsTUFBQSxTQUFBO29CQUNBLE1BQUEsUUFBQTs7Z0JBRUEsTUFBQSxVQUFBLElBQUEsUUFBQSxRQUFBO2dCQUNBLE1BQUEsUUFBQSxLQUFBLFFBQUE7ZUFDQTs7OztJQUlBLElBQUEsVUFBQSxrQkFBQSxZQUFBOzs7UUFHQSxJQUFBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtnQkFDQSxTQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxpQkFBQTs7WUFFQSxhQUFBO1lBQ0EsVUFBQTs7UUFFQSxPQUFBOztRQUVBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLE1BQUEsS0FBQSxTQUFBOzs7O0FDek1BLENBQUEsWUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxVQUFBLFFBQUEsVUFBQSxDQUFBLFFBQUE7O0lBRUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxJQUFBLFVBQUE7WUFDQSxVQUFBO1lBQ0EsS0FBQTtZQUNBLFVBQUE7WUFDQSxZQUFBO1lBQ0EsWUFBQTs7O1FBR0EsT0FBQTs7UUFFQSxTQUFBLFNBQUEsVUFBQSxRQUFBO1lBQ0EsU0FBQSxVQUFBO1lBQ0EsUUFBQSxPQUFBO2dCQUNBLEtBQUE7b0JBQ0EsU0FBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLFNBQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxTQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsU0FBQTtvQkFDQTs7O1lBR0EsSUFBQSxRQUFBLFFBQUEsV0FBQSxRQUFBO1lBQ0EsT0FBQSxVQUFBLEtBQUEsTUFBQSxXQUFBO2dCQUNBLE1BQUEsS0FBQSxNQUFBLFVBQUEsQ0FBQSxjQUFBLGFBQUEsT0FBQTs7OztRQUlBLFNBQUEsSUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBOzs7UUFHQSxTQUFBLFdBQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTs7O1FBR0EsU0FBQSxXQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7WUFDQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7OztRQUdBLFNBQUEsU0FBQSxTQUFBLE1BQUEsUUFBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBOzs7UUFHQSxTQUFBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQSxXQUFBO1lBQ0EsSUFBQSxRQUFBLENBQUEsY0FBQSxXQUFBLEtBQUEsUUFBQSxLQUFBO1lBQ0EsU0FBQSxTQUFBLE1BQUEsU0FBQSxPQUFBO1lBQ0EsTUFBQSxRQUFBLFNBQUE7WUFD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LFdBQUEsZUFBQSxXQUFBOztFQUVBLE9BQUE7R0FDQSxVQUFBO0dBQ0EsYUFBQTtHQUNBLFlBQUE7R0FDQSxNQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUE7Ozs7Ozs7OztBQ1RBLENBQUEsWUFBQTtJQUNBO0lBQ0EsSUFBQSxlQUFBO0lBQ0EsUUFBQSxPQUFBO1NBQ0EsV0FBQTtZQUNBLENBQUEsVUFBQSxlQUFBOztJQUVBLFNBQUEsU0FBQSxRQUFBLGFBQUE7UUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxNQUFBLFNBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxNQUFBO1FBQ0EsR0FBQSxRQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQTtZQUNBLElBQUEsV0FBQSxDQUFBLG1CQUFBO1lBQ0EsT0FBQSxtQkFBQSxVQUFBO2lCQUNBLEtBQUEsWUFBQTtvQkFDQSxJQUFBOzs7O1FBSUEsU0FBQSxTQUFBO1lBQ0EsT0FBQSxZQUFBLFNBQUEsS0FBQSxVQUFBLE1BQUE7O2dCQUVBLEdBQUEsTUFBQTtnQkFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxTQUFBLGtCQUFBO1lBQ0EsT0FBQSxZQUFBLGtCQUFBLEtBQUEsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxPQUFBLEdBQUE7Ozs7O0FDckNBLENBQUEsWUFBQTtJQUNBO0lBQ0EsSUFBQSxlQUFBO0lBQ0EsUUFBQSxPQUFBLE9BQUEsV0FBQSxjQUFBLENBQUEsVUFBQSxlQUFBOztJQUVBLFNBQUEsVUFBQSxRQUFBLGFBQUE7UUFDQSxJQUFBLFdBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxNQUFBLFNBQUE7O1FBRUEsSUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBO1lBQ0EsT0FBQTtZQUNBLGFBQUE7O1FBRUEsR0FBQSxlQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxRQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQTtZQUNBLElBQUEsV0FBQSxDQUFBLG1CQUFBO1lBQ0EsT0FBQSxtQkFBQSxVQUFBO2lC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QUFBO0lBQ0EsR0FBQSxRQUFBLE9BQUEsUUFBQSxLQUFBO0lBQ0EsR0FBQSxrQkFBQTs7SUFFQTtPQUNBO09BQ0EsS0FBQSxTQUFBLFdBQUE7UUFDQSxHQUFBLFlBQUEsR0FBQSxPQUFBOzs7SUFHQSxTQUFBLGtCQUFBO01BQ0EsSUFBQSxVQUFBLGVBQUEsVUFBQSxHQUFBLEtBQUE7O01BRUEsUUFBQSxLQUFBLFVBQUE7UUFDQSxXQUFBLFFBQUE7Ozs7SUFJQSxTQUFBLFlBQUEsTUFBQTtNQUNBLEdBQUEsUUFBQSxLQUFBO01BQ0EsR0FBQTtNQUNBLEdBQUEsZ0JBQUEsR0FBQTs7O0lBR0EsU0FBQSxZQUFBLFFBQUE7UUFDQSxlQUFBLEtBQUE7VUFDQSxRQUFBLFFBQUEsUUFBQSxTQUFBLGVBQUE7VUFDQSxhQUFBO1VBQ0EsWUFBQSxFQUFBLGtCQUFBO1VBQ0EsY0FBQTtVQUNBLG1CQUFBO1VBQ0EsYUFBQTtXQUNBLEtBQUEsU0FBQSxhQUFBO1VBQ0EsZUFBQSxLQUFBLE9BQUEsWUFBQSxPQUFBOzs7UUFHQSxTQUFBLGlCQUFBLGlCQUFBO1VBQ0EsSUFBQSxLQUFBOztVQUVBLEdBQUEsVUFBQTtZQUNBLEVBQUEsTUFBQSxTQUFBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsRUFBQSxNQUFBLFFBQUEsTUFBQSxRQUFBLEtBQUE7OztVQUdBLEdBQUEsZ0JBQUEsU0FBQSxRQUFBO1lBQ0EsZUFBQSxLQUFBOzs7OztJQUtBLFNBQUEsZ0JBQUEsT0FBQTtNQUNBLFNBQUE7UUFDQSxTQUFBO1dBQ0EsUUFBQTtXQUNBLFVBQUE7V0FDQSxTQUFBOzs7Ozs7O0FDdEVBLENBQUEsWUFBQTtFQUNBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTtZQUNBOzs7SUFHQSxTQUFBLG1CQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLGtCQUFBLEVBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxLQUFBLEVBQUEsS0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFB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QUNBLElBQUEsaUJBQUEsUUFBQSxVQUFBO01BQ0EsT0FBQSxTQUFBLFNBQUEsT0FBQTtRQUNBLFFBQUEsTUFBQSxNQUFBLFFBQUEsb0JBQUE7Ozs7OztBQzdCQSxDQUFBLFVBQUE7QUFDQTtFQUNBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsbUJBQUE7TUFDQTtNQUNBOzs7RUFHQSxTQUFBLGdCQUFBLGNBQUE7SUFDQSxJQUFBLEtBQUE7O0lBRUEsR0FBQSxZQUFBOztJQUVBO09BQ0E7T0FDQSxLQUFBLFNBQUEsV0FBQTtRQUNBLEdBQUEsWUFBQSxHQUFBLE9BQUE7Ozs7OztBQ2pCQSxDQUFBLFlBQUE7RUFDQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7WUFDQTtZQUNBOzs7SUFHQSxTQUFBLGVBQUEsaUJBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxRQUFBOztRQUVBO2FBQ0E7YUFDQSxLQUFBLFVBQUEsT0FBQTtnQkFDQSxHQUFBLFFBQUEsR0FBQSxPQUFBOzs7UUFHQSxTQUFBLFVBQUE7WUFDQSxHQUFBLE1BQUEsS0FBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLE1BQUE7WUFDQSxHQUFBLFdBQUE7OztRQUdBLFNBQUEsWUFBQTtZQUNBLElBQUEsUUFBQTtZQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsVUFBQSxNQUFBO2dCQUNBLFNBQUEsS0FBQSxPQUFBLElBQUE7O1lBRUEsT0FBQTs7O1FBR0EsU0FBQSxRQUFBLEdBQUE7O1lBRUEsRUFBQTtZQUNBLElBQUEsV0FBQSxHQUFBO1lBQ0EsR0FBQSxRQUFBO1lBQ0EsUUFBQSxRQUFBLFVBQUEsVUFBQSxNQUFBO2dCQUNBLElBQUEsQ0FBQSxLQUFBLE1BQUEsR0FBQSxNQUFBLEtBQUE7Ozs7UUFJQSxTQUFBLFlBQUE7WUFDQSxJQUFBLGVBQUEsR0FBQTtnQkFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFVBQUEsTUFBQTtvQkFDQSxLQUFBLE9BQUE7O21CQUVBO2dCQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsVUFBQSxNQUFBO29CQUNBLEtBQUEsT0FBQTs7Ozs7OztBQ3REQSxDQUFBLFlBQUE7RUFDQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsbUJBQUE7WUFDQTs7O0lBR0EsU0FBQSxrQkFBQTtRQUNBLElBQUEsS0FBQTs7O1FBR0EsR0FBQSxlQUFBLENBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxTQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsU0FBQSxDQUFBLEtBQUEsUUFBQSxHQUFBO1FBQ0EsR0FBQSxtQkFBQSxDQUFBLENBQUEsS0FBQSxVQUFBLEdBQUEsU0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFBOztRQUVBLEdBQUEsZUFBQTtZQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsR0FBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7Z0JBQ0EsR0FBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7Z0JBQ0EsY0FBQSxHQUFBLE9BQUE7Z0JBQ0EsT0FBQSxDQUFBLG9CQUFBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQTs7Ozs7O0FDM0JBLENBQUEsWUFBQTtFQUNBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTtZQUNBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLG9CQUFBLEVBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBLEVBQUEsS0FBQSxXQUFBLEdBQUE7O1FBRUEsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxjQUFBLEdBQUEsT0FBQTtnQkFDQSxPQUFBLENBQUEsb0JBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQTs7Ozs7O0FDMUJBLENBQUEsWUFBQTtFQUNBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTtZQUNBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLG9CQUFBOztRQUVBLFNBQUEsa0JBQUE7WUFDQSxJQUFBLE1BQUE7WUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxLQUFBO2dCQUNBLElBQUEsS0FBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsSUFBQSxNQUFBLElBQUE7O1lBRUEsT0FBQSxFQUFBLEVBQUEsUUFBQSxLQUFBLE9BQUEsb0JBQUEsTUFBQTs7O1FBR0EsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxZQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxXQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsU0FBQSxFQUFBLGtCQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsa0NBQUEsS0FBQSxNQUFBLEVBQUEsTUFBQSxLQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxZQUFBO0lBQ0E7O0lBRUEsSUFBQSxlQUFBO0lBQ0EsUUFBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLENBQUEsVUFBQSxVQUFBOztJQUVBLFNBQUEsUUFBQSxRQUFBLFFBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQSxFQUFBOztRQUVBLFNBQUEsZUFBQTtZQUNBLEdBQUEsWUFBQSxPQUFBLE9BQUEsU0FBQSxHQUFBO2dCQUNBLE9BQUEsRUFBQSxPQUFBLFlBQUEsRUFBQSxPQUFBLFNBQUE7ZUFDQSxLQUFBLFNBQUEsSUFBQSxJQUFBO2dCQUNBLE9BQUEsR0FBQSxPQUFBLFNBQUEsTUFBQSxHQUFBLE9BQUEsU0FBQTs7OztRQUlBLFNBQUEsVUFBQSxPQUFBO1lBQ0EsSUFBQSxDQUFBLE1BQUEsT0FBQSxTQUFBLENBQUEsT0FBQSxXQUFBLENBQUEsT0FBQSxRQUFBLE9BQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLFdBQUEsTUFBQSxPQUFBO1lBQ0EsT0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBLEdBQUEsU0FBQSxZQUFBLFdBQUEsWUFBQTs7OztBQzdCQSxDQUFBLFlBQUE7R0FDQTtHQUNBLFFBQUEsT0FBQSxhQUFBLENBQUE7O0lBRUEsT0FBQSxDQUFBLGtCQUFBLFNBQUEsZ0JBQUE7S0FDQSxlQUFBLEtBQUEsVUFBQTtPQUNBLGFBQUE7T0FDQSxZQUFBOzs7O0lBSUEsV0FBQSxhQUFBLENBQUEsV0FBQTs7OztBQ1hBLENBQUEsWUFBQTtHQUNBO0dBQ0EsU0FBQSxvQkFBQSxXQUFBOztLQUVBLFdBQUEsT0FBQTs7S0FFQSxTQUFBLG9CQUFBLFVBQUE7O09BRUEsR0FBQSxlQUFBLE9BQUEsU0FBQSxhQUFBOztTQUVBLElBQUEsWUFBQSxZQUFBO1NBQ0EsT0FBQSxXQUFBOzs7Ozs7QUNYQSxDQUFBLFlBQUE7QUFDQTs7QUFFQSxRQUFBLE9BQUEsYUFBQSxDQUFBOztDQUVBLE9BQUEsQ0FBQSxrQkFBQSxTQUFBLGdCQUFBO0VBQ0EsZUFBQSxLQUFBLFVBQUE7SUFDQSxhQUFBO0lBQ0EsWUFBQTs7OztDQUlBLFdBQUEsYUFBQSxDQUFBLFdBQUE7Ozs7O0FDWkEsQ0FBQSxZQUFBO0dBQ0E7R0FDQSxTQUFBLG9CQUFBLFdBQUE7O0tBRUEsV0FBQSxPQUFBOztLQUVBLFNBQUEsb0JBQUEsVUFBQTs7T0FFQSxHQUFBLGVBQUEsT0FBQSxTQUFBLGFBQUE7O1NBRUEsSUFBQSxZQUFBLFlBQUE7U0FDQSxPQUFBLFdBQUE7Ozs7OztBQU1BIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJyxcblx0XHRbXG4gICAgICAgIC8vIEFuZ3VsYXIgbW9kdWxlc1xuICAgICAgICAnbmdBbmltYXRlJywgICAgICAgIC8vIGFuaW1hdGlvbnNcbiAgICAgICAgJ25nUm91dGUnLCAgICAgICAgICAvLyByb3V0aW5nXG4gICAgICAgICduZ1Nhbml0aXplJywgICAgICAgLy8gc2FuaXRpemVzIGh0bWwgYmluZGluZ3MgKGV4OiBzaWRlYmFyLmpzKVxuXHRcdFx0XHQncGFydGlhbHNNb2R1bGUnLFxuXHRcdFx0XHQnYW5ndWxhci1sb2NrZXInLFxuXG4gICAgICAgIC8vIEN1c3RvbSBtb2R1bGVzXG4gICAgICAgICdjb21tb24nLCAgICAgICAgICAgLy8gY29tbW9uIGZ1bmN0aW9ucywgbG9nZ2VyLCBzcGlubmVyXG4gICAgICAgICdjb21tb24uYm9vdHN0cmFwJywgLy8gYm9vdHN0cmFwIGRpYWxvZyB3cmFwcGVyIGZ1bmN0aW9uc1xuXG4gICAgICAgIC8vIDNyZCBQYXJ0eSBNb2R1bGVzXG4gICAgICAgICd1aS5ib290c3RyYXAnLCAgICAgIC8vIHVpLWJvb3RzdHJhcCAoZXg6IGNhcm91c2VsLCBwYWdpbmF0aW9uLCBkaWFsb2cpXG5cblx0XHRcdFx0Ly8gbG9jYWwgUGFydHkgTW9kdWxlc1xuXHRcdFx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcblx0XHRcdFx0J2FwcC5maWx0ZXJzJyxcblx0XHRcdFx0J2FwcC5zZXJ2aWNlcycsXG5cdFx0XHRcdCdhcHAuZGlyZWN0aXZlcycsXG5cdFx0XHRcdCdhcHAucm91dGVzJyxcblx0XHRcdFx0J2FwcC5jb25maWcnXG5cdFx0XSk7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlciddKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnYW5ndWxhci1sb2NrZXInXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbihyb3V0ZXMpe1xuICBcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKXtcblxuXHRcdHZhciBnZXRWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpe1xuXHRcdFx0cmV0dXJuICcuL2J1aWxkL3ZpZXdzLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcblx0XHR9O1xuXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xuXHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9vdGVyOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnZm9vdGVyJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1haW46IHt9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG4gICAgICAuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgZGF0YToge30sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ21haW5AJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xhbmRpbmcnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmxhbmRpbmcnLCB7XG4gICAgICAgIHVybDogJy9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sJyxcbiAgICAgICAgZGF0YToge30sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ21haW5AJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xhbmRpbmcnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblx0XHRcdC5zdGF0ZSgnYXBwLmxhbmRpbmcnLCB7XG5cdFx0XHRcdHVybDogJy8nLFxuXHRcdFx0XHRkYXRhOiB7fSxcblx0XHRcdFx0dmlld3M6IHtcblx0XHRcdFx0XHQnbWFpbkAnOiB7XG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJG1kU2lkZW5hdil7XG5cdFx0JHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cblx0XHRcdGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnBhZ2VOYW1lKXtcblx0XHRcdFx0JHJvb3RTY29wZS5jdXJyZW50X3BhZ2UgPSB0b1N0YXRlLmRhdGEucGFnZU5hbWU7XG5cdFx0XHR9XG5cblx0XHR9KTtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiR2aWV3Q29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHR3aW5kb3cuUHJpc20uaGlnaGxpZ2h0QWxsKCk7XG5cdFx0fSk7XG5cblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUpe1xuXHRcdFx0JG1kU2lkZW5hdignbGVmdCcpLmNsb3NlKCk7XG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcblx0XHRjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuXHRcdC5wcmltYXJ5UGFsZXR0ZSgnaW5kaWdvJylcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXG5cdFx0Lndhcm5QYWxldHRlKCdyZWQnKTtcblx0fSk7XG5cbn0pKCk7XG4iLCJleHBvcnRzLmNvbmZpZyA9IHtcbiAgYWxsU2NyaXB0c1RpbWVvdXQ6IDExMDAwLFxuXG4gIHNwZWNzOiBbXG4gICAgJyouanMnXG4gIF0sXG5cbiAgY2FwYWJpbGl0aWVzOiB7XG4gICAgJ2Jyb3dzZXJOYW1lJzogJ2Nocm9tZSdcbiAgfSxcblxuICBiYXNlVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FwcC8nLFxuXG4gIGZyYW1ld29yazogJ2phc21pbmUnLFxuXG4gIGphc21pbmVOb2RlT3B0czoge1xuICAgIGRlZmF1bHRUaW1lb3V0SW50ZXJ2YWw6IDMwMDAwXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3Byb3RyYWN0b3IvYmxvYi9tYXN0ZXIvZG9jcy90b2MubWQgKi9cblxuZGVzY3JpYmUoJ215IGFwcCcsIGZ1bmN0aW9uKCkge1xuXG5cbiAgaXQoJ3Nob3VsZCBhdXRvbWF0aWNhbGx5IHJlZGlyZWN0IHRvIC92aWV3MSB3aGVuIGxvY2F0aW9uIGhhc2gvZnJhZ21lbnQgaXMgZW1wdHknLCBmdW5jdGlvbigpIHtcbiAgICBicm93c2VyLmdldCgnaW5kZXguaHRtbCcpO1xuICAgIGV4cGVjdChicm93c2VyLmdldExvY2F0aW9uQWJzVXJsKCkpLnRvTWF0Y2goXCIvdmlldzFcIik7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ3ZpZXcxJywgZnVuY3Rpb24oKSB7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgYnJvd3Nlci5nZXQoJ2luZGV4Lmh0bWwjL3ZpZXcxJyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHZpZXcxIHdoZW4gdXNlciBuYXZpZ2F0ZXMgdG8gL3ZpZXcxJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoZWxlbWVudC5hbGwoYnkuY3NzKCdbbmctdmlld10gcCcpKS5maXJzdCgpLmdldFRleHQoKSkuXG4gICAgICAgIHRvTWF0Y2goL3BhcnRpYWwgZm9yIHZpZXcgMS8pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ3ZpZXcyJywgZnVuY3Rpb24oKSB7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgYnJvd3Nlci5nZXQoJ2luZGV4Lmh0bWwjL3ZpZXcyJyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHZpZXcyIHdoZW4gdXNlciBuYXZpZ2F0ZXMgdG8gL3ZpZXcyJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoZWxlbWVudC5hbGwoYnkuY3NzKCdbbmctdmlld10gcCcpKS5maXJzdCgpLmdldFRleHQoKSkuXG4gICAgICAgIHRvTWF0Y2goL3BhcnRpYWwgZm9yIHZpZXcgMi8pO1xuICAgIH0pO1xuXG4gIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnY2FwaXRhbGl6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0XHRyZXR1cm4gKGlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csZnVuY3Rpb24odHh0KXtcblx0XHRcdFx0cmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcblx0XHRcdH0pIDogJyc7XG5cdFx0fTtcblx0fSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2h1bWFuUmVhZGFibGUnLCBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBmdW5jdGlvbiBodW1hbml6ZShzdHIpIHtcblx0XHRcdGlmICggIXN0ciApe1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcblx0XHRcdGZvciAodmFyIGk9MDsgaTxmcmFncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnc1tpXSA9IGZyYWdzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZnJhZ3NbaV0uc2xpY2UoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZ3Muam9pbignICcpO1xuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlQ2hhcmFjdGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBjaGFycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgbGFzdCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoLTEpID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCArICcuLi4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIHdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xuXHRcdHJldHVybiBmdW5jdGlvbiggaHRtbCApe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbCk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoJ3VjZmlyc3QnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xuXHRcdFx0aWYgKCAhaW5wdXQgKXtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG5cdFx0fTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdBUEknLCBmdW5jdGlvbihSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlKSB7XG5cblx0XHQvL2NvbnRlbnQgbmVnb3RpYXRpb25cblx0XHR2YXIgaGVhZGVycyA9IHtcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHQnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uJ1xuXHRcdH07XG5cblx0XHRyZXR1cm4gUmVzdGFuZ3VsYXIud2l0aENvbmZpZyhmdW5jdGlvbihSZXN0YW5ndWxhckNvbmZpZ3VyZXIpIHtcblx0XHRcdFJlc3Rhbmd1bGFyQ29uZmlndXJlclxuXHRcdFx0XHQuc2V0QmFzZVVybCgnL2FwaS8nKVxuXHRcdFx0XHQuc2V0RGVmYXVsdEhlYWRlcnMoaGVhZGVycylcblx0XHRcdFx0LnNldEVycm9ySW50ZXJjZXB0b3IoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MjIpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIGVycm9yIGluIHJlc3BvbnNlLmRhdGEuZXJyb3JzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBUb2FzdFNlcnZpY2UuZXJyb3IocmVzcG9uc2UuZGF0YS5lcnJvcnNbZXJyb3JdWzBdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5hZGRGdWxsUmVxdWVzdEludGVyY2VwdG9yKGZ1bmN0aW9uKGVsZW1lbnQsIG9wZXJhdGlvbiwgd2hhdCwgdXJsLCBoZWFkZXJzKSB7XG5cdFx0XHRcdFx0aWYgKCRsb2NhbFN0b3JhZ2Uuand0KSB7XG5cdFx0XHRcdFx0XHRoZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyAkbG9jYWxTdG9yYWdlLmp3dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBjb21tb24gbW9kdWxlXG4gICAgLy8gQ29udGFpbnMgc2VydmljZXM6XG4gICAgLy8gIC0gY29tbW9uXG4gICAgLy8gIC0gbG9nZ2VyXG4gICAgLy8gIC0gc3Bpbm5lclxuICAgIHZhciBjb21tb25Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnY29tbW9uJywgW10pO1xuXG4gICAgLy8gTXVzdCBjb25maWd1cmUgdGhlIGNvbW1vbiBzZXJ2aWNlIGFuZCBzZXQgaXRzXG4gICAgLy8gZXZlbnRzIHZpYSB0aGUgY29tbW9uQ29uZmlnUHJvdmlkZXJcbiAgICBjb21tb25Nb2R1bGUucHJvdmlkZXIoJ2NvbW1vbkNvbmZpZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIHByb3BlcnRpZXMgd2UgbmVlZCB0byBzZXRcbiAgICAgICAgICAgIC8vY29udHJvbGxlckFjdGl2YXRlU3VjY2Vzc0V2ZW50OiAnJyxcbiAgICAgICAgICAgIC8vc3Bpbm5lclRvZ2dsZUV2ZW50OiAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGNvbW1vbk1vZHVsZS5mYWN0b3J5KCdjb21tb24nLFxuICAgICAgICBbJyRxJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnY29tbW9uQ29uZmlnJywgJ2xvZ2dlcicsIGNvbW1vbl0pO1xuXG4gICAgZnVuY3Rpb24gY29tbW9uKCRxLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgY29tbW9uQ29uZmlnLCBsb2dnZXIpIHtcbiAgICAgICAgdmFyIHRocm90dGxlcyA9IHt9O1xuXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgLy8gY29tbW9uIGFuZ3VsYXIgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAkYnJvYWRjYXN0OiAkYnJvYWRjYXN0LFxuICAgICAgICAgICAgJHE6ICRxLFxuICAgICAgICAgICAgJHRpbWVvdXQ6ICR0aW1lb3V0LFxuICAgICAgICAgICAgLy8gZ2VuZXJpY1xuICAgICAgICAgICAgYWN0aXZhdGVDb250cm9sbGVyOiBhY3RpdmF0ZUNvbnRyb2xsZXIsXG4gICAgICAgICAgICBjcmVhdGVTZWFyY2hUaHJvdHRsZTogY3JlYXRlU2VhcmNoVGhyb3R0bGUsXG4gICAgICAgICAgICBkZWJvdW5jZWRUaHJvdHRsZTogZGVib3VuY2VkVGhyb3R0bGUsXG4gICAgICAgICAgICBpc051bWJlcjogaXNOdW1iZXIsXG4gICAgICAgICAgICBsb2dnZXI6IGxvZ2dlciwgLy8gZm9yIGFjY2Vzc2liaWxpdHlcbiAgICAgICAgICAgIHRleHRDb250YWluczogdGV4dENvbnRhaW5zXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGVDb250cm9sbGVyKHByb21pc2VzLCBjb250cm9sbGVySWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKGV2ZW50QXJncykge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0geyBjb250cm9sbGVySWQ6IGNvbnRyb2xsZXJJZCB9O1xuICAgICAgICAgICAgICAgICRicm9hZGNhc3QoY29tbW9uQ29uZmlnLmNvbmZpZy5jb250cm9sbGVyQWN0aXZhdGVTdWNjZXNzRXZlbnQsIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiAkYnJvYWRjYXN0KCkge1xuICAgICAgICAgICAgcmV0dXJuICRyb290U2NvcGUuJGJyb2FkY2FzdC5hcHBseSgkcm9vdFNjb3BlLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlU2VhcmNoVGhyb3R0bGUodmlld21vZGVsLCBsaXN0LCBmaWx0ZXJlZExpc3QsIGZpbHRlciwgZGVsYXkpIHtcbiAgICAgICAgICAgIC8vIEFmdGVyIGEgZGVsYXksIHNlYXJjaCBhIHZpZXdtb2RlbCdzIGxpc3QgdXNpbmdcbiAgICAgICAgICAgIC8vIGEgZmlsdGVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuIGEgZmlsdGVyZWRMaXN0LlxuXG4gICAgICAgICAgICAvLyBjdXN0b20gZGVsYXkgb3IgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgIGRlbGF5ID0gK2RlbGF5IHx8IDMwMDtcbiAgICAgICAgICAgIC8vIGlmIG9ubHkgdm0gYW5kIGxpc3QgcGFyYW1ldGVycyB3ZXJlIHBhc3NlZCwgc2V0IG90aGVycyBieSBuYW1pbmcgY29udmVudGlvblxuICAgICAgICAgICAgaWYgKCFmaWx0ZXJlZExpc3QpIHtcbiAgICAgICAgICAgICAgICAvLyBhc3N1bWluZyBsaXN0IGlzIG5hbWVkIHNlc3Npb25zLCBmaWx0ZXJlZExpc3QgaXMgZmlsdGVyZWRTZXNzaW9uc1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkTGlzdCA9ICdmaWx0ZXJlZCcgKyBsaXN0WzBdLnRvVXBwZXJDYXNlKCkgKyBsaXN0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpOyAvLyBzdHJpbmdcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXIgZnVuY3Rpb24gaXMgbmFtZWQgc2Vzc2lvbkZpbHRlclxuICAgICAgICAgICAgICAgIGZpbHRlciA9IGxpc3QgKyAnRmlsdGVyJzsgLy8gZnVuY3Rpb24gaW4gc3RyaW5nIGZvcm1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSBmaWx0ZXJpbmcgZnVuY3Rpb24gd2Ugd2lsbCBjYWxsIGZyb20gaGVyZVxuICAgICAgICAgICAgdmFyIGZpbHRlckZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHRyYW5zbGF0ZXMgdG8gLi4uXG4gICAgICAgICAgICAgICAgLy8gdm0uZmlsdGVyZWRTZXNzaW9uc1xuICAgICAgICAgICAgICAgIC8vICAgICAgPSB2bS5zZXNzaW9ucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSggeyByZXR1cm5zIHZtLnNlc3Npb25GaWx0ZXIgKGl0ZW0pIH0gKTtcbiAgICAgICAgICAgICAgICB2aWV3bW9kZWxbZmlsdGVyZWRMaXN0XSA9IHZpZXdtb2RlbFtsaXN0XS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdtb2RlbFtmaWx0ZXJdKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBvdXRlciBJRkZFIHNvIHdlIGNhbiB1c2UgY2xvc3VyZVxuICAgICAgICAgICAgICAgIC8vIG92ZXIgZmlsdGVySW5wdXRUaW1lb3V0IHdoaWNoIHJlZmVyZW5jZXMgdGhlIHRpbWVvdXRcbiAgICAgICAgICAgICAgICB2YXIgZmlsdGVySW5wdXRUaW1lb3V0O1xuXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHdoYXQgYmVjb21lcyB0aGUgJ2FwcGx5RmlsdGVyJyBmdW5jdGlvbiBpbiB0aGUgY29udHJvbGxlclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc2VhcmNoTm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJJbnB1dFRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbChmaWx0ZXJJbnB1dFRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVySW5wdXRUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoTm93IHx8ICFkZWxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyRm4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcklucHV0VGltZW91dCA9ICR0aW1lb3V0KGZpbHRlckZuLCBkZWxheSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlYm91bmNlZFRocm90dGxlKGtleSwgY2FsbGJhY2ssIGRlbGF5LCBpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgIC8vIFBlcmZvcm0gc29tZSBhY3Rpb24gKGNhbGxiYWNrKSBhZnRlciBhIGRlbGF5LlxuICAgICAgICAgICAgLy8gVHJhY2sgdGhlIGNhbGxiYWNrIGJ5IGtleSwgc28gaWYgdGhlIHNhbWUgY2FsbGJhY2tcbiAgICAgICAgICAgIC8vIGlzIGlzc3VlZCBhZ2FpbiwgcmVzdGFydCB0aGUgZGVsYXkuXG5cbiAgICAgICAgICAgIHZhciBkZWZhdWx0RGVsYXkgPSAxMDAwO1xuICAgICAgICAgICAgZGVsYXkgPSBkZWxheSB8fCBkZWZhdWx0RGVsYXk7XG4gICAgICAgICAgICBpZiAodGhyb3R0bGVzW2tleV0pIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGhyb3R0bGVzW2tleV0pO1xuICAgICAgICAgICAgICAgIHRocm90dGxlc1trZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm90dGxlc1trZXldID0gJHRpbWVvdXQoY2FsbGJhY2ssIGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICAgICAgICAgICAgLy8gbmVnYXRpdmUgb3IgcG9zaXRpdmVcbiAgICAgICAgICAgIHJldHVybiAoL15bLV0/XFxkKyQvKS50ZXN0KHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0ZXh0Q29udGFpbnModGV4dCwgc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQgJiYgLTEgIT09IHRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaFRleHQudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHNlcnZpY2VJZCA9ICdkYXRhY29udGV4dCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5mYWN0b3J5KHNlcnZpY2VJZCwgWyckaHR0cCcsICdjb21tb24nLCBkYXRhY29udGV4dF0pO1xuXG4gICAgZnVuY3Rpb24gZGF0YWNvbnRleHQoJGh0dHAsIGNvbW1vbikge1xuICAgICAgICB2YXIgJHEgPSBjb21tb24uJHE7XG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBnZXRBdmVuZ2Vyc0Nhc3Q6IGdldEF2ZW5nZXJzQ2FzdCxcbiAgICAgICAgICAgIGdldEF2ZW5nZXJDb3VudDogZ2V0QXZlbmdlckNvdW50LFxuICAgICAgICAgICAgZ2V0TUFBOiBnZXRNQUFcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRNQUEoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICcvZGF0YS9tYWEnfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhWzBdLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICByZXR1cm4gJHEud2hlbihyZXN1bHRzKTtcbi8vICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSB7ZGF0YTogbnVsbH07XG4vLyAgICAgICAgICAgICRodHRwKHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnL21hYSd9KVxuLy8gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbi8vICAgICAgICAgICAgICAgICAgICByZXN1bHRzLmRhdGEgPSBkYXRhWzBdLmRhdGEucmVzdWx0cztcbi8vICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHJlc3VsdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgIHJldHVybiBnZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY291bnQgPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihjb3VudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHZhciBjYXN0ID0gW1xuICAgICAgICAgICAgICAgIHtuYW1lOiAnUm9iZXJ0IERvd25leSBKci4nLCBjaGFyYWN0ZXI6ICdUb255IFN0YXJrIC8gSXJvbiBNYW4nfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NocmlzIEhlbXN3b3J0aCcsIGNoYXJhY3RlcjogJ1Rob3InfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NocmlzIEV2YW5zJywgY2hhcmFjdGVyOiAnU3RldmUgUm9nZXJzIC8gQ2FwdGFpbiBBbWVyaWNhJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdNYXJrIFJ1ZmZhbG8nLCBjaGFyYWN0ZXI6ICdCcnVjZSBCYW5uZXIgLyBUaGUgSHVsayd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnU2NhcmxldHQgSm9oYW5zc29uJywgY2hhcmFjdGVyOiAnTmF0YXNoYSBSb21hbm9mZiAvIEJsYWNrIFdpZG93J30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdKZXJlbXkgUmVubmVyJywgY2hhcmFjdGVyOiAnQ2xpbnQgQmFydG9uIC8gSGF3a2V5ZSd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnR3d5bmV0aCBQYWx0cm93JywgY2hhcmFjdGVyOiAnUGVwcGVyIFBvdHRzJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdTYW11ZWwgTC4gSmFja3NvbicsIGNoYXJhY3RlcjogJ05pY2sgRnVyeSd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnUGF1bCBCZXR0YW55JywgY2hhcmFjdGVyOiAnSmFydmlzJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdUb20gSGlkZGxlc3RvbicsIGNoYXJhY3RlcjogJ0xva2knfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NsYXJrIEdyZWdnJywgY2hhcmFjdGVyOiAnQWdlbnQgUGhpbCBDb3Vsc29uJ31cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gJHEud2hlbihjYXN0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XG5cblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCRzY29wZSl7XG5cdFx0XHRcdFx0b3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRoaWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxuXHRcdFx0XHRcdCRtZERpYWxvZy5hbGVydCgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRjb25maXJtOiBmdW5jdGlvbih0aXRsZSwgY29udGVudCkge1xuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmNvbmZpcm0oKVxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5vaygnT2snKVxuXHRcdFx0XHRcdFx0LmNhbmNlbCgnQ2FuY2VsJylcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NJbWdQZXJzb24nLCBbJ2NvbmZpZycsIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgLy9Vc2FnZTpcbiAgICAgICAgLy88aW1nIGRhdGEtY2MtaW1nLXBlcnNvbj1cInt7cy5zcGVha2VyLmltYWdlU291cmNlfX1cIi8+XG4gICAgICAgIHZhciBiYXNlUGF0aCA9IGNvbmZpZy5pbWFnZVNldHRpbmdzLmltYWdlQmFzZVBhdGg7XG4gICAgICAgIHZhciB1bmtub3duSW1hZ2UgPSBjb25maWcuaW1hZ2VTZXR0aW5ncy51bmtub3duUGVyc29uSW1hZ2VTb3VyY2U7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnY2NJbWdQZXJzb24nLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGJhc2VQYXRoICsgKHZhbHVlIHx8IHVua25vd25JbWFnZSk7XG4gICAgICAgICAgICAgICAgYXR0cnMuJHNldCgnc3JjJywgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1NpZGViYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE9wZW5zIGFuZCBjbHNvZXMgdGhlIHNpZGViYXIgbWVudS5cbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vICA8ZGl2IGRhdGEtY2Mtc2lkZWJhcj5cbiAgICAgICAgLy8gQ3JlYXRlczpcbiAgICAgICAgLy8gIDxkaXYgZGF0YS1jYy1zaWRlYmFyIGNsYXNzPVwic2lkZWJhclwiPlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyICRzaWRlYmFySW5uZXIgPSBlbGVtZW50LmZpbmQoJy5zaWRlYmFyLWlubmVyJyk7XG4gICAgICAgICAgICB2YXIgJGRyb3Bkb3duRWxlbWVudCA9IGVsZW1lbnQuZmluZCgnLnNpZGViYXItZHJvcGRvd24gYScpO1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnc2lkZWJhcicpO1xuICAgICAgICAgICAgJGRyb3Bkb3duRWxlbWVudC5jbGljayhkcm9wZG93bik7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRyb3Bkb3duKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZHJvcENsYXNzID0gJ2Ryb3B5JztcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEkZHJvcGRvd25FbGVtZW50Lmhhc0NsYXNzKGRyb3BDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZUFsbFNpZGViYXJzKCk7XG4gICAgICAgICAgICAgICAgICAgICRzaWRlYmFySW5uZXIuc2xpZGVEb3duKDM1MCk7XG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bkVsZW1lbnQuYWRkQ2xhc3MoZHJvcENsYXNzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRkcm9wZG93bkVsZW1lbnQuaGFzQ2xhc3MoZHJvcENsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd25FbGVtZW50LnJlbW92ZUNsYXNzKGRyb3BDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICRzaWRlYmFySW5uZXIuc2xpZGVVcCgzNTApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhpZGVBbGxTaWRlYmFycygpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNpZGViYXJJbm5lci5zbGlkZVVwKDM1MCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLWRyb3Bkb3duIGEnKS5yZW1vdmVDbGFzcyhkcm9wQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1dpZGdldENsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gPGEgZGF0YS1jYy13aWRnZXQtY2xvc2U+PC9hPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyA8YSBkYXRhLWNjLXdpZGdldC1jbG9zZT1cIlwiIGhyZWY9XCIjXCIgY2xhc3M9XCJ3Y2xvc2VcIj5cbiAgICAgICAgLy8gICAgIDxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCI+PC9pPlxuICAgICAgICAvLyA8L2E+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiPjwvaT4nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoJ3djbG9zZScpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGljayhjbG9zZUVsKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xvc2VFbChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaGlkZSgxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1dpZGdldE1pbmltaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gPGEgZGF0YS1jYy13aWRnZXQtbWluaW1pemU+PC9hPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyA8YSBkYXRhLWNjLXdpZGdldC1taW5pbWl6ZT1cIlwiIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXVwXCI+PC9pPjwvYT5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi11cFwiPjwvaT4nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAvLyQoJ2JvZHknKS5vbignY2xpY2snLCAnLndpZGdldCAud21pbmltaXplJywgbWluaW1pemUpO1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnaHJlZicsICcjJyk7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCd3bWluaW1pemUnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xpY2sobWluaW1pemUpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBtaW5pbWl6ZShlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciAkd2NvbnRlbnQgPSBlbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLm5leHQoJy53aWRnZXQtY29udGVudCcpO1xuICAgICAgICAgICAgICAgIHZhciBpRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oJ2knKTtcbiAgICAgICAgICAgICAgICBpZiAoJHdjb250ZW50LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKCdmYSBmYS1jaGV2cm9uLXVwJyk7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LmFkZENsYXNzKCdmYSBmYS1jaGV2cm9uLWRvd24nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcygnZmEgZmEtY2hldnJvbi1kb3duJyk7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LmFkZENsYXNzKCdmYSBmYS1jaGV2cm9uLXVwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICR3Y29udGVudC50b2dnbGUoNTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZSgnY2NTY3JvbGxUb1RvcCcsIFsnJHdpbmRvdycsXG4gICAgICAgIC8vIFVzYWdlOlxuICAgICAgICAvLyA8c3BhbiBkYXRhLWNjLXNjcm9sbC10by10b3A+PC9zcGFuPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyA8c3BhbiBkYXRhLWNjLXNjcm9sbC10by10b3A9XCJcIiBjbGFzcz1cInRvdG9wXCI+XG4gICAgICAgIC8vICAgICAgPGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tdXBcIj48L2k+PC9hPlxuICAgICAgICAvLyA8L3NwYW4+XG4gICAgICAgIGZ1bmN0aW9uICgkd2luZG93KSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8YSBocmVmPVwiI1wiPjxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi11cFwiPjwvaT48L2E+JyxcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHdpbiA9ICQoJHdpbmRvdyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygndG90b3AnKTtcbiAgICAgICAgICAgICAgICAkd2luLnNjcm9sbCh0b2dnbGVJY29uKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnYScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTGVhcm5pbmcgUG9pbnQ6ICRhbmNob3JTY3JvbGwgd29ya3MsIGJ1dCBubyBhbmltYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLy8kYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB0b2dnbGVJY29uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHdpbi5zY3JvbGxUb3AoKSA+IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2xpZGVVcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1NwaW5uZXInLCBbJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHdpbmRvdykge1xuICAgICAgICAvLyBEZXNjcmlwdGlvbjpcbiAgICAgICAgLy8gIENyZWF0ZXMgYSBuZXcgU3Bpbm5lciBhbmQgc2V0cyBpdHMgb3B0aW9uc1xuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gIDxkaXYgZGF0YS1jYy1zcGlubmVyPVwidm0uc3Bpbm5lck9wdGlvbnNcIj48L2Rpdj5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHNjb3BlLnNwaW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLmNjU3Bpbm5lciwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuc3Bpbm5lcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NvcGUuc3Bpbm5lciA9IG5ldyAkd2luZG93LlNwaW5uZXIob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgc2NvcGUuc3Bpbm5lci5zcGluKGVsZW1lbnRbMF0pO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1dpZGdldEhlYWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9Vc2FnZTpcbiAgICAgICAgLy88ZGl2IGRhdGEtY2Mtd2lkZ2V0LWhlYWRlciB0aXRsZT1cInZtLm1hcC50aXRsZVwiPjwvZGl2PlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogJ0AnLFxuICAgICAgICAgICAgICAgICdzdWJ0aXRsZSc6ICdAJyxcbiAgICAgICAgICAgICAgICAncmlnaHRUZXh0JzogJ0AnLFxuICAgICAgICAgICAgICAgICdhbGxvd0NvbGxhcHNlJzogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbGF5b3V0L3dpZGdldGhlYWRlci5odG1sJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnY2xhc3MnLCAnd2lkZ2V0LWhlYWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjb21tb24nKS5mYWN0b3J5KCdsb2dnZXInLCBbJyRsb2cnLCBsb2dnZXJdKTtcblxuICAgIGZ1bmN0aW9uIGxvZ2dlcigkbG9nKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgZ2V0TG9nRm46IGdldExvZ0ZuLFxuICAgICAgICAgICAgbG9nOiBsb2csXG4gICAgICAgICAgICBsb2dFcnJvcjogbG9nRXJyb3IsXG4gICAgICAgICAgICBsb2dTdWNjZXNzOiBsb2dTdWNjZXNzLFxuICAgICAgICAgICAgbG9nV2FybmluZzogbG9nV2FybmluZ1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldExvZ0ZuKG1vZHVsZUlkLCBmbk5hbWUpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IGZuTmFtZSB8fCAnbG9nJztcbiAgICAgICAgICAgIHN3aXRjaCAoZm5OYW1lLnRvTG93ZXJDYXNlKCkpIHsgLy8gY29udmVydCBhbGlhc2VzXG4gICAgICAgICAgICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgICAgICAgICAgICAgIGZuTmFtZSA9ICdsb2dTdWNjZXNzJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgICAgICAgICBmbk5hbWUgPSAnbG9nRXJyb3InO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd3YXJuJzpcbiAgICAgICAgICAgICAgICAgICAgZm5OYW1lID0gJ2xvZ1dhcm5pbmcnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgICAgICAgICAgICAgICAgZm5OYW1lID0gJ2xvZ1dhcm5pbmcnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxvZ0ZuID0gc2VydmljZVtmbk5hbWVdIHx8IHNlcnZpY2UubG9nO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtc2csIGRhdGEsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgICAgIGxvZ0ZuKG1zZywgZGF0YSwgbW9kdWxlSWQsIChzaG93VG9hc3QgPT09IHVuZGVmaW5lZCkgPyB0cnVlIDogc2hvd1RvYXN0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2cobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgIGxvZ0l0KG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0LCAnaW5mbycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nV2FybmluZyhtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsICd3YXJuaW5nJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dTdWNjZXNzKG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICBsb2dJdChtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICBsb2dJdChtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCwgJ2Vycm9yJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dJdChtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCwgdG9hc3RUeXBlKSB7XG4gICAgICAgICAgICB2YXIgd3JpdGUgPSAodG9hc3RUeXBlID09PSAnZXJyb3InKSA/ICRsb2cuZXJyb3IgOiAkbG9nLmxvZztcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZSA/ICdbJyArIHNvdXJjZSArICddICcgOiAnJztcbiAgICAgICAgICAgIHdyaXRlKHNvdXJjZSwgbWVzc2FnZSwgZGF0YSk7XG4gICAgICAgICAgICBpZiAoc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvYXN0VHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09ICd3YXJuaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIud2FybmluZyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRvYXN0VHlwZSA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBNdXN0IGNvbmZpZ3VyZSB0aGUgY29tbW9uIHNlcnZpY2UgYW5kIHNldCBpdHNcbiAgICAvLyBldmVudHMgdmlhIHRoZSBjb21tb25Db25maWdQcm92aWRlclxuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2NvbW1vbicpXG4gICAgICAgIC5mYWN0b3J5KCdzcGlubmVyJywgWydjb21tb24nLCAnY29tbW9uQ29uZmlnJywgc3Bpbm5lcl0pO1xuXG4gICAgZnVuY3Rpb24gc3Bpbm5lcihjb21tb24sIGNvbW1vbkNvbmZpZykge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIHNwaW5uZXJIaWRlOiBzcGlubmVySGlkZSxcbiAgICAgICAgICAgIHNwaW5uZXJTaG93OiBzcGlubmVyU2hvd1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNwaW5uZXJIaWRlKCkge1xuICAgICAgICAgICAgc3Bpbm5lclRvZ2dsZShmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzcGlubmVyU2hvdygpIHtcbiAgICAgICAgICAgIHNwaW5uZXJUb2dnbGUodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzcGlubmVyVG9nZ2xlKHNob3cpIHtcbiAgICAgICAgICAgIGNvbW1vbi4kYnJvYWRjYXN0KGNvbW1vbkNvbmZpZy5jb25maWcuc3Bpbm5lclRvZ2dsZUV2ZW50LCB7IHNob3c6IHNob3cgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbigkbWRUb2FzdCl7XG5cblx0XHR2YXIgZGVsYXkgPSA2MDAwLFxuXHRcdFx0cG9zaXRpb24gPSAndG9wIHJpZ2h0Jyxcblx0XHRcdGFjdGlvbiA9ICdPSyc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcblx0XHRcdFx0XHRcdC5oaWRlRGVsYXkoZGVsYXkpXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdFx0XHRpZiAoIWNvbnRlbnQpe1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxuXHRcdFx0XHRcdCRtZFRvYXN0LnNpbXBsZSgpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxuXHRcdFx0XHRcdFx0LnRoZW1lKCd3YXJuJylcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnZlcnNpb24uaW50ZXJwb2xhdGUtZmlsdGVyJywgW10pXG5cbi5maWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiBTdHJpbmcodGV4dCkucmVwbGFjZSgvXFwlVkVSU0lPTlxcJS9tZywgdmVyc2lvbik7XG4gIH07XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmRlc2NyaWJlKCdhcHAudmVyc2lvbiBtb2R1bGUnLCBmdW5jdGlvbigpIHtcbiAgYmVmb3JlRWFjaChtb2R1bGUoJ2FwcC52ZXJzaW9uJykpO1xuXG4gIGRlc2NyaWJlKCdpbnRlcnBvbGF0ZSBmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgJHByb3ZpZGUudmFsdWUoJ3ZlcnNpb24nLCAnVEVTVF9WRVInKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgVkVSU0lPTicsIGluamVjdChmdW5jdGlvbihpbnRlcnBvbGF0ZUZpbHRlcikge1xuICAgICAgZXhwZWN0KGludGVycG9sYXRlRmlsdGVyKCdiZWZvcmUgJVZFUlNJT04lIGFmdGVyJykpLnRvRXF1YWwoJ2JlZm9yZSBURVNUX1ZFUiBhZnRlcicpO1xuICAgIH0pKTtcbiAgfSk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC52ZXJzaW9uLnZlcnNpb24tZGlyZWN0aXZlJywgW10pXG5cbi5kaXJlY3RpdmUoJ2FwcFZlcnNpb24nLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycykge1xuICAgIGVsbS50ZXh0KHZlcnNpb24pO1xuICB9O1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnYXBwLnZlcnNpb24gbW9kdWxlJywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2gobW9kdWxlKCdhcHAudmVyc2lvbicpKTtcblxuICBkZXNjcmliZSgnYXBwLXZlcnNpb24gZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcmludCBjdXJyZW50IHZlcnNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS52YWx1ZSgndmVyc2lvbicsICdURVNUX1ZFUicpO1xuICAgICAgfSk7XG4gICAgICBpbmplY3QoZnVuY3Rpb24oJGNvbXBpbGUsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkY29tcGlsZSgnPHNwYW4gYXBwLXZlcnNpb24+PC9zcGFuPicpKCRyb290U2NvcGUpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC50ZXh0KCkpLnRvRXF1YWwoJ1RFU1RfVkVSJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC52ZXJzaW9uJywgW1xuICAnYXBwLnZlcnNpb24uaW50ZXJwb2xhdGUtZmlsdGVyJyxcbiAgJ2FwcC52ZXJzaW9uLnZlcnNpb24tZGlyZWN0aXZlJ1xuXSlcblxuLnZhbHVlKCd2ZXJzaW9uJywgJzAuMScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnYXBwLnZlcnNpb24gbW9kdWxlJywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2gobW9kdWxlKCdhcHAudmVyc2lvbicpKTtcblxuICBkZXNjcmliZSgndmVyc2lvbiBzZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY3VycmVudCB2ZXJzaW9uJywgaW5qZWN0KGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICAgIGV4cGVjdCh2ZXJzaW9uKS50b0VxdWFsKCcwLjEnKTtcbiAgICB9KSk7XG4gIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRVc2Vyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERpYWxvZ1NlcnZpY2Upe1xuXG4gICAgICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKXtcblx0ICAgICAgICAvL2RvIHNvbWV0aGluZyB1c2VmdWxcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXHREaWFsb2dTZXJ2aWNlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCAnYXBwLmNvbnRyb2xsZXJzJyApLmNvbnRyb2xsZXIoICdEYXRhTGlzdGluZ0N0cmwnLCBmdW5jdGlvbigpe1xuXHRcdC8vXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCAnZGF0YUxpc3RpbmcnLCBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9kYXRhX2xpc3RpbmcvZGF0YV9saXN0aW5nLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0RhdGFMaXN0aW5nQ3RybCcsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiggc2NvcGUsIGVsZW1lbnQsIGF0dHJzICl7XG5cdFx0XHRcdC8vXG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBjb250cm9sbGVySWQgPSAnYXZlbmdlcnMnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcihjb250cm9sbGVySWQsXG4gICAgICAgICAgICBbJ2NvbW1vbicsICdkYXRhY29udGV4dCcsIGF2ZW5nZXJzXSk7XG5cbiAgICBmdW5jdGlvbiBhdmVuZ2Vycyhjb21tb24sIGRhdGFjb250ZXh0KSB7XG4gICAgICAgIHZhciBnZXRMb2dGbiA9IGNvbW1vbi5sb2dnZXIuZ2V0TG9nRm47XG4gICAgICAgIHZhciBsb2cgPSBnZXRMb2dGbihjb250cm9sbGVySWQpO1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmF2ZW5nZXJzID0gW107XG4gICAgICAgIHZtLm1hYSA9IFtdO1xuICAgICAgICB2bS50aXRsZSA9ICdBdmVuZ2Vycyc7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlcyA9IFtnZXRBdmVuZ2Vyc0Nhc3QoKSwgZ2V0TUFBKCldO1xuICAgICAgICAgICAgY29tbW9uLmFjdGl2YXRlQ29udHJvbGxlcihwcm9taXNlcywgY29udHJvbGxlcklkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdBY3RpdmF0ZWQgQXZlbmdlcnMgVmlldycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TUFBKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFjb250ZXh0LmdldE1BQSgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbi8vICAgICAgICAgICAgICAgIHZtLm1hYSA9IGRhdGEuZGF0YVswXS5kYXRhLnJlc3VsdHM7XG4gICAgICAgICAgICAgICAgdm0ubWFhID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ubWFhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBdmVuZ2Vyc0Nhc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YWNvbnRleHQuZ2V0QXZlbmdlcnNDYXN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmF2ZW5nZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uYXZlbmdlcnM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGNvbnRyb2xsZXJJZCA9ICdkYXNoYm9hcmQnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb250cm9sbGVyKGNvbnRyb2xsZXJJZCwgWydjb21tb24nLCAnZGF0YWNvbnRleHQnLCBkYXNoYm9hcmRdKTtcblxuICAgIGZ1bmN0aW9uIGRhc2hib2FyZChjb21tb24sIGRhdGFjb250ZXh0KSB7XG4gICAgICAgIHZhciBnZXRMb2dGbiA9IGNvbW1vbi5sb2dnZXIuZ2V0TG9nRm47XG4gICAgICAgIHZhciBsb2cgPSBnZXRMb2dGbihjb250cm9sbGVySWQpO1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLm5ld3MgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ01hcnZlbCBBdmVuZ2VycycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01hcnZlbCBBdmVuZ2VycyAyIGlzIG5vdyBpbiBwcm9kdWN0aW9uISdcbiAgICAgICAgfTtcbiAgICAgICAgdm0uYXZlbmdlckNvdW50ID0gMDtcbiAgICAgICAgdm0uYXZlbmdlcnMgPSBbXTtcbiAgICAgICAgdm0udGl0bGUgPSAnRGFzaGJvYXJkJztcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW2dldEF2ZW5nZXJDb3VudCgpLCBnZXRBdmVuZ2Vyc0Nhc3QoKV07XG4gICAgICAgICAgICBjb21tb24uYWN0aXZhdGVDb250cm9sbGVyKHByb21pc2VzLCBjb250cm9sbGVySWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkgeyBsb2coJ0FjdGl2YXRlZCBEYXNoYm9hcmQgVmlldycpOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJDb3VudCgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhY29udGV4dC5nZXRBdmVuZ2VyQ291bnQoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYXZlbmdlckNvdW50ID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uYXZlbmdlckNvdW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBdmVuZ2Vyc0Nhc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YWNvbnRleHQuZ2V0QXZlbmdlcnNDYXN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmF2ZW5nZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uYXZlbmdlcnM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIEZvb3RlckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigpe1xuICAgICAgICAvL1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBIZWFkZXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEhlYWRlckNvbnRyb2xsZXIoKXtcbiAgICAgICAgLy9cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ29udHJvbGxlcicsIExhbmRpbmdDb250cm9sbGVyKTtcblxuXHRmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXG5cdFx0dm0ubGFyYXZlbF9kZXNjcmlwdGlvbiA9ICdSZXNwb25zZSBtYWNyb3MgaW50ZWdyYXRlZCB3aXRoIHlvdXIgQW5ndWxhciBhcHAnO1xuXHRcdHZtLmFuZ3VsYXJfZGVzY3JpcHRpb24gPSAnUXVlcnkgeW91ciBBUEkgd2l0aG91dCB3b3JyeWluZyBhYm91dCB2YWxpZGF0aW9ucyc7XG5cblx0XHQvKlxuXHRcdFRoaXMgaXMgYSB0ZXJyaWJsZSB0ZW1wb3JhcnkgaGFjayxcblx0XHR0byBmaXggbGF5b3V0IGlzc3VlcyB3aXRoIGZsZXggb24gaU9TIChjaHJvbWUgJiBzYWZhcmkpXG5cdFx0TWFrZSBzdXJlIHRvIHJlbW92ZSB0aGlzIHdoZW4geW91IG1vZGlmeSB0aGlzIGRlbW9cblx0XHQqL1xuXHRcdHZtLmlPUyA9IC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXHR9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb250cm9sbGVySWQgPSAnc2hlbGwnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb250cm9sbGVyKGNvbnRyb2xsZXJJZCxcbiAgICAgICAgWyckcm9vdFNjb3BlJywgJ2NvbW1vbicsICdjb25maWcnLCBzaGVsbF0pO1xuXG4gICAgZnVuY3Rpb24gc2hlbGwoJHJvb3RTY29wZSwgY29tbW9uLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdmFyIGxvZ1N1Y2Nlc3MgPSBjb21tb24ubG9nZ2VyLmdldExvZ0ZuKGNvbnRyb2xsZXJJZCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgdmFyIGV2ZW50cyA9IGNvbmZpZy5ldmVudHM7XG4gICAgICAgIHZtLnRpdGxlID0gJ0dydW50IGFuZCBHdWxwJztcbiAgICAgICAgdm0uYnVzeU1lc3NhZ2UgPSAnUGxlYXNlIHdhaXQgLi4uJztcbiAgICAgICAgdm0uaXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgdm0uc3Bpbm5lck9wdGlvbnMgPSB7XG4gICAgICAgICAgICByYWRpdXM6IDQwLFxuICAgICAgICAgICAgbGluZXM6IDcsXG4gICAgICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgICAgICBzcGVlZDogMS43LFxuICAgICAgICAgICAgY29ybmVyczogMS4wLFxuICAgICAgICAgICAgdHJhaWw6IDEwMCxcbiAgICAgICAgICAgIGNvbG9yOiAnI0Y1OEEwMCdcbiAgICAgICAgfTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgbG9nU3VjY2VzcygnR3J1bnQgYW5kIEd1bHAgd2l0aCBBbmd1bGFyIGxvYWRlZCEnLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbW1vbi5hY3RpdmF0ZUNvbnRyb2xsZXIoW10sIGNvbnRyb2xsZXJJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTcGlubmVyKG9uKSB7IHZtLmlzQnVzeSA9IG9uOyB9XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JyxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkgeyB0b2dnbGVTcGlubmVyKHRydWUpOyB9XG4gICAgICAgICk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oZXZlbnRzLmNvbnRyb2xsZXJBY3RpdmF0ZVN1Y2Nlc3MsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkgeyB0b2dnbGVTcGlubmVyKGZhbHNlKTsgfVxuICAgICAgICApO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKGV2ZW50cy5zcGlubmVyVG9nZ2xlLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHsgdG9nZ2xlU3Bpbm5lcihkYXRhLnNob3cpOyB9XG4gICAgICAgICk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb250cm9sUGFuZWxDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgJyRtZERpYWxvZycsICckaW50ZXJ2YWwnLFxuICAgICAgICAgICAgQ29udHJvbFBhbmVsQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIENvbnRyb2xQYW5lbENvbnRyb2xsZXIoJG1kRGlhbG9nLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5idXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHZtLnNob3dQcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB2bS5yZWxvYWRTZXJ2ZXIgPSAnU3RhZ2luZyc7XG4gICAgICAgIHZtLnBlcmZvcm1Qcm9ncmVzcyA9IHBlcmZvcm1Qcm9ncmVzcztcbiAgICAgICAgdm0uZGV0ZXJtaW5hdGVWYWx1ZSA9IDEwO1xuXG4gICAgICAgIGZ1bmN0aW9uIHBlcmZvcm1Qcm9ncmVzcygpIHtcbiAgICAgICAgICAgIHZtLnNob3dQcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICBpbnRlcnZhbCA9ICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2bS5kZXRlcm1pbmF0ZVZhbHVlICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKHZtLmRldGVybWluYXRlVmFsdWUgPiAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZGV0ZXJtaW5hdGVWYWx1ZSA9IDEwO1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93UHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwLCAwLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dBbGVydCgpIHtcbiAgICAgICAgICAgIGFsZXJ0ID0gJG1kRGlhbG9nLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbG9hZGluZyBkb25lIScsXG4gICAgICAgICAgICAgICAgY29udGVudDogdm0ucmVsb2FkU2VydmVyICsgXCIgc2VydmVyIHJlbG9hZGVkLlwiLFxuICAgICAgICAgICAgICAgIG9rOiAnQ2xvc2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRtZERpYWxvZ1xuICAgICAgICAgICAgICAgIC5zaG93KGFsZXJ0KVxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblwidXNlIHN0cmljdFwiO1xuICBhbmd1bGFyXG4gICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBbXG4gICAgICAgICAgJ25hdlNlcnZpY2UnLCAnJG1kU2lkZW5hdicsICckbWRCb3R0b21TaGVldCcsICckbG9nJywgJyRxJywgJyRzdGF0ZScsICckbWRUb2FzdCcsXG4gICAgICAgICAgTWFpbkNvbnRyb2xsZXJcbiAgICAgICBdKTtcblxuICBmdW5jdGlvbiBNYWluQ29udHJvbGxlcihuYXZTZXJ2aWNlLCAkbWRTaWRlbmF2LCAkbWRCb3R0b21TaGVldCwgJGxvZywgJHEsICRzdGF0ZSwgJG1kVG9hc3QpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubWVudUl0ZW1zID0gWyBdO1xuICAgIHZtLnNlbGVjdEl0ZW0gPSBzZWxlY3RJdGVtO1xuICAgIHZtLnRvZ2dsZUl0ZW1zTGlzdCA9IHRvZ2dsZUl0ZW1zTGlzdDtcbiAgICB2bS5zaG93QWN0aW9ucyA9IHNob3dBY3Rpb25zO1xuICAgIHZtLnRpdGxlID0gJHN0YXRlLmN1cnJlbnQuZGF0YS50aXRsZTtcbiAgICB2bS5zaG93U2ltcGxlVG9hc3QgPSBzaG93U2ltcGxlVG9hc3Q7XG5cbiAgICBuYXZTZXJ2aWNlXG4gICAgICAubG9hZEFsbEl0ZW1zKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKG1lbnVJdGVtcykge1xuICAgICAgICB2bS5tZW51SXRlbXMgPSBbXS5jb25jYXQobWVudUl0ZW1zKTtcbiAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdG9nZ2xlSXRlbXNMaXN0KCkge1xuICAgICAgdmFyIHBlbmRpbmcgPSAkbWRCb3R0b21TaGVldC5oaWRlKCkgfHwgJHEud2hlbih0cnVlKTtcblxuICAgICAgcGVuZGluZy50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICRtZFNpZGVuYXYoJ2xlZnQnKS50b2dnbGUoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW0gKGl0ZW0pIHtcbiAgICAgIHZtLnRpdGxlID0gaXRlbS5uYW1lO1xuICAgICAgdm0udG9nZ2xlSXRlbXNMaXN0KCk7XG4gICAgICB2bS5zaG93U2ltcGxlVG9hc3Qodm0udGl0bGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dBY3Rpb25zKCRldmVudCkge1xuICAgICAgICAkbWRCb3R0b21TaGVldC5zaG93KHtcbiAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKSxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC92aWV3cy9wYXJ0aWFscy9ib3R0b21TaGVldC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiBbICckbWRCb3R0b21TaGVldCcsIFNoZWV0Q29udHJvbGxlcl0sXG4gICAgICAgICAgY29udHJvbGxlckFzOiBcInZtXCIsXG4gICAgICAgICAgYmluZFRvQ29udHJvbGxlciA6IHRydWUsXG4gICAgICAgICAgdGFyZ2V0RXZlbnQ6ICRldmVudFxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGNsaWNrZWRJdGVtKSB7XG4gICAgICAgICAgY2xpY2tlZEl0ZW0gJiYgJGxvZy5kZWJ1ZyggY2xpY2tlZEl0ZW0ubmFtZSArICcgY2xpY2tlZCEnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gU2hlZXRDb250cm9sbGVyKCAkbWRCb3R0b21TaGVldCApIHtcbiAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgdm0uYWN0aW9ucyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ1NoYXJlJywgaWNvbjogJ3NoYXJlJywgdXJsOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1Bbmd1bGFyJTIwTWF0ZXJpYWwlMjBEYXNoYm9hcmQlMjBodHRwczovL2dpdGh1Yi5jb20vZmxhdGxvZ2ljL2FuZ3VsYXItbWF0ZXJpYWwtZGFzaGJvYXJkJTIwdmlhJTIwQGZsYXRsb2dpY2luYycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1N0YXInLCBpY29uOiAnc3RhcicsIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9mbGF0bG9naWMvYW5ndWxhci1tYXRlcmlhbC1kYXNoYm9hcmQvc3RhcmdhemVycycgfVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICB2bS5wZXJmb3JtQWN0aW9uID0gZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgICAgICAkbWRCb3R0b21TaGVldC5oaWRlKGFjdGlvbik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dTaW1wbGVUb2FzdCh0aXRsZSkge1xuICAgICAgJG1kVG9hc3Quc2hvdyhcbiAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcbiAgICAgICAgICAuY29udGVudCh0aXRsZSlcbiAgICAgICAgICAuaGlkZURlbGF5KDIwMDApXG4gICAgICAgICAgLnBvc2l0aW9uKCd0b3AgcmlnaHQnKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01lbW9yeUNvbnRyb2xsZXInLCBbXG4gICAgICAgICAgICBNZW1vcnlDb250cm9sbGVyXG4gICAgICAgIF0pO1xuXG4gICAgZnVuY3Rpb24gTWVtb3J5Q29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGRhdGEgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgdm0ubWVtb3J5Q2hhcnREYXRhID0gWyB7a2V5OiAnbWVtb3J5JywgeTogNDJ9LCB7IGtleTogJ2ZyZWUnLCB5OiA1OH0gXTtcblxuICAgICAgICB2bS5jaGFydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMTAsXG4gICAgICAgICAgICAgICAgZG9udXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcGllOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnN0YXJ0QW5nbGUvMiAtTWF0aC5QSS8yIH0sXG4gICAgICAgICAgICAgICAgICAgIGVuZEFuZ2xlOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5lbmRBbmdsZS8yIC1NYXRoLlBJLzIgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgdmFsdWVGb3JtYXQ6IChkMy5mb3JtYXQoXCIuMGZcIikpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBbJ3JnYigwLCAxNTAsIDEzNiknLCAncmdiKDE5MSwgMTkxLCAxOTEpJ10sXG4gICAgICAgICAgICAgICAgc2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdG9vbHRpcHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnNDIlJyxcbiAgICAgICAgICAgICAgICB0aXRsZU9mZnNldDogLTEwLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogeyBib3R0b206IC04MCwgbGVmdDogLTIwLCByaWdodDogLTIwIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ01lc3NhZ2VzQ29udHJvbGxlcicsIFtcbiAgICAgICdtZXNzYWdlc1NlcnZpY2UnLFxuICAgICAgTWVzc2FnZXNDb250cm9sbGVyXG4gICAgXSk7XG5cbiAgZnVuY3Rpb24gTWVzc2FnZXNDb250cm9sbGVyKG1lc3NhZ2VzU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5tZXNzYWdlcyA9IFtdO1xuXG4gICAgbWVzc2FnZXNTZXJ2aWNlXG4gICAgICAubG9hZEFsbEl0ZW1zKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgICAgIHZtLm1lc3NhZ2VzID0gW10uY29uY2F0KG1lc3NhZ2VzKTtcbiAgICAgIH0pO1xuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZXJmb3JtYW5jZUNvbnRyb2xsZXInLCBbXG4gICAgICAgICAgICAncGVyZm9ybWFuY2VTZXJ2aWNlJywgJyRxJyxcbiAgICAgICAgICAgIFBlcmZvcm1hbmNlQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFBlcmZvcm1hbmNlQ29udHJvbGxlcihwZXJmb3JtYW5jZVNlcnZpY2UsICRxKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY2hhcnRPcHRpb25zID0ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RhY2tlZEFyZWFDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB7IGxlZnQ6IC0xNSwgcmlnaHQ6IC0xNSB9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkWzBdIH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMV0gfSxcbiAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ092ZXIgOUsnLFxuICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd1hBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogWydyZ2IoMCwgMTUwLCAxMzYpJywgJ3JnYigyMDQsIDIwMywgMjAzKScsICdyZ2IoMTQ5LCAxNDksIDE0OSknLCAncmdiKDQ0LCA0NCwgNDQpJ10sXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogeyBjb250ZW50R2VuZXJhdG9yOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gJzxkaXYgY2xhc3M9XCJjdXN0b20tdG9vbHRpcFwiPicgKyBkLnBvaW50LnkgKyAnJTwvZGl2PicgKyAnPGRpdiBjbGFzcz1cImN1c3RvbS10b29sdGlwXCI+JyArIGQuc2VyaWVzWzBdLmtleSArICc8L2Rpdj4nIH0gfSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ucGVyZm9ybWFuY2VDaGFydERhdGEgPSBbXTtcbiAgICAgICAgdm0ucGVyZm9ybWFuY2VQZXJpb2QgPSAnd2Vlayc7XG4gICAgICAgIHZtLmNoYW5nZVBlcmlvZCA9IGNoYW5nZVBlcmlvZDtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJpZXMgPSBbbG9hZERhdGEoKV07XG4gICAgICAgICAgICAkcS5hbGwocXVlcmllcyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWREYXRhKCkge1xuICAgICAgICAgICAgdm0ucGVyZm9ybWFuY2VDaGFydERhdGEgPSBwZXJmb3JtYW5jZVNlcnZpY2UuZ2V0UGVyZm9ybWFuY2VEYXRhKHZtLnBlcmZvcm1hbmNlUGVyaW9kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVBlcmlvZCgpIHtcbiAgICAgICAgICAgIGxvYWREYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgW1xuICAgICAgUHJvZmlsZUNvbnRyb2xsZXJcbiAgICBdKTtcblxuICBmdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcigpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udXNlciA9IHtcbiAgICAgIHRpdGxlOiAnQWRtaW4nLFxuICAgICAgZW1haWw6ICdjb250YWN0QGZsYXRsb2dpYy5jb20nLFxuICAgICAgZmlyc3ROYW1lOiAnJyxcbiAgICAgIGxhc3ROYW1lOiAnJyAsXG4gICAgICBjb21wYW55OiAnRmxhdExvZ2ljIEluYy4nICxcbiAgICAgIGFkZHJlc3M6ICdGYWJyaXRzaXVzYSBzdHIsIDQnICxcbiAgICAgIGNpdHk6ICdNaW5zaycgLFxuICAgICAgc3RhdGU6ICcnICxcbiAgICAgIGJpb2dyYXBoeTogJ1dlIGFyZSB5b3VuZyBhbmQgYW1iaXRpb3VzIGZ1bGwgc2VydmljZSBkZXNpZ24gYW5kIHRlY2hub2xvZ3kgY29tcGFueS4gJyArXG4gICAgICAnT3VyIGZvY3VzIGlzIEphdmFTY3JpcHQgZGV2ZWxvcG1lbnQgYW5kIFVzZXIgSW50ZXJmYWNlIGRlc2lnbi4nLFxuICAgICAgcG9zdGFsQ29kZSA6ICcyMjAwMDcnXG4gICAgfTtcbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnJHEnLCAnY291bnRyaWVzU2VydmljZScsXG4gICAgICBTZWFyY2hDb250cm9sbGVyXG4gICAgXSk7XG5cbiAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkdGltZW91dCwgJHEsIGNvdW50cmllc1NlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0uY291bnRyaWVzID0gY291bnRyaWVzU2VydmljZS5sb2FkQWxsKCk7XG4gICAgdm0uc2VsZWN0ZWRDb3VudHJ5ID0gbnVsbDtcbiAgICB2bS5zZWFyY2hUZXh0ID0gbnVsbDtcbiAgICB2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuICAgIHZtLmRpc2FibGVDYWNoaW5nID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoIChxdWVyeSkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBxdWVyeSA/IHZtLmNvdW50cmllcy5maWx0ZXIoIGNyZWF0ZUZpbHRlckZvcihxdWVyeSkgKSA6IFtdLFxuICAgICAgICBkZWZlcnJlZDtcbiAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVmZXJyZWQucmVzb2x2ZSggcmVzdWx0cyApOyB9LCBNYXRoLnJhbmRvbSgpICogMTAwMCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSB7XG4gICAgICB2YXIgbG93ZXJjYXNlUXVlcnkgPSBhbmd1bGFyLmxvd2VyY2FzZShxdWVyeSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gZmlsdGVyRm4oc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIChzdGF0ZS52YWx1ZS5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSA9PT0gMCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdUYWJsZUNvbnRyb2xsZXInLCBbXG4gICAgICAndGFibGVTZXJ2aWNlJyxcbiAgICAgIFRhYmxlQ29udHJvbGxlclxuICAgIF0pO1xuXG4gIGZ1bmN0aW9uIFRhYmxlQ29udHJvbGxlcih0YWJsZVNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udGFibGVEYXRhID0gW107XG5cbiAgICB0YWJsZVNlcnZpY2VcbiAgICAgIC5sb2FkQWxsSXRlbXMoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24odGFibGVEYXRhKSB7XG4gICAgICAgIHZtLnRhYmxlRGF0YSA9IFtdLmNvbmNhdCh0YWJsZURhdGEpO1xuICAgICAgfSk7XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RvZG9Db250cm9sbGVyJywgW1xuICAgICAgICAgICAgJ3RvZG9MaXN0U2VydmljZScsXG4gICAgICAgICAgICBUb2RvQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFRvZG9Db250cm9sbGVyKHRvZG9MaXN0U2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmFkZFRvZG8gPSBhZGRUb2RvO1xuICAgICAgICB2bS5yZW1haW5pbmcgPSByZW1haW5pbmc7XG4gICAgICAgIHZtLmFyY2hpdmUgPSBhcmNoaXZlO1xuICAgICAgICB2bS50b2dnbGVBbGwgPSB0b2dnbGVBbGw7XG4gICAgICAgIHZtLnRvZG9zID0gW107XG5cbiAgICAgICAgdG9kb0xpc3RTZXJ2aWNlXG4gICAgICAgICAgICAubG9hZEFsbEl0ZW1zKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0b2Rvcykge1xuICAgICAgICAgICAgICAgIHZtLnRvZG9zID0gW10uY29uY2F0KHRvZG9zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvZG8oKSB7XG4gICAgICAgICAgICB2bS50b2Rvcy5wdXNoKHt0ZXh0OiB2bS50b2RvVGV4dCwgZG9uZTogZmFsc2V9KTtcbiAgICAgICAgICAgIHZtLnRvZG9UZXh0ID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1haW5pbmcoKSB7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRvZG9zLCBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICAgICAgICAgIGNvdW50ICs9IHRvZG8uZG9uZSA/IDAgOiAxO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhcmNoaXZlKGUpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZnJvbSBzdWJtaXR0aW5nXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgb2xkVG9kb3MgPSB2bS50b2RvcztcbiAgICAgICAgICAgIHZtLnRvZG9zID0gW107XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gob2xkVG9kb3MsIGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2RvLmRvbmUpIHZtLnRvZG9zLnB1c2godG9kbyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUFsbCgpIHtcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRvZG9zLCBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICAgICAgICAgICAgICB0b2RvLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRvZG9zLCBmdW5jdGlvbiAodG9kbykge1xuICAgICAgICAgICAgICAgICAgICB0b2RvLmRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzYWdlQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAgIFVzYWdlQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFVzYWdlQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGRhdGEgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgdm0ucmFtQ2hhcnREYXRhID0gW3trZXk6ICdNZW1vcnknLCB5OiA3Njg2NjB9LCB7IGtleTogJ0NhY2hlJywgeTogMzY3NDA0fSwge2tleTogJ1N3YXAnLCB5OiA0MTkyNCB9XTtcbiAgICAgICAgdm0uc3RvcmFnZUNoYXJ0RGF0YSA9IFt7a2V5OiAnU3lzdGVtJywgeTogMTI2NTYwfSwge2tleTogJ090aGVyJywgeTogMjI0MzY1IH1dO1xuXG4gICAgICAgIHZtLmNoYXJ0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3BpZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEzMCxcbiAgICAgICAgICAgICAgICBkb251dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB4OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueTsgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZUZvcm1hdDogKGQzLmZvcm1hdChcIi4wZlwiKSksXG4gICAgICAgICAgICAgICAgY29sb3I6IFsncmdiKDAsIDE1MCwgMTM2KScsICcjRTc1NzUzJywgJ3JnYigyMzUsIDIzNSwgMjM1KSddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnODMlJyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHsgdG9wOiAtMTAsIGxlZnQ6IC0yMCwgcmlnaHQ6IC0yMCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Zpc2l0b3JzQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAgIFZpc2l0b3JzQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFZpc2l0b3JzQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGRhdGEgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgdm0udmlzaXRvcnNDaGFydERhdGEgPSBbIHtrZXk6ICdNb2JpbGUnLCB5OiA1MjY0fSwgeyBrZXk6ICdEZXNrdG9wJywgeTogMzg3Mn0gXTtcblxuICAgICAgICB2bS5jaGFydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMTAsXG4gICAgICAgICAgICAgICAgZG9udXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgdmFsdWVGb3JtYXQ6IChkMy5mb3JtYXQoXCIuMGZcIikpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBbJ3JnYigwLCAxNTAsIDEzNiknLCAnI0U3NTc1MyddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT3ZlciA5SycsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB7IHRvcDogLTEwIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignV2FybmluZ3NDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgV2FybmluZ3NDb250cm9sbGVyXG4gICAgICAgIF0pO1xuXG4gICAgZnVuY3Rpb24gV2FybmluZ3NDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFRPRE86IG1vdmUgZGF0YSB0byB0aGUgc2VydmljZVxuICAgICAgICB2bS53YXJuaW5nc0NoYXJ0RGF0YSA9IHdhcm5pbmdGdW5jdGlvbjtcblxuICAgICAgICBmdW5jdGlvbiB3YXJuaW5nRnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2luID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2luLnB1c2goe3g6IGksIHk6IE1hdGguYWJzKE1hdGguY29zKGkvMTApICowLjI1KmkgKyAwLjkgLSAwLjQqaSl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbIHsgdmFsdWVzOiBzaW4sIGNvbG9yOiAncmdiKDAsIDE1MCwgMTM2KScsIGFyZWE6IHRydWUgfSBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0uY2hhcnRPcHRpb25zID0ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGluZUNoYXJ0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIxMCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHsgdG9wOiAtMTAsIGxlZnQ6IC0yMCwgcmlnaHQ6IC0yMCB9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnggfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC55IH0sXG4gICAgICAgICAgICAgICAgc2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0xlZ2VuZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdPdmVyIDlLJyxcbiAgICAgICAgICAgICAgICBzaG93WUF4aXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dYQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogeyBjb250ZW50R2VuZXJhdG9yOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gJzxzcGFuIGNsYXNzPVwiY3VzdG9tLXRvb2x0aXBcIj4nICsgTWF0aC5yb3VuZChkLnBvaW50LnkpICsgJzwvc3Bhbj4nIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb250cm9sbGVySWQgPSAnc2lkZWJhcic7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLFxuICAgICAgICBbJyRyb3V0ZScsICdyb3V0ZXMnLCBzaWRlYmFyXSk7XG5cbiAgICBmdW5jdGlvbiBzaWRlYmFyKCRyb3V0ZSwgcm91dGVzKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uaXNDdXJyZW50ID0gaXNDdXJyZW50O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7IGdldE5hdlJvdXRlcygpOyB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmF2Um91dGVzKCkge1xuICAgICAgICAgICAgdm0ubmF2Um91dGVzID0gcm91dGVzLmZpbHRlcihmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuY29uZmlnLnNldHRpbmdzICYmIHIuY29uZmlnLnNldHRpbmdzLm5hdjtcbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24ocjEsIHIyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIxLmNvbmZpZy5zZXR0aW5ncy5uYXYgLSByMi5jb25maWcuc2V0dGluZ3MubmF2O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0N1cnJlbnQocm91dGUpIHtcbiAgICAgICAgICAgIGlmICghcm91dGUuY29uZmlnLnRpdGxlIHx8ICEkcm91dGUuY3VycmVudCB8fCAhJHJvdXRlLmN1cnJlbnQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWVudU5hbWUgPSByb3V0ZS5jb25maWcudGl0bGU7XG4gICAgICAgICAgICByZXR1cm4gJHJvdXRlLmN1cnJlbnQudGl0bGUuc3Vic3RyKDAsIG1lbnVOYW1lLmxlbmd0aCkgPT09IG1lbnVOYW1lID8gJ2N1cnJlbnQnIDogJyc7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAndXNlIHN0cmljdCc7XG4gICBhbmd1bGFyLm1vZHVsZSgnYXBwLnZpZXcxJywgWyduZ1JvdXRlJ10pXG5cbiAgIC5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy92aWV3MScsIHtcbiAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXcxL3ZpZXcxLmh0bWwnLFxuICAgICAgIGNvbnRyb2xsZXI6ICdWaWV3MUN0cmwnXG4gICAgIH0pO1xuICAgfV0pXG5cbiAgIC5jb250cm9sbGVyKCdWaWV3MUN0cmwnLCBbZnVuY3Rpb24oKSB7XG5cbiAgIH1dKTt9KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICd1c2Ugc3RyaWN0JztcbiAgIGRlc2NyaWJlKCdhcHAudmlldzEgbW9kdWxlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgYmVmb3JlRWFjaChtb2R1bGUoJ2FwcC52aWV3MScpKTtcblxuICAgICBkZXNjcmliZSgndmlldzEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICBpdCgnc2hvdWxkIC4uLi4nLCBpbmplY3QoZnVuY3Rpb24oJGNvbnRyb2xsZXIpIHtcbiAgICAgICAgIC8vc3BlYyBib2R5XG4gICAgICAgICB2YXIgdmlldzFDdHJsID0gJGNvbnRyb2xsZXIoJ1ZpZXcxQ3RybCcpO1xuICAgICAgICAgZXhwZWN0KHZpZXcxQ3RybCkudG9CZURlZmluZWQoKTtcbiAgICAgICB9KSk7XG5cbiAgICAgfSk7XG4gICB9KTt9KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC52aWV3MicsIFsnbmdSb3V0ZSddKVxuXG4uY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvdmlldzInLCB7XG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3Mi92aWV3Mi5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnVmlldzJDdHJsJ1xuICB9KTtcbn1dKVxuXG4uY29udHJvbGxlcignVmlldzJDdHJsJywgW2Z1bmN0aW9uKCkge1xuXG59XSk7XG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICd1c2Ugc3RyaWN0JztcbiAgIGRlc2NyaWJlKCdhcHAudmlldzIgbW9kdWxlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgYmVmb3JlRWFjaChtb2R1bGUoJ2FwcC52aWV3MicpKTtcblxuICAgICBkZXNjcmliZSgndmlldzIgY29udHJvbGxlcicsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICBpdCgnc2hvdWxkIC4uLi4nLCBpbmplY3QoZnVuY3Rpb24oJGNvbnRyb2xsZXIpIHtcbiAgICAgICAgIC8vc3BlYyBib2R5XG4gICAgICAgICB2YXIgdmlldzJDdHJsID0gJGNvbnRyb2xsZXIoJ1ZpZXcyQ3RybCcpO1xuICAgICAgICAgZXhwZWN0KHZpZXcyQ3RybCkudG9CZURlZmluZWQoKTtcbiAgICAgICB9KSk7XG5cbiAgICAgfSk7XG4gICB9KTtcbn0oKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
