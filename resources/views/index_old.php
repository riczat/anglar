<!DOCTYPE html>
<html data-ng-app="app">
<head>
    <style>
        /* This helps the ng-show/ng-hide animations start at the right place. */
        /* Since Angular has this but needs to load, this gives us the class early. */
        .ng-hide {
            display: none!important;
        }
    </style>
<!--
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
-->
<!--[if lt IE 7]>      <html lang="en" ng-app="app" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en" ng-app="app" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" ng-app="app" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<!--<![endif]-->

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>My AngularJS App</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>


  <!-- 1. Load libraries -->
   <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
   <script src="bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js"></script>
   <script src="bulid/js/app.js"></script>
   <script src="bulid/js/partial.js"></script>
   <script src="bulid/js/vendor.js"></script>
   <script src="bulid/js/components/version/version.js"></script>
   <script src="bulid/js/components/version/version-directive.js"></script>
   <script src="bulid/js/components/version/interpolate-filter.js"></script>


     <script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
     <script src="node_modules/angular2/bundles/angular2.dev.js"></script>
     <script src="node_modules/systemjs/dist/system.src.js"></script>
     <script src="node_modules/rxjs/bundles/Rx.js"></script>

     <link href="{{ asset('bulid//css/app.css') }}" rel="stylesheet">

    <link rel="stylesheet" href="{!! asset('bulid/css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! asset('bulid/css/app.css') !!}">
    <!-- 2. Configure SystemJS -->

  </head>
  <body>
    <div ng-view></div>

    <ul class="menu">
      <li><a href="#/views/view1">view1</a></li>
      <li><a href="#/views/view2">view2</a></li>
    </ul>

<div ui-view="header"></div>
<div ui-view="main"></div>
<div ui-view="footer"></div>
    <div>
        <div data-ng-include="'bulid/views/layout/shell.html'"></div>
        <div id="splash-page" data-ng-show="false">
            <div class="page-splash">
                <div class="page-splash-message">
                    Grunt and Gulp with Angular
                </div>
                <div class="progress progress-striped active page-progress-bar">
                    <div class="bar"></div>
                </div>
            </div>
        </div>
    </div>

    <span data-cc-scroll-to-top></span>

    <!-- Vendor Scripts -->
    <script src="scripts/jquery-2.0.3.js"></script>
    <script src="scripts/angular.js"></script>
    <script src="scripts/angular-animate.js"></script>
    <script src="scripts/angular-route.js"></script>
    <script src="scripts/angular-sanitize.js"></script>
    <script src="scripts/bootstrap.js"></script>
    <script src="scripts/toastr.js"></script>
    <script src="scripts/moment.js"></script>
    <script src="scripts/ui-bootstrap-tpls-0.10.0.js"></script>
    <script src="scripts/spin.js"></script>

    <!-- Bootstrapping -->
    <script src="bulid/js/app.js"></script>
    <script src="app/config.js"></script>
    <script src="app/config.exceptionHandler.js"></script>
    <script src="app/config.route.js"></script>

    <!-- common Modules -->
    <script src="app/common/common.js"></script>
    <script src="app/common/logger.js"></script>
    <script src="app/common/spinner.js"></script>

    <!-- common.bootstrap Modules -->
    <script src="app/common/bootstrap/bootstrap.dialog.js"></script>

    <!-- app -->
    <script src="build/views/avengers.js"></script>
    <script src="build/views/dashboard.js"></script>
    <script src="build/views/shell.js"></script>
    <script src="build/views/sidebar.js"></script>

    <!-- app Services -->
    <script src="build/views/datacontext.js"></script>
    <script src="build/views/directives.js"></script>

<script src="{!! asset('bulid/js/vendor.js') !!}"></script>
<script src="{!! asset('bulid/js/partials.js') !!}"></script>
<script src="{!! asset('bulid/js/app.js') !!}"></script>


</body>
</html>
