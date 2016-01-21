(function (){
	"use strict";

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
})();
