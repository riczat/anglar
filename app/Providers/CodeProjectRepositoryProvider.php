<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class CodeProjectRepositoryProvider extends ServiceProvider
{

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
                \App\Repositories\ClientRepository::class, \App\Repositories\ClientRepositoryEloquent::class
        );
        $this->app->bind(
                \App\Repositories\ProjectRepository::class, \App\Repositories\ProjectRepositoryEloquent::class
        );
        $this->app->bind(
                \App\Repositories\ProjectNoteRepository::class, \App\Repositories\ProjectNoteRepositoryEloquent::class
        );
        $this->app->bind(
                \App\Repositories\ProjectFileRepository::class, \App\Repositories\ProjectFileRepositoryEloquent::class
        );
        $this->app->bind(
                \App\Repositories\ProjectTaskRepository::class, \App\Repositories\ProjectTaskRepositoryEloquent::class
        );
        $this->app->bind(
                \App\Repositories\ProjectMemberRepository::class, \App\Repositories\ProjectMemberRepositoryEloquent::class
        );
        $this->app->bind(
                \App\Repositories\UserRepository::class, \App\Repositories\UserRepositoryEloquent::class
        );
    }

}
