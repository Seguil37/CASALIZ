<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Project;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('manage-favorites');

        $favorites = Favorite::with('project.featuredImages')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($favorite) => $favorite->project);

        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $this->authorize('manage-favorites');

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $project = Project::findOrFail($validated['project_id']);

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'project_id' => $project->id,
        ]);

        return response()->json(['message' => 'Proyecto agregado a favoritos']);
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorize('manage-favorites');

        Favorite::where('user_id', $request->user()->id)
            ->where('project_id', $project->id)
            ->delete();

        return response()->json(['message' => 'Proyecto eliminado de favoritos']);
    }
}
