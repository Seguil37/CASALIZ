<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            'Viviendas unifamiliares y multifamiliares',
            'Casas de campo',
            'Diseño de interiores con vistas en 3D',
            'Expediente de licencia de construcción',
            'Declaratoria de fábrica',
            'Independizaciones',
            'Habilitaciones urbanas',
            'Subdivisión de lote',
            'Acumulación de lote',
            'Prescripción adquisitiva',
            'Visación de planos',
            'Levantamiento topográfico',
            'Licencia de funcionamiento',
            'Compra venta de terrenos',
            'Expedientes técnicos',
        ];

        foreach ($services as $title) {
            $service = Service::updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'title' => $title,
                    'category' => 'Diseño, Construcción e Inmobiliaria',
                    'short_description' => 'Servicio profesional de CASALIZ en la categoría de diseño y construcción.',
                    'description' => 'Detalle completo del servicio de ' . $title . ' ofrecido por CASALIZ, incluyendo acompañamiento experto y asesoría personalizada.',
                    'status' => 'published',
                    'featured' => false,
                    'cover_image' => 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
                    'created_by' => 1,
                    'updated_by' => 1,
                ]
            );

            ServiceImage::updateOrCreate(
                ['service_id' => $service->id, 'position' => 0],
                [
                    'path' => $service->cover_image,
                    'caption' => $service->title,
                ]
            );
        }
    }
}
