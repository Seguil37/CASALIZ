<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ProjectImagesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('project_images')->delete();
        
        DB::table('project_images')->insert(array (
            0 => 
            array (
                'id' => 1,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-1-694310fc452c9.jpg',
                'caption' => 'VISTA DEL PRIMER PISO',
                'position' => 1,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            1 => 
            array (
                'id' => 2,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-2-694310fc511b6.jpg',
                'caption' => 'LADO IZQUIERDO',
                'position' => 2,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            2 => 
            array (
                'id' => 3,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-3-694310fc52b34.jpg',
                'caption' => 'LADO DERECHO',
                'position' => 3,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            3 => 
            array (
                'id' => 4,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-4-694310fc540b6.jpg',
                'caption' => 'SALA',
                'position' => 4,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            4 => 
            array (
                'id' => 5,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-5-694310fc5561c.jpg',
                'caption' => 'COCINA',
                'position' => 5,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            5 => 
            array (
                'id' => 6,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-6-694310fc5b6e6.jpg',
                'caption' => 'CUARTO DORMITORIO',
                'position' => 6,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            6 => 
            array (
                'id' => 7,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-7-694310fc5e5b4.jpg',
                'caption' => 'FACHADA PRINCIPAL',
                'position' => 7,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            7 => 
            array (
                'id' => 8,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-8-694310fc61a86.jpg',
                'caption' => 'VISTA DEL SEGUNDO PISO',
                'position' => 8,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            8 => 
            array (
                'id' => 9,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-9-694310fc64be7.jpg',
                'caption' => 'PRIMER DORMITORIO',
                'position' => 9,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            9 => 
            array (
                'id' => 10,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-10-694310fc6713f.jpg',
                'caption' => 'FONDO POSTERIOR',
                'position' => 10,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            10 => 
            array (
                'id' => 11,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-11-694310fc69742.jpg',
                'caption' => 'TERCERO DORMITORIO',
                'position' => 11,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            11 => 
            array (
                'id' => 12,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-12-694310fc6c58d.jpg',
                'caption' => 'COMEDOR',
                'position' => 12,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            12 => 
            array (
                'id' => 13,
                'project_id' => 1,
                'path' => '/storage/images/proyectos/1-casa-de-campo-zurite/gallery-0-694310fc6eaa5.jpg',
                'caption' => NULL,
                'position' => 0,
                'created_at' => '2025-12-17 20:22:20',
                'updated_at' => '2025-12-17 20:22:20',
            ),
            13 => 
            array (
                'id' => 14,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-0-694312cf6705a.jpg',
                'caption' => 'FACHADA PRINCIPAL',
                'position' => 0,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            14 => 
            array (
                'id' => 15,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-1-694312cf6d180.jpg',
                'caption' => 'SALA',
                'position' => 1,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            15 => 
            array (
                'id' => 16,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-2-694312cf6ea6e.jpg',
                'caption' => 'CORTE PRIMER PISO',
                'position' => 2,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            16 => 
            array (
                'id' => 17,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-3-694312cf701da.jpg',
                'caption' => 'COMEDOR',
                'position' => 3,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            17 => 
            array (
                'id' => 18,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-4-694312cf74c43.jpg',
                'caption' => 'COCINA',
                'position' => 4,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            18 => 
            array (
                'id' => 19,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-5-694312cf786ed.jpg',
                'caption' => 'PRIMER DOMITORIO',
                'position' => 5,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            19 => 
            array (
                'id' => 20,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-6-694312cf80833.jpg',
                'caption' => 'SEGUNDO DORMITORIO',
                'position' => 6,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            20 => 
            array (
                'id' => 21,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-7-694312cf8fb21.jpg',
                'caption' => 'CORTE DE LOS DEMÁS PISOS',
                'position' => 7,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            21 => 
            array (
                'id' => 22,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-8-694312cf961aa.jpg',
                'caption' => 'SALA COMEDOR',
                'position' => 8,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            22 => 
            array (
                'id' => 23,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-9-694312cf99db0.jpg',
                'caption' => 'SALA',
                'position' => 9,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            23 => 
            array (
                'id' => 24,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-10-694312cf9b464.jpg',
                'caption' => 'COCINA',
                'position' => 10,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            24 => 
            array (
                'id' => 25,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-11-694312cf9c859.jpg',
                'caption' => 'PRIMER DORMITORIO',
                'position' => 11,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            25 => 
            array (
                'id' => 26,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-12-694312cf9fae3.jpg',
                'caption' => 'SEGUNDO DORMITORIO',
                'position' => 12,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            26 => 
            array (
                'id' => 27,
                'project_id' => 2,
                'path' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/gallery-13-694312cfa1d3d.jpg',
                'caption' => 'TERCER DORMITORIO',
                'position' => 13,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
            ),
            27 => 
            array (
                'id' => 28,
                'project_id' => 3,
                'path' => '/storage/images/proyectos/3-das/gallery-0-694321a95430c.jpg',
                'caption' => NULL,
                'position' => 0,
                'created_at' => '2025-12-17 21:33:29',
                'updated_at' => '2025-12-17 21:33:29',
            ),
        ));
        
        
    }
}