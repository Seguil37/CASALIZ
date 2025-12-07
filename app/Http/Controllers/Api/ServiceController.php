<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class ServiceController extends Controller
{
    protected array $services = [
        [
            'id' => 1,
            'name' => 'Diseño arquitectónico',
            'description' => 'Proyectos funcionales y estéticos que integran normativa peruana, eficiencia energética y experiencia de usuario.',
            'highlights' => ['Anteproyecto y planos de especialidades', 'Modelado 3D y recorridos virtuales', 'Coordinación multidisciplinaria'],
        ],
        [
            'id' => 2,
            'name' => 'Expedientes técnicos',
            'description' => 'Documentación completa para licitaciones y ejecución con metrados, memorias descriptivas y especificaciones.',
            'highlights' => ['Memoria y metrados detallados', 'Especificaciones técnicas', 'Planos listos para aprobación']
        ],
        [
            'id' => 3,
            'name' => 'Licencias de obra y edificación',
            'description' => 'Gestión integral ante municipalidades y entidades revisoras para asegurar permisos sin contratiempos.',
            'highlights' => ['Revisión normativa', 'Gestión documentaria', 'Acompañamiento en inspecciones']
        ],
        [
            'id' => 4,
            'name' => 'Regularización de construcciones',
            'description' => 'Levantamiento, diagnóstico y plan de regularización para obras existentes y saneamiento físico-legal.',
            'highlights' => ['Levantamiento arquitectónico', 'Informes técnicos', 'Plan de saneamiento']
        ],
        [
            'id' => 5,
            'name' => 'Ampliaciones y remodelaciones',
            'description' => 'Rediseño de espacios residenciales y corporativos con enfoque en eficiencia y confort.',
            'highlights' => ['Optimización de espacios', 'Selección de materiales', 'Supervisión de acabados']
        ],
        [
            'id' => 6,
            'name' => 'Supervisión de obra',
            'description' => 'Control de calidad, seguridad y cumplimiento de especificaciones durante la ejecución.',
            'highlights' => ['Seguimiento de cronograma', 'Control de calidad', 'Informes de avance']
        ],
    ];

    public function index()
    {
        return response()->json(['data' => $this->services]);
    }
}
