<?php

use Illuminate\Database\Seeder;
use App\Entities\User;

class UserTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
      //  User::truncate();
       factory(User::class)->create([
            'name' => "Ricard Zattergren",
            'email' => "ricard.zattergren@gmail.com",
            'password' => bcrypt('emil9707'),
            'remember_token' => str_random(10),
        ]);
        factory(User::class, 10)->create();
    }

}
