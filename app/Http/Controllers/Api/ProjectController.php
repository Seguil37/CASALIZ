<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::orderBy('created_at', 'desc')->get();

        return response()->json($projects);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json($project);
    }
}
