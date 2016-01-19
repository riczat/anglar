<?php

use Dingo\Api\Routing\Helpers;
use Illuminate\Routing\Controller;

class UserController extends BaseController
{
      public function index()
    {
        $users = User::all();

        return $this->response->collection($users, new UserTransformer);
    }
    public function show($id)
    {
        $user = User::findOrFail($id);

        return $this->response->array($user->toArray());
    }
}
