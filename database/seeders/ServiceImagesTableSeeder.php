<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceImagesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('service_images')->delete();
        
        DB::table('service_images')->insert(array (
            0 => 
            array (
                'id' => 2,
                'service_id' => 2,
                'path' => '/storage/images/servicios/2-tasacion-profesional-de-inmuebles/cover-69431614cdbc1.jpg',
                'caption' => 'Tasación Profesional de Inmuebles',
                'position' => 0,
                'created_at' => '2025-12-17 20:44:04',
                'updated_at' => '2025-12-17 20:44:04',
            ),
            1 => 
            array (
                'id' => 3,
                'service_id' => 1,
                'path' => '/storage/images/servicios/1-conformidad-de-obra-y-regularizacion-de-edificaciones/cover-69431480c39c4.jpg',
                'caption' => 'Conformidad de Obra y Regularización de Edificaciones',
                'position' => 0,
                'created_at' => '2025-12-17 20:44:14',
                'updated_at' => '2025-12-17 20:44:14',
            ),
            2 => 
            array (
                'id' => 4,
                'service_id' => 3,
                'path' => '/storage/images/servicios/3-asesoria-inmobiliaria-para-compra-segura-de-propiedades/cover-69431d415e3c4.jpg',
                'caption' => 'Asesoría Inmobiliaria para Compra Segura de Propiedades',
                'position' => 0,
                'created_at' => '2025-12-17 21:14:42',
                'updated_at' => '2025-12-17 21:14:42',
            ),
            3 => 
            array (
                'id' => 5,
                'service_id' => 4,
                'path' => '/storage/images/servicios/4-servicios-integrales-de-arquitectura-e-ingenieria/cover-69431df562e99.jpg',
                'caption' => 'Servicios Integrales de Arquitectura e Ingeniería',
                'position' => 0,
                'created_at' => '2025-12-17 21:17:41',
                'updated_at' => '2025-12-17 21:17:41',
            ),
            4 => 
            array (
                'id' => 12,
                'service_id' => 5,
                'path' => '/storage/images/servicios/5-apertura-y-actualizacion-de-carpeta-predial/cover-69431e4d96064.jpg',
                'caption' => 'Apertura y Actualización de Carpeta Predial',
                'position' => 0,
                'created_at' => '2025-12-17 21:34:00',
                'updated_at' => '2025-12-17 21:34:00',
            ),
            5 => 
            array (
                'id' => 13,
                'service_id' => 8,
                'path' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/gallery-0-694322f1340db.jpg',
                'caption' => NULL,
                'position' => 0,
                'created_at' => '2025-12-17 21:38:57',
                'updated_at' => '2025-12-17 21:38:57',
            ),
            6 => 
            array (
                'id' => 14,
                'service_id' => 8,
                'path' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/gallery-1-694322f13a41c.jpg',
                'caption' => NULL,
                'position' => 1,
                'created_at' => '2025-12-17 21:38:57',
                'updated_at' => '2025-12-17 21:38:57',
            ),
            7 => 
            array (
                'id' => 15,
                'service_id' => 8,
                'path' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/gallery-2-694322f13bcff.jpg',
                'caption' => NULL,
                'position' => 2,
                'created_at' => '2025-12-17 21:38:57',
                'updated_at' => '2025-12-17 21:38:57',
            ),
            8 => 
            array (
                'id' => 16,
                'service_id' => 8,
                'path' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/gallery-3-694322f13d427.jpg',
                'caption' => NULL,
                'position' => 3,
                'created_at' => '2025-12-17 21:38:57',
                'updated_at' => '2025-12-17 21:38:57',
            ),
            9 => 
            array (
                'id' => 17,
                'service_id' => 8,
                'path' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/gallery-4-694322f13ee72.jpg',
                'caption' => NULL,
                'position' => 4,
                'created_at' => '2025-12-17 21:38:57',
                'updated_at' => '2025-12-17 21:38:57',
            ),
            10 => 
            array (
                'id' => 18,
                'service_id' => 8,
                'path' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/gallery-5-694322f140a24.jpg',
                'caption' => NULL,
                'position' => 5,
                'created_at' => '2025-12-17 21:38:57',
                'updated_at' => '2025-12-17 21:38:57',
            ),
            11 => 
            array (
                'id' => 19,
                'service_id' => 9,
                'path' => '/storage/images/servicios/9-licencia-de-funcionamiento-para-establecimientos-comerciales/cover-694327ebd012b.jpg',
                'caption' => 'Licencia de Funcionamiento para Establecimientos Comerciales',
                'position' => 0,
                'created_at' => '2025-12-17 22:00:11',
                'updated_at' => '2025-12-17 22:00:11',
            ),
            12 => 
            array (
                'id' => 20,
                'service_id' => 10,
                'path' => '/storage/images/servicios/10-licencia-de-obra-para-construccion/cover-6943293bd08e0.jpg',
                'caption' => 'Licencia de Obra para Construcción',
                'position' => 0,
                'created_at' => '2025-12-17 22:05:47',
                'updated_at' => '2025-12-17 22:05:47',
            ),
            13 => 
            array (
                'id' => 21,
                'service_id' => 11,
                'path' => '/storage/images/servicios/11-independizacion-de-inmuebles/cover-694329917d768.jpg',
                'caption' => 'Independización de Inmuebles',
                'position' => 0,
                'created_at' => '2025-12-17 22:07:13',
                'updated_at' => '2025-12-17 22:07:13',
            ),
            14 => 
            array (
                'id' => 22,
                'service_id' => 12,
                'path' => '/storage/images/servicios/12-licencia-de-demolicion-de-inmuebles/cover-694329b30f68f.jpg',
                'caption' => 'Licencia de Demolición de Inmuebles',
                'position' => 0,
                'created_at' => '2025-12-17 22:07:47',
                'updated_at' => '2025-12-17 22:07:47',
            ),
            15 => 
            array (
                'id' => 23,
                'service_id' => 13,
                'path' => '/storage/images/servicios/13-licencia-de-habilitacion-urbana/cover-694329d1723e6.jpg',
                'caption' => 'Licencia de Habilitación Urbana',
                'position' => 0,
                'created_at' => '2025-12-17 22:08:17',
                'updated_at' => '2025-12-17 22:08:17',
            ),
            16 => 
            array (
                'id' => 24,
                'service_id' => 14,
                'path' => '/storage/images/servicios/14-subdivision-de-lotes/cover-69432a005699c.jpg',
                'caption' => 'Subdivisión de Lotes',
                'position' => 0,
                'created_at' => '2025-12-17 22:09:04',
                'updated_at' => '2025-12-17 22:09:04',
            ),
            17 => 
            array (
                'id' => 25,
                'service_id' => 15,
                'path' => '/storage/images/servicios/15-declaratoria-de-fabrica/cover-69432a19e7dbc.jpg',
                'caption' => 'Declaratoria de Fábrica',
                'position' => 0,
                'created_at' => '2025-12-17 22:09:29',
                'updated_at' => '2025-12-17 22:09:29',
            ),
            18 => 
            array (
                'id' => 28,
                'service_id' => 7,
                'path' => '/storage/images/servicios/7-regularizacion-e-independizacion-de-inmuebles-ley-no-30830/cover-69431fa90f4ee.jpg',
                'caption' => 'Regularización e Independización de Inmuebles – Ley N.º 30830',
                'position' => 0,
                'created_at' => '2025-12-17 22:13:49',
                'updated_at' => '2025-12-17 22:13:49',
            ),
            19 => 
            array (
                'id' => 31,
                'service_id' => 6,
                'path' => '/storage/images/servicios/6-apertura-de-carpeta-predial/cover-69431ed1b9541.jpg',
                'caption' => 'Apertura de Carpeta Predial',
                'position' => 0,
                'created_at' => '2025-12-17 22:14:43',
                'updated_at' => '2025-12-17 22:14:43',
            ),
        ));
        
        
    }
}