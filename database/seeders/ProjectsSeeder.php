<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'name' => 'Residencial Costa Azul',
                'location' => 'Miraflores, Lima',
                'project_type' => 'Vivienda multifamiliar',
                'area' => '3,800 m²',
                'status' => 'En ejecución',
                'description' => 'Edificio de 8 niveles con terrazas verdes y circulación natural del aire.',
                'image_url' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Oficinas Andes',
                'location' => 'San Isidro, Lima',
                'project_type' => 'Oficinas corporativas',
                'area' => '5,200 m²',
                'status' => 'Completado',
                'description' => 'Plantas libres con núcleos eficientes y certificación energética en proceso.',
                'image_url' => 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Hotel Valle Sagrado',
                'location' => 'Urubamba, Cusco',
                'project_type' => 'Hospitalidad',
                'area' => '6,500 m²',
                'status' => 'Completado',
                'description' => 'Complejo hotelero de baja altura integrado con el paisaje andino y materiales locales.',
                'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Centro Comunitario Pachacamac',
                'location' => 'Pachacámac, Lima',
                'project_type' => 'Equipamiento público',
                'area' => '1,100 m²',
                'status' => 'En diseño',
                'description' => 'Espacio comunitario modular con aulas, talleres y plaza central abierta.',
                'image_url' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Casa Maranta',
                'location' => 'La Molina, Lima',
                'project_type' => 'Vivienda unifamiliar',
                'area' => '420 m²',
                'status' => 'Completado',
                'description' => 'Residencia de líneas puras que prioriza iluminación natural y conexión con el jardín.',
                'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Campus Creativo Norte',
                'location' => 'Trujillo, La Libertad',
                'project_type' => 'Educativo',
                'area' => '9,300 m²',
                'status' => 'En desarrollo',
                'description' => 'Plan maestro para pabellones académicos, biblioteca y plaza de innovación.',
                'image_url' => 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(
                ['name' => $project['name'], 'location' => $project['location']],
                $project
            );
        }
    }
}
