<?php

Route::get('/', 'AngularController@serveApp');

Route::get('/unsupported-browser', 'AngularController@unsupported');

/** @var \Dingo\Api\Routing\Router $api */

$api = app('Dingo\Api\Routing\Router');

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

$api->group(['middleware' => 'api.auth'], function ($api) {
    
	$api->get('sample/protected', 'LoginController@protectedData');
    $api->post('users/login', 'LoginController@login');
	$api->post('posts', 'CreatePostController@create');
}
);
