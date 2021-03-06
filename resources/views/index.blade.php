<!DOCTYPE html>
<html ng-app="app" ng-strict-di>
    <head>

      <link rel="stylesheet" href="/css/vendor.css">
   <link rel="stylesheet" href="/css/app.css">

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}">
      <link rel="stylesheet" href="{!! asset('css/app.css') !!}">
      <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'>
      <title>Anglar Material Starter</title>

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
                <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
                <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Laravel</a>
                </div>

                <div class="collapse navbar-collapse" id="navbar">
                    <ul class="nav navbar-nav">
                        <li><a href='#/home'>Welcome</a></li>
                    </ul>

                    <ul class="nav navbar-nav navbar-right">
                        @if(auth()->guest())
                        @if(!Request::is('auth/login'))
                        <li><a href='#/login'>Login</a></li>
                        @endif
                        @if(!Request::is('auth/register'))
                        <li><a href="#/auth/register">Register</a></li>
                        @endif
                        @else
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{{ auth()->user()->name }} <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="auth/logout">Logout</a></li>
                            </ul>
                        </li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>

            <div ui-view="layout"></div>
            <div ui-view="main"></div>
            <div ui-view="footer"></div>

        <!-- Scripts -->
        <div ng-view></div>

        <script src="/js/vendor.js"></script>
        <script src="/js/app.js"></script

        <script src="{!! asset('js/vendor.js') !!}"></script>
        <script src="{!! asset('js/partials.js') !!}"></script>
        <script src="{!! asset('js/app.js') !!}"></script>

        {{--livereload--}}
        @if ( env('APP_ENV') === 'local' )
        <script type="text/javascript">
            document.write('<script src="'+ location.protocol + '//' + (location.host.split(':')[0] || 'localhost') +':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
        </script>
        @endif
    </body>
    </html>
