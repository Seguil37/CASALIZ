<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query()->with('gallery');

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        $user = $request->user('sanctum');

        if (!$user || !$user->isAdmin()) {
            $query->where('status', 'published');
        } elseif ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $perPage = min(max((int) $request->input('per_page', 12), 1), 100);

        return response()->json(
            $query->orderByDesc('updated_at')->paginate($perPage)
        );
    }

    public function show(Request $request, Service $service)
    {
        $user = $request->user('sanctum');

        if ($service->status !== 'published' && (!$user || !$user->isAdmin())) {
            abort(404);
        }

        return response()->json(
            $service->load('gallery')
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', Service::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:150',
            'short_description' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:draft,published,archived',
            'featured' => 'boolean',
            'cover_image' => 'required|string',
            'images' => 'array',
            'images.*.path' => 'required_with:images|string',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $service = Service::create([
                ...collect($validated)->except('images')->toArray(),
                'slug' => Str::slug($validated['title']),
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            $this->syncImages($service, $validated['images'] ?? []);

            return response()->json($service->load('gallery'), 201);
        });
    }

    public function update(Request $request, Service $service)
    {
        $this->authorize('update', $service);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:150',
            'short_description' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'in:draft,published,archived',
            'featured' => 'boolean',
            'cover_image' => 'sometimes|string',
            'images' => 'array',
            'images.*.path' => 'required_with:images|string',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $service, $request) {
            $service->update([
                ...collect($validated)->except('images')->toArray(),
                'slug' => isset($validated['title']) ? Str::slug($validated['title']) : $service->slug,
                'updated_by' => $request->user()->id,
            ]);

            if (array_key_exists('images', $validated)) {
                $service->images()->delete();
                $this->syncImages($service, $validated['images']);
            }

            return response()->json($service->load('gallery'));
        });
    }

    public function destroy(Service $service)
    {
        $this->authorize('delete', $service);
        $service->delete();

        return response()->json(['message' => 'Servicio eliminado']);
    }

    protected function syncImages(Service $service, array $images): void
    {
        foreach ($images as $index => $image) {
            ServiceImage::create([
                'service_id' => $service->id,
                'path' => $image['path'],
                'caption' => $image['caption'] ?? null,
                'position' => $index,
            ]);
        }

        if (empty($images) && $service->cover_image) {
            ServiceImage::create([
                'service_id' => $service->id,
                'path' => $service->cover_image,
                'caption' => $service->title,
                'position' => 0,
            ]);
        }
    }
}
