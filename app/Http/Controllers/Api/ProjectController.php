<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query()->with('featuredImages');

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');

            $query->where(function ($query) use ($searchTerm) {
                $query->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('city', 'like', "%{$searchTerm}%");
            });
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

        $user = $request->user('sanctum');

        if (!$user || !$user->isAdmin()) {
            $query->where('status', 'published');
        }

        $perPage = min(max((int) $request->input('per_page', 12), 1), 100);

        return response()->json(
            $query->orderByDesc(DB::raw('COALESCE(published_at, created_at)'))
                ->paginate($perPage)
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

    public function show(Request $request, Project $project)
    {
        $user = $request->user('sanctum');

        // Permitir ver si: está publicado O el usuario es admin O el usuario es el creador
        if ($project->status !== 'published' && (!$user || (!$user->isAdmin() && $project->created_by !== $user->id))) {
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
            'hero_image' => 'nullable|string|max:2048|required_without:hero_image_file',
            'hero_image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:hero_image',
            'images' => 'array',
            'images.*.path' => 'nullable|string|max:2048|required_without:images.*.file',
            'images.*.file' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:images.*.path',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $project = Project::create([
                ...collect($validated)->except('images')->toArray(),
                'slug' => $this->generateUniqueSlug($validated['title']),
                'published_at' => $validated['status'] === 'published'
                    ? now()
                    : null,
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            $folder = $this->projectFolder($project);

            $heroImage = $this->storeImageFile(
                $request->file('hero_image_file'),
                $folder,
                'hero'
            ) ?? $validated['hero_image'] ?? null;

            $project->update(['hero_image' => $heroImage]);

            $this->syncImages($project, $validated['images'] ?? [], $request, $folder);

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
            'hero_image' => 'sometimes|nullable|string|max:2048|required_without:hero_image_file',
            'hero_image_file' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:hero_image',
            'images' => 'array|max:20',
            'images.*.path' => 'nullable|string|max:2048|required_without:images.*.file',
            'images.*.file' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:images.*.path',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $project, $request) {
            $project->update([
                ...collect($validated)->except('images')->toArray(),
                'slug' => isset($validated['title'])
                    ? $this->generateUniqueSlug($validated['title'], $project->id)
                    : $project->slug,
                'published_at' => ($validated['status'] ?? $project->status) === 'published'
                    ? ($project->published_at ?? now())
                    : null,
                'updated_by' => $request->user()->id,
            ]);

            $folder = $this->projectFolder($project);

            $heroImage = $this->storeImageFile(
                $request->file('hero_image_file'),
                $folder,
                'hero'
            ) ?? $validated['hero_image'] ?? $project->hero_image;

            $project->update(['hero_image' => $heroImage]);

            if (array_key_exists('images', $validated)) {
                $project->images()->delete();
                $this->syncImages($project, $validated['images'], $request, $folder);
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

    protected function syncImages(Project $project, array $images, Request $request, string $folder): void
    {
        foreach ($images as $index => $image) {
            $file = $request->file("images.$index.file");
            $storedPath = $this->storeImageFile($file, $folder, "gallery-{$index}");
            $path = $storedPath ?? $image['path'] ?? null;

            if (!$path) {
                continue;
            }

            ProjectImage::create([
                'project_id' => $project->id,
                'path' => $path,
                'caption' => $image['caption'] ?? null,
                'position' => $index,
            ]);
        }
    }

    protected function storeImageFile($file, string $folder, string $prefix): ?string
    {
        if (!$file) {
            return null;
        }

        $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'jpg';
        $filename = "{$prefix}-" . uniqid() . ".{$extension}";

        $storedPath = $file->storeAs($folder, $filename, 'public');

        return Storage::url($storedPath);
    }

    protected function projectFolder(Project $project): string
    {
        return "images/proyectos/{$project->id}-{$project->slug}";
    }

    protected function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title) ?: 'proyecto';
        $slug = $baseSlug;
        $suffix = 1;

        $exists = function (string $candidate) use ($ignoreId): bool {
            return Project::where('slug', $candidate)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists();
        };

        while ($exists($slug)) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
