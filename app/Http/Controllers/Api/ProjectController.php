<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    protected function projects(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Residencial Mirador',
                'location' => 'Cusco, Perú',
                'type' => 'Vivienda multifamiliar',
                'status' => 'En ejecución',
                'area' => '4,800 m²',
                'description' => 'Conjunto habitacional con enfoque en iluminación natural, eficiencia energética y espacios comunitarios seguros.',
                'highlights' => ['Estructura antisísmica', 'Certificación energética aplicada', 'Áreas verdes integradas'],
                'image' => '/images/projects/residencial-mirador.jpg',
            ],
            [
                'id' => 2,
                'name' => 'Centro Empresarial Andino',
                'location' => 'Lima, Perú',
                'type' => 'Oficinas y coworking',
                'status' => 'Entregado',
                'area' => '7,200 m²',
                'description' => 'Edificio corporativo flexible con núcleos eficientes, terrazas activas y sistemas inteligentes de climatización.',
                'highlights' => ['Certificación LEED-ready', 'Auditorios modulares', 'Gestión BMS integrada'],
                'image' => '/images/projects/centro-andino.jpg',
            ],
            [
                'id' => 3,
                'name' => 'Hospital Valle Sur',
                'location' => 'Arequipa, Perú',
                'type' => 'Infraestructura de salud',
                'status' => 'Diseño',
                'area' => '9,500 m²',
                'description' => 'Clínica de media complejidad con flujos separados para pacientes, personal y suministros, priorizando bioseguridad.',
                'highlights' => ['Planeamiento hospitalario', 'Salas UCI y emergencia', 'Instalaciones sanitarias redundantes'],
                'image' => '/images/projects/hospital-valle-sur.jpg',
            ],
            [
                'id' => 4,
                'name' => 'Campus Educativo Horizonte',
                'location' => 'Trujillo, Perú',
                'type' => 'Educación',
                'status' => 'En permisos',
                'area' => '12,000 m²',
                'description' => 'Masterplan para colegio bilingüe con aulas bioclimáticas, laboratorios STEM y zonas deportivas techadas.',
                'highlights' => ['Diseño modular', 'Laboratorios especializados', 'Circulaciones seguras'],
                'image' => '/images/projects/campus-horizonte.jpg',
            ],
        ];
    }

    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->projects()]);
    }

    public function show(int $id): JsonResponse
    {
        $project = collect($this->projects())->firstWhere('id', $id);

        if (!$project) {
            return response()->json([
                'message' => 'Proyecto no encontrado',
            ], 404);
        }

        return response()->json(['data' => $project]);
    }
}
