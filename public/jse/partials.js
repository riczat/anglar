(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/dialogs/add_users/add_users.html',
    '<md-dialog ng-controller="AddUsersCtrl">\n' +
    '	<form ng-submit="save()">\n' +
    '		<md-dialog-content>\n' +
    '			<h2 class="md-title">Add users</h2>\n' +
    '\n' +
    '			<md-input-container flex>\n' +
    '        		<label>Data</label>\n' +
    '				<input type="text">\n' +
    '      		</md-input-container>\n' +
    '\n' +
    '		</md-dialog-content>\n' +
    '\n' +
    '		<div class="md-actions" layout="row">\n' +
    '			<md-button type="button" ng-click="hide()">Cancel</md-button>\n' +
    '			<md-button class="md-primary md-raised" type="submit">Save</md-button>\n' +
    '		</div>\n' +
    '	</form>\n' +
    '</md-dialog>\n' +
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
  $templateCache.put('./views/directives/data_listing/data_listing.html',
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
  $templateCache.put('./views/app/views/avengers/avengers.html',
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
  $templateCache.put('./views/app/views/dashboard/dashboard.html',
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
  $templateCache.put('./views/app/views/layout/shell.html',
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
  $templateCache.put('./views/app/views/layout/topnav.html',
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
  $templateCache.put('./views/app/views/layout/widgetheader.html',
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
  $templateCache.put('./views/app/views/partials/autocomplete.html',
    '<div  ng-controller="SearchController as vm">\n' +
    '  <md-content ng-show="$showOptions" class="options">\n' +
    '    <md-radio-group ng-model="vm.disableCaching" >\n' +
    '      <md-radio-button  ng-value="true">Disable caching</md-radio-button>\n' +
    '      <md-radio-button  ng-value="false">Enable caching</md-radio-button>\n' +
    '    </md-radio-group>\n' +
    '  </md-content>\n' +
    '\n' +
    '  <md-content class="md-padding">\n' +
    '    <md-autocomplete placeholder="Search country"\n' +
    '                     md-selected-item="vm.selectedCountry"\n' +
    '                     md-search-text="vm.searchText"\n' +
    '                     md-no-cache="vm.disableCaching"\n' +
    '                     md-items="item in vm.querySearch(vm.searchText)"\n' +
    '                     md-item-text="item.display">\n' +
    '      <span md-highlight-text="vm.searchText">{{item.display}}</span>\n' +
    '    </md-autocomplete>\n' +
    '\n' +
    '    <p>Selected country:\n' +
    '      <b>{{vm.selectedCountry.display || \'No country selected\'}}</b>\n' +
    '    </p>\n' +
    '    <p>Country code:\n' +
    '      <b>{{vm.selectedCountry.code || \'No country selected\'}}</b>\n' +
    '    </p>\n' +
    '  </md-content>\n' +
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
  $templateCache.put('./views/app/views/partials/bottomSheet.html',
    '<md-bottom-sheet class="md-list md-has-header">\n' +
    '  <md-subheader>Select action</md-subheader>\n' +
    '  <md-list>\n' +
    '      <md-list-item ng-repeat="action in vm.actions">\n' +
    '          <md-button class="md-list-item-content"  ng-click="vm.performAction(action)" ng-href="{{action.url}}" target="_blank">\n' +
    '              <i class="material-icons">{{action.icon}}</i>\n' +
    '              <span class="share-label">{{action.name}}</span>\n' +
    '          </md-button>\n' +
    '      </md-list-item>\n' +
    '  </md-list>\n' +
    '</md-bottom-sheet>\n' +
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
  $templateCache.put('./views/app/views/partials/checkboxes.html',
    '<md-content class="md-padding" ng-controller="TodoController as vm">\n' +
    '    <div layout="row">\n' +
    '        <h4 flex="82">{{vm.remaining()}} of {{vm.todos.length}} remaining</h4>\n' +
    '        <md-button class="md-primary" ng-click="vm.toggleAll()">Toggle All\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-checkbox ng-repeat="todo in vm.todos" ng-model="todo.done">\n' +
    '        {{todo.text}}\n' +
    '    </md-checkbox>\n' +
    '\n' +
    '    <form ng-submit="vm.addTodo($event)">\n' +
    '        <md-input-container>\n' +
    '            <label>Write some todo task here...</label>\n' +
    '            <input ng-model="vm.todoText">\n' +
    '        </md-input-container>\n' +
    '        <md-button class="md-fab md-warn" aria-label="Eat cake">\n' +
    '            <i class="material-icons">add</i>\n' +
    '        </md-button>\n' +
    '        <md-button class="md-primary" ng-click="vm.archive($event)">\n' +
    '            Remove completed\n' +
    '        </md-button>\n' +
    '    </form>\n' +
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
  $templateCache.put('./views/app/views/partials/controlPanel.html',
    '<md-content ng-controller="ControlPanelController as vm" class="md-padding">\n' +
    '    <md-progress-linear class="widget-progress md-accent" md-mode="determinate"\n' +
    '                        value="{{vm.determinateValue}}" ng-show="vm.showProgress">\n' +
    '    </md-progress-linear>\n' +
    '\n' +
    '    <md-radio-group ng-model="vm.reloadServer">\n' +
    '        <md-radio-button class="md-accent" value="Staging">Staging server</md-radio-button>\n' +
    '        <md-radio-button class="md-accent" value="Production">Production server</md-radio-button>\n' +
    '    </md-radio-group>\n' +
    '\n' +
    '    <md-button class="md-raised md-warn" ng-click="vm.performProgress()">\n' +
    '        Reload server\n' +
    '    </md-button>\n' +
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
  $templateCache.put('./views/app/views/partials/memory.html',
    '<md-content ng-controller="MemoryController as vm" class="md-padding" layout="row" layout-align="center center">\n' +
    '    <nvd3 options="vm.chartOptions" data="vm.memoryChartData"></nvd3>\n' +
    '</md-content>');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/partials/messages.html',
    '<div class="messages" ng-controller="MessagesController as vm">\n' +
    '    <md-content class="messages-content">\n' +
    '\n' +
    '        <messages-section theme="md-accent" title="New Orders" messages="vm.messages"></messages-section>\n' +
    '        <messages-section theme="md-primary" title="Delivered" messages="vm.messages"></messages-section>\n' +
    '        <messages-section theme="md-warn" title="Problems reported" messages="vm.messages"></messages-section>\n' +
    '\n' +
    '        <md-divider></md-divider>\n' +
    '    </md-content>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/views/partials/performance.html',
    '<div ng-controller="PerformanceController as vm">\n' +
    '  <md-content ng-show="$showOptions" class="options">\n' +
    '    <md-radio-group ng-model="vm.performancePeriod" ng-change="vm.changePeriod()">\n' +
    '      <md-radio-button  value="week">Last week</md-radio-button>\n' +
    '      <md-radio-button  value="month">Last month</md-radio-button>\n' +
    '    </md-radio-group>\n' +
    '  </md-content>\n' +
    '\n' +
    '  <md-content class="md-padding">\n' +
    '    <nvd3 options="vm.chartOptions" data="vm.performanceChartData"></nvd3>\n' +
    '  </md-content>\n' +
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
  $templateCache.put('./views/app/views/partials/profile.html',
    '<!-- TODO: Add validations -->\n' +
    '<md-content md-theme="dark" class="md-padding" layout="row" layout-sm="column">\n' +
    '    <md-input-container>\n' +
    '        <label>Username</label>\n' +
    '        <input ng-model="vm.user.title">\n' +
    '    </md-input-container>\n' +
    '    <md-input-container>\n' +
    '        <label>Email</label>\n' +
    '        <input ng-model="vm.user.email" type="email">\n' +
    '    </md-input-container>\n' +
    '</md-content>\n' +
    '<md-content class="md-padding">\n' +
    '    <form name="userForm">\n' +
    '        <div layout layout-sm="column">\n' +
    '            <md-input-container flex="80">\n' +
    '                <label>Company (Disabled)</label>\n' +
    '                <input ng-model="vm.user.company" disabled>\n' +
    '            </md-input-container>\n' +
    '            <md-input-container flex>\n' +
    '                <label>Submission Date</label>\n' +
    '                <input type="date" ng-model="vm.user.submissionDate">\n' +
    '            </md-input-container>\n' +
    '        </div>\n' +
    '        <div layout layout-sm="column">\n' +
    '            <md-input-container flex>\n' +
    '                <label>First Name</label>\n' +
    '                <input ng-model="vm.user.firstName"\n' +
    '                       placeholder="Placeholder text">\n' +
    '            </md-input-container>\n' +
    '            <md-input-container flex>\n' +
    '                <label>Last Name</label>\n' +
    '                <input ng-model="vm.user.lastName">\n' +
    '            </md-input-container>\n' +
    '        </div>\n' +
    '        <md-input-container flex>\n' +
    '            <label>Address</label>\n' +
    '            <input ng-model="vm.user.address">\n' +
    '        </md-input-container>\n' +
    '        <div layout layout-sm="column">\n' +
    '            <md-input-container flex>\n' +
    '                <label>City</label>\n' +
    '                <input ng-model="vm.user.city">\n' +
    '            </md-input-container>\n' +
    '            <md-input-container flex>\n' +
    '                <label>State</label>\n' +
    '                <input ng-model="user.state">\n' +
    '            </md-input-container>\n' +
    '            <md-input-container flex>\n' +
    '                <label>Postal Code</label>\n' +
    '                <input ng-model="vm.user.postalCode">\n' +
    '            </md-input-container>\n' +
    '        </div>\n' +
    '        <md-input-container flex>\n' +
    '            <label>About us</label>\n' +
    '            <textarea ng-model="vm.user.biography" columns="1"\n' +
    '                      md-maxlength="150"></textarea>\n' +
    '        </md-input-container>\n' +
    '    </form>\n' +
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
  $templateCache.put('./views/app/views/partials/table.html',
    '<!-- TODO: Replace table to table component when https://github.com/angular/material/issues/796 will closed -->\n' +
    '<div class="table-responsive-vertical md-whiteframe-z1">\n' +
    '    <table id="table" class="table table-hover table-bordered">\n' +
    '        <thead>\n' +
    '        <tr>\n' +
    '            <th>#</th>\n' +
    '            <th>Issue</th>\n' +
    '            <th>Status</th>\n' +
    '            <th>Progress</th>\n' +
    '        </tr>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '        <tr ng-repeat="data in vm.tableData track by $index">\n' +
    '            <td data-title="ID">{{$index + 1}}</td>\n' +
    '            <td data-title="Issue">{{data.issue}}</td>\n' +
    '            <td data-title="Status">{{data.status}}</td>\n' +
    '            <td data-title="Progress">\n' +
    '                <md-progress-linear class="table-progress {{data.class}}"\n' +
    '                                    md-mode="determinate"\n' +
    '                                    value={{data.progress}}>\n' +
    '                </md-progress-linear>\n' +
    '            </td>\n' +
    '        </tr>\n' +
    '        </tbody>\n' +
    '    </table>\n' +
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
  $templateCache.put('./views/app/views/partials/usage.html',
    '<md-content ng-controller="UsageController as vm" class="md-padding" layout="row">\n' +
    '  <div flex>\n' +
    '    <nvd3 options="vm.chartOptions" data="vm.ramChartData"></nvd3>\n' +
    '    <h4 class="donut-chart-title">RAM</h4>\n' +
    '  </div>\n' +
    '  <div flex>\n' +
    '    <nvd3 options="vm.chartOptions" data="vm.storageChartData"></nvd3>\n' +
    '    <h4 class="donut-chart-title">Storage</h4>\n' +
    '  </div>\n' +
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
  $templateCache.put('./views/app/views/partials/visitors.html',
    '<md-content ng-controller="VisitorsController as vm" class="md-padding" layout="row" layout-align="center center">\n' +
    '    <nvd3 options="vm.chartOptions" data="vm.visitorsChartData"></nvd3>\n' +
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
  $templateCache.put('./views/app/views/partials/warnings.html',
    '<md-content ng-controller="WarningsController as vm" class="md-padding" layout="row" layout-align="center center">\n' +
    '    <nvd3 options="vm.chartOptions" data="vm.warningsChartData"></nvd3>\n' +
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
  $templateCache.put('./views/app/views/sidebar/sidebar.html',
    '\n' +
    '<md-sidenav md-is-locked-open="$mdMedia(\'gt-sm\')" md-component-id="left"\n' +
    '            class="md-whiteframe-z2 md-sidenav-left">\n' +
    '  <md-toolbar md-theme="custom" class="md-hue-1 md-whiteframe-z2">\n' +
    '    <md-button layout="row" layout-align="center center" class="md-toolbar-tools md-warn"\n' +
    '               href="https://github.com/flatlogic/angular-material-dashboard">\n' +
    '      <h1>AMD</h1>\n' +
    '    </md-button>\n' +
    '  </md-toolbar>\n' +
    '      <md-button ng-repeat-start="item in vm.menuItems" layout="column" layout-align="center center"\n' +
    '                 flex class="capitalize" ng-click="vm.selectItem(item)"\n' +
    '                 ui-sref-active="md-warn" ui-sref="{{item.sref}}">\n' +
    '          <div hide-sm hide-md class="md-tile-content">\n' +
    '              <i class="material-icons md-36">{{item.icon}}</i>\n' +
    '          </div>\n' +
    '          <div class="md-tile-content">\n' +
    '              {{item.name}}\n' +
    '          </div>\n' +
    '      </md-button>\n' +
    '      <md-divider ng-repeat-end></md-divider>\n' +
    '      <md-button hide-gt-md flex ng-click="vm.showActions($event)">\n' +
    '          <div layout="row" class="md-tile-content">\n' +
    '            Actions\n' +
    '          </div>\n' +
    '      </md-button>\n' +
    '</md-sidenav>\n' +
    '\n' +
    '<div layout="column" flex>\n' +
    '    <md-toolbar layout="row" layout-align="end center">\n' +
    '        <md-button hide-sm class="toolbar-button" aria-label="Search">\n' +
    '            <i class="material-icons">search</i>\n' +
    '        </md-button>\n' +
    '        <md-button hide-sm class="toolbar-button" aria-label="Notifications">\n' +
    '            <i class="material-icons">notifications</i>\n' +
    '            <span class="notifications-label">7</span>\n' +
    '        </md-button>\n' +
    '        <md-button hide-sm class="toolbar-button" aria-label="Settings">\n' +
    '            <i class="material-icons">settings</i>\n' +
    '        </md-button>\n' +
    '        <md-button hide-gt-sm ng-click="vm.toggleItemsList()" aria-label="Menu">\n' +
    '            <i class="material-icons">menu</i>\n' +
    '        </md-button>\n' +
    '    </md-toolbar>\n' +
    '\n' +
    '    <md-content flex class="md-padding page-content">\n' +
    '        <div ui-view></div>\n' +
    '    </md-content>\n' +
    '</div>\n' +
    '\n' +
    '<md-sidenav md-is-locked-open="$mdMedia(\'gt-sm\')" md-component-id="right"\n' +
    '            class="md-whiteframe-z2 md-sidenav-right">\n' +
    '    <md-toolbar layout="row">\n' +
    '        <md-toolbar flex="80" class="md-warn" layout="row" layout-align="center center">\n' +
    '            <img class="img-circle" ng-src="assets/images/feynman.jpg">\n' +
    '            <md-menu>\n' +
    '                <md-button class="capitalize" ng-click="$mdOpenMenu()" aria-label="Open menu">\n' +
    '                    <span>Richard Feynman</span>\n' +
    '                    <i class="material-icons">keyboard_arrow_down</i>\n' +
    '                </md-button>\n' +
    '                <md-menu-content>\n' +
    '                    <md-menu-item><md-button ng-click="$mdCloseMenu()" ui-sref="home.profile">Profile</md-button></md-menu-item>\n' +
    '                    <md-menu-item><md-button ng-click="$mdCloseMenu()" ui-sref="home.dashboard">Log out</md-button></md-menu-item>\n' +
    '                </md-menu-content>\n' +
    '            </md-menu>\n' +
    '        </md-toolbar>\n' +
    '        <md-toolbar flex="20" layout="row" layout-align="center center">\n' +
    '            <md-button ng-click="vm.showActions($event)" class="toolbar-button">\n' +
    '                <i class="material-icons">more_vert</i>\n' +
    '            </md-button>\n' +
    '        </md-toolbar>\n' +
    '    </md-toolbar>\n' +
    '\n' +
    '    <section>\n' +
    '        <md-toolbar md-theme="grey" class="md-hue-1">\n' +
    '            <div class="md-toolbar-tools">\n' +
    '                <h3>Messages</h3>\n' +
    '            </div>\n' +
    '        </md-toolbar>\n' +
    '        <div ng-include src="\'app/views/partials/messages.html\'"/>\n' +
    '    </section>\n' +
    '</md-sidenav>\n' +
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
