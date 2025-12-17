<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('projects')->delete();
        
        DB::table('projects')->insert(array (
            0 => 
            array (
                'id' => 1,
                'title' => 'Casa de Campo Zurite',
                'slug' => 'casa-de-campo-zurite',
                'type' => 'Residencial – Casa de campo',
                'city' => 'Zurite',
                'state' => 'Cusco',
                'country' => 'Peru',
                'is_featured' => 1,
                'hero_image' => '/storage/images/proyectos/1-casa-de-campo-zurite/hero-694310fadd23a.jpg',
                'status' => 'published',
                'published_at' => '2025-12-17 20:22:18',
                'summary' => 'Proyecto de vivienda unifamiliar tipo casa de campo, diseñada para integrarse al entorno natural de la comunidad de Janama, en Zurite. La propuesta prioriza confort, funcionalidad y una imagen arquitectónica contemporánea con materiales cálidos y soluciones espaciales eficientes.',
                'description' => 'La Casa de Campo Zurite es un proyecto residencial desarrollado en la comunidad de Janama, distrito de Zurite, provincia de Anta – Cusco. La vivienda fue concebida como una casa de descanso, integrándose armónicamente al paisaje rural y aprovechando las visuales, la iluminación natural y la ventilación cruzada.

El diseño arquitectónico presenta una volumetría moderna con cubiertas inclinadas, balcones y amplios vanos, combinando materiales tradicionales y contemporáneos. El programa arquitectónico incluye cuatro habitaciones, dos baños completos, sala, comedor, cocina funcional, lavandería y cochera, distribuidos de manera eficiente para garantizar confort y habitabilidad.

El proyecto responde a criterios de funcionalidad, estética y adaptación al entorno, ofreciendo una solución residencial sólida, confortable y acorde al contexto rural andino, cumpliendo con las normativas vigentes y las necesidades del usuario final.',
                'metadata' => NULL,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 20:22:18',
                'updated_at' => '2025-12-17 20:22:20',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'title' => 'Edificio Multifamiliar Ecológica Plaza',
                'slug' => 'edificio-multifamiliar-ecologica-plaza',
                'type' => 'Residencial – Edificio multifamiliar',
                'city' => 'Cusco',
                'state' => 'Cusco',
                'country' => 'Peru',
                'is_featured' => 1,
                'hero_image' => '/storage/images/proyectos/2-edificio-multifamiliar-ecologica-plaza/hero-694312cf5edd5.jpg',
                'status' => 'published',
                'published_at' => '2025-12-17 20:30:07',
                'summary' => 'Proyecto de edificio multifamiliar diseñado para uso residencial urbano, con departamentos funcionales y una propuesta arquitectónica contemporánea que optimiza el espacio, la iluminación natural y la habitabilidad en un entorno consolidado de la ciudad de Cusco.',
                'description' => 'El Edificio Multifamiliar Ecológica Plaza es un proyecto residencial desarrollado en la ciudad de Cusco, concebido para albergar múltiples unidades de vivienda con una distribución eficiente y funcional en cada nivel. El diseño arquitectónico responde a una estética moderna, con una fachada contemporánea que combina volúmenes limpios, materiales de bajo mantenimiento y amplias áreas acristaladas que favorecen la iluminación natural.

En el primer nivel se plantea una unidad residencial que incluye sala, comedor, cocina, dos dormitorios, lavandería, dos baños y cochera, garantizando accesibilidad y funcionalidad. Los niveles superiores cuentan con departamentos que incorporan sala, comedor, cocina, tres dormitorios, lavandería y dos baños, ofreciendo espacios cómodos y bien organizados para familias.

El proyecto prioriza la optimización del área construida, la correcta ventilación e iluminación de los ambientes, así como una adecuada relación entre espacio público y privado. Su ubicación estratégica y diseño eficiente lo convierten en una propuesta ideal para vivienda multifamiliar en contexto urbano, cumpliendo con la normativa vigente y las necesidades del mercado inmobiliario local.',
                'metadata' => NULL,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 20:30:07',
                'updated_at' => '2025-12-17 20:30:07',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'title' => 'DAS',
                'slug' => 'das',
                'type' => 'SAD',
                'city' => 'ASD',
                'state' => 'ASD',
                'country' => 'Peru',
                'is_featured' => 1,
                'hero_image' => '/storage/images/proyectos/3-das/hero-694321a94f285.jpg',
                'status' => 'published',
                'published_at' => '2025-12-17 21:33:29',
                'summary' => 'ASD',
                'description' => 'ASD',
                'metadata' => NULL,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:33:29',
                'updated_at' => '2025-12-17 21:33:34',
                'deleted_at' => '2025-12-17 21:33:34',
            ),
        ));
        
        
    }
}