<!doctype html>
<html ng-app="app">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <script src="bower_components/angular/angular.js"></script>
      <script src="bower_components/angular-animate/angular-animate.js"></script>
      <script src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
      <script src="bower_components/angular-strap/dist/angular-strap.tpl.min.js"></script>
      <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
      <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
 
     <script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
     <script src="node_modules/systemjs/dist/system.src.js"></script>
     <script src="node_modules/rxjs/bundles/Rx.js"></script>
     <script src="node_modules/angular2/bundles/angular2.dev.js"></script>
 <script>
   System.config({
     packages: {        
       app: {
         format: 'register',
         defaultExtension: 'js'
       }
     }
   });
   System.import('angular/app/boot')
         .then(null, console.error.bind(console));
 </script>
    <link rel="stylesheet" type="text/css" href="bower_components/semantic/dist/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="bower_components/semantic/dist/semantic.css">
    
    <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! asset('css/app.css') !!}">
    <link rel="stylesheet" 
    
        <title>anglar material</title>
    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
</head>
<body layout="row">
<div ui-view="header" class="Page"></div>

<!-- Sidenav component -->
<md-sidenav
        class="Sidebar md-sidenav-left md-whiteframe-z2"
        md-component-id="left"
        md-is-locked-open="$mdMedia('gt-md')"
        tabindex="-1">

    <!-- Sidebar header/branding -->
    <md-toolbar class="Sidebar-header">
        <h1 class="md-toolbar-tools Sidebar-title">Laravel 5 angular<br>material starter</h1>
        <h6 class="Sidebar-version">
            <a target="_blank" href="https://github.com/jadjoubran/laravel5-angular-material-starter/releases">version 3 - alpha</a>
        </h6>
    </md-toolbar>

    <!-- Sidebar menu items -->
    <md-content
            class="Sidebar-pages md-default-theme"
            ui-view="sidebar"
            ng-controller="SidebarCtrl">
    </md-content>
</md-sidenav>

<div flex role="main" layout="column" tabindex="-1">
    <md-toolbar class="Header md-accent md-whiteframe-z1" layout="column">
        <div ui-view="header" ng-controller="HeaderCtrl"></div>
    </md-toolbar>
    <md-content layout="column" flex md-scroll-y>
        <div ui-view="main" class="Page"></div>
    </md-content>
</div>
<div ui-view="footer" class="Page"></div>

<script src="{!! asset('js/vendor.js') !!}"></script>
<script src="{!! asset('js/app.js') !!}"></script>
<script src="//cdn.jsdelivr.net/g/prism@1.3.0(prism.js+components/prism-css.min.js+components/prism-php.min.js+components/prism-bash.min.js+components/prism-javascript.min.js+components/prism-markup.min.js+plugins/show-language/prism-show-language.min.js)"></script>

{{--livereload--}}
@if ( env('APP_ENV') === 'local' )
    <script type="text/javascript">
        document.write('<script src="'+ location.protocol + '//' + (location.host || 'localhost') +':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
    </script>
@endif
</body>
</html>
