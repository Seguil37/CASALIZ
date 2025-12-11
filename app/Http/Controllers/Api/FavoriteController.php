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
        $this->authorize('viewAny', Favorite::class);

        $favorites = $request->user()
            ->favoriteProjects()
            ->with('featuredImages')
            ->latest('favorites.created_at')
            ->paginate(12);

        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Favorite::class);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'project_id' => $validated['project_id'],
        ]);

        return response()->json(
            $favorite->load('project.featuredImages'),
            201
        );
    }

    public function destroy(Request $request, Project $project)
    {
        $favorite = Favorite::where('user_id', $request->user()->id)
            ->where('project_id', $project->id)
            ->firstOrFail();

        $this->authorize('delete', $favorite);

        $favorite->delete();

        return response()->json(['message' => 'Favorito eliminado']);
    }
}
