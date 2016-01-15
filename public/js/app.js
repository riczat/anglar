(function(){
	"use strict";

	angular.module('app',
		[
        // Angular modules
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
				'partialsModule',

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
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'angular-loading-bar']);
	angular.module('app.filters', []);
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.config', []);

})();

(function(routes){
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
                    $interval.cancel(interval)
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
'use strict';

angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);
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
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJyb3V0ZXMucnVuLmpzIiwiY29uZmlnL2xvYWRpbmdfYmFyLmNvbmZpZy5qcyIsImNvbmZpZy90aGVtZS5jb25maWcuanMiLCJlMmUtdGVzdHMvcHJvdHJhY3Rvci5jb25mLmpzIiwiZTJlLXRlc3RzL3NjZW5hcmlvcy5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5maWx0ZXIuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmZpbHRlci5qcyIsImZpbHRlcnMvdHJ1bmNhdGVfY2hhcmFjdGVycy5maWx0ZXIuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmZpbHRlci5qcyIsImZpbHRlcnMvdWNmaXJzdC5maWx0ZXIuanMiLCJzZXJ2aWNlcy9BUEkuc2VydmljZS5qcyIsInNlcnZpY2VzL2NvbW1vbi5qcyIsInNlcnZpY2VzL2RhdGFjb250ZXh0LmpzIiwic2VydmljZXMvZGlhbG9nLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kaXJlY3RpdmVzLmpzIiwic2VydmljZXMvbG9nZ2VyLmpzIiwic2VydmljZXMvc3Bpbm5lci5qcyIsInNlcnZpY2VzL3RvYXN0LnNlcnZpY2UuanMiLCJjb21wb25lbnRzL3ZlcnNpb24vaW50ZXJwb2xhdGUtZmlsdGVyLmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL2ludGVycG9sYXRlLWZpbHRlcl90ZXN0LmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL3ZlcnNpb24tZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy92ZXJzaW9uL3ZlcnNpb24tZGlyZWN0aXZlX3Rlc3QuanMiLCJjb21wb25lbnRzL3ZlcnNpb24vdmVyc2lvbi5qcyIsImNvbXBvbmVudHMvdmVyc2lvbi92ZXJzaW9uX3Rlc3QuanMiLCJkaWFsb2dzL2FkZF91c2Vycy9hZGRfdXNlcnMuanMiLCJkaXJlY3RpdmVzL2RhdGFfbGlzdGluZy9kYXRhX2xpc3RpbmcuanMiLCJkaXJlY3RpdmVzL2RhdGFfbGlzdGluZy9kZWZpbml0aW9uLmpzIiwiYXBwL3ZpZXdzL2F2ZW5nZXJzL2F2ZW5nZXJzLmpzIiwiYXBwL3ZpZXdzL2Rhc2hib2FyZC9kYXNoYm9hcmQuanMiLCJhcHAvdmlld3MvZm9vdGVyL2Zvb3Rlci5jb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL2hlYWRlci9oZWFkZXIuY29udHJvbGxlci5qcyIsImFwcC92aWV3cy9sYW5kaW5nL2xhbmRpbmcuY29udHJvbGxlci5qcyIsImFwcC92aWV3cy9sYXlvdXQvc2hlbGwuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvQ29udHJvbFBhbmVsQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9NYWluQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9NZW1vcnlDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL01lc3NhZ2VzQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9QZXJmb3JtYW5jZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvUHJvZmlsZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvU2VhcmNoQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9UYWJsZUNvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvVG9kb0NvbnRyb2xsZXIuanMiLCJhcHAvdmlld3MvcGFydGlhbHMvVXNhZ2VDb250cm9sbGVyLmpzIiwiYXBwL3ZpZXdzL3BhcnRpYWxzL1Zpc2l0b3JzQ29udHJvbGxlci5qcyIsImFwcC92aWV3cy9wYXJ0aWFscy9XYXJuaW5nc0NvbnRyb2xsZXIuanMiLCJhcHAvdmlld3Mvc2lkZWJhci9zaWRlYmFyLmpzIiwiYXBwL3ZpZXdzL3ZpZXcxL3ZpZXcxLmpzIiwiYXBwL3ZpZXdzL3ZpZXcxL3ZpZXcxX3Rlc3QuanMiLCJhcHAvdmlld3MvdmlldzIvdmlldzIuanMiLCJhcHAvdmlld3MvdmlldzIvdmlldzJfdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUE7RUFDQTs7UUFFQTtRQUNBO1FBQ0E7SUFDQTs7O1FBR0E7UUFDQTs7O1FBR0E7OztJQUdBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7O0NBR0EsUUFBQSxPQUFBLGNBQUEsQ0FBQTtDQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLGFBQUEsY0FBQSxhQUFBLGVBQUE7Q0FDQSxRQUFBLE9BQUEsZUFBQTtDQUNBLFFBQUEsT0FBQSxnQkFBQTtDQUNBLFFBQUEsT0FBQSxrQkFBQTtDQUNBLFFBQUEsT0FBQSxjQUFBOzs7O0FDaENBLENBQUEsU0FBQSxPQUFBO0VBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsU0FBQSxnQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxpQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxPQUFBO0tBQ0EsUUFBQTtNQUNBLGFBQUEsUUFBQTs7S0FFQSxRQUFBO01BQ0EsYUFBQSxRQUFBOztLQUVBLE1BQUE7OztPQUdBLE1BQUEsZUFBQTtRQUNBLEtBQUE7UUFDQSxNQUFBO1FBQ0EsT0FBQTtVQUNBLFNBQUE7WUFDQSxhQUFBLFFBQUE7Ozs7T0FJQSxNQUFBLGVBQUE7UUFDQSxLQUFBO1FBQ0EsTUFBQTtRQUNBLE9BQUE7VUFDQSxTQUFBO1lBQ0EsYUFBQSxRQUFBOzs7O0lBSUEsTUFBQSxlQUFBO0lBQ0EsS0FBQTtJQUNBLE1BQUE7SUFDQSxPQUFBO0tBQ0EsU0FBQTtNQUNBLGFBQUEsUUFBQTs7Ozs7Ozs7QUMvQ0EsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsU0FBQSxZQUFBLFdBQUE7RUFDQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFFBQUE7O0dBRUEsSUFBQSxRQUFBLFFBQUEsUUFBQSxLQUFBLFNBQUE7SUFDQSxXQUFBLGVBQUEsUUFBQSxLQUFBOzs7O0VBSUEsV0FBQSxJQUFBLHNCQUFBLFNBQUEsT0FBQSxRQUFBO0dBQ0EsT0FBQSxNQUFBOzs7RUFHQSxXQUFBLElBQUEsdUJBQUEsU0FBQSxPQUFBLFFBQUE7R0FDQSxXQUFBLFFBQUE7Ozs7OztBQ2hCQSxDQUFBLFdBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsY0FBQSxpQ0FBQSxVQUFBLHNCQUFBO0VBQ0Esc0JBQUEsaUJBQUE7Ozs7O0FDSkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsOEJBQUEsU0FBQSxvQkFBQTs7RUFFQSxtQkFBQSxNQUFBO0dBQ0EsZUFBQTtHQUNBLGNBQUE7R0FDQSxZQUFBOzs7OztBQ1JBLFFBQUEsU0FBQTtFQUNBLG1CQUFBOztFQUVBLE9BQUE7SUFDQTs7O0VBR0EsY0FBQTtJQUNBLGVBQUE7OztFQUdBLFNBQUE7O0VBRUEsV0FBQTs7RUFFQSxpQkFBQTtJQUNBLHdCQUFBOzs7O0FDaEJBOzs7O0FBSUEsU0FBQSxVQUFBLFdBQUE7OztFQUdBLEdBQUEsZ0ZBQUEsV0FBQTtJQUNBLFFBQUEsSUFBQTtJQUNBLE9BQUEsUUFBQSxxQkFBQSxRQUFBOzs7O0VBSUEsU0FBQSxTQUFBLFdBQUE7O0lBRUEsV0FBQSxXQUFBO01BQ0EsUUFBQSxJQUFBOzs7O0lBSUEsR0FBQSxxREFBQSxXQUFBO01BQ0EsT0FBQSxRQUFBLElBQUEsR0FBQSxJQUFBLGdCQUFBLFFBQUE7UUFDQSxRQUFBOzs7Ozs7RUFNQSxTQUFBLFNBQUEsV0FBQTs7SUFFQSxXQUFBLFdBQUE7TUFDQSxRQUFBLElBQUE7Ozs7SUFJQSxHQUFBLHFEQUFBLFdBQUE7TUFDQSxPQUFBLFFBQUEsSUFBQSxHQUFBLElBQUEsZ0JBQUEsUUFBQTtRQUNBLFFBQUE7Ozs7OztBQ3JDQSxDQUFBLFVBQUE7Q0FDQTs7Q0FFQSxRQUFBLE9BQUEsZUFBQSxRQUFBLGNBQUEsVUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBO0dBQ0EsT0FBQSxDQUFBLFNBQUEsTUFB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LEtBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxNQUFBLEtBQUEsU0FBQTs7OztBQ3pNQSxDQUFBLFlBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsVUFBQSxRQUFBLFVBQUEsQ0FBQSxRQUFBOztJQUVBLFNBQUEsT0FBQSxNQUFBO1FBQ0EsSUFBQSxVQUFBO1lBQ0EsVUFBQTtZQUNBLEtBQUE7WUFDQSxVQUFBO1lBQ0EsWUFBQTtZQUNBLFlBQUE7OztRQUdBLE9BQUE7O1FBRUEsU0FBQSxTQUFBLFVBQUEsUUFBQTtZQUNBLFNBQUEsVUFBQTtZQUNBLFFBQUEsT0FBQTtnQkFDQSxLQUFBO29CQUNBLFNBQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxTQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsU0FBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLFNBQUE7b0JBQ0E7OztZQUdBLElBQUEsUUFBQSxRQUFBLFdBQUEsUUFBQTtZQUNBLE9BQUEsVUFBQSxLQUFBLE1BQUEsV0FBQTtnQkFDQSxNQUFBLEtBQUEsTUFBQSxVQUFBLENBQUEsY0FBQSxhQUFBLE9BQUE7Ozs7UUFJQSxTQUFBLElBQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTs7O1FBR0EsU0FBQSxXQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7WUFDQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUE7OztRQUdBLFNBQUEsV0FBQSxTQUFBLE1BQUEsUUFBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLE1BQUEsUUFBQSxXQUFBOzs7UUFHQSxTQUFBLFNBQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxNQUFBLFFBQUEsV0FBQTs7O1FBR0EsU0FBQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFdBQUEsV0FBQTtZQUNBLElBQUEsUUFBQSxDQUFBLGNBQUEsV0FBQSxLQUFBLFFBQUEsS0FBQTtZQUNBLFNBQUEsU0FBQSxNQUFBLFNBQUEsT0FBQTtZQUNBLE1BQUEsUUFBQSxTQUFBO1lBQ0EsSUFBQSxXQUFB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V0FBQTs7RUFFQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLGFBQUE7R0FDQSxZQUFBO0dBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUNUQSxDQUFBLFlBQUE7SUFDQTtJQUNBLElBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQTtTQUNBLFdBQUE7WUFDQSxDQUFBLFVBQUEsZUFBQTs7SUFFQSxTQUFBLFNBQUEsUUFBQSxhQUFBO1FBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsTUFBQSxTQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsTUFBQTtRQUNBLEdBQUEsUUFBQTs7UUFFQTs7UUFFQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFdBQUEsQ0FBQSxtQkFBQTtZQUNBLE9BQUEsbUJBQUEsVUFBQTtpQkFDQSxLQUFBLFlBQUE7b0JBQ0EsSUFBQTs7OztRQUlBLFNBQUEsU0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBLEtBQUEsVUFBQSxNQUFBOztnQkFFQSxHQUFBLE1BQUE7Z0JBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsU0FBQSxrQkFBQTtZQUNBLE9BQUEsWUFBQSxrQkFBQSxLQUFBLFVBQUEsTUFBQTtnQkFDQSxHQUFBLFdBQUE7Z0JBQ0EsT0FBQSxHQUFBOzs7OztBQ3JDQSxDQUFBLFlBQUE7SUFDQTtJQUNBLElBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQSxPQUFBLFdBQUEsY0FBQSxDQUFBLFVBQUEsZUFBQTs7SUFFQSxTQUFBLFVBQUEsUUFBQSxhQUFBO1FBQ0EsSUFBQSxXQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsTUFBQSxTQUFBOztRQUVBLElBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQTtZQUNBLE9BQUE7WUFDQSxhQUFBOztRQUVBLEdBQUEsZUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsUUFBQTs7UUFFQTs7UUFFQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFdBQUEsQ0FBQSxtQkFBQTtZQUNBLE9BQUEsbUJBQUEsVUFBQTtpQkFDQSxLQUFBLFlB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T0FBQSxRQUFBLEtBQUE7SUFDQSxHQUFBLGtCQUFBOztJQUVBO09BQ0E7T0FDQSxLQUFBLFNBQUEsV0FBQTtRQUNBLEdBQUEsWUFBQSxHQUFBLE9BQUE7OztJQUdBLFNBQUEsa0JBQUE7TUFDQSxJQUFBLFVBQUEsZUFBQSxVQUFBLEdBQUEsS0FBQTs7TUFFQSxRQUFBLEtBQUEsVUFBQTtRQUNBLFdBQUEsUUFBQTs7OztJQUlBLFNBQUEsWUFBQSxNQUFBO01BQ0EsR0FBQSxRQUFBLEtBQUE7TUFDQSxHQUFBO01BQ0EsR0FBQSxnQkFBQSxHQUFBOzs7SUFHQSxTQUFBLFlBQUEsUUFBQTtRQUNBLGVBQUEsS0FBQTtVQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUEsZUFBQTtVQUNBLGFBQUE7VUFDQSxZQUFBLEVBQUEsa0JBQUE7VUFDQSxjQUFBO1VBQ0EsbUJBQUE7VUFDQSxhQUFBO1dBQ0EsS0FBQSxTQUFBLGFBQUE7VUFDQSxlQUFBLEtBQUEsT0FBQSxZQUFBLE9BQUE7OztRQUdBLFNBQUEsaUJBQUEsaUJBQUE7VUFDQSxJQUFBLEtBQUE7O1VBRUEsR0FBQSxVQUFBO1lBQ0EsRUFBQSxNQUFBLFNBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQSxFQUFBLE1BQUEsUUFBQSxNQUFBLFFBQUEsS0FBQTs7O1VBR0EsR0FBQSxnQkFBQSxTQUFBLFFBQUE7WUFDQSxlQUFBLEtBQUE7Ozs7O0lBS0EsU0FBQSxnQkFBQSxPQUFBO01BQ0EsU0FBQTtRQUNBLFNBQUE7V0FDQSxRQUFBO1dBQ0EsVUFBQTtXQUNBLFNBQUE7Ozs7Ozs7QUN0RUEsQ0FBQSxZQUFBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTtZQUNBOzs7SUFHQSxTQUFBLG1CQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLGtCQUFBLEVBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxLQUFBLEVBQUEsS0FBQSxRQUFBLEdBQUE7O1FBRUEsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxLQUFB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QkFDQSxLQUFBLE9BQUE7Ozs7Ozs7QUNyREEsQ0FBQSxZQUFBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxtQkFBQTtZQUNBOzs7SUFHQSxTQUFBLGtCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLGVBQUEsQ0FBQSxDQUFBLEtBQUEsVUFBQSxHQUFBLFNBQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxTQUFBLENBQUEsS0FBQSxRQUFBLEdBQUE7UUFDQSxHQUFBLG1CQUFBLENBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxTQUFBLENBQUEsS0FBQSxTQUFBLEdBQUE7O1FBRUEsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxjQUFBLEdBQUEsT0FBQTtnQkFDQSxPQUFBLENBQUEsb0JBQUEsV0FBQTtnQkFDQSxZQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLEVBQUEsS0FBQSxDQUFBLElBQUEsTUFBQSxDQUFBLElBQUEsT0FBQSxDQUFBOzs7Ozs7QUMxQkEsQ0FBQSxZQUFBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTtZQUNBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7UUFHQSxHQUFBLG9CQUFBLEVBQUEsQ0FBQSxLQUFBLFVBQUEsR0FBQSxPQUFBLEVBQUEsS0FBQSxXQUFBLEdBQUE7O1FBRUEsR0FBQSxlQUFBO1lBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxHQUFBLFVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtnQkFDQSxjQUFBLEdBQUEsT0FBQTtnQkFDQSxPQUFBLENBQUEsb0JBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxFQUFBLEtBQUEsQ0FBQTs7Ozs7O0FDekJBLENBQUEsWUFBQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsc0JBQUE7WUFDQTs7O0lBR0EsU0FBQSxxQkFBQTtRQUNBLElBQUEsS0FBQTs7O1FBR0EsR0FBQSxvQkFBQTs7UUFFQSxTQUFBLGtCQUFBO1lBQ0EsSUFBQSxNQUFBO1lBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsS0FBQTtnQkFDQSxJQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxJQUFBOztZQUVBLE9BQUEsRUFBQSxFQUFBLFFBQUEsS0FBQSxPQUFBLG9CQUFBLE1BQUE7OztRQUdBLEdBQUEsZUFBQTtZQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLFFBQUEsRUFBQSxLQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsSUFBQSxPQUFBLENBQUE7Z0JBQ0EsR0FBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7Z0JBQ0EsR0FBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsV0FBQTtnQkFDQSxXQUFBO2dCQUNBLFNBQUEsRUFBQSxrQkFBQSxVQUFBLEdBQUEsRUFBQSxPQUFBLGtDQUFBLEtBQUEsTUFBQSxFQUFBLE1BQUEsS0FBQTs7Ozs7O0FDakNBLENBQUEsWUFBQTtJQUNBOztJQUVBLElBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQSxPQUFBLFdBQUE7UUFDQSxDQUFBLFVBQUEsVUFBQTs7SUFFQSxTQUFBLFFBQUEsUUFBQSxRQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsWUFBQTs7UUFFQTs7UUFFQSxTQUFBLFdBQUEsRUFBQTs7UUFFQSxTQUFBLGVBQUE7WUFDQSxHQUFBLFlBQUEsT0FBQSxPQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBLEVBQUEsT0FBQSxZQUFBLEVBQUEsT0FBQSxTQUFBO2VBQ0EsS0FBQSxTQUFBLElBQUEsSUFBQTtnQkFDQSxPQUFBLEdBQUEsT0FBQSxTQUFBLE1BQUEsR0FBQSxPQUFBLFNBQUE7Ozs7UUFJQSxTQUFBLFVBQUEsT0FBQTtZQUNBLElBQUEsQ0FBQSxNQUFBLE9BQUEsU0FBQSxDQUFBLE9BQUEsV0FBQSxDQUFBLE9BQUEsUUFBQSxPQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxXQUFBLE1BQUEsT0FBQTtZQUNBLE9BQUEsT0FBQSxRQUFBLE1BQUEsT0FBQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFlBQUE7Ozs7QUM3QkE7O0FBRUEsUUFBQSxPQUFBLGFBQUEsQ0FBQTs7Q0FFQSxPQUFBLENBQUEsa0JBQUEsU0FBQSxnQkFBQTtFQUNBLGVBQUEsS0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLFlBQUE7Ozs7Q0FJQSxXQUFBLGFBQUEsQ0FBQSxXQUFBOzs7QUNYQTs7QUFFQSxTQUFBLG9CQUFBLFdBQUE7O0VBRUEsV0FBQSxPQUFBOztFQUVBLFNBQUEsb0JBQUEsVUFBQTs7SUFFQSxHQUFBLGVBQUEsT0FBQSxTQUFBLGFBQUE7O01BRUEsSUFBQSxZQUFBLFlBQUE7TUFDQSxPQUFBLFdBQUE7Ozs7O0FDWEE7O0FBRUEsUUFBQSxPQUFBLGFBQUEsQ0FBQTs7Q0FFQSxPQUFBLENBQUEsa0JBQUEsU0FBQSxnQkFBQTtFQUNBLGVBQUEsS0FBQSxVQUFBO0lBQ0EsYUFBQTtJQUNBLFlBQUE7Ozs7Q0FJQSxXQUFBLGFBQUEsQ0FBQSxXQUFBOzs7QUNYQTs7QUFFQSxTQUFBLG9CQUFBLFdBQUE7O0VBRUEsV0FBQSxPQUFBOztFQUVBLFNBQUEsb0JBQUEsVUFBQTs7SUFFQSxHQUFBLGVBQUEsT0FBQSxTQUFBLGFBQUE7O01BRUEsSUFBQSxZQUFBLFlBQUE7TUFDQSxPQUFBLFdBQUE7Ozs7R0FJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcsXG5cdFx0W1xuICAgICAgICAvLyBBbmd1bGFyIG1vZHVsZXNcbiAgICAgICAgJ25nQW5pbWF0ZScsICAgICAgICAvLyBhbmltYXRpb25zXG4gICAgICAgICduZ1JvdXRlJywgICAgICAgICAgLy8gcm91dGluZ1xuICAgICAgICAnbmdTYW5pdGl6ZScsICAgICAgIC8vIHNhbml0aXplcyBodG1sIGJpbmRpbmdzIChleDogc2lkZWJhci5qcylcblx0XHRcdFx0J3BhcnRpYWxzTW9kdWxlJyxcblxuICAgICAgICAvLyBDdXN0b20gbW9kdWxlc1xuICAgICAgICAnY29tbW9uJywgICAgICAgICAgIC8vIGNvbW1vbiBmdW5jdGlvbnMsIGxvZ2dlciwgc3Bpbm5lclxuICAgICAgICAnY29tbW9uLmJvb3RzdHJhcCcsIC8vIGJvb3RzdHJhcCBkaWFsb2cgd3JhcHBlciBmdW5jdGlvbnNcblxuICAgICAgICAvLyAzcmQgUGFydHkgTW9kdWxlc1xuICAgICAgICAndWkuYm9vdHN0cmFwJywgICAgICAvLyB1aS1ib290c3RyYXAgKGV4OiBjYXJvdXNlbCwgcGFnaW5hdGlvbiwgZGlhbG9nKVxuXG5cdFx0XHRcdC8vIGxvY2FsIFBhcnR5IE1vZHVsZXNcblx0XHRcdFx0J2FwcC5jb250cm9sbGVycycsXG5cdFx0XHRcdCdhcHAuZmlsdGVycycsXG5cdFx0XHRcdCdhcHAuc2VydmljZXMnLFxuXHRcdFx0XHQnYXBwLmRpcmVjdGl2ZXMnLFxuXHRcdFx0XHQnYXBwLnJvdXRlcycsXG5cdFx0XHRcdCdhcHAuY29uZmlnJ1xuXHRcdF0pO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJywgJ25nU3RvcmFnZScsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLWxvYWRpbmctYmFyJ10pO1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSk7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFtdKTtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24ocm91dGVzKXtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG5cblx0XHR2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKXtcblx0XHRcdHJldHVybiAnLi92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xuXHRcdH07XG5cblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxuXHRcdFx0LnN0YXRlKCdhcHAnLCB7XG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb290ZXI6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmb290ZXInKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bWFpbjoge31cblx0XHRcdFx0fVxuXHRcdFx0fSlcbiAgICAgIC5zdGF0ZSgnYXBwLmxhbmRpbmcnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICBkYXRhOiB7fSxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnbWFpbkAnOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAubGFuZGluZycsIHtcbiAgICAgICAgdXJsOiAnL2FwcC9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWwnLFxuICAgICAgICBkYXRhOiB7fSxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnbWFpbkAnOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXHRcdFx0LnN0YXRlKCdhcHAubGFuZGluZycsIHtcblx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdGRhdGE6IHt9LFxuXHRcdFx0XHR2aWV3czoge1xuXHRcdFx0XHRcdCdtYWluQCc6IHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbWRTaWRlbmF2KXtcblx0XHQkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblxuXHRcdFx0aWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucGFnZU5hbWUpe1xuXHRcdFx0XHQkcm9vdFNjb3BlLmN1cnJlbnRfcGFnZSA9IHRvU3RhdGUuZGF0YS5wYWdlTmFtZTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXHRcdCRyb290U2NvcGUuJG9uKFwiJHZpZXdDb250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcblx0XHRcdHdpbmRvdy5QcmlzbS5oaWdobGlnaHRBbGwoKTtcblx0XHR9KTtcblxuXHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSl7XG5cdFx0XHQkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpe1xuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG5cdFx0LnByaW1hcnlQYWxldHRlKCdpbmRpZ28nKVxuXHRcdC5hY2NlbnRQYWxldHRlKCdncmV5Jylcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xuXHR9KTtcblxufSkoKTtcbiIsImV4cG9ydHMuY29uZmlnID0ge1xuICBhbGxTY3JpcHRzVGltZW91dDogMTEwMDAsXG5cbiAgc3BlY3M6IFtcbiAgICAnKi5qcydcbiAgXSxcblxuICBjYXBhYmlsaXRpZXM6IHtcbiAgICAnYnJvd3Nlck5hbWUnOiAnY2hyb21lJ1xuICB9LFxuXG4gIGJhc2VVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBwLycsXG5cbiAgZnJhbWV3b3JrOiAnamFzbWluZScsXG5cbiAgamFzbWluZU5vZGVPcHRzOiB7XG4gICAgZGVmYXVsdFRpbWVvdXRJbnRlcnZhbDogMzAwMDBcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvcHJvdHJhY3Rvci9ibG9iL21hc3Rlci9kb2NzL3RvYy5tZCAqL1xuXG5kZXNjcmliZSgnbXkgYXBwJywgZnVuY3Rpb24oKSB7XG5cblxuICBpdCgnc2hvdWxkIGF1dG9tYXRpY2FsbHkgcmVkaXJlY3QgdG8gL3ZpZXcxIHdoZW4gbG9jYXRpb24gaGFzaC9mcmFnbWVudCBpcyBlbXB0eScsIGZ1bmN0aW9uKCkge1xuICAgIGJyb3dzZXIuZ2V0KCdpbmRleC5odG1sJyk7XG4gICAgZXhwZWN0KGJyb3dzZXIuZ2V0TG9jYXRpb25BYnNVcmwoKSkudG9NYXRjaChcIi92aWV3MVwiKTtcbiAgfSk7XG5cblxuICBkZXNjcmliZSgndmlldzEnLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBicm93c2VyLmdldCgnaW5kZXguaHRtbCMvdmlldzEnKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdmlldzEgd2hlbiB1c2VyIG5hdmlnYXRlcyB0byAvdmlldzEnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChlbGVtZW50LmFsbChieS5jc3MoJ1tuZy12aWV3XSBwJykpLmZpcnN0KCkuZ2V0VGV4dCgpKS5cbiAgICAgICAgdG9NYXRjaCgvcGFydGlhbCBmb3IgdmlldyAxLyk7XG4gICAgfSk7XG5cbiAgfSk7XG5cblxuICBkZXNjcmliZSgndmlldzInLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBicm93c2VyLmdldCgnaW5kZXguaHRtbCMvdmlldzInKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdmlldzIgd2hlbiB1c2VyIG5hdmlnYXRlcyB0byAvdmlldzInLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChlbGVtZW50LmFsbChieS5jc3MoJ1tuZy12aWV3XSBwJykpLmZpcnN0KCkuZ2V0VGV4dCgpKS5cbiAgICAgICAgdG9NYXRjaCgvcGFydGlhbCBmb3IgdmlldyAyLyk7XG4gICAgfSk7XG5cbiAgfSk7XG59KTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICdjYXBpdGFsaXplJywgZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcblx0XHRcdHJldHVybiAoaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xuXHRcdFx0XHRyZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fSkgOiAnJztcblx0XHR9O1xuXHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuXHRcdFx0aWYgKCAhc3RyICl7XG5cdFx0XHRcdHJldHVybiAnJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmFncyA9IHN0ci5zcGxpdCgnXycpO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZyYWdzW2ldID0gZnJhZ3NbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmcmFnc1tpXS5zbGljZSgxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XG5cdFx0fTtcblx0fSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVDaGFyYWN0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBjaGFycywgYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgIGlmIChpc05hTihjaGFycykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhcnMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dC5sZW5ndGggPiBjaGFycykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcblxuICAgICAgICAgICAgICAgIGlmICghYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RzcGFjZSA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBsYXN0IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0c3BhY2UgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBsYXN0c3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGgtMSkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgaW5wdXQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0ICsgJy4uLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVXb3JkcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgd29yZHMpIHtcbiAgICAgICAgICAgIGlmIChpc05hTih3b3JkcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod29yZHMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dFdvcmRzID0gaW5wdXQuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRXb3Jkcy5sZW5ndGggPiB3b3Jkcykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0V29yZHMuc2xpY2UoMCwgd29yZHMpLmpvaW4oJyAnKSArICcuLi4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ3RydXN0SHRtbCcsIGZ1bmN0aW9uKCAkc2NlICl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sKTtcblx0XHR9O1xuXHR9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndWNmaXJzdCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiggaW5wdXQgKSB7XG5cdFx0XHRpZiAoICFpbnB1dCApe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcblx0XHR9O1xuXHR9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpLmZhY3RvcnkoJ0FQSScsIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyLCBUb2FzdFNlcnZpY2UsICRsb2NhbFN0b3JhZ2UpIHtcblxuXHRcdC8vY29udGVudCBuZWdvdGlhdGlvblxuXHRcdHZhciBoZWFkZXJzID0ge1xuXHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdCdBY2NlcHQnOiAnYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb24nXG5cdFx0fTtcblxuXHRcdHJldHVybiBSZXN0YW5ndWxhci53aXRoQ29uZmlnKGZ1bmN0aW9uKFJlc3Rhbmd1bGFyQ29uZmlndXJlcikge1xuXHRcdFx0UmVzdGFuZ3VsYXJDb25maWd1cmVyXG5cdFx0XHRcdC5zZXRCYXNlVXJsKCcvYXBpLycpXG5cdFx0XHRcdC5zZXREZWZhdWx0SGVhZGVycyhoZWFkZXJzKVxuXHRcdFx0XHQuc2V0RXJyb3JJbnRlcmNlcHRvcihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQyMikge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgZXJyb3IgaW4gcmVzcG9uc2UuZGF0YS5lcnJvcnMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFRvYXN0U2VydmljZS5lcnJvcihyZXNwb25zZS5kYXRhLmVycm9yc1tlcnJvcl1bMF0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LmFkZEZ1bGxSZXF1ZXN0SW50ZXJjZXB0b3IoZnVuY3Rpb24oZWxlbWVudCwgb3BlcmF0aW9uLCB3aGF0LCB1cmwsIGhlYWRlcnMpIHtcblx0XHRcdFx0XHRpZiAoJGxvY2FsU3RvcmFnZS5qd3QpIHtcblx0XHRcdFx0XHRcdGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArICRsb2NhbFN0b3JhZ2Uuand0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBEZWZpbmUgdGhlIGNvbW1vbiBtb2R1bGVcbiAgICAvLyBDb250YWlucyBzZXJ2aWNlczpcbiAgICAvLyAgLSBjb21tb25cbiAgICAvLyAgLSBsb2dnZXJcbiAgICAvLyAgLSBzcGlubmVyXG4gICAgdmFyIGNvbW1vbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdjb21tb24nLCBbXSk7XG5cbiAgICAvLyBNdXN0IGNvbmZpZ3VyZSB0aGUgY29tbW9uIHNlcnZpY2UgYW5kIHNldCBpdHNcbiAgICAvLyBldmVudHMgdmlhIHRoZSBjb21tb25Db25maWdQcm92aWRlclxuICAgIGNvbW1vbk1vZHVsZS5wcm92aWRlcignY29tbW9uQ29uZmlnJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgcHJvcGVydGllcyB3ZSBuZWVkIHRvIHNldFxuICAgICAgICAgICAgLy9jb250cm9sbGVyQWN0aXZhdGVTdWNjZXNzRXZlbnQ6ICcnLFxuICAgICAgICAgICAgLy9zcGlubmVyVG9nZ2xlRXZlbnQ6ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY29uZmlnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgY29tbW9uTW9kdWxlLmZhY3RvcnkoJ2NvbW1vbicsXG4gICAgICAgIFsnJHEnLCAnJHJvb3RTY29wZScsICckdGltZW91dCcsICdjb21tb25Db25maWcnLCAnbG9nZ2VyJywgY29tbW9uXSk7XG5cbiAgICBmdW5jdGlvbiBjb21tb24oJHEsICRyb290U2NvcGUsICR0aW1lb3V0LCBjb21tb25Db25maWcsIGxvZ2dlcikge1xuICAgICAgICB2YXIgdGhyb3R0bGVzID0ge307XG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICAvLyBjb21tb24gYW5ndWxhciBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICRicm9hZGNhc3Q6ICRicm9hZGNhc3QsXG4gICAgICAgICAgICAkcTogJHEsXG4gICAgICAgICAgICAkdGltZW91dDogJHRpbWVvdXQsXG4gICAgICAgICAgICAvLyBnZW5lcmljXG4gICAgICAgICAgICBhY3RpdmF0ZUNvbnRyb2xsZXI6IGFjdGl2YXRlQ29udHJvbGxlcixcbiAgICAgICAgICAgIGNyZWF0ZVNlYXJjaFRocm90dGxlOiBjcmVhdGVTZWFyY2hUaHJvdHRsZSxcbiAgICAgICAgICAgIGRlYm91bmNlZFRocm90dGxlOiBkZWJvdW5jZWRUaHJvdHRsZSxcbiAgICAgICAgICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICAgICAgICAgIGxvZ2dlcjogbG9nZ2VyLCAvLyBmb3IgYWNjZXNzaWJpbGl0eVxuICAgICAgICAgICAgdGV4dENvbnRhaW5zOiB0ZXh0Q29udGFpbnNcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZUNvbnRyb2xsZXIocHJvbWlzZXMsIGNvbnRyb2xsZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAoZXZlbnRBcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB7IGNvbnRyb2xsZXJJZDogY29udHJvbGxlcklkIH07XG4gICAgICAgICAgICAgICAgJGJyb2FkY2FzdChjb21tb25Db25maWcuY29uZmlnLmNvbnRyb2xsZXJBY3RpdmF0ZVN1Y2Nlc3NFdmVudCwgZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uICRicm9hZGNhc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0LmFwcGx5KCRyb290U2NvcGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVTZWFyY2hUaHJvdHRsZSh2aWV3bW9kZWwsIGxpc3QsIGZpbHRlcmVkTGlzdCwgZmlsdGVyLCBkZWxheSkge1xuICAgICAgICAgICAgLy8gQWZ0ZXIgYSBkZWxheSwgc2VhcmNoIGEgdmlld21vZGVsJ3MgbGlzdCB1c2luZ1xuICAgICAgICAgICAgLy8gYSBmaWx0ZXIgZnVuY3Rpb24sIGFuZCByZXR1cm4gYSBmaWx0ZXJlZExpc3QuXG5cbiAgICAgICAgICAgIC8vIGN1c3RvbSBkZWxheSBvciB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgZGVsYXkgPSArZGVsYXkgfHwgMzAwO1xuICAgICAgICAgICAgLy8gaWYgb25seSB2bSBhbmQgbGlzdCBwYXJhbWV0ZXJzIHdlcmUgcGFzc2VkLCBzZXQgb3RoZXJzIGJ5IG5hbWluZyBjb252ZW50aW9uXG4gICAgICAgICAgICBpZiAoIWZpbHRlcmVkTGlzdCkge1xuICAgICAgICAgICAgICAgIC8vIGFzc3VtaW5nIGxpc3QgaXMgbmFtZWQgc2Vzc2lvbnMsIGZpbHRlcmVkTGlzdCBpcyBmaWx0ZXJlZFNlc3Npb25zXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRMaXN0ID0gJ2ZpbHRlcmVkJyArIGxpc3RbMF0udG9VcHBlckNhc2UoKSArIGxpc3Quc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7IC8vIHN0cmluZ1xuICAgICAgICAgICAgICAgIC8vIGZpbHRlciBmdW5jdGlvbiBpcyBuYW1lZCBzZXNzaW9uRmlsdGVyXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gbGlzdCArICdGaWx0ZXInOyAvLyBmdW5jdGlvbiBpbiBzdHJpbmcgZm9ybVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGZpbHRlcmluZyBmdW5jdGlvbiB3ZSB3aWxsIGNhbGwgZnJvbSBoZXJlXG4gICAgICAgICAgICB2YXIgZmlsdGVyRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJhbnNsYXRlcyB0byAuLi5cbiAgICAgICAgICAgICAgICAvLyB2bS5maWx0ZXJlZFNlc3Npb25zXG4gICAgICAgICAgICAgICAgLy8gICAgICA9IHZtLnNlc3Npb25zLmZpbHRlcihmdW5jdGlvbihpdGVtKCB7IHJldHVybnMgdm0uc2Vzc2lvbkZpbHRlciAoaXRlbSkgfSApO1xuICAgICAgICAgICAgICAgIHZpZXdtb2RlbFtmaWx0ZXJlZExpc3RdID0gdmlld21vZGVsW2xpc3RdLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlld21vZGVsW2ZpbHRlcl0oaXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIG91dGVyIElGRkUgc28gd2UgY2FuIHVzZSBjbG9zdXJlXG4gICAgICAgICAgICAgICAgLy8gb3ZlciBmaWx0ZXJJbnB1dFRpbWVvdXQgd2hpY2ggcmVmZXJlbmNlcyB0aGUgdGltZW91dFxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJJbnB1dFRpbWVvdXQ7XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gd2hhdCBiZWNvbWVzIHRoZSAnYXBwbHlGaWx0ZXInIGZ1bmN0aW9uIGluIHRoZSBjb250cm9sbGVyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWFyY2hOb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcklucHV0VGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKGZpbHRlcklucHV0VGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJJbnB1dFRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hOb3cgfHwgIWRlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJGbigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVySW5wdXRUaW1lb3V0ID0gJHRpbWVvdXQoZmlsdGVyRm4sIGRlbGF5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVib3VuY2VkVGhyb3R0bGUoa2V5LCBjYWxsYmFjaywgZGVsYXksIGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgLy8gUGVyZm9ybSBzb21lIGFjdGlvbiAoY2FsbGJhY2spIGFmdGVyIGEgZGVsYXkuXG4gICAgICAgICAgICAvLyBUcmFjayB0aGUgY2FsbGJhY2sgYnkga2V5LCBzbyBpZiB0aGUgc2FtZSBjYWxsYmFja1xuICAgICAgICAgICAgLy8gaXMgaXNzdWVkIGFnYWluLCByZXN0YXJ0IHRoZSBkZWxheS5cblxuICAgICAgICAgICAgdmFyIGRlZmF1bHREZWxheSA9IDEwMDA7XG4gICAgICAgICAgICBkZWxheSA9IGRlbGF5IHx8IGRlZmF1bHREZWxheTtcbiAgICAgICAgICAgIGlmICh0aHJvdHRsZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aHJvdHRsZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgdGhyb3R0bGVzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3R0bGVzW2tleV0gPSAkdGltZW91dChjYWxsYmFjaywgZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gICAgICAgICAgICAvLyBuZWdhdGl2ZSBvciBwb3NpdGl2ZVxuICAgICAgICAgICAgcmV0dXJuICgvXlstXT9cXGQrJC8pLnRlc3QodmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRleHRDb250YWlucyh0ZXh0LCBzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dCAmJiAtMSAhPT0gdGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoVGV4dC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgc2VydmljZUlkID0gJ2RhdGFjb250ZXh0JztcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmZhY3Rvcnkoc2VydmljZUlkLCBbJyRodHRwJywgJ2NvbW1vbicsIGRhdGFjb250ZXh0XSk7XG5cbiAgICBmdW5jdGlvbiBkYXRhY29udGV4dCgkaHR0cCwgY29tbW9uKSB7XG4gICAgICAgIHZhciAkcSA9IGNvbW1vbi4kcTtcblxuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldEF2ZW5nZXJzQ2FzdDogZ2V0QXZlbmdlcnNDYXN0LFxuICAgICAgICAgICAgZ2V0QXZlbmdlckNvdW50OiBnZXRBdmVuZ2VyQ291bnQsXG4gICAgICAgICAgICBnZXRNQUE6IGdldE1BQVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldE1BQSgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9kYXRhL21hYSd9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFbMF0uZGF0YS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHJlc3VsdHMpO1xuLy8gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IHtkYXRhOiBudWxsfTtcbi8vICAgICAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICcvbWFhJ30pXG4vLyAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuLy8gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMuZGF0YSA9IGRhdGFbMF0uZGF0YS5yZXN1bHRzO1xuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgcmV0dXJuICRxLndoZW4ocmVzdWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBdmVuZ2VyQ291bnQoKSB7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGdldEF2ZW5nZXJzQ2FzdCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb3VudCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKGNvdW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnNDYXN0KCkge1xuICAgICAgICAgICAgdmFyIGNhc3QgPSBbXG4gICAgICAgICAgICAgICAge25hbWU6ICdSb2JlcnQgRG93bmV5IEpyLicsIGNoYXJhY3RlcjogJ1RvbnkgU3RhcmsgLyBJcm9uIE1hbid9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnQ2hyaXMgSGVtc3dvcnRoJywgY2hhcmFjdGVyOiAnVGhvcid9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnQ2hyaXMgRXZhbnMnLCBjaGFyYWN0ZXI6ICdTdGV2ZSBSb2dlcnMgLyBDYXB0YWluIEFtZXJpY2EnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ01hcmsgUnVmZmFsbycsIGNoYXJhY3RlcjogJ0JydWNlIEJhbm5lciAvIFRoZSBIdWxrJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdTY2FybGV0dCBKb2hhbnNzb24nLCBjaGFyYWN0ZXI6ICdOYXRhc2hhIFJvbWFub2ZmIC8gQmxhY2sgV2lkb3cnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0plcmVteSBSZW5uZXInLCBjaGFyYWN0ZXI6ICdDbGludCBCYXJ0b24gLyBIYXdrZXllJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdHd3luZXRoIFBhbHRyb3cnLCBjaGFyYWN0ZXI6ICdQZXBwZXIgUG90dHMnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1NhbXVlbCBMLiBKYWNrc29uJywgY2hhcmFjdGVyOiAnTmljayBGdXJ5J30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdQYXVsIEJldHRhbnknLCBjaGFyYWN0ZXI6ICdKYXJ2aXMnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1RvbSBIaWRkbGVzdG9uJywgY2hhcmFjdGVyOiAnTG9raSd9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnQ2xhcmsgR3JlZ2cnLCBjaGFyYWN0ZXI6ICdBZ2VudCBQaGlsIENvdWxzb24nfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHJldHVybiAkcS53aGVuKGNhc3QpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCRtZERpYWxvZyl7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZnJvbVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgJHNjb3BlKXtcblxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJHNjb3BlKXtcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcblx0XHRcdH0sXG5cblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQub2soJ09rJylcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdGNvbmZpcm06IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KSB7XG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXG5cdFx0XHRcdFx0XHQudGl0bGUodGl0bGUpXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXG5cdFx0XHRcdFx0XHQuY2FuY2VsKCdDYW5jZWwnKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY0ltZ1BlcnNvbicsIFsnY29uZmlnJywgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAvL1VzYWdlOlxuICAgICAgICAvLzxpbWcgZGF0YS1jYy1pbWctcGVyc29uPVwie3tzLnNwZWFrZXIuaW1hZ2VTb3VyY2V9fVwiLz5cbiAgICAgICAgdmFyIGJhc2VQYXRoID0gY29uZmlnLmltYWdlU2V0dGluZ3MuaW1hZ2VCYXNlUGF0aDtcbiAgICAgICAgdmFyIHVua25vd25JbWFnZSA9IGNvbmZpZy5pbWFnZVNldHRpbmdzLnVua25vd25QZXJzb25JbWFnZVNvdXJjZTtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdjY0ltZ1BlcnNvbicsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gYmFzZVBhdGggKyAodmFsdWUgfHwgdW5rbm93bkltYWdlKTtcbiAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCdzcmMnLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjU2lkZWJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gT3BlbnMgYW5kIGNsc29lcyB0aGUgc2lkZWJhciBtZW51LlxuICAgICAgICAvLyBVc2FnZTpcbiAgICAgICAgLy8gIDxkaXYgZGF0YS1jYy1zaWRlYmFyPlxuICAgICAgICAvLyBDcmVhdGVzOlxuICAgICAgICAvLyAgPGRpdiBkYXRhLWNjLXNpZGViYXIgY2xhc3M9XCJzaWRlYmFyXCI+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgJHNpZGViYXJJbm5lciA9IGVsZW1lbnQuZmluZCgnLnNpZGViYXItaW5uZXInKTtcbiAgICAgICAgICAgIHZhciAkZHJvcGRvd25FbGVtZW50ID0gZWxlbWVudC5maW5kKCcuc2lkZWJhci1kcm9wZG93biBhJyk7XG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdzaWRlYmFyJyk7XG4gICAgICAgICAgICAkZHJvcGRvd25FbGVtZW50LmNsaWNrKGRyb3Bkb3duKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZHJvcGRvd24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBkcm9wQ2xhc3MgPSAnZHJvcHknO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoISRkcm9wZG93bkVsZW1lbnQuaGFzQ2xhc3MoZHJvcENsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICBoaWRlQWxsU2lkZWJhcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNpZGViYXJJbm5lci5zbGlkZURvd24oMzUwKTtcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duRWxlbWVudC5hZGRDbGFzcyhkcm9wQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGRyb3Bkb3duRWxlbWVudC5oYXNDbGFzcyhkcm9wQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bkVsZW1lbnQucmVtb3ZlQ2xhc3MoZHJvcENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgJHNpZGViYXJJbm5lci5zbGlkZVVwKDM1MCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGlkZUFsbFNpZGViYXJzKCkge1xuICAgICAgICAgICAgICAgICAgICAkc2lkZWJhcklubmVyLnNsaWRlVXAoMzUwKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItZHJvcGRvd24gYScpLnJlbW92ZUNsYXNzKGRyb3BDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjV2lkZ2V0Q2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFVzYWdlOlxuICAgICAgICAvLyA8YSBkYXRhLWNjLXdpZGdldC1jbG9zZT48L2E+XG4gICAgICAgIC8vIENyZWF0ZXM6XG4gICAgICAgIC8vIDxhIGRhdGEtY2Mtd2lkZ2V0LWNsb3NlPVwiXCIgaHJlZj1cIiNcIiBjbGFzcz1cIndjbG9zZVwiPlxuICAgICAgICAvLyAgICAgPGkgY2xhc3M9XCJmYSBmYS1yZW1vdmVcIj48L2k+XG4gICAgICAgIC8vIDwvYT5cbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCI+PC9pPicsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgYXR0cnMuJHNldCgnd2Nsb3NlJyk7XG4gICAgICAgICAgICBlbGVtZW50LmNsaWNrKGNsb3NlRWwpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZUVsKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjV2lkZ2V0TWluaW1pemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFVzYWdlOlxuICAgICAgICAvLyA8YSBkYXRhLWNjLXdpZGdldC1taW5pbWl6ZT48L2E+XG4gICAgICAgIC8vIENyZWF0ZXM6XG4gICAgICAgIC8vIDxhIGRhdGEtY2Mtd2lkZ2V0LW1pbmltaXplPVwiXCIgaHJlZj1cIiNcIj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tdXBcIj48L2k+PC9hPlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXVwXCI+PC9pPicsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIC8vJCgnYm9keScpLm9uKCdjbGljaycsICcud2lkZ2V0IC53bWluaW1pemUnLCBtaW5pbWl6ZSk7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoJ3dtaW5pbWl6ZScpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGljayhtaW5pbWl6ZSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG1pbmltaXplKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyICR3Y29udGVudCA9IGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkubmV4dCgnLndpZGdldC1jb250ZW50Jyk7XG4gICAgICAgICAgICAgICAgdmFyIGlFbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlbignaScpO1xuICAgICAgICAgICAgICAgIGlmICgkd2NvbnRlbnQuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaUVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhIGZhLWNoZXZyb24tdXAnKTtcbiAgICAgICAgICAgICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ2ZhIGZhLWNoZXZyb24tZG93bicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKCdmYSBmYS1jaGV2cm9uLWRvd24nKTtcbiAgICAgICAgICAgICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ2ZhIGZhLWNoZXZyb24tdXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHdjb250ZW50LnRvZ2dsZSg1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAuZGlyZWN0aXZlKCdjY1Njcm9sbFRvVG9wJywgWyckd2luZG93JyxcbiAgICAgICAgLy8gVXNhZ2U6XG4gICAgICAgIC8vIDxzcGFuIGRhdGEtY2Mtc2Nyb2xsLXRvLXRvcD48L3NwYW4+XG4gICAgICAgIC8vIENyZWF0ZXM6XG4gICAgICAgIC8vIDxzcGFuIGRhdGEtY2Mtc2Nyb2xsLXRvLXRvcD1cIlwiIGNsYXNzPVwidG90b3BcIj5cbiAgICAgICAgLy8gICAgICA8YSBocmVmPVwiI1wiPjxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi11cFwiPjwvaT48L2E+XG4gICAgICAgIC8vIDwvc3Bhbj5cbiAgICAgICAgZnVuY3Rpb24gKCR3aW5kb3cpIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxhIGhyZWY9XCIjXCI+PGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXVwXCI+PC9pPjwvYT4nLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciAkd2luID0gJCgkd2luZG93KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCd0b3RvcCcpO1xuICAgICAgICAgICAgICAgICR3aW4uc2Nyb2xsKHRvZ2dsZUljb24pO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5maW5kKCdhJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBMZWFybmluZyBQb2ludDogJGFuY2hvclNjcm9sbCB3b3JrcywgYnV0IG5vIGFuaW1hdGlvblxuICAgICAgICAgICAgICAgICAgICAvLyRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUljb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkd2luLnNjcm9sbFRvcCgpID4gMzAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNsaWRlRG93bigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zbGlkZVVwKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdKTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjU3Bpbm5lcicsIFsnJHdpbmRvdycsIGZ1bmN0aW9uICgkd2luZG93KSB7XG4gICAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgICAvLyAgQ3JlYXRlcyBhIG5ldyBTcGlubmVyIGFuZCBzZXRzIGl0cyBvcHRpb25zXG4gICAgICAgIC8vIFVzYWdlOlxuICAgICAgICAvLyAgPGRpdiBkYXRhLWNjLXNwaW5uZXI9XCJ2bS5zcGlubmVyT3B0aW9uc1wiPjwvZGl2PlxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgc2NvcGUuc3Bpbm5lciA9IG51bGw7XG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goYXR0cnMuY2NTcGlubmVyLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5zcGlubmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNwaW5uZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY29wZS5zcGlubmVyID0gbmV3ICR3aW5kb3cuU3Bpbm5lcihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBzY29wZS5zcGlubmVyLnNwaW4oZWxlbWVudFswXSk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIGFwcC5kaXJlY3RpdmUoJ2NjV2lkZ2V0SGVhZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvL1VzYWdlOlxuICAgICAgICAvLzxkaXYgZGF0YS1jYy13aWRnZXQtaGVhZGVyIHRpdGxlPVwidm0ubWFwLnRpdGxlXCI+PC9kaXY+XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAndGl0bGUnOiAnQCcsXG4gICAgICAgICAgICAgICAgJ3N1YnRpdGxlJzogJ0AnLFxuICAgICAgICAgICAgICAgICdyaWdodFRleHQnOiAnQCcsXG4gICAgICAgICAgICAgICAgJ2FsbG93Q29sbGFwc2UnOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9sYXlvdXQvd2lkZ2V0aGVhZGVyLmh0bWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBhdHRycy4kc2V0KCdjbGFzcycsICd3aWRnZXQtaGVhZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2NvbW1vbicpLmZhY3RvcnkoJ2xvZ2dlcicsIFsnJGxvZycsIGxvZ2dlcl0pO1xuXG4gICAgZnVuY3Rpb24gbG9nZ2VyKCRsb2cpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBnZXRMb2dGbjogZ2V0TG9nRm4sXG4gICAgICAgICAgICBsb2c6IGxvZyxcbiAgICAgICAgICAgIGxvZ0Vycm9yOiBsb2dFcnJvcixcbiAgICAgICAgICAgIGxvZ1N1Y2Nlc3M6IGxvZ1N1Y2Nlc3MsXG4gICAgICAgICAgICBsb2dXYXJuaW5nOiBsb2dXYXJuaW5nXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TG9nRm4obW9kdWxlSWQsIGZuTmFtZSkge1xuICAgICAgICAgICAgZm5OYW1lID0gZm5OYW1lIHx8ICdsb2cnO1xuICAgICAgICAgICAgc3dpdGNoIChmbk5hbWUudG9Mb3dlckNhc2UoKSkgeyAvLyBjb252ZXJ0IGFsaWFzZXNcbiAgICAgICAgICAgICAgICBjYXNlICdzdWNjZXNzJzpcbiAgICAgICAgICAgICAgICAgICAgZm5OYW1lID0gJ2xvZ1N1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICAgICAgICAgIGZuTmFtZSA9ICdsb2dFcnJvcic7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dhcm4nOlxuICAgICAgICAgICAgICAgICAgICBmbk5hbWUgPSAnbG9nV2FybmluZyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgICAgICAgICAgICAgICBmbk5hbWUgPSAnbG9nV2FybmluZyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbG9nRm4gPSBzZXJ2aWNlW2ZuTmFtZV0gfHwgc2VydmljZS5sb2c7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZywgZGF0YSwgc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICAgICAgbG9nRm4obXNnLCBkYXRhLCBtb2R1bGVJZCwgKHNob3dUb2FzdCA9PT0gdW5kZWZpbmVkKSA/IHRydWUgOiBzaG93VG9hc3QpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZyhtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCkge1xuICAgICAgICAgICAgbG9nSXQobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QsICdpbmZvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dXYXJuaW5nKG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0KSB7XG4gICAgICAgICAgICBsb2dJdChtZXNzYWdlLCBkYXRhLCBzb3VyY2UsIHNob3dUb2FzdCwgJ3dhcm5pbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ1N1Y2Nlc3MobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgIGxvZ0l0KG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0LCAnc3VjY2VzcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nRXJyb3IobWVzc2FnZSwgZGF0YSwgc291cmNlLCBzaG93VG9hc3QpIHtcbiAgICAgICAgICAgIGxvZ0l0KG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0LCAnZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ0l0KG1lc3NhZ2UsIGRhdGEsIHNvdXJjZSwgc2hvd1RvYXN0LCB0b2FzdFR5cGUpIHtcbiAgICAgICAgICAgIHZhciB3cml0ZSA9ICh0b2FzdFR5cGUgPT09ICdlcnJvcicpID8gJGxvZy5lcnJvciA6ICRsb2cubG9nO1xuICAgICAgICAgICAgc291cmNlID0gc291cmNlID8gJ1snICsgc291cmNlICsgJ10gJyA6ICcnO1xuICAgICAgICAgICAgd3JpdGUoc291cmNlLCBtZXNzYWdlLCBkYXRhKTtcbiAgICAgICAgICAgIGlmIChzaG93VG9hc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAodG9hc3RUeXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRvYXN0VHlwZSA9PT0gJ3dhcm5pbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9hc3RUeXBlID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmluZm8obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIE11c3QgY29uZmlndXJlIHRoZSBjb21tb24gc2VydmljZSBhbmQgc2V0IGl0c1xuICAgIC8vIGV2ZW50cyB2aWEgdGhlIGNvbW1vbkNvbmZpZ1Byb3ZpZGVyXG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29tbW9uJylcbiAgICAgICAgLmZhY3RvcnkoJ3NwaW5uZXInLCBbJ2NvbW1vbicsICdjb21tb25Db25maWcnLCBzcGlubmVyXSk7XG5cbiAgICBmdW5jdGlvbiBzcGlubmVyKGNvbW1vbiwgY29tbW9uQ29uZmlnKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgc3Bpbm5lckhpZGU6IHNwaW5uZXJIaWRlLFxuICAgICAgICAgICAgc3Bpbm5lclNob3c6IHNwaW5uZXJTaG93XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3Bpbm5lckhpZGUoKSB7XG4gICAgICAgICAgICBzcGlubmVyVG9nZ2xlKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNwaW5uZXJTaG93KCkge1xuICAgICAgICAgICAgc3Bpbm5lclRvZ2dsZSh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNwaW5uZXJUb2dnbGUoc2hvdykge1xuICAgICAgICAgICAgY29tbW9uLiRicm9hZGNhc3QoY29tbW9uQ29uZmlnLmNvbmZpZy5zcGlubmVyVG9nZ2xlRXZlbnQsIHsgc2hvdzogc2hvdyB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCRtZFRvYXN0KXtcblxuXHRcdHZhciBkZWxheSA9IDYwMDAsXG5cdFx0XHRwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxuXHRcdFx0YWN0aW9uID0gJ09LJztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbihjb250ZW50KXtcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJG1kVG9hc3Quc2hvdyhcblx0XHRcdFx0XHQkbWRUb2FzdC5zaW1wbGUoKVxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcblx0XHRcdFx0XHRcdC5wb3NpdGlvbihwb3NpdGlvbilcblx0XHRcdFx0XHRcdC5hY3Rpb24oYWN0aW9uKVxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XG5cdFx0XHRcdGlmICghY29udGVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRtZFRvYXN0LnNob3coXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcblx0XHRcdFx0XHRcdC5jb250ZW50KGNvbnRlbnQpXG5cdFx0XHRcdFx0XHQucG9zaXRpb24ocG9zaXRpb24pXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxuXHRcdFx0XHRcdFx0LmFjdGlvbihhY3Rpb24pXG5cdFx0XHRcdFx0XHQuaGlkZURlbGF5KGRlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAudmVyc2lvbi5pbnRlcnBvbGF0ZS1maWx0ZXInLCBbXSlcblxuLmZpbHRlcignaW50ZXJwb2xhdGUnLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZyh0ZXh0KS5yZXBsYWNlKC9cXCVWRVJTSU9OXFwlL21nLCB2ZXJzaW9uKTtcbiAgfTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZGVzY3JpYmUoJ2FwcC52ZXJzaW9uIG1vZHVsZScsIGZ1bmN0aW9uKCkge1xuICBiZWZvcmVFYWNoKG1vZHVsZSgnYXBwLnZlcnNpb24nKSk7XG5cbiAgZGVzY3JpYmUoJ2ludGVycG9sYXRlIGZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAkcHJvdmlkZS52YWx1ZSgndmVyc2lvbicsICdURVNUX1ZFUicpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmVwbGFjZSBWRVJTSU9OJywgaW5qZWN0KGZ1bmN0aW9uKGludGVycG9sYXRlRmlsdGVyKSB7XG4gICAgICBleHBlY3QoaW50ZXJwb2xhdGVGaWx0ZXIoJ2JlZm9yZSAlVkVSU0lPTiUgYWZ0ZXInKSkudG9FcXVhbCgnYmVmb3JlIFRFU1RfVkVSIGFmdGVyJyk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnZlcnNpb24udmVyc2lvbi1kaXJlY3RpdmUnLCBbXSlcblxuLmRpcmVjdGl2ZSgnYXBwVmVyc2lvbicsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzKSB7XG4gICAgZWxtLnRleHQodmVyc2lvbik7XG4gIH07XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmRlc2NyaWJlKCdhcHAudmVyc2lvbiBtb2R1bGUnLCBmdW5jdGlvbigpIHtcbiAgYmVmb3JlRWFjaChtb2R1bGUoJ2FwcC52ZXJzaW9uJykpO1xuXG4gIGRlc2NyaWJlKCdhcHAtdmVyc2lvbiBkaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByaW50IGN1cnJlbnQgdmVyc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgbW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLnZhbHVlKCd2ZXJzaW9uJywgJ1RFU1RfVkVSJyk7XG4gICAgICB9KTtcbiAgICAgIGluamVjdChmdW5jdGlvbigkY29tcGlsZSwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgZWxlbWVudCA9ICRjb21waWxlKCc8c3BhbiBhcHAtdmVyc2lvbj48L3NwYW4+JykoJHJvb3RTY29wZSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LnRleHQoKSkudG9FcXVhbCgnVEVTVF9WRVInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnZlcnNpb24nLCBbXG4gICdhcHAudmVyc2lvbi5pbnRlcnBvbGF0ZS1maWx0ZXInLFxuICAnYXBwLnZlcnNpb24udmVyc2lvbi1kaXJlY3RpdmUnXG5dKVxuXG4udmFsdWUoJ3ZlcnNpb24nLCAnMC4xJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmRlc2NyaWJlKCdhcHAudmVyc2lvbiBtb2R1bGUnLCBmdW5jdGlvbigpIHtcbiAgYmVmb3JlRWFjaChtb2R1bGUoJ2FwcC52ZXJzaW9uJykpO1xuXG4gIGRlc2NyaWJlKCd2ZXJzaW9uIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjdXJyZW50IHZlcnNpb24nLCBpbmplY3QoZnVuY3Rpb24odmVyc2lvbikge1xuICAgICAgZXhwZWN0KHZlcnNpb24pLnRvRXF1YWwoJzAuMScpO1xuICAgIH0pKTtcbiAgfSk7XG59KTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZFVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGlhbG9nU2VydmljZSl7XG5cbiAgICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbigpe1xuXHQgICAgICAgIC8vZG8gc29tZXRoaW5nIHVzZWZ1bFxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdERpYWxvZ1NlcnZpY2UuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoICdhcHAuY29udHJvbGxlcnMnICkuY29udHJvbGxlciggJ0RhdGFMaXN0aW5nQ3RybCcsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9cbiAgICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoICdkYXRhTGlzdGluZycsIGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2RhdGFfbGlzdGluZy9kYXRhX2xpc3RpbmcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnRGF0YUxpc3RpbmdDdHJsJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKCBzY29wZSwgZWxlbWVudCwgYXR0cnMgKXtcblx0XHRcdFx0Ly9cblx0XHRcdH1cblx0XHR9O1xuXG5cdH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGNvbnRyb2xsZXJJZCA9ICdhdmVuZ2Vycyc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKGNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgIFsnY29tbW9uJywgJ2RhdGFjb250ZXh0JywgYXZlbmdlcnNdKTtcblxuICAgIGZ1bmN0aW9uIGF2ZW5nZXJzKGNvbW1vbiwgZGF0YWNvbnRleHQpIHtcbiAgICAgICAgdmFyIGdldExvZ0ZuID0gY29tbW9uLmxvZ2dlci5nZXRMb2dGbjtcbiAgICAgICAgdmFyIGxvZyA9IGdldExvZ0ZuKGNvbnRyb2xsZXJJZCk7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uYXZlbmdlcnMgPSBbXTtcbiAgICAgICAgdm0ubWFhID0gW107XG4gICAgICAgIHZtLnRpdGxlID0gJ0F2ZW5nZXJzJztcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW2dldEF2ZW5nZXJzQ2FzdCgpLCBnZXRNQUEoKV07XG4gICAgICAgICAgICBjb21tb24uYWN0aXZhdGVDb250cm9sbGVyKHByb21pc2VzLCBjb250cm9sbGVySWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsb2coJ0FjdGl2YXRlZCBBdmVuZ2VycyBWaWV3Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRNQUEoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YWNvbnRleHQuZ2V0TUFBKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuLy8gICAgICAgICAgICAgICAgdm0ubWFhID0gZGF0YS5kYXRhWzBdLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgICAgICB2bS5tYWEgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5tYWE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhY29udGV4dC5nZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYXZlbmdlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VycztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgY29udHJvbGxlcklkID0gJ2Rhc2hib2FyZCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLCBbJ2NvbW1vbicsICdkYXRhY29udGV4dCcsIGRhc2hib2FyZF0pO1xuXG4gICAgZnVuY3Rpb24gZGFzaGJvYXJkKGNvbW1vbiwgZGF0YWNvbnRleHQpIHtcbiAgICAgICAgdmFyIGdldExvZ0ZuID0gY29tbW9uLmxvZ2dlci5nZXRMb2dGbjtcbiAgICAgICAgdmFyIGxvZyA9IGdldExvZ0ZuKGNvbnRyb2xsZXJJZCk7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ubmV3cyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnTWFydmVsIEF2ZW5nZXJzJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFydmVsIEF2ZW5nZXJzIDIgaXMgbm93IGluIHByb2R1Y3Rpb24hJ1xuICAgICAgICB9O1xuICAgICAgICB2bS5hdmVuZ2VyQ291bnQgPSAwO1xuICAgICAgICB2bS5hdmVuZ2VycyA9IFtdO1xuICAgICAgICB2bS50aXRsZSA9ICdEYXNoYm9hcmQnO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbZ2V0QXZlbmdlckNvdW50KCksIGdldEF2ZW5nZXJzQ2FzdCgpXTtcbiAgICAgICAgICAgIGNvbW1vbi5hY3RpdmF0ZUNvbnRyb2xsZXIocHJvbWlzZXMsIGNvbnRyb2xsZXJJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7IGxvZygnQWN0aXZhdGVkIERhc2hib2FyZCBWaWV3Jyk7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFjb250ZXh0LmdldEF2ZW5nZXJDb3VudCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5hdmVuZ2VyQ291bnQgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VyQ291bnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhY29udGV4dC5nZXRBdmVuZ2Vyc0Nhc3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYXZlbmdlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hdmVuZ2VycztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGb290ZXJDb250cm9sbGVyJywgRm9vdGVyQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCl7XG4gICAgICAgIC8vXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIEhlYWRlckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigpe1xuICAgICAgICAvL1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDb250cm9sbGVyJywgTGFuZGluZ0NvbnRyb2xsZXIpO1xuXG5cdGZ1bmN0aW9uIExhbmRpbmdDb250cm9sbGVyKCkge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cblx0XHR2bS5sYXJhdmVsX2Rlc2NyaXB0aW9uID0gJ1Jlc3BvbnNlIG1hY3JvcyBpbnRlZ3JhdGVkIHdpdGggeW91ciBBbmd1bGFyIGFwcCc7XG5cdFx0dm0uYW5ndWxhcl9kZXNjcmlwdGlvbiA9ICdRdWVyeSB5b3VyIEFQSSB3aXRob3V0IHdvcnJ5aW5nIGFib3V0IHZhbGlkYXRpb25zJztcblxuXHRcdC8qXG5cdFx0VGhpcyBpcyBhIHRlcnJpYmxlIHRlbXBvcmFyeSBoYWNrLFxuXHRcdHRvIGZpeCBsYXlvdXQgaXNzdWVzIHdpdGggZmxleCBvbiBpT1MgKGNocm9tZSAmIHNhZmFyaSlcblx0XHRNYWtlIHN1cmUgdG8gcmVtb3ZlIHRoaXMgd2hlbiB5b3UgbW9kaWZ5IHRoaXMgZGVtb1xuXHRcdCovXG5cdFx0dm0uaU9TID0gL2lQYWR8aVBob25lfGlQb2QvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGNvbnRyb2xsZXJJZCA9ICdzaGVsbCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoY29udHJvbGxlcklkLFxuICAgICAgICBbJyRyb290U2NvcGUnLCAnY29tbW9uJywgJ2NvbmZpZycsIHNoZWxsXSk7XG5cbiAgICBmdW5jdGlvbiBzaGVsbCgkcm9vdFNjb3BlLCBjb21tb24sIGNvbmZpZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2YXIgbG9nU3VjY2VzcyA9IGNvbW1vbi5sb2dnZXIuZ2V0TG9nRm4oY29udHJvbGxlcklkLCAnc3VjY2VzcycpO1xuICAgICAgICB2YXIgZXZlbnRzID0gY29uZmlnLmV2ZW50cztcbiAgICAgICAgdm0udGl0bGUgPSAnR3J1bnQgYW5kIEd1bHAnO1xuICAgICAgICB2bS5idXN5TWVzc2FnZSA9ICdQbGVhc2Ugd2FpdCAuLi4nO1xuICAgICAgICB2bS5pc0J1c3kgPSB0cnVlO1xuICAgICAgICB2bS5zcGlubmVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHJhZGl1czogNDAsXG4gICAgICAgICAgICBsaW5lczogNyxcbiAgICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgICAgIHNwZWVkOiAxLjcsXG4gICAgICAgICAgICBjb3JuZXJzOiAxLjAsXG4gICAgICAgICAgICB0cmFpbDogMTAwLFxuICAgICAgICAgICAgY29sb3I6ICcjRjU4QTAwJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICBsb2dTdWNjZXNzKCdHcnVudCBhbmQgR3VscCB3aXRoIEFuZ3VsYXIgbG9hZGVkIScsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgY29tbW9uLmFjdGl2YXRlQ29udHJvbGxlcihbXSwgY29udHJvbGxlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVNwaW5uZXIob24pIHsgdm0uaXNCdXN5ID0gb247IH1cblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7IHRvZ2dsZVNwaW5uZXIodHJ1ZSk7IH1cbiAgICAgICAgKTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihldmVudHMuY29udHJvbGxlckFjdGl2YXRlU3VjY2VzcyxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7IHRvZ2dsZVNwaW5uZXIoZmFsc2UpOyB9XG4gICAgICAgICk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oZXZlbnRzLnNwaW5uZXJUb2dnbGUsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkgeyB0b2dnbGVTcGlubmVyKGRhdGEuc2hvdyk7IH1cbiAgICAgICAgKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb250cm9sUGFuZWxDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgJyRtZERpYWxvZycsICckaW50ZXJ2YWwnLFxuICAgICAgICAgICAgQ29udHJvbFBhbmVsQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIENvbnRyb2xQYW5lbENvbnRyb2xsZXIoJG1kRGlhbG9nLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5idXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHZtLnNob3dQcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB2bS5yZWxvYWRTZXJ2ZXIgPSAnU3RhZ2luZyc7XG4gICAgICAgIHZtLnBlcmZvcm1Qcm9ncmVzcyA9IHBlcmZvcm1Qcm9ncmVzcztcbiAgICAgICAgdm0uZGV0ZXJtaW5hdGVWYWx1ZSA9IDEwO1xuXG4gICAgICAgIGZ1bmN0aW9uIHBlcmZvcm1Qcm9ncmVzcygpIHtcbiAgICAgICAgICAgIHZtLnNob3dQcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICBpbnRlcnZhbCA9ICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2bS5kZXRlcm1pbmF0ZVZhbHVlICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKHZtLmRldGVybWluYXRlVmFsdWUgPiAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZGV0ZXJtaW5hdGVWYWx1ZSA9IDEwO1xuICAgICAgICAgICAgICAgICAgICB2bS5zaG93UHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTAsIDAsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hvd0FsZXJ0KCkge1xuICAgICAgICAgICAgYWxlcnQgPSAkbWREaWFsb2cuYWxlcnQoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVsb2FkaW5nIGRvbmUhJyxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB2bS5yZWxvYWRTZXJ2ZXIgKyBcIiBzZXJ2ZXIgcmVsb2FkZWQuXCIsXG4gICAgICAgICAgICAgICAgb2s6ICdDbG9zZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJG1kRGlhbG9nXG4gICAgICAgICAgICAgICAgLnNob3coYWxlcnQpXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gIGFuZ3VsYXJcbiAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgIC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAnbmF2U2VydmljZScsICckbWRTaWRlbmF2JywgJyRtZEJvdHRvbVNoZWV0JywgJyRsb2cnLCAnJHEnLCAnJHN0YXRlJywgJyRtZFRvYXN0JyxcbiAgICAgICAgICBNYWluQ29udHJvbGxlclxuICAgICAgIF0pO1xuXG4gIGZ1bmN0aW9uIE1haW5Db250cm9sbGVyKG5hdlNlcnZpY2UsICRtZFNpZGVuYXYsICRtZEJvdHRvbVNoZWV0LCAkbG9nLCAkcSwgJHN0YXRlLCAkbWRUb2FzdCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5tZW51SXRlbXMgPSBbIF07XG4gICAgdm0uc2VsZWN0SXRlbSA9IHNlbGVjdEl0ZW07XG4gICAgdm0udG9nZ2xlSXRlbXNMaXN0ID0gdG9nZ2xlSXRlbXNMaXN0O1xuICAgIHZtLnNob3dBY3Rpb25zID0gc2hvd0FjdGlvbnM7XG4gICAgdm0udGl0bGUgPSAkc3RhdGUuY3VycmVudC5kYXRhLnRpdGxlO1xuICAgIHZtLnNob3dTaW1wbGVUb2FzdCA9IHNob3dTaW1wbGVUb2FzdDtcblxuICAgIG5hdlNlcnZpY2VcbiAgICAgIC5sb2FkQWxsSXRlbXMoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24obWVudUl0ZW1zKSB7XG4gICAgICAgIHZtLm1lbnVJdGVtcyA9IFtdLmNvbmNhdChtZW51SXRlbXMpO1xuICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVJdGVtc0xpc3QoKSB7XG4gICAgICB2YXIgcGVuZGluZyA9ICRtZEJvdHRvbVNoZWV0LmhpZGUoKSB8fCAkcS53aGVuKHRydWUpO1xuXG4gICAgICBwZW5kaW5nLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgJG1kU2lkZW5hdignbGVmdCcpLnRvZ2dsZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VsZWN0SXRlbSAoaXRlbSkge1xuICAgICAgdm0udGl0bGUgPSBpdGVtLm5hbWU7XG4gICAgICB2bS50b2dnbGVJdGVtc0xpc3QoKTtcbiAgICAgIHZtLnNob3dTaW1wbGVUb2FzdCh2bS50aXRsZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd0FjdGlvbnMoJGV2ZW50KSB7XG4gICAgICAgICRtZEJvdHRvbVNoZWV0LnNob3coe1xuICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL3BhcnRpYWxzL2JvdHRvbVNoZWV0Lmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6IFsgJyRtZEJvdHRvbVNoZWV0JywgU2hlZXRDb250cm9sbGVyXSxcbiAgICAgICAgICBjb250cm9sbGVyQXM6IFwidm1cIixcbiAgICAgICAgICBiaW5kVG9Db250cm9sbGVyIDogdHJ1ZSxcbiAgICAgICAgICB0YXJnZXRFdmVudDogJGV2ZW50XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oY2xpY2tlZEl0ZW0pIHtcbiAgICAgICAgICBjbGlja2VkSXRlbSAmJiAkbG9nLmRlYnVnKCBjbGlja2VkSXRlbS5uYW1lICsgJyBjbGlja2VkIScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBTaGVldENvbnRyb2xsZXIoICRtZEJvdHRvbVNoZWV0ICkge1xuICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICB2bS5hY3Rpb25zID0gW1xuICAgICAgICAgICAgeyBuYW1lOiAnU2hhcmUnLCBpY29uOiAnc2hhcmUnLCB1cmw6ICdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUFuZ3VsYXIlMjBNYXRlcmlhbCUyMERhc2hib2FyZCUyMGh0dHBzOi8vZ2l0aHViLmNvbS9mbGF0bG9naWMvYW5ndWxhci1tYXRlcmlhbC1kYXNoYm9hcmQlMjB2aWElMjBAZmxhdGxvZ2ljaW5jJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnU3RhcicsIGljb246ICdzdGFyJywgdXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL2ZsYXRsb2dpYy9hbmd1bGFyLW1hdGVyaWFsLWRhc2hib2FyZC9zdGFyZ2F6ZXJzJyB9XG4gICAgICAgICAgXTtcblxuICAgICAgICAgIHZtLnBlcmZvcm1BY3Rpb24gPSBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgICAgICAgICRtZEJvdHRvbVNoZWV0LmhpZGUoYWN0aW9uKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd1NpbXBsZVRvYXN0KHRpdGxlKSB7XG4gICAgICAkbWRUb2FzdC5zaG93KFxuICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxuICAgICAgICAgIC5jb250ZW50KHRpdGxlKVxuICAgICAgICAgIC5oaWRlRGVsYXkoMjAwMClcbiAgICAgICAgICAucG9zaXRpb24oJ3RvcCByaWdodCcpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdNZW1vcnlDb250cm9sbGVyJywgW1xuICAgICAgICAgICAgTWVtb3J5Q29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIE1lbW9yeUNvbnRyb2xsZXIoKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLy8gVE9ETzogbW92ZSBkYXRhIHRvIHRoZSBzZXJ2aWNlXG4gICAgICAgIHZtLm1lbW9yeUNoYXJ0RGF0YSA9IFsge2tleTogJ21lbW9yeScsIHk6IDQyfSwgeyBrZXk6ICdmcmVlJywgeTogNTh9IF07XG5cbiAgICAgICAgdm0uY2hhcnRPcHRpb25zID0ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncGllQ2hhcnQnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjEwLFxuICAgICAgICAgICAgICAgIGRvbnV0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBpZToge1xuICAgICAgICAgICAgICAgICAgICBzdGFydEFuZ2xlOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5zdGFydEFuZ2xlLzIgLU1hdGguUEkvMiB9LFxuICAgICAgICAgICAgICAgICAgICBlbmRBbmdsZTogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZW5kQW5nbGUvMiAtTWF0aC5QSS8yIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgICAgICAgICAgICB5OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC55OyB9LFxuICAgICAgICAgICAgICAgIHZhbHVlRm9ybWF0OiAoZDMuZm9ybWF0KFwiLjBmXCIpKSxcbiAgICAgICAgICAgICAgICBjb2xvcjogWydyZ2IoMCwgMTUwLCAxMzYpJywgJ3JnYigxOTEsIDE5MSwgMTkxKSddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJzQyJScsXG4gICAgICAgICAgICAgICAgdGl0bGVPZmZzZXQ6IC0xMCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IHsgYm90dG9tOiAtODAsIGxlZnQ6IC0yMCwgcmlnaHQ6IC0yMCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdNZXNzYWdlc0NvbnRyb2xsZXInLCBbXG4gICAgICAnbWVzc2FnZXNTZXJ2aWNlJyxcbiAgICAgIE1lc3NhZ2VzQ29udHJvbGxlclxuICAgIF0pO1xuXG4gIGZ1bmN0aW9uIE1lc3NhZ2VzQ29udHJvbGxlcihtZXNzYWdlc1NlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubWVzc2FnZXMgPSBbXTtcblxuICAgIG1lc3NhZ2VzU2VydmljZVxuICAgICAgLmxvYWRBbGxJdGVtcygpXG4gICAgICAudGhlbihmdW5jdGlvbihtZXNzYWdlcykge1xuICAgICAgICB2bS5tZXNzYWdlcyA9IFtdLmNvbmNhdChtZXNzYWdlcyk7XG4gICAgICB9KTtcbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZXJmb3JtYW5jZUNvbnRyb2xsZXInLCBbXG4gICAgICAgICAgICAncGVyZm9ybWFuY2VTZXJ2aWNlJywgJyRxJyxcbiAgICAgICAgICAgIFBlcmZvcm1hbmNlQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFBlcmZvcm1hbmNlQ29udHJvbGxlcihwZXJmb3JtYW5jZVNlcnZpY2UsICRxKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY2hhcnRPcHRpb25zID0ge1xuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RhY2tlZEFyZWFDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB7IGxlZnQ6IC0xNSwgcmlnaHQ6IC0xNSB9LFxuICAgICAgICAgICAgICAgIHg6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkWzBdIH0sXG4gICAgICAgICAgICAgICAgeTogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMV0gfSxcbiAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ092ZXIgOUsnLFxuICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd1hBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogWydyZ2IoMCwgMTUwLCAxMzYpJywgJ3JnYigyMDQsIDIwMywgMjAzKScsICdyZ2IoMTQ5LCAxNDksIDE0OSknLCAncmdiKDQ0LCA0NCwgNDQpJ10sXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogeyBjb250ZW50R2VuZXJhdG9yOiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gJzxkaXYgY2xhc3M9XCJjdXN0b20tdG9vbHRpcFwiPicgKyBkLnBvaW50LnkgKyAnJTwvZGl2PicgKyAnPGRpdiBjbGFzcz1cImN1c3RvbS10b29sdGlwXCI+JyArIGQuc2VyaWVzWzBdLmtleSArICc8L2Rpdj4nIH0gfSxcbiAgICAgICAgICAgICAgICBzaG93Q29udHJvbHM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ucGVyZm9ybWFuY2VDaGFydERhdGEgPSBbXTtcbiAgICAgICAgdm0ucGVyZm9ybWFuY2VQZXJpb2QgPSAnd2Vlayc7XG4gICAgICAgIHZtLmNoYW5nZVBlcmlvZCA9IGNoYW5nZVBlcmlvZDtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJpZXMgPSBbbG9hZERhdGEoKV07XG4gICAgICAgICAgICAkcS5hbGwocXVlcmllcyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWREYXRhKCkge1xuICAgICAgICAgICAgdm0ucGVyZm9ybWFuY2VDaGFydERhdGEgPSBwZXJmb3JtYW5jZVNlcnZpY2UuZ2V0UGVyZm9ybWFuY2VEYXRhKHZtLnBlcmZvcm1hbmNlUGVyaW9kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVBlcmlvZCgpIHtcbiAgICAgICAgICAgIGxvYWREYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgW1xuICAgICAgUHJvZmlsZUNvbnRyb2xsZXJcbiAgICBdKTtcblxuICBmdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcigpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udXNlciA9IHtcbiAgICAgIHRpdGxlOiAnQWRtaW4nLFxuICAgICAgZW1haWw6ICdjb250YWN0QGZsYXRsb2dpYy5jb20nLFxuICAgICAgZmlyc3ROYW1lOiAnJyxcbiAgICAgIGxhc3ROYW1lOiAnJyAsXG4gICAgICBjb21wYW55OiAnRmxhdExvZ2ljIEluYy4nICxcbiAgICAgIGFkZHJlc3M6ICdGYWJyaXRzaXVzYSBzdHIsIDQnICxcbiAgICAgIGNpdHk6ICdNaW5zaycgLFxuICAgICAgc3RhdGU6ICcnICxcbiAgICAgIGJpb2dyYXBoeTogJ1dlIGFyZSB5b3VuZyBhbmQgYW1iaXRpb3VzIGZ1bGwgc2VydmljZSBkZXNpZ24gYW5kIHRlY2hub2xvZ3kgY29tcGFueS4gJyArXG4gICAgICAnT3VyIGZvY3VzIGlzIEphdmFTY3JpcHQgZGV2ZWxvcG1lbnQgYW5kIFVzZXIgSW50ZXJmYWNlIGRlc2lnbi4nLFxuICAgICAgcG9zdGFsQ29kZSA6ICcyMjAwMDcnXG4gICAgfTtcbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnJHEnLCAnY291bnRyaWVzU2VydmljZScsXG4gICAgICBTZWFyY2hDb250cm9sbGVyXG4gICAgXSk7XG5cbiAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkdGltZW91dCwgJHEsIGNvdW50cmllc1NlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0uY291bnRyaWVzID0gY291bnRyaWVzU2VydmljZS5sb2FkQWxsKCk7XG4gICAgdm0uc2VsZWN0ZWRDb3VudHJ5ID0gbnVsbDtcbiAgICB2bS5zZWFyY2hUZXh0ID0gbnVsbDtcbiAgICB2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuICAgIHZtLmRpc2FibGVDYWNoaW5nID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoIChxdWVyeSkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBxdWVyeSA/IHZtLmNvdW50cmllcy5maWx0ZXIoIGNyZWF0ZUZpbHRlckZvcihxdWVyeSkgKSA6IFtdLFxuICAgICAgICBkZWZlcnJlZDtcbiAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVmZXJyZWQucmVzb2x2ZSggcmVzdWx0cyApOyB9LCBNYXRoLnJhbmRvbSgpICogMTAwMCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSB7XG4gICAgICB2YXIgbG93ZXJjYXNlUXVlcnkgPSBhbmd1bGFyLmxvd2VyY2FzZShxdWVyeSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gZmlsdGVyRm4oc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIChzdGF0ZS52YWx1ZS5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSA9PT0gMCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdUYWJsZUNvbnRyb2xsZXInLCBbXG4gICAgICAndGFibGVTZXJ2aWNlJyxcbiAgICAgIFRhYmxlQ29udHJvbGxlclxuICAgIF0pO1xuXG4gIGZ1bmN0aW9uIFRhYmxlQ29udHJvbGxlcih0YWJsZVNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udGFibGVEYXRhID0gW107XG5cbiAgICB0YWJsZVNlcnZpY2VcbiAgICAgIC5sb2FkQWxsSXRlbXMoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24odGFibGVEYXRhKSB7XG4gICAgICAgIHZtLnRhYmxlRGF0YSA9IFtdLmNvbmNhdCh0YWJsZURhdGEpO1xuICAgICAgfSk7XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignVG9kb0NvbnRyb2xsZXInLCBbXG4gICAgICAgICAgICAndG9kb0xpc3RTZXJ2aWNlJyxcbiAgICAgICAgICAgIFRvZG9Db250cm9sbGVyXG4gICAgICAgIF0pO1xuXG4gICAgZnVuY3Rpb24gVG9kb0NvbnRyb2xsZXIodG9kb0xpc3RTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uYWRkVG9kbyA9IGFkZFRvZG87XG4gICAgICAgIHZtLnJlbWFpbmluZyA9IHJlbWFpbmluZztcbiAgICAgICAgdm0uYXJjaGl2ZSA9IGFyY2hpdmU7XG4gICAgICAgIHZtLnRvZ2dsZUFsbCA9IHRvZ2dsZUFsbDtcbiAgICAgICAgdm0udG9kb3MgPSBbXTtcblxuICAgICAgICB0b2RvTGlzdFNlcnZpY2VcbiAgICAgICAgICAgIC5sb2FkQWxsSXRlbXMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHRvZG9zKSB7XG4gICAgICAgICAgICAgICAgdm0udG9kb3MgPSBbXS5jb25jYXQodG9kb3MpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkVG9kbygpIHtcbiAgICAgICAgICAgIHZtLnRvZG9zLnB1c2goe3RleHQ6IHZtLnRvZG9UZXh0LCBkb25lOiBmYWxzZX0pO1xuICAgICAgICAgICAgdm0udG9kb1RleHQgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbWFpbmluZygpIHtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udG9kb3MsIGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgY291bnQgKz0gdG9kby5kb25lID8gMCA6IDE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFyY2hpdmUoZSkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBmcm9tIHN1Ym1pdHRpbmdcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBvbGRUb2RvcyA9IHZtLnRvZG9zO1xuICAgICAgICAgICAgdm0udG9kb3MgPSBbXTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChvbGRUb2RvcywgZnVuY3Rpb24gKHRvZG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRvZG8uZG9uZSkgdm0udG9kb3MucHVzaCh0b2RvKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlQWxsKCkge1xuICAgICAgICAgICAgaWYgKHJlbWFpbmluZygpID09IDApIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udG9kb3MsIGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZG8uZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udG9kb3MsIGZ1bmN0aW9uICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZG8uZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc2FnZUNvbnRyb2xsZXInLCBbXG4gICAgICAgICAgICBVc2FnZUNvbnRyb2xsZXJcbiAgICAgICAgXSk7XG5cbiAgICBmdW5jdGlvbiBVc2FnZUNvbnRyb2xsZXIoKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLy8gVE9ETzogbW92ZSBkYXRhIHRvIHRoZSBzZXJ2aWNlXG4gICAgICAgIHZtLnJhbUNoYXJ0RGF0YSA9IFt7a2V5OiAnTWVtb3J5JywgeTogNzY4NjYwfSwgeyBrZXk6ICdDYWNoZScsIHk6IDM2NzQwNH0sIHtrZXk6ICdTd2FwJywgeTogNDE5MjQgfV07XG4gICAgICAgIHZtLnN0b3JhZ2VDaGFydERhdGEgPSBbe2tleTogJ1N5c3RlbScsIHk6IDEyNjU2MH0sIHtrZXk6ICdPdGhlcicsIHk6IDIyNDM2NSB9XTtcblxuICAgICAgICB2bS5jaGFydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMzAsXG4gICAgICAgICAgICAgICAgZG9udXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgdmFsdWVGb3JtYXQ6IChkMy5mb3JtYXQoXCIuMGZcIikpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBbJ3JnYigwLCAxNTAsIDEzNiknLCAnI0U3NTc1MycsICdyZ2IoMjM1LCAyMzUsIDIzNSknXSxcbiAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJzgzJScsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB7IHRvcDogLTEwLCBsZWZ0OiAtMjAsIHJpZ2h0OiAtMjAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Zpc2l0b3JzQ29udHJvbGxlcicsIFtcbiAgICAgICAgICAgIFZpc2l0b3JzQ29udHJvbGxlclxuICAgICAgICBdKTtcblxuICAgIGZ1bmN0aW9uIFZpc2l0b3JzQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGRhdGEgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgdm0udmlzaXRvcnNDaGFydERhdGEgPSBbIHtrZXk6ICdNb2JpbGUnLCB5OiA1MjY0fSwgeyBrZXk6ICdEZXNrdG9wJywgeTogMzg3Mn0gXTtcblxuICAgICAgICB2bS5jaGFydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWVDaGFydCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMTAsXG4gICAgICAgICAgICAgICAgZG9udXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnk7IH0sXG4gICAgICAgICAgICAgICAgdmFsdWVGb3JtYXQ6IChkMy5mb3JtYXQoXCIuMGZcIikpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBbJ3JnYigwLCAxNTAsIDEzNiknLCAnI0U3NTc1MyddLFxuICAgICAgICAgICAgICAgIHNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT3ZlciA5SycsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB7IHRvcDogLTEwIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdXYXJuaW5nc0NvbnRyb2xsZXInLCBbXG4gICAgICAgICAgICBXYXJuaW5nc0NvbnRyb2xsZXJcbiAgICAgICAgXSk7XG5cbiAgICBmdW5jdGlvbiBXYXJuaW5nc0NvbnRyb2xsZXIoKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLy8gVE9ETzogbW92ZSBkYXRhIHRvIHRoZSBzZXJ2aWNlXG4gICAgICAgIHZtLndhcm5pbmdzQ2hhcnREYXRhID0gd2FybmluZ0Z1bmN0aW9uO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdhcm5pbmdGdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzaW4gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaW4ucHVzaCh7eDogaSwgeTogTWF0aC5hYnMoTWF0aC5jb3MoaS8xMCkgKjAuMjUqaSArIDAuOSAtIDAuNCppKX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFsgeyB2YWx1ZXM6IHNpbiwgY29sb3I6ICdyZ2IoMCwgMTUwLCAxMzYpJywgYXJlYTogdHJ1ZSB9IF07XG4gICAgICAgIH1cblxuICAgICAgICB2bS5jaGFydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lQ2hhcnQnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjEwLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogeyB0b3A6IC0xMCwgbGVmdDogLTIwLCByaWdodDogLTIwIH0sXG4gICAgICAgICAgICAgICAgeDogZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQueCB9LFxuICAgICAgICAgICAgICAgIHk6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnkgfSxcbiAgICAgICAgICAgICAgICBzaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ092ZXIgOUsnLFxuICAgICAgICAgICAgICAgIHNob3dZQXhpczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd1hBeGlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0b29sdGlwOiB7IGNvbnRlbnRHZW5lcmF0b3I6IGZ1bmN0aW9uIChkKSB7IHJldHVybiAnPHNwYW4gY2xhc3M9XCJjdXN0b20tdG9vbHRpcFwiPicgKyBNYXRoLnJvdW5kKGQucG9pbnQueSkgKyAnPC9zcGFuPicgfSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGNvbnRyb2xsZXJJZCA9ICdzaWRlYmFyJztcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29udHJvbGxlcihjb250cm9sbGVySWQsXG4gICAgICAgIFsnJHJvdXRlJywgJ3JvdXRlcycsIHNpZGViYXJdKTtcblxuICAgIGZ1bmN0aW9uIHNpZGViYXIoJHJvdXRlLCByb3V0ZXMpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5pc0N1cnJlbnQgPSBpc0N1cnJlbnQ7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHsgZ2V0TmF2Um91dGVzKCk7IH1cblxuICAgICAgICBmdW5jdGlvbiBnZXROYXZSb3V0ZXMoKSB7XG4gICAgICAgICAgICB2bS5uYXZSb3V0ZXMgPSByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5jb25maWcuc2V0dGluZ3MgJiYgci5jb25maWcuc2V0dGluZ3MubmF2O1xuICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbihyMSwgcjIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjEuY29uZmlnLnNldHRpbmdzLm5hdiAtIHIyLmNvbmZpZy5zZXR0aW5ncy5uYXY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQ3VycmVudChyb3V0ZSkge1xuICAgICAgICAgICAgaWYgKCFyb3V0ZS5jb25maWcudGl0bGUgfHwgISRyb3V0ZS5jdXJyZW50IHx8ICEkcm91dGUuY3VycmVudC50aXRsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtZW51TmFtZSA9IHJvdXRlLmNvbmZpZy50aXRsZTtcbiAgICAgICAgICAgIHJldHVybiAkcm91dGUuY3VycmVudC50aXRsZS5zdWJzdHIoMCwgbWVudU5hbWUubGVuZ3RoKSA9PT0gbWVudU5hbWUgPyAnY3VycmVudCcgOiAnJztcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnZpZXcxJywgWyduZ1JvdXRlJ10pXG5cbi5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy92aWV3MScsIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3ZpZXcxL3ZpZXcxLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdWaWV3MUN0cmwnXG4gIH0pO1xufV0pXG5cbi5jb250cm9sbGVyKCdWaWV3MUN0cmwnLCBbZnVuY3Rpb24oKSB7XG5cbn1dKTsiLCIndXNlIHN0cmljdCc7XG5cbmRlc2NyaWJlKCdhcHAudmlldzEgbW9kdWxlJywgZnVuY3Rpb24oKSB7XG5cbiAgYmVmb3JlRWFjaChtb2R1bGUoJ2FwcC52aWV3MScpKTtcblxuICBkZXNjcmliZSgndmlldzEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCl7XG5cbiAgICBpdCgnc2hvdWxkIC4uLi4nLCBpbmplY3QoZnVuY3Rpb24oJGNvbnRyb2xsZXIpIHtcbiAgICAgIC8vc3BlYyBib2R5XG4gICAgICB2YXIgdmlldzFDdHJsID0gJGNvbnRyb2xsZXIoJ1ZpZXcxQ3RybCcpO1xuICAgICAgZXhwZWN0KHZpZXcxQ3RybCkudG9CZURlZmluZWQoKTtcbiAgICB9KSk7XG5cbiAgfSk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAudmlldzInLCBbJ25nUm91dGUnXSlcblxuLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3ZpZXcyJywge1xuICAgIHRlbXBsYXRlVXJsOiAndmlldzIvdmlldzIuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ1ZpZXcyQ3RybCdcbiAgfSk7XG59XSlcblxuLmNvbnRyb2xsZXIoJ1ZpZXcyQ3RybCcsIFtmdW5jdGlvbigpIHtcblxufV0pOyIsIid1c2Ugc3RyaWN0JztcblxuZGVzY3JpYmUoJ2FwcC52aWV3MiBtb2R1bGUnLCBmdW5jdGlvbigpIHtcblxuICBiZWZvcmVFYWNoKG1vZHVsZSgnYXBwLnZpZXcyJykpO1xuXG4gIGRlc2NyaWJlKCd2aWV3MiBjb250cm9sbGVyJywgZnVuY3Rpb24oKXtcblxuICAgIGl0KCdzaG91bGQgLi4uLicsIGluamVjdChmdW5jdGlvbigkY29udHJvbGxlcikge1xuICAgICAgLy9zcGVjIGJvZHlcbiAgICAgIHZhciB2aWV3MkN0cmwgPSAkY29udHJvbGxlcignVmlldzJDdHJsJyk7XG4gICAgICBleHBlY3QodmlldzJDdHJsKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pKTtcblxuICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
