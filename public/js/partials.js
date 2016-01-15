(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/index-async.html',
    '<!doctype html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <link rel="stylesheet" href="bower_components/html5-boilerplate/css/normalize.css">\n' +
    '  <link rel="stylesheet" href="bower_components/html5-boilerplate/css/main.css">\n' +
    '  <style>\n' +
    '    [ng-cloak] {\n' +
    '      display: none;\n' +
    '    }\n' +
    '  </style>\n' +
    '  <script src="bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js"></script>\n' +
    '  <script>\n' +
    '    // include angular loader, which allows the files to load in any order\n' +
    '    //@@NG_LOADER_START@@\n' +
    '    // You need to run `npm run update-index-async` to inject the angular async code here\n' +
    '    //@@NG_LOADER_END@@\n' +
    '\n' +
    '    // include a third-party async loader library\n' +
    '    /*!\n' +
    '     * $script.js v1.3\n' +
    '     * https://github.com/ded/script.js\n' +
    '     * Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011\n' +
    '     * Follow our software http://twitter.com/dedfat\n' +
    '     * License: MIT\n' +
    '     */\n' +
    '    !function(a,b,c){function t(a,c){var e=b.createElement("script"),f=j;e.onload=e.onerror=e[o]=function(){e[m]&&!/^c|loade/.test(e[m])||f||(e.onload=e[o]=null,f=1,c())},e.async=1,e.src=a,d.insertBefore(e,d.firstChild)}function q(a,b){p(a,function(a){return!b(a)})}var d=b.getElementsByTagName("head")[0],e={},f={},g={},h={},i="string",j=!1,k="push",l="DOMContentLoaded",m="readyState",n="addEventListener",o="onreadystatechange",p=function(a,b){for(var c=0,d=a.length;c<d;++c)if(!b(a[c]))return j;return 1};!b[m]&&b[n]&&(b[n](l,function r(){b.removeEventListener(l,r,j),b[m]="complete"},j),b[m]="loading");var s=function(a,b,d){function o(){if(!--m){e[l]=1,j&&j();for(var a in g)p(a.split("|"),n)&&!q(g[a],n)&&(g[a]=[])}}function n(a){return a.call?a():e[a]}a=a[k]?a:[a];var i=b&&b.call,j=i?b:d,l=i?a.join(""):b,m=a.length;c(function(){q(a,function(a){h[a]?(l&&(f[l]=1),o()):(h[a]=1,l&&(f[l]=1),t(s.path?s.path+a+".js":a,o))})},0);return s};s.get=t,s.ready=function(a,b,c){a=a[k]?a:[a];var d=[];!q(a,function(a){e[a]||d[k](a)})&&p(a,function(a){return e[a]})?b():!function(a){g[a]=g[a]||[],g[a][k](b),c&&c(d)}(a.join("|"));return s};var u=a.$script;s.noConflict=function(){a.$script=u;return this},typeof module!="undefined"&&module.exports?module.exports=s:a.$script=s}(this,document,setTimeout)\n' +
    '\n' +
    '    // load all of the dependencies asynchronously.\n' +
    '    $script([\n' +
    '      \'bower_components/angular/angular.js\',\n' +
    '      \'bower_components/angular-route/angular-route.js\',\n' +
    '      \'app.js\',\n' +
    '      \'view1/view1.js\',\n' +
    '      \'view2/view2.js\',\n' +
    '      \'components/version/version.js\',\n' +
    '      \'components/version/version-directive.js\',\n' +
    '      \'components/version/interpolate-filter.js\'\n' +
    '    ], function() {\n' +
    '      // when all is done, execute bootstrap angular application\n' +
    '      angular.bootstrap(document, [\'myApp\']);\n' +
    '    });\n' +
    '  </script>\n' +
    '  <title>My AngularJS App</title>\n' +
    '  <link rel="stylesheet" href="app.css">\n' +
    '</head>\n' +
    '<body ng-cloak>\n' +
    '  <ul class="menu">\n' +
    '    <li><a href="#/view1">view1</a></li>\n' +
    '    <li><a href="#/view2">view2</a></li>\n' +
    '  </ul>\n' +
    '\n' +
    '  <div ng-view></div>\n' +
    '\n' +
    '  <div>Angular seed app: v<span app-version></span></div>\n' +
    '\n' +
    '</body>\n' +
    '</html>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/index.html',
    '<!DOCTYPE html>\n' +
    '\n' +
    '<!--\n' +
    'Copyright 2016 Google Inc. All Rights Reserved.\n' +
    'Use of this source code is governed by an MIT-style license that\n' +
    'can be found in the LICENSE file at http://angular.io/license\n' +
    '-->\n' +
    '<!--[if lt IE 7]>      <html lang="en" ng-app="myApp" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->\n' +
    '<!--[if IE 7]>         <html lang="en" ng-app="myApp" class="no-js lt-ie9 lt-ie8"> <![endif]-->\n' +
    '<!--[if IE 8]>         <html lang="en" ng-app="myApp" class="no-js lt-ie9"> <![endif]-->\n' +
    '<!--[if gt IE 8]><!-->\n' +
    '<!--<![endif]-->\n' +
    '\n' +
    '<html lang="en" ng-app="app" class="no-js">\n' +
    '<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
    '  <title>My AngularJS App</title>\n' +
    '  <meta name="description" content="">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '  <link rel="stylesheet" href="bower_components/html5-boilerplate/dist/css/normalize.css">\n' +
    '  <link rel="stylesheet" href="bower_components/html5-boilerplate/dist/css/main.css">\n' +
    '  <link rel="stylesheet" href="app.css">\n' +
    '\n' +
    '	 <!-- 1. Load libraries -->\n' +
    '    <script type="text/javascript" src="bundle.js" charset="utf-8"></script>\n' +
    '	  <script src="bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js"></script>\n' +
    '    <script src="https://code.angularjs.org/2.0.0-beta.0/angular2-polyfills.js"></script>\n' +
    '    <script src="https://code.angularjs.org/tools/system.js"></script>\n' +
    '    <script src="https://code.angularjs.org/tools/typescript.js"></script>\n' +
    '    <script src="https://code.angularjs.org/2.0.0-beta.0/Rx.js"></script>\n' +
    '    <script src="https://code.angularjs.org/2.0.0-beta.0/angular2.dev.js"></script>\n' +
    '    <script src="js/app.js"></script>\n' +
    '    <script src="js/partial.js"></script>\n' +
    '    <script src="js/vendor.js"></script>\n' +
    '    <script src="js/components/version/version.js"></script>\n' +
    '    <script src="js/components/version/version-directive.js"></script>\n' +
    '    <script src="js/components/version/interpolate-filter.js"></script>\n' +
    '\n' +
    '    <!-- 2. Configure SystemJS -->\n' +
    '    <script>\n' +
    '      System.config({\n' +
    '        transpiler: \'typescript\',\n' +
    '        typescriptOptions: { emitDecoratorMetadata: true },\n' +
    '        packages: {\'app\': {defaultExtension: \'ts\'}}\n' +
    '      });\n' +
    '      System.import(\'app/boot\')\n' +
    '            .then(null, console.error.bind(console));\n' +
    '    </script>\n' +
    '\n' +
    '  </head>\n' +
    '\n' +
    '  <!-- 3. Display the application -->\n' +
    '\n' +
    '\n' +
    '\n' +
    '<body>\n' +
    '  <div ng-view></div>\n' +
    '\n' +
    '  <ul class="menu">\n' +
    '    <li><a href="#/views/view1">view1</a></li>\n' +
    '    <li><a href="#/views/view2">view2</a></li>\n' +
    '  </ul>\n' +
    '\n' +
    '\n' +
    '\n' +
    '  <my-app>Loading...</my-app>\n' +
    '\n' +
    '  <div>Angular seed app: v<span app-version></span></div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '</body>\n' +
    '</html>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/avengers/avengers.html',
    '<section class="mainbar" data-ng-controller="avengers as vm">\n' +
    '    <section class="matter">\n' +
    '        <div class="container">\n' +
    '            <div class="row">\n' +
    '                <div class="widget wblue">\n' +
    '                    <div data-cc-widget-header title="{{vm.title}}"></div>\n' +
    '                    <div class="widget-content user">\n' +
    '                        <!--<pre>{{vm.maa.data | json}}</pre>-->\n' +
    '                        <input data-ng-model="vm.filter.name" placeholder="Find Avengers by name"/>\n' +
    '                        <table class="table table-condensed table-striped">\n' +
    '                            <thead>\n' +
    '                            <tr>\n' +
    '                                <th></th>\n' +
    '                                <th>Character</th>\n' +
    '                                <th>Description</th>\n' +
    '                            </tr>\n' +
    '                            </thead>\n' +
    '                            <tbody>\n' +
    '                            <tr data-ng-repeat="c in vm.maa | filter:vm.filter track by c.id">\n' +
    '                                <td><img\n' +
    '                                        ng-src="{{c.thumbnail.path}}.{{c.thumbnail.extension}}"\n' +
    '                                        class="avenger-thumb img-rounded"/></td>\n' +
    '                                <td><span class="avenger-name">{{c.name}}</span></td>\n' +
    '                                <td>{{c.description | limitTo: 2000 }} ...</td>\n' +
    '                            </tr>\n' +
    '                            </tbody>\n' +
    '                        </table>\n' +
    '                    </div>\n' +
    '                    <div class="widget-foot">\n' +
    '                        <div class="clearfix"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</section>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/dashboard/dashboard.html',
    '<section id="dashboard-view" class="mainbar" data-ng-controller="dashboard as vm">\n' +
    '    <section class="matter">\n' +
    '        <div class="container">\n' +
    '            <div class="row">\n' +
    '                <div class="col-md-12">\n' +
    '                    <ul class="today-datas">\n' +
    '                        <li class="blightblue">\n' +
    '                            <div class="pull-left"><i class="fa fa-plane"></i></div>\n' +
    '                            <div class="datas-text pull-right">\n' +
    '                                <span class="bold">Stark Tower</span> New York, New York\n' +
    '                            </div>\n' +
    '                            <div class="clearfix"></div>\n' +
    '                        </li>\n' +
    '\n' +
    '                        <li class="bblue">\n' +
    '                            <div class="pull-left avenger-logo"></div>\n' +
    '                            <div class="datas-text pull-right">\n' +
    '                                <span class="bold">{{vm.avengerCount}}</span> Cast\n' +
    '                            </div>\n' +
    '                            <div class="clearfix"></div>\n' +
    '                        </li>\n' +
    '\n' +
    '                    </ul>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="row">\n' +
    '                <div class="col-md-6">\n' +
    '                    <div class="widget wblue">\n' +
    '                        <div data-cc-widget-header title="Avengers Movie Cast"\n' +
    '                             allow-collapse="true"></div>\n' +
    '                        <div class="widget-content text-center text-info">\n' +
    '                            <table class="table table-condensed table-striped">\n' +
    '                                <thead>\n' +
    '                                    <tr>\n' +
    '                                        <th>Name</th>\n' +
    '                                        <th>Character</th>\n' +
    '                                    </tr>\n' +
    '                                </thead>\n' +
    '                                <tbody>\n' +
    '                                    <tr data-ng-repeat="a in vm.avengers">\n' +
    '                                        <td>{{a.name}}</td>\n' +
    '                                        <td>{{a.character}}</td>\n' +
    '                                    </tr>\n' +
    '                                </tbody>\n' +
    '                            </table>\n' +
    '                        </div>\n' +
    '                        <div class="widget-foot">\n' +
    '                            <div class="clearfix"></div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="col-md-6">\n' +
    '                    <div class="widget wlightblue">\n' +
    '                        <div data-cc-widget-header title="{{vm.news.title}}"\n' +
    '                             allow-collapse="true"></div>\n' +
    '                        <div class="widget-content text-center text-info">\n' +
    '                            <small>{{vm.news.description}}</small>\n' +
    '                        </div>\n' +
    '                        <div class="widget-foot">\n' +
    '                            <div class="clearfix"></div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n' +
    '</section>');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/layout/shell.html',
    '<div data-ng-controller="shell as vm">\n' +
    '    <header class="clearfix">\n' +
    '        <div data-ng-include="\'app/layout/topnav.html\'"></div>\n' +
    '    </header>\n' +
    '    <section id="content" class="content">\n' +
    '        <div data-ng-show="vm.isBusy" class="page-splash dissolve-animation">\n' +
    '            <div data-cc-spinner="vm.spinnerOptions"></div>\n' +
    '            <div class="page-splash-message page-splash-message-subtle">{{vm.busyMessage}}</div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div data-ng-include="\'app/layout/sidebar.html\'"></div>\n' +
    '\n' +
    '        <div data-ng-view class="shuffle-animation"></div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/layout/sidebar.html',
    '<div data-cc-sidebar data-ng-controller="sidebar as vm">\n' +
    '    <div class="sidebar-filler"></div>\n' +
    '    <div class="sidebar-dropdown"><a href="#">Menu</a></div>\n' +
    '    <div class="sidebar-inner">\n' +
    '        <div class="sidebar-widget">\n' +
    '        </div>\n' +
    '        <ul class="navi">\n' +
    '            <li class="nlightblue fade-selection-animation" data-ng-class="vm.isCurrent(r)"\n' +
    '                data-ng-repeat="r in vm.navRoutes">\n' +
    '                <a href="#{{r.url}}" data-ng-bind-html="r.config.settings.content"></a>\n' +
    '            </li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/layout/topnav.html',
    '<nav class="navbar navbar-fixed-top navbar-inverse">\n' +
    '    <div class="navbar-header">\n' +
    '        <a href="/" class="navbar-brand"><span class="brand-title">{{vm.title}}</span></a>\n' +
    '        <a class="btn navbar-btn navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n' +
    '            <span class="icon-bar"></span>\n' +
    '            <span class="icon-bar"></span>\n' +
    '            <span class="icon-bar"></span>\n' +
    '        </a>\n' +
    '    </div>\n' +
    '    <div class="navbar-collapse collapse">\n' +
    '        <div class="pull-right navbar-logo">\n' +
    '            <ul class="nav navbar-nav pull-right">\n' +
    '                <li>\n' +
    '                    <a href="http://www.johnpapa.net/hottowel-angular" target="_blank">\n' +
    '                        Created by John Papa\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '                <li class="dropdown dropdown-big">\n' +
    '                    <a href="http://www.angularjs.org" target="_blank">\n' +
    '                        <img src="content/images/AngularJS-small.png" />\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</nav>');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/layout/widgetheader.html',
    '<div class="page-title pull-left">{{title}}</div>\n' +
    '<small class="page-title-subtle" data-ng-show="subtitle">({{subtitle}})</small>\n' +
    '<div class="widget-icons pull-right" data-ng-if="allowCollapse">\n' +
    '    <a data-cc-widget-minimize></a>\n' +
    '</div>\n' +
    '<small class="pull-right page-title-subtle" data-ng-show="rightText">{{rightText}}</small>\n' +
    '<div class="clearfix"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/footer/footer.html',
    '<md-content class="Page-Container Footer" ng-controller="FooterController as vm" layout-align="center center">\n' +
    '<md-icon md-svg-src="/img/icons/logo-grey.svg" class="Footer-logo"></md-icon>\n' +
    '<br/>\n' +
    '<br/>\n' +
    '<div class="Footer-text">\n' +
    '	An open source project by <a href="https://github.com/jadjoubran" class="Footer-link" target="_blank">Jad Joubran</a>.\n' +
    '	Design by <a href="https://www.linkedin.com/in/nicolesaidy" class="Footer-link" target="_blank">Nicole Saidy</a>\n' +
    '</div>\n' +
    '<div class="Footer-text">\n' +
    '	&copy; 2016 Laravel Angular Material Starter\n' +
    '</div>\n' +
    '</md-content>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/header/header.html',
    '<md-content class="Page-Container DemoHeader" ng-controller="HeaderController as vm">\n' +
    '	<div layout="row">\n' +
    '		<div flex="90" flex-offset="5" class="DemoHeader-container">\n' +
    '			<div layout="row" layout-align="space-between">\n' +
    '				<img src="img/icons/logo.svg" class="DemoHeader-logo"/>\n' +
    '				<div layout="row" layout-align="center stretch" hide-xs>\n' +
    '					<a class="DemoHeader-link md-subhead" href="https://laravel-angular.readme.io" target="_blank">Docs</a>\n' +
    '					<a class="DemoHeader-link md-subhead" href="">Screencasts</a>\n' +
    '					<a class="DemoHeader-link md-subhead" href="https://github.com/jadjoubran/laravel5-angular-material-starter" target="_blank">Github</a>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '	</div>\n' +
    '</md-content>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/landing/landing.html',
    '<div class="Page-Container Landing" ng-controller="LandingController as vm" ng-class="{\'iOS-hack\': vm.iOS}">\n' +
    '	<div layout="column" class="Landing-cover" layout-align="center center">\n' +
    '		<div class="md-headline Landing-subtitle">Build your next powerful web app</div>\n' +
    '		<h1 class="md-display-3 Landing-heading"><strong>laravel angular</strong> <span class="Landing-headingLight">material starter</span></h1>\n' +
    '		<md-button class="md-raised md-large Landing-getStarted" href="https://laravel-angular.readme.io/docs/install" target="_blank">Get Started</md-button>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="Landing-laravelAngular">\n' +
    '		<div class="Landing-ampersand" hide show-gt-sm>&amp;</div>\n' +
    '		<div layout="column" layout-gt-sm="row">\n' +
    '			<div flex="50" class="Landing-laravel" layout-align="center center">\n' +
    '				<h2 class="md-display-2 Landing-laravelAngular-title">Laravel</h2>\n' +
    '				<div class="md-title Landing-laravelAngular-subtitle">{{vm.laravel_description}}</div>\n' +
    '				<br/>\n' +
    '				<div class="DemoCode">\n' +
    '					<span class="DemoCode-operator">&lt;?php</span><br/>\n' +
    '					<br/>\n' +
    '					<span class="DemoCode-highlight">class</span> <span class="DemoCode-secondary">PostsController</span><br/>\n' +
    '					{<br/>\n' +
    '					<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;public <span class="DemoCode-secondary">function</span> <span class="DemoCode-highlight">get</span>()<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;{<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="DemoCode-secondary">$posts</span> = <span class="DemoCode-highlight">App</span>\\<span class="DemoCode-highlight">Post</span>::<span class="DemoCode-secondary">get</span>();<br/>\n' +
    '					<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="DemoCode-highlight">return</span> <span class="DemoCode-secondary">response</span>()<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt;<span class="DemoCode-secondary">success</span>(compact(<span class="DemoCode-string">\'posts\'</span>));<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>\n' +
    '					}\n' +
    '				</div>\n' +
    '			</div>\n' +
    '			<div flex="50" class="Landing-angular" layout-align="center center">\n' +
    '				<h2 class="md-display-2 Landing-laravelAngular-title">Angular</h2>\n' +
    '				<div class="md-title Landing-laravelAngular-subtitle">{{vm.angular_description}}</div>\n' +
    '				<br/>\n' +
    '				<div class="DemoCode">\n' +
    '					(<span class="DemoCode-secondary">function</span>(){<br/>\n' +
    '					<span class="DemoCode-string">"use strict"</span>;<br/><br/>\n' +
    '					<span class="DemoCode-secondary">function</span> <span class="DemoCode-highlight">LandingController</span>(API) {<br/>\n' +
    '					<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;<span class="DemoCode-highlight">this</span>.<span class="DemoCode-highlight">getPosts</span> = <span class="DemoCode-secondary">function</span>(){<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;API.all(<span class="DemoCode-string">\'posts\'</span>).get()<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.then(<span class="DemoCode-secondary">function</span>(response){<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="DemoCode-highlight">this</span>.posts = <span class="DemoCode-highlight">response.data</span>;<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br/>\n' +
    '					&nbsp;&nbsp;&nbsp;&nbsp;}<br/>\n' +
    '					<br/>\n' +
    '					})();\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="Landing-features" layout-align="center center">\n' +
    '		<h1 class="md-display-2 Landing-featuresMainTitle">Laravel Angular Material Starter</h1>\n' +
    '		<div class="md-title Landing-featuresMainDescription">\n' +
    '			The right features to get you started\n' +
    '		</div>\n' +
    '		<br/>\n' +
    '		<div>\n' +
    '			<div layout="column" layout-gt-sm="row" layout-align="space-between">\n' +
    '				<div flex="100" flex-gt-sm="33">\n' +
    '					<div class="Landing-featuresEntry Landing-featuresEntry--restful">\n' +
    '						<md-icon md-svg-src="/img/icons/restful-api.svg" class="Landing-featuresEntry-icon"></md-icon>\n' +
    '					</div>\n' +
    '					<div class="md-headline Landing-featuresTitle">RESTful API</div>\n' +
    '					<div class="md-subhead Landing-featuresDescription">Build consistent REST APIs and call them fluently using JavaScript, without having to worry about validation errors</div>\n' +
    '				</div>\n' +
    '				<div flex="33">\n' +
    '					<div class="Landing-featuresEntry Landing-featuresEntry--jwt">\n' +
    '						<md-icon md-svg-src="/img/icons/json-webtoken.svg" class="Landing-featuresEntry-icon"></md-icon>\n' +
    '					</div>\n' +
    '					<div class="md-headline Landing-featuresTitle">Json Web Token Authentication</div>\n' +
    '					<div class="md-subhead Landing-featuresDescription">Get an out-of-the-box JWT Authentication in your app that allows you to authenticate users on the fly</div>\n' +
    '				</div>\n' +
    '				<div flex="33">\n' +
    '					<div class="Landing-featuresEntry Landing-featuresEntry--generators">\n' +
    '						<md-icon md-svg-src="/img/icons/angular-generators.svg" class="Landing-featuresEntry-icon"></md-icon>\n' +
    '					</div>\n' +
    '					<div class="md-headline Landing-featuresTitle">Angular Generators</div>\n' +
    '					<div class="md-subhead Landing-featuresDescription">Generate angular features, dialogs, directives, services, filters & configs just like you\'re used to</div>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '		<br/>\n' +
    '		<br/>\n' +
    '	</div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/view1/view1.html',
    '<p>This is the partial for view 1.</p>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/view2/view2.html',
    '<p>This is the partial for view 2.</p>\n' +
    '<p>\n' +
    '  Showing of \'interpolate\' filter:\n' +
    '  {{ \'Current version is v%VERSION%.\' | interpolate }}\n' +
    '</p>\n' +
    '');
}]);
})();
