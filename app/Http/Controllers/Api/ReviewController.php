<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::with(['user', 'project'])
            ->approved()
            ->when($request->input('project_id'), fn($q, $project) => $q->where('project_id', $project))
            ->latest()
            ->paginate(15);

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|min:10|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
        ]);

        $user = $request->user();
        $project = Project::findOrFail($validated['project_id']);

        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imageUrls[] = $image->store('reviews', 'public');
            }
        }

        $existingReview = Review::withTrashed()
            ->where('user_id', $user->id)
            ->where('project_id', $project->id)
            ->first();

        $payload = [
            'user_id' => $user->id,
            'project_id' => $project->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'status' => 'approved',
            'images' => !empty($imageUrls) ? $imageUrls : ($existingReview?->images ?? null),
        ];

        if ($existingReview) {
            if ($existingReview->trashed()) {
                $existingReview->restore();
            }
            $existingReview->update($payload);
            $review = $existingReview;
            $code = 200;
        } else {
            $review = Review::create($payload);
            $code = 201;
        }

        return response()->json([
            'message' => 'Reseña registrada',
            'review' => $review->load('user'),
        ], $code);
    }

    public function markHelpful($id)
    {
        $review = Review::findOrFail($id);
        $review->increment('helpful_count');

        return response()->json([
            'message' => 'Marcado como útil',
            'helpful_count' => $review->helpful_count,
        ]);
    }
}
