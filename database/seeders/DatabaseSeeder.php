<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            SystemSettingsSeeder::class,
        ]);
        $this->call(ServicesTableSeeder::class);
        $this->call(ServiceImagesTableSeeder::class);
        $this->call(ProjectsTableSeeder::class);
        $this->call(ProjectImagesTableSeeder::class);
        $this->call(TramiteDemoSeeder::class);
    }
}
