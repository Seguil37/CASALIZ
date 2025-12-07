<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug' => 'diseno-arquitectonico',
                'name' => 'Diseño arquitectónico',
                'description' => 'Conceptualizamos y detallamos proyectos que equilibran estética, funcionalidad y normativa.',
                'icon' => 'pencil-ruler',
            ],
            [
                'slug' => 'expedientes-tecnicos',
                'name' => 'Expedientes técnicos',
                'description' => 'Desarrollamos expedientes integrales listos para licitar y ejecutar sin sorpresas.',
                'icon' => 'file-text',
            ],
            [
                'slug' => 'licencias-obra',
                'name' => 'Licencias de obra',
                'description' => 'Gestionamos licencias y permisos ante municipalidades con seguimiento cercano.',
                'icon' => 'badge-check',
            ],
            [
                'slug' => 'regularizacion',
                'name' => 'Regularización',
                'description' => 'Saneamos edificaciones existentes para que cumplan con normativas y registros.',
                'icon' => 'clipboard-list',
            ],
            [
                'slug' => 'remodelaciones',
                'name' => 'Remodelaciones y ampliaciones',
                'description' => 'Transformamos espacios para potenciar su valor y adaptarlos a nuevas necesidades.',
                'icon' => 'building-2',
            ],
            [
                'slug' => 'supervision-obra',
                'name' => 'Supervisión de obra',
                'description' => 'Acompañamos la ejecución para asegurar calidad, seguridad y control de presupuesto.',
                'icon' => 'hard-hat',
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
