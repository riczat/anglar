(function(routes){
  "use strict";

	angular.module('app.routes').config(function($stateProvider, $urlRouterProvider){

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

	});
})();
