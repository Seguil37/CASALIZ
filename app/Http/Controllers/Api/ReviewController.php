<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = ProjectReview::with('user')
            ->when($request->filled('project_id'), fn($q) => $q->where('project_id', $request->project_id))
            ->latest()
            ->paginate(20);

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $this->authorize('create', ProjectReview::class);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $project = Project::findOrFail($validated['project_id']);

        $review = ProjectReview::updateOrCreate(
            ['project_id' => $project->id, 'user_id' => $request->user()->id],
            [
                'rating' => $validated['rating'] ?? null,
                'comment' => $validated['comment'],
                'status' => 'approved',
            ]
        );

        return response()->json($review->load('user'), 201);
    }

    public function destroy(ProjectReview $review)
    {
        $this->authorize('delete', $review);
        $review->delete();

        return response()->json(['message' => 'Comentario eliminado']);
    }
}
