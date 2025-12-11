<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['categories', 'creator'])
            ->when($request->input('location'), fn($q, $location) => $q->where('location', 'like', "%{$location}%"))
            ->when($request->input('type'), fn($q, $type) => $q->where('type', $type))
            ->when($request->input('status'), fn($q, $status) => $q->where('status', $status))
            ->when($request->input('year'), fn($q, $year) => $q->where('year', $year))
            ->when($request->input('category'), function ($q, $category) {
                $q->whereHas('categories', fn($cq) => $cq->where('slug', $category)->orWhere('id', $category));
            })
            ->when($request->input('search'), fn($q, $search) => $q->where('title', 'like', "%{$search}%"));

        $sort = $request->input('sort', 'recent');
        if ($sort === 'best') {
            $query->withAvg('reviews as reviews_avg', 'rating')->orderByDesc('reviews_avg');
        } elseif ($sort === 'popular') {
            $query->orderByDesc('published_at');
        } else {
            $query->latest();
        }

        return $query->paginate($request->input('per_page', 12));
    }

    public function show($id)
    {
        $project = Project::with(['categories', 'creator', 'reviews' => fn($q) => $q->approved()->with('user')])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return $project;
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateProject($request);
        $data['slug'] = Str::slug($data['title']);
        $data['created_by'] = $request->user()->id;

        $project = Project::create($data);
        $project->categories()->sync($request->input('categories', []));

        return response()->json($project->load(['categories', 'creator']), 201);
    }

    public function update(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $project = Project::findOrFail($id);
        $data = $this->validateProject($request, $project->id);
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $project->update($data);
        if ($request->has('categories')) {
            $project->categories()->sync($request->input('categories', []));
        }

        return $project->load(['categories', 'creator']);
    }

    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Proyecto eliminado']);
    }

    protected function validateProject(Request $request, $projectId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max(255)',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max(255)',
            'type' => 'nullable|string|max(255)',
            'status' => 'required|string|in:design,construction,delivered,draft,published',
            'year' => 'nullable|integer',
            'featured_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'tags' => 'nullable|array',
            'published_at' => 'nullable|date',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
        ]);
    }

    protected function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || !in_array($request->user()->role, ['admin', 'master_admin'])) {
            abort(403, 'Solo administradores pueden gestionar proyectos');
        }
    }
}
