<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Casa Miraflores',
                'type' => 'Residencial',
                'city' => 'Lima',
                'state' => 'Lima',
                'country' => 'Perú',
                'summary' => 'Remodelación integral de una casa familiar con espacios abiertos y luz natural.',
                'description' => 'Proyecto arquitectónico centrado en la integración de la sala con el jardín y acabados cálidos.',
                'hero_image' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title' => 'Loft Barranco',
                'type' => 'Departamento',
                'city' => 'Lima',
                'state' => 'Lima',
                'country' => 'Perú',
                'summary' => 'Loft industrial con doble altura y balcones hacia el malecón.',
                'description' => 'Espacios flexibles para trabajo y descanso, uso de concreto expuesto y acero visto.',
                'hero_image' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title' => 'Condominio Valle Sagrado',
                'type' => 'Condominio',
                'city' => 'Urubamba',
                'state' => 'Cusco',
                'country' => 'Perú',
                'summary' => 'Conjunto de viviendas ecoamigables con vistas a las montañas.',
                'description' => 'Diseño bioclimático con materiales locales y techos verdes para integrarse al paisaje.',
                'hero_image' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
                'is_featured' => false,
                'status' => 'published',
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::updateOrCreate(
                ['slug' => Str::slug($projectData['title'])],
                [
                    ...$projectData,
                    'slug' => Str::slug($projectData['title']),
                    'published_at' => now(),
                    'created_by' => 1,
                    'updated_by' => 1,
                ]
            );

            ProjectImage::updateOrCreate(
                ['project_id' => $project->id, 'position' => 0],
                [
                    'path' => $projectData['hero_image'],
                    'caption' => $projectData['title'],
                ]
            );
        }
    }
}
