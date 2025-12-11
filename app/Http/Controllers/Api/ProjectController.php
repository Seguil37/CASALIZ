<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query()->with('featuredImages');

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('city')) {
            $query->where('city', $request->input('city'));
        }

        if ($request->filled('state')) {
            $query->where('state', $request->input('state'));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $query->where('status', 'published');

        return response()->json(
            $query->orderByDesc('published_at')->paginate(12)
        );
    }

    public function featured()
    {
        $projects = Project::where('status', 'published')
            ->where('is_featured', true)
            ->with('featuredImages')
            ->orderByDesc('published_at')
            ->take(8)
            ->get();

        return response()->json($projects);
    }

    public function show(Project $project)
    {
        if ($project->status !== 'published') {
            abort(404);
        }

        return response()->json(
            $project->load([
                'images' => fn ($query) => $query->orderBy('position'),
                'featuredImages',
                'reviews.user',
            ])
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:120',
            'country' => 'nullable|string|max:120',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'images' => 'array',
            'images.*.path' => 'required_with:images|string',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $project = Project::create([
                ...collect($validated)->except('images')->toArray(),
                'slug' => Str::slug($validated['title']),
                'published_at' => $validated['status'] === 'published'
                    ? now()
                    : null,
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            if (!empty($validated['images'])) {
                foreach ($validated['images'] as $index => $image) {
                    ProjectImage::create([
                        'project_id' => $project->id,
                        'path' => $image['path'],
                        'caption' => $image['caption'] ?? null,
                        'position' => $index,
                    ]);
                }
            }

            return response()->json($project->load('featuredImages'), 201);
        });
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:120',
            'country' => 'nullable|string|max:120',
            'status' => 'in:draft,published,archived',
            'is_featured' => 'boolean',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'images' => 'array',
            'images.*.path' => 'required_with:images|string',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $project, $request) {
            $project->update([
                ...collect($validated)->except('images')->toArray(),
                'slug' => isset($validated['title'])
                    ? Str::slug($validated['title'])
                    : $project->slug,
                'published_at' => ($validated['status'] ?? $project->status) === 'published'
                    ? ($project->published_at ?? now())
                    : null,
                'updated_by' => $request->user()->id,
            ]);

            if (array_key_exists('images', $validated)) {
                $project->images()->delete();
                foreach ($validated['images'] as $index => $image) {
                    ProjectImage::create([
                        'project_id' => $project->id,
                        'path' => $image['path'],
                        'caption' => $image['caption'] ?? null,
                        'position' => $index,
                    ]);
                }
            }

            return response()->json($project->load('featuredImages'));
        });
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        $project->delete();

        return response()->json(['message' => 'Proyecto eliminado']);
    }
}
