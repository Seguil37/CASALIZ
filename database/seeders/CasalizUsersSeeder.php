<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class CasalizUsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Master Admin', 'email' => 'master@casaliz.com', 'role' => 'master_admin'],
            ['name' => 'Admin Casaliz', 'email' => 'admin@casaliz.com', 'role' => 'admin'],
            ['name' => 'Cliente Casaliz', 'email' => 'cliente@casaliz.com', 'role' => 'client'],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'role' => $user['role'],
                    'password' => Hash::make('password'),
                    'is_active' => true,
                ]
            );
        }
    }
}
