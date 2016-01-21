<?php
Route::get('/', 'HomeController@serveApp');
Route::get('/unsupported-browser', 'HomeController@unsupported');

Route::post('oauth/access_token', function () {
    return Response::json(Authorizer::issueAccessToken());
});
Route::get('home',function(){
    return redirect('/');
});
Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController'
]);

Route::get('/data', 'DataController@index');

Route::group(['middleware' => 'oauth'], function() {
            Route::resource('client', 'ClientController', ['except' => ['edit', 'create']]);
            Route::group(['middleware' => 'CheckProjectOwner'], function() {

            Route::post('project/store', 'ProjectController@store');

            Route::resource('project', 'ProjectController', ['except' => ['edit', 'create']]);

            Route::group(['prefix' => 'project'], function() {
            // members

            Route::resource('file', "ProjectFileController", ['except' => ['edit', 'create']]);
            Route::post('member', "ProjectController@newMember");
            Route::get('{id}/member/list', "ProjectController@getMembers");
            Route::get('{id}/member/{menberId}', "ProjectMemberController@show");
            Route::delete('member/delete', "ProjectController@removeMember");
            Route::post('user/isMember', "ProjectController@isMember");

            Route::resource('note', 'ProjectNoteController', ['except' => ['edit', 'create']]);
            Route::get('teste/{pId}/{userId}', "ProjectController@hasMember");
            Route::post('store', 'ProjectController@store');


            //tasks
            Route::get('{id}/task/list', "ProjectController@getTasks");
            Route::get('{project}/task/{id}', "ProjectTaskController@show");
            Route::post('task/store', "ProjectTaskController@store");
            Route::put('task/update', "ProjectTaskController@update");
            Route::delete('task/delete', "ProjectTaskController@destroy");
        });
    });
});

$api = app('Dingo\Api\Routing\Router');

//protected routes with JWT (must be logged in to access any of these routes)
$api->version('v1', ['middleware' => 'api.auth'], function ($api) {

    $api->get('sample/protected', 'LoginController@protectedData');

});
