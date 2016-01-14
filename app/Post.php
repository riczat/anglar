<?php

class CreatePost extends TestCase
{
   
  public function RequiresAuthentication()
  {
      $post = factory(App\Post::class)->make();
    
      $this->post('/api/posts', [
        'name' => $post->name,
        'topic' => $post->topic,
      ])->seeApiError(401);
  }
  
  public function StoresPostSuccessfully()
  {
   
    $post = factory(App\Post::class)->make();
    
    $this->authUserPost('/api/posts', [
      'name' => $post->name,
      'topic' => $post->topic,
      ])->seeApiSuccess()
      ->seeJsonObject('post')
      ->seeJsonKeyValueString('name', $post->name)
      ->seeJsonKeyValueString('topic', $post->topic);
    
    $this->seeInDatabase('posts', [
      'name' => $post->name,
      'topic' => $post->topic,
      ]);
  }