<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;

class CasalizCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Residencial',
            'Comercial',
            'Corporativo',
            'Remodelación',
            'Interiores 3D',
            'Casa de campo',
            'Multifamiliar',
            'Unifamiliar',
            'Habilitación urbana',
            'Subdivisión de lote',
        ];

        foreach ($categories as $index => $name) {
            Category::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => 'Categoría de proyecto de arquitectura',
                    'order' => $index,
                    'is_active' => true,
                ]
            );
        }
    }
}
