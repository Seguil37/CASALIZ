<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🚀 Seeders CASA LIZ');

        $this->call([
            SystemSettingsSeeder::class,
            CasalizUsersSeeder::class,
            CasalizCategoriesSeeder::class,
            CasalizProjectsSeeder::class,
        ]);

        $this->command->table(
            ['Modelo', 'Cantidad'],
            [
                ['Usuarios', \App\Models\User::count()],
                ['Categorías', \App\Models\Category::count()],
                ['Proyectos', \App\Models\Project::count()],
                ['Reseñas', \App\Models\Review::count()],
            ]
        );

        $this->command->table(
            ['Rol', 'Email', 'Password'],
            [
                ['Master', 'master@casaliz.com', 'password'],
                ['Admin', 'admin@casaliz.com', 'password'],
                ['Cliente', 'cliente@casaliz.com', 'password'],
            ]
        );
    }
}
