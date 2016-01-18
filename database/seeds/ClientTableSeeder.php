<?php

use Illuminate\Database\Seeder;
use App\Entities\Client;

class ClientTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        // Client::truncate();
        factory(Client::class, 15)->create();
    }

}
