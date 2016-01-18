<?php

use Illuminate\Database\Seeder;
use App\Entities\Project;

class ProjectTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {

        //  Project::truncate();
        factory(Project::class, 30)->create();
    }

}
