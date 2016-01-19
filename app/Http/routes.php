<?php

Route::get('/', 'HomeController@index');
/*
Route::post('oauth/access_token', function () {
    return Response::json(Authorizer::issueAccessToken());
});*/
Route::get('home',function(){
    return redirect('/');
});
Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController'
]);

$api->group([], function ($api) {

    $api->post('users/login', 'LoginController@login');

});
  //protected routes with JWT (must be logged in to access any of these routes)
      $api->group(['middleware' => 'api.auth'], function ($api) {

      $api->get('sample/protected', 'LoginController@protectedData');

      $api->resource('client', 'ClientController', ['except' => ['edit', 'create']]);
      $api->group(['middleware' => 'CheckProjectOwner'], function() {


          $api->post('project/store', 'ProjectController@store');

          $api->resource('project', 'ProjectController', ['except' => ['edit', 'create']]);

          $api->group(['prefix' => 'project'], function() {
              // members

              $api->resource('file', "ProjectFileController", ['except' => ['edit', 'create']]);
              $api->post('member', "ProjectController@newMember");
              $api->get('{id}/member/list', "ProjectController@getMembers");
              $api->get('{id}/member/{menberId}', "ProjectMemberController@show");
              $api->delete('member/delete', "ProjectController@removeMember");
              $api->post('user/isMember', "ProjectController@isMember");

              $api->resource('note', 'ProjectNoteController', ['except' => ['edit', 'create']]);
              $api->get('teste/{pId}/{userId}', "ProjectController@hasMember");
              $api->post('store', 'ProjectController@store');


              //tasks
              $api->get('{id}/task/list', "ProjectController@getTasks");
              $api->get('{project}/task/{id}', "ProjectTaskController@show");
              $api->post('task/store', "ProjectTaskController@store");
              $api->put('task/update', "ProjectTaskController@update");
              $api->delete('task/delete', "ProjectTaskController@destroy");
          });
      });
  });
