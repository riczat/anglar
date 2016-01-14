(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/app/footer/footer.html',
    '<md-content class="Page-Container Footer" ng-controller="FooterController as vm" layout-align="center center">\n' +
    '	<md-icon md-svg-src="/img/icons/logo-grey.svg" class="Footer-logo"></md-icon>\n' +
    '	<br/>\n' +
    '	<br/>\n' +
    '	<div class="Footer-text">\n' +
    '		An open source project by <a href="https://github.com/riczat" class="Footer-link" target="_blank">Ricard Zättergren</a>.\n' +
    '		Design by <a href="https://www.linkedin.com/in/nicolesaidy" class="Footer-link" target="_blank">Nicole Saidy</a>\n' +
    '	</div>\n' +
    '	<div class="Footer-text">\n' +
    '		&copy; 2016 Anglar Material Starter\n' +
    '	</div>\n' +
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
  $templateCache.put('./views/app/sidebar/sidebar.html',
    '<div ng-controller="AppCtrl" layout="column" style="height:500px;" ng-cloak>\n' +
    '  <section layout="row" flex>\n' +
    '    <md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia(\'gt-md\')">\n' +
    '      <md-toolbar class="md-theme-indigo">\n' +
    '        <h1 class="md-toolbar-tools">Sidenav Left</h1>\n' +
    '      </md-toolbar>\n' +
    '      <md-content layout-padding ng-controller="LeftCtrl">\n' +
    '        <md-button ng-click="close()" class="md-primary" hide-gt-md>\n' +
    '          Close Sidenav Left\n' +
    '        </md-button>\n' +
    '        <p hide-md show-gt-md>\n' +
    '          This sidenav is locked open on your device. To go back to the default behavior,\n' +
    '          narrow your display.\n' +
    '        </p>\n' +
    '      </md-content>\n' +
    '    </md-sidenav>\n' +
    '    <md-content flex layout-padding>\n' +
    '      <div layout="column" layout-fill layout-align="top center">\n' +
    '        <p>\n' +
    '        The left sidenav will \'lock open\' on a medium (>=960px wide) device.\n' +
    '        </p>\n' +
    '        <p>\n' +
    '        The right sidenav will focus on a specific child element.\n' +
    '        </p>\n' +
    '        <div>\n' +
    '          <md-button ng-click="toggleLeft()"\n' +
    '            class="md-primary" hide-gt-md>\n' +
    '            Toggle left\n' +
    '          </md-button>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '          <md-button ng-click="toggleRight()"\n' +
    '            ng-hide="isOpenRight()"\n' +
    '            class="md-primary">\n' +
    '            Toggle right\n' +
    '          </md-button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div flex></div>\n' +
    '    </md-content>\n' +
    '    <md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="right">\n' +
    '      <md-toolbar class="md-theme-light">\n' +
    '        <h1 class="md-toolbar-tools">Sidenav Right</h1>\n' +
    '      </md-toolbar>\n' +
    '      <md-content ng-controller="RightCtrl" layout-padding>\n' +
    '        <form>\n' +
    '          <md-input-container>\n' +
    '            <label for="testInput">Test input</label>\n' +
    '            <input type="text" id="testInput"\n' +
    '                   ng-model="data" md-autofocus>\n' +
    '          </md-input-container>\n' +
    '        </form>\n' +
    '        <md-button ng-click="close()" class="md-primary">\n' +
    '          Close Sidenav Right\n' +
    '        </md-button>\n' +
    '      </md-content>\n' +
    '    </md-sidenav>\n' +
    '  </section>\n' +
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
  $templateCache.put('./views/app/unsupported_browser/unsupported_browser.html',
    '<md-content class="Page-Container" ng-controller="UnsupportedBrowserCtrl" layout="column" layout-align="start center">\n' +
    '\n' +
    '    <md-card>\n' +
    '\n' +
    '        <md-toolbar>\n' +
    '            <div class="md-toolbar-tools">\n' +
    '                <h2>Unsupported Browser Page</h2>\n' +
    '            </div>\n' +
    '        </md-toolbar>\n' +
    '\n' +
    '        <img src="https://i.imgur.com/5sRuLSo.png" alt="Unsupported Browser Page for IE <= 10">\n' +
    '        <md-card-content>\n' +
    '            <p>\n' +
    '                Open <a href="/unsupported-browser" target="_blank">/unsupported-browser</a> to see the unsupported browser page that shows for Internet Explorer 10 or below.\n' +
    '            </p>\n' +
    '            <p>\n' +
    '                This is necessary because Angular Material uses the newest features in CSS (such as flexbox or its layout).\n' +
    '            </p>\n' +
    '        </md-card-content>\n' +
    '\n' +
    '    </md-card>\n' +
    '\n' +
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
  $templateCache.put('./views/dialogs/change_password/change_password.html',
    '<md-dialog ng-controller="ChangePasswordController as vm">\n' +
    '	<form ng-submit="vm.save()">\n' +
    '		<md-dialog-content>\n' +
    '			<h2 class="md-title">Change password</h2>\n' +
    '\n' +
    '			<md-input-container flex>\n' +
    '        		<label>Data</label>\n' +
    '				<input type="text">\n' +
    '      		</md-input-container>\n' +
    '\n' +
    '		</md-dialog-content>\n' +
    '\n' +
    '		<div class="md-actions" layout="row">\n' +
    '			<md-button type="button" ng-click="vm.hide()">Cancel</md-button>\n' +
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
  $templateCache.put('./views/dialogs/login/login.html',
    '<md-dialog ng-controller="LoginController as vm">\n' +
    '	<form ng-submit="vm.save()">\n' +
    '		<md-dialog-content>\n' +
    '			<h2 class="md-title">Login</h2>\n' +
    '\n' +
    '			<md-input-container flex>\n' +
    '        		<label>Data</label>\n' +
    '				<input type="text">\n' +
    '      		</md-input-container>\n' +
    '\n' +
    '		</md-dialog-content>\n' +
    '\n' +
    '		<div class="md-actions" layout="row">\n' +
    '			<md-button type="button" ng-click="vm.hide()">Cancel</md-button>\n' +
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
  $templateCache.put('./views/directives/add_users/add_users.html',
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
  $templateCache.put('./views/directives/create_post_form/create_post_form.html',
    '<form ng-submit="vm.submit()">\n' +
    '  \n' +
    '    <input type="text" ng-model="name" placeholder="Name">\n' +
    '    <input type="text" ng-model="topic" placeholder="Topic">\n' +
    '  \n' +
    '    <md-button type="submit">Create post</md-button>\n' +
    '  \n' +
    '</form>');
}]);
})();

(function(module) {
try {
  module = angular.module('partialsModule');
} catch (e) {
  module = angular.module('partialsModule', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('./views/directives/employee/employee.html',
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
  $templateCache.put('./views/directives/user_profile/user_profile.html',
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
  $templateCache.put('./views/app/create_post/create_post.html',
    '<md-content class="Page-Container" ng-controller="CreatePostController as vm">\n' +
    '<h1>Create Post</h1>\n' +
    '\n' +
    '<create-post-form></create-post-form>\n' +
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
  $templateCache.put('./views/app/landing/landing.html',
    '<div class="Page-Container Landing" ng-controller="LandingController as vm">\n' +
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
  $templateCache.put('./views/app/header/header.html',
    '</div>\n' +
    '<div ng-controller="AppCtrl" ng-cloak>\n' +
    '  <md-content>\n' +
    '    <br>\n' +
    '    <md-toolbar>\n' +
    '      <div class="md-toolbar-tools">\n' +
    '        <md-button class="md-icon-button" aria-label="Settings">\n' +
    '          <md-icon md-svg-icon="img/icons/menu.svg"></md-icon>\n' +
    '        </md-button>\n' +
    '        <h2>\n' +
    '          <span>Toolbar with Icon Buttons</span>\n' +
    '        </h2>\n' +
    '        <span flex></span>\n' +
    '        <md-button class="md-icon-button" aria-label="Favorite">\n' +
    '          <md-icon md-svg-icon="img/icons/favorite.svg" style="color: greenyellow;"></md-icon>\n' +
    '        </md-button>\n' +
    '        <md-button class="md-icon-button" aria-label="More">\n' +
    '          <md-icon md-svg-icon="img/icons/more_vert.svg"></md-icon>\n' +
    '        </md-button>\n' +
    '      </div>\n' +
    '    </md-toolbar>\n' +
    '    <br>\n' +
    '    <md-toolbar>\n' +
    '      <div class="md-toolbar-tools">\n' +
    '        <md-button aria-label="Go Back">\n' +
    '          Go Back\n' +
    '        </md-button>\n' +
    '        <h2>\n' +
    '          <span>Toolbar with Standard Buttons</span>\n' +
    '        </h2>\n' +
    '        <span flex></span>\n' +
    '        <md-button class="md-raised" aria-label="Learn More">\n' +
    '          Learn More\n' +
    '        </md-button>\n' +
    '        <md-button class="md-fab md-mini" aria-label="Favorite">\n' +
    '          <md-icon md-svg-icon="img/icons/favorite.svg"></md-icon>\n' +
    '        </md-button>\n' +
    '      </div>\n' +
    '    </md-toolbar>\n' +
    '    <br>\n' +
    '    <md-toolbar class="md-tall md-accent">\n' +
    '      <h2 class="md-toolbar-tools">\n' +
    '        <span>Toolbar: tall (md-accent)</span>\n' +
    '      </h2>\n' +
    '    </md-toolbar>\n' +
    '    <br>\n' +
    '    <md-toolbar class="md-tall md-warn md-hue-3">\n' +
    '      <span flex></span>\n' +
    '      <h2 class="md-toolbar-tools md-toolbar-tools-bottom">\n' +
    '        <span class="md-flex">Toolbar: tall with actions pin to the bottom (md-warn md-hue-3)</span>\n' +
    '      </h2>\n' +
    '    </md-toolbar>\n' +
    '  </md-content>\n' +
    '</div>');
}]);
})();
