<?php

use Illuminate\Database\Seeder;
use larang\Entities\User;

class UserTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        //  User::truncate();
       /* factory(User::class)->create([
            'name' => "mario Henrique",
            'email' => "mario@mario",
            'password' => bcrypt(123456),
            'remember_token' => str_random(10),
        ]);*/
        factory(User::class, 10)->create();
    }

}
