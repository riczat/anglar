<?php

use Illuminate\Database\Seeder;
use App\Entities\ProjectTask;

class ProjectTasksTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        factory(ProjectTask::class, 20)->create();
    }

}
