<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Master Admin',
                'email' => 'master@casaliz.test',
                'password' => Hash::make('password'),
                'role' => 'master_admin',
                'city' => 'Lima',
                'state' => 'Lima',
                'country' => 'Perú',
            ],
            [
                'name' => 'Admin Principal',
                'email' => 'admin@casaliz.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'city' => 'Arequipa',
                'state' => 'Arequipa',
                'country' => 'Perú',
            ],
            [
                'name' => 'Cliente Demo',
                'email' => 'cliente@casaliz.test',
                'password' => Hash::make('password'),
                'role' => 'client',
                'city' => 'Cusco',
                'state' => 'Cusco',
                'country' => 'Perú',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
