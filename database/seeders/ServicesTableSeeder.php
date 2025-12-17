<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('services')->delete();
        
        DB::table('services')->insert(array (
            0 => 
            array (
                'id' => 1,
                'title' => 'Conformidad de Obra y Regularización de Edificaciones',
                'slug' => 'conformidad-de-obra-y-regularizacion-de-edificaciones',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Asegura la legalidad de tu proyecto culminado mediante el trámite de Conformidad de Obra. Nuestro equipo se encarga de todo el proceso técnico y administrativo de manera rápida y eficiente.',
                'description' => 'El servicio de Conformidad de Obra está dirigido a propietarios que han culminado la construcción de su vivienda, edificio o proyecto inmobiliario y requieren regularizarlo conforme a la normativa vigente.

En CASALIZ Arquitectos Ingenieros nos encargamos integralmente de los trámites necesarios ante la municipalidad, incluyendo la verificación técnica, revisión de planos, cumplimiento normativo y gestión administrativa, garantizando que la edificación obtenga la conformidad correspondiente.

Este servicio permite asegurar la legalidad del inmueble, facilitar futuras independizaciones, declaratoria de fábrica, compra-venta o financiamiento, evitando observaciones y retrasos. Nuestro enfoque prioriza un proceso claro, confiable y ágil, adaptado a las necesidades de cada cliente.',
                'status' => 'published',
                'featured' => 1,
                'cover_image' => '/storage/images/servicios/1-conformidad-de-obra-y-regularizacion-de-edificaciones/cover-69431480c39c4.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 20:37:20',
                'updated_at' => '2025-12-17 20:44:14',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'title' => 'Tasación Profesional de Inmuebles',
                'slug' => 'tasacion-profesional-de-inmuebles',
                'category' => 'Servicios Inmobiliarios',
                'short_description' => 'Obtén una tasación profesional y conoce el valor real de tu propiedad. Evaluamos departamentos, viviendas y terrenos considerando ubicación, estado y características del inmueble.',
                'description' => 'El servicio de Tasación Profesional de Inmuebles permite determinar el valor comercial real de una propiedad, ya sea un departamento, vivienda o terreno, mediante un análisis técnico especializado.

En CASALIZ Arquitectos Ingenieros realizamos la evaluación considerando factores clave como la ubicación, el estado de conservación, el área, las características constructivas y el contexto urbano o rural del inmueble. La tasación es fundamental para operaciones de compra y venta, solicitudes de créditos hipotecarios, procesos de herencia o división patrimonial, así como trámites judiciales o notariales.

Nuestro equipo simplifica todo el proceso, brindando un servicio confiable, preciso y transparente, respaldado por criterios técnicos y normativa vigente, garantizando resultados claros y útiles para la toma de decisiones.',
                'status' => 'published',
                'featured' => 1,
                'cover_image' => '/storage/images/servicios/2-tasacion-profesional-de-inmuebles/cover-69431614cdbc1.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 20:44:04',
                'updated_at' => '2025-12-17 20:44:04',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'title' => 'Asesoría Inmobiliaria para Compra Segura de Propiedades',
                'slug' => 'asesoria-inmobiliaria-para-compra-segura-de-propiedades',
                'category' => 'Servicios Inmobiliarios',
                'short_description' => 'Evita riesgos y asegura tu inversión al comprar un departamento o terreno. Brindamos asesoría profesional integral durante todo el proceso de adquisición.',
                'description' => 'El servicio de Asesoría Inmobiliaria para Compra Segura de Propiedades está orientado a personas que desean adquirir un departamento o terreno con total seguridad y respaldo técnico–legal.

En CASALIZ Arquitectos Ingenieros acompañamos al cliente en todo el proceso de compra, realizando la revisión legal del inmueble, la evaluación del valor real de mercado y la verificación de documentos, cargas y posibles observaciones. Este servicio permite prevenir estafas, sobrevaloraciones y problemas legales futuros.

Nuestro enfoque se basa en brindar una asesoría clara, confiable y profesional, asegurando que cada inversión inmobiliaria se realice con información verificada y decisiones bien fundamentadas.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/3-asesoria-inmobiliaria-para-compra-segura-de-propiedades/cover-69431d415e3c4.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:14:41',
                'updated_at' => '2025-12-17 21:14:42',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => 4,
                'title' => 'Servicios Integrales de Arquitectura e Ingeniería',
                'slug' => 'servicios-integrales-de-arquitectura-e-ingenieria',
                'category' => 'Diseño, Construcción y Regularización Inmobiliaria',
                'short_description' => 'Servicios integrales de arquitectura e ingeniería en Cusco. Diseñamos, regularizamos y gestionamos licencias para garantizar la legalidad y funcionalidad de tu inversión inmobiliaria.',
                'description' => 'En CASALIZ Arquitectos Ingenieros brindamos servicios integrales de arquitectura e ingeniería, orientados a cubrir todas las etapas de un proyecto inmobiliario, desde el diseño hasta la regularización y obtención de licencias.

Nuestro equipo ofrece soluciones completas que incluyen diseño de vivienda, regularización de construcciones conforme a la Ley 30830, licencias de obra y demolición, declaratoria de fábrica, independización de inmuebles, licencias de funcionamiento, prescripción adquisitiva de dominio, habilitación urbana y subdivisión de lotes.

Nos enfocamos en garantizar la legalidad, funcionalidad y seguridad jurídica de cada propiedad, acompañando al cliente con asesoría técnica y administrativa especializada. Trabajamos con criterios profesionales, cumpliendo la normativa vigente y asegurando que cada inversión se realice con respaldo y confianza.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/4-servicios-integrales-de-arquitectura-e-ingenieria/cover-69431df562e99.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:17:41',
                'updated_at' => '2025-12-17 21:17:41',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => 5,
                'title' => 'Apertura y Actualización de Carpeta Predial',
                'slug' => 'apertura-y-actualizacion-de-carpeta-predial',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Gestionamos la apertura y actualización de tu carpeta predial ante la municipalidad para evitar multas, observaciones y problemas legales futuros con tu propiedad.',
                'description' => 'El servicio de Apertura y Actualización de Carpeta Predial está dirigido a propietarios que aún no han registrado su inmueble en la municipalidad o que necesitan actualizar la información tras la compra o venta de una propiedad.

En CASALIZ Arquitectos Ingenieros nos encargamos de todo el proceso administrativo y técnico, incluyendo la revisión de la documentación, actualización de datos del propietario y gestión ante la municipalidad correspondiente. Este trámite es fundamental para evitar multas, trabas legales y futuros inconvenientes relacionados con terrenos o edificaciones.

Nuestro servicio garantiza un proceso rápido, seguro y confiable, asegurando que la propiedad se encuentre correctamente registrada y en regla, brindando tranquilidad y respaldo legal al propietario.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/5-apertura-y-actualizacion-de-carpeta-predial/cover-69431e4d96064.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:19:09',
                'updated_at' => '2025-12-17 21:34:00',
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id' => 6,
                'title' => 'Apertura de Carpeta Predial',
                'slug' => 'apertura-de-carpeta-predial',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Apertura y actualización de carpeta predial ante la municipalidad para registrar correctamente tu propiedad y evitar multas o problemas legales futuros.',
                'description' => 'El servicio de Apertura de Carpeta Predial está dirigido a propietarios que aún no han registrado su inmueble en la municipalidad o que requieren actualizar la información luego de una compra, venta o transferencia de propiedad.

En CASALIZ Arquitectos Ingenieros gestionamos de manera integral la apertura y regularización de la carpeta predial, revisando la documentación necesaria, actualizando los datos del propietario y realizando el trámite correspondiente ante la municipalidad. Este proceso es fundamental para evitar multas, observaciones administrativas y trabas legales relacionadas con terrenos o edificaciones.

Nuestro equipo garantiza un servicio rápido, seguro y confiable, asegurando que tu propiedad quede correctamente registrada y en regla, brindándote tranquilidad y respaldo legal.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/6-apertura-de-carpeta-predial/cover-69431ed1b9541.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:21:21',
                'updated_at' => '2025-12-17 22:14:43',
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id' => 7,
                'title' => 'Regularización e Independización de Inmuebles – Ley N.º 30830',
                'slug' => 'regularizacion-e-independizacion-de-inmuebles-ley-no-30830',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Regularizamos edificaciones y gestionamos la independización de departamentos conforme a la Ley N.º 30830, de manera rápida, segura y conforme a la normativa vigente.',
                'description' => 'El servicio de Regularización e Independización de Inmuebles – Ley N.º 30830 está dirigido a propietarios que han construido, ampliado, remodelado o demolido una edificación y requieren regularizarla legalmente, así como independizar departamentos o unidades inmobiliarias.

De acuerdo con la Ley N.º 30830, pueden regularizarse edificaciones ejecutadas hasta el 31 de diciembre de 2016, incluyendo viviendas unifamiliares, multifamiliares, centros comerciales, mercados y locales comerciales.

En CASALIZ Arquitectos Ingenieros nos encargamos de todo el proceso técnico y administrativo, desde la evaluación del inmueble, elaboración y revisión de planos, hasta la gestión del trámite ante las entidades correspondientes, garantizando un proceso ágil, confiable y transparente.

Este servicio permite otorgar seguridad jurídica a la propiedad, facilitar futuras ventas, herencias o trámites notariales, y asegurar que el inmueble cumpla con la normativa vigente.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/7-regularizacion-e-independizacion-de-inmuebles-ley-no-30830/cover-69431fa90f4ee.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:24:57',
                'updated_at' => '2025-12-17 22:13:49',
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id' => 8,
                'title' => 'Diseño Arquitectónico de Viviendas y Edificaciones',
                'slug' => 'diseno-arquitectonico-de-viviendas-y-edificaciones',
                'category' => 'Diseño, Construcción y Regularización Inmobiliaria',
                'short_description' => 'Diseñamos tu vivienda o edificación a medida, desarrollando propuestas arquitectónicas completas con planos técnicos y visualización 3D hasta lograr el diseño ideal para tu proyecto.',
                'description' => 'El servicio de Diseño Arquitectónico de Viviendas y Edificaciones está orientado a personas que desean desarrollar su proyecto desde cero o mejorar una propuesta existente, convirtiendo su idea en un diseño funcional, estético y técnicamente viable.

En CASALIZ Arquitectos Ingenieros realizamos diseños personalizados, proponiendo alternativas hasta encontrar el diseño soñado del cliente. El servicio incluye la elaboración de planos de arquitectura, estructura, instalaciones sanitarias y eléctricas, así como el diseño 3D de fachada e interiores para una correcta visualización del proyecto.

Además, se entrega material gráfico y audiovisual, incluyendo recorridos y videos en 3D, permitiendo comprender el proyecto antes de su ejecución. Al finalizar, el cliente recibe toda la información organizada en un portafolio completo, listo para gestión, construcción o trámites posteriores.

Nuestro enfoque combina creatividad, funcionalidad y cumplimiento normativo, garantizando un proyecto sólido y adaptable a las necesidades del usuario.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/8-diseno-arquitectonico-de-viviendas-y-edificaciones/cover-6943205284f94.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 21:27:46',
                'updated_at' => '2025-12-17 21:27:46',
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id' => 9,
                'title' => 'Licencia de Funcionamiento para Establecimientos Comerciales',
                'slug' => 'licencia-de-funcionamiento-para-establecimientos-comerciales',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Gestionamos la Licencia de Funcionamiento para que tu negocio opere legalmente, cumpliendo con todos los requisitos municipales vigentes en Cusco.',
                'description' => 'El servicio de Licencia de Funcionamiento para Establecimientos Comerciales está dirigido a personas y empresas que desean iniciar o formalizar un negocio, garantizando el cumplimiento de la normativa municipal correspondiente.

En CASALIZ Arquitectos Ingenieros brindamos asesoría integral durante todo el proceso, desde la revisión del local y la documentación requerida, hasta la gestión del trámite ante la municipalidad. Nos aseguramos de que el establecimiento cumpla con las condiciones técnicas, de seguridad y zonificación necesarias para operar legalmente.

Este servicio permite evitar sanciones, multas o clausuras, asegurando que el negocio funcione de manera formal y segura. Nuestro enfoque es rápido, confiable y transparente, acompañando al cliente hasta la obtención de la licencia correspondiente.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/9-licencia-de-funcionamiento-para-establecimientos-comerciales/cover-694327ebd012b.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:00:11',
                'updated_at' => '2025-12-17 22:00:11',
                'deleted_at' => NULL,
            ),
            9 => 
            array (
                'id' => 10,
                'title' => 'Licencia de Obra para Construcción',
                'slug' => 'licencia-de-obra-para-construccion',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Gestionamos tu Licencia de Obra para que inicies tu construcción cumpliendo con todos los requisitos legales y evitando retrasos o sanciones municipales.',
                'description' => 'El servicio de Licencia de Obra para Construcción está dirigido a propietarios y promotores que planean iniciar una nueva construcción y requieren autorización municipal previa.

En CASALIZ Arquitectos Ingenieros brindamos asesoría integral durante todo el proceso, desde la revisión y elaboración de la documentación técnica hasta la gestión del trámite ante la municipalidad. Si el cliente no cuenta con los requisitos completos, nuestro equipo se encarga de elaborarlos, incluyendo ficha registral, plano de ubicación, planos de arquitectura (plantas, cortes y elevaciones), memoria descriptiva por especialidad, planos estructurales y planos de instalaciones sanitarias.

Este servicio garantiza que el proyecto cumpla con la normativa vigente desde el inicio, evitando observaciones, retrasos y problemas legales durante la ejecución de la obra. Nuestro enfoque es ordenado, técnico y eficiente, acompañando al cliente hasta la obtención de la licencia correspondiente.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/10-licencia-de-obra-para-construccion/cover-6943293bd08e0.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:05:47',
                'updated_at' => '2025-12-17 22:05:47',
                'deleted_at' => NULL,
            ),
            10 => 
            array (
                'id' => 11,
                'title' => 'Independización de Inmuebles',
                'slug' => 'independizacion-de-inmuebles',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Divide tu propiedad en unidades independientes de forma legal y segura, obteniendo su propia partida registral en SUNARP para vender o transferir sin complicaciones.',
                'description' => 'El servicio de Independización de Inmuebles está dirigido a propietarios que desean dividir una construcción en unidades inmobiliarias independientes, ya sea para vender, transferir o regularizar cada unidad de manera individual.

En CASALIZ Arquitectos Ingenieros gestionamos todo el proceso técnico y legal necesario para la independización, incluyendo la elaboración y revisión de planos, verificación del cumplimiento normativo y la tramitación ante SUNARP para la obtención de partidas registrales independientes.

Este servicio permite realizar la venta de unidades inmobiliarias de forma legal, segura y transparente, evitando observaciones registrales y problemas futuros. Nuestro equipo acompaña al cliente en cada etapa, garantizando un proceso ordenado, confiable y eficiente.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/11-independizacion-de-inmuebles/cover-694329917d768.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:07:13',
                'updated_at' => '2025-12-17 22:07:13',
                'deleted_at' => NULL,
            ),
            11 => 
            array (
                'id' => 12,
                'title' => 'Licencia de Demolición de Inmuebles',
                'slug' => 'licencia-de-demolicion-de-inmuebles',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Gestionamos la Licencia de Demolición para que puedas demoler tu inmueble de forma legal, segura y sin multas, cumpliendo con la normativa municipal vigente.',
                'description' => 'El servicio de Licencia de Demolición de Inmuebles está dirigido a propietarios que desean demoler una edificación existente para construir una nueva, realizar una renovación integral o liberar un terreno, cumpliendo con todos los requisitos legales.

En CASALIZ Arquitectos Ingenieros nos encargamos de la gestión completa del trámite ante la municipalidad, incluyendo la revisión técnica del inmueble, la elaboración y presentación de la documentación requerida y el acompañamiento durante todo el proceso administrativo.

Este servicio permite asegurar la legalidad de la demolición, evitar multas o sanciones, y garantizar la seguridad durante la ejecución de los trabajos. Nuestro equipo trabaja de manera ordenada, responsable y eficiente, brindando tranquilidad al cliente desde el inicio hasta la obtención de la licencia correspondiente.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/12-licencia-de-demolicion-de-inmuebles/cover-694329b30f68f.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:07:47',
                'updated_at' => '2025-12-17 22:07:47',
                'deleted_at' => NULL,
            ),
            12 => 
            array (
                'id' => 13,
                'title' => 'Licencia de Habilitación Urbana',
                'slug' => 'licencia-de-habilitacion-urbana',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Gestionamos la Licencia de Habilitación Urbana para que puedas dividir y vender terrenos de gran tamaño de forma legal, segura y conforme a la normativa municipal vigente.',
                'description' => 'El servicio de Licencia de Habilitación Urbana está dirigido a propietarios que cuentan con terrenos de gran extensión y desean venderlos en partes o lotes de manera formal y legal.

Este trámite es obligatorio para terrenos que requieren la implementación de obras de accesibilidad y servicios básicos, como redes de agua y desagüe, distribución de energía eléctrica, iluminación pública, pistas, veredas y delimitación de áreas públicas y privadas.

En CASALIZ Arquitectos Ingenieros nos encargamos de todo el proceso: evaluación técnica del terreno, elaboración de planos y documentos, coordinación con las entidades correspondientes y gestión integral ante la municipalidad, asegurando que el terreno quede habilitado para su comercialización.

Nuestro servicio garantiza que la habilitación urbana se realice de forma ordenada, eficiente y conforme a la ley, evitando observaciones, retrasos y sanciones futuras.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/13-licencia-de-habilitacion-urbana/cover-694329d1723e6.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:08:17',
                'updated_at' => '2025-12-17 22:08:17',
                'deleted_at' => NULL,
            ),
            13 => 
            array (
                'id' => 14,
                'title' => 'Subdivisión de Lotes',
                'slug' => 'subdivision-de-lotes',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Dividimos tu lote en unidades independientes mediante la Subdivisión de Lotes, permitiéndote vender partes de tu propiedad de forma legal, segura y conforme a la normativa vigente.',
                'description' => 'El servicio de Subdivisión de Lotes está dirigido a propietarios que desean dividir su terreno en dos o más unidades independientes para su venta, transferencia o futura edificación.

Este trámite permite que cada nueva unidad resultante cuente con su propia partida registral en SUNARP, requisito indispensable para realizar la venta de una parte del lote de forma legal y segura.

En CASALIZ Arquitectos Ingenieros nos encargamos de todo el proceso: evaluación técnica del terreno, elaboración de planos de subdivisión, cumplimiento de la normativa municipal y registral, y gestión integral ante la municipalidad y SUNARP.

Nuestro objetivo es que puedas subdividir tu lote sin complicaciones, evitando observaciones, retrasos y problemas legales, garantizando que cada unidad resultante quede debidamente registrada y lista para su comercialización independiente.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/14-subdivision-de-lotes/cover-69432a005699c.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:09:04',
                'updated_at' => '2025-12-17 22:09:04',
                'deleted_at' => NULL,
            ),
            14 => 
            array (
                'id' => 15,
                'title' => 'Declaratoria de Fábrica',
                'slug' => 'declaratoria-de-fabrica',
                'category' => 'Trámites y Regularización Inmobiliaria',
                'short_description' => 'Obtén la Declaratoria de Fábrica y certifica legalmente tu edificación, permitiéndote registrar la construcción en SUNARP y habilitar procesos posteriores como la independización de unidades inmobiliarias.',
                'description' => 'La Declaratoria de Fábrica es el trámite legal mediante el cual se reconoce oficialmente una edificación construida sobre un predio, certificando su existencia, características y legalidad ante la municipalidad y SUNARP.

Este proceso se realiza posteriormente a la Conformidad de Obra y es indispensable para registrar la edificación en la partida registral del predio. Una vez inscrita la Declaratoria de Fábrica en SUNARP, el propietario puede proceder a la independización de las unidades inmobiliarias del edificio, facilitando su venta, alquiler o transferencia de forma legal.

En CASALIZ Arquitectos Ingenieros nos encargamos de todo el procedimiento: revisión técnica del inmueble, elaboración de planos conforme a obra, memoria descriptiva, gestión municipal y registral, y seguimiento hasta la correcta inscripción en SUNARP.

Nuestro objetivo es simplificar el proceso, evitar observaciones y garantizar que tu propiedad cuente con respaldo legal, protegiendo tu inversión y permitiéndote realizar trámites posteriores sin inconvenientes.',
                'status' => 'published',
                'featured' => 0,
                'cover_image' => '/storage/images/servicios/15-declaratoria-de-fabrica/cover-69432a19e7dbc.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2025-12-17 22:09:29',
                'updated_at' => '2025-12-17 22:09:29',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}