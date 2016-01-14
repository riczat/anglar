<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Post;

class CreatePostController extends Controller
{
	public function create(Request $request)
	{
		$this->validate([
				'name'  => 'required',
				'topic' => 'required',
		]);

		$post = new Post;
		$post->name = $request->input('name');
		$post->topic = $request->input('topic');
		$post->save();

		return response()->success(compact('post'));
	}

}