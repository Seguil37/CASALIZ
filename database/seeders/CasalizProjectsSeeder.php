<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Project;
use App\Models\User;
use App\Models\Category;

class CasalizProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::where('role', 'admin')->orWhere('role', 'master_admin')->first();

        if (!$creator) {
            return;
        }

        $projects = [
            [
                'title' => 'Casa Miraflores',
                'summary' => 'Vivienda unifamiliar con enfoque bioclimático en Lima.',
                'location' => 'Lima, Perú',
                'type' => 'unifamiliar',
                'status' => 'published',
                'year' => 2023,
                'tags' => ['lima', 'bioclimático', 'residencial'],
                'categories' => ['Unifamiliar', 'Residencial'],
            ],
            [
                'title' => 'Centro Empresarial Andino',
                'summary' => 'Complejo corporativo con áreas colaborativas y terraza verde.',
                'location' => 'Cusco, Perú',
                'type' => 'corporativo',
                'status' => 'construction',
                'year' => 2024,
                'tags' => ['corporativo', 'sostenible'],
                'categories' => ['Corporativo', 'Comercial'],
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'title' => $data['title'],
                    'summary' => $data['summary'],
                    'location' => $data['location'],
                    'type' => $data['type'],
                    'status' => $data['status'],
                    'year' => $data['year'],
                    'tags' => $data['tags'],
                    'created_by' => $creator->id,
                    'published_at' => now(),
                ]
            );

            $categoryIds = Category::whereIn('name', $data['categories'])->pluck('id');
            $project->categories()->sync($categoryIds);
        }
    }
}
