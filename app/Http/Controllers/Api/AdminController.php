<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function statistics(Request $request)
    {
        $this->authorizeAdmin($request);

        return [
            'published_projects' => Project::where('status', 'published')->count(),
            'draft_projects' => Project::where('status', 'draft')->count(),
            'reviews_total' => Review::count(),
            'reviews_average' => Review::approved()->avg('rating'),
        ];
    }

    public function recentProjects(Request $request)
    {
        $this->authorizeAdmin($request);

        $projects = Project::with('categories')
            ->latest('published_at')
            ->take($request->input('limit', 5))
            ->get();

        return $projects;
    }

    protected function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || !in_array($request->user()->role, ['admin', 'master_admin'])) {
            abort(403, 'Solo administradores pueden acceder.');
        }
    }
}
