<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Support\ModuleAccess;

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

        if (!$user || !$user->isAdmin() || !ModuleAccess::can($user, ModuleAccess::SERVICES)) {
            $query->where('status', 'published');
        } elseif ($request->filled('status') && $request->input('status') !== 'all') {
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

        if ($service->status !== 'published' && (!$user || !$user->isAdmin() || !ModuleAccess::can($user, ModuleAccess::SERVICES))) {
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
            'cover_image' => 'nullable|string|max:2048|required_without:cover_image_file',
            'cover_image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:cover_image',
            'images' => 'array|max:20',
            'images.*.path' => 'nullable|string|max:2048|required_without:images.*.file',
            'images.*.file' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:images.*.path',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $service = Service::create([
                ...collect($validated)->except('images')->toArray(),
                'slug' => $this->generateUniqueSlug($validated['title']),
                'created_by' => $request->user()->id,
                'updated_by' => $request->user()->id,
            ]);

            $folder = $this->serviceFolder($service);

            $coverImagePath = $this->storeImageFile(
                $request->file('cover_image_file'),
                $folder,
                'cover'
            ) ?? $validated['cover_image'] ?? null;

            $service->update(['cover_image' => $coverImagePath]);

            $this->syncImages(
                $service,
                $validated['images'] ?? [],
                $request,
                $folder
            );

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
            'cover_image' => 'sometimes|nullable|string|max:2048|required_without:cover_image_file',
            'cover_image_file' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:cover_image',
            'images' => 'array|max:20',
            'images.*.path' => 'nullable|string|max:2048|required_without:images.*.file',
            'images.*.file' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:5120|required_without:images.*.path',
            'images.*.caption' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $service, $request) {
            $service->update([
                ...collect($validated)->except('images')->toArray(),
                'slug' => isset($validated['title'])
                    ? $this->generateUniqueSlug($validated['title'], $service->id)
                    : $service->slug,
                'updated_by' => $request->user()->id,
            ]);

            $folder = $this->serviceFolder($service);

            $coverImagePath = $this->storeImageFile(
                $request->file('cover_image_file'),
                $folder,
                'cover'
            ) ?? $validated['cover_image'] ?? $service->cover_image;

            $service->update(['cover_image' => $coverImagePath]);

            if (array_key_exists('images', $validated)) {
                $service->images()->delete();
                $this->syncImages($service, $validated['images'], $request, $folder);
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

    protected function syncImages(Service $service, array $images, Request $request, string $folder): void
    {
        foreach ($images as $index => $image) {
            $file = $request->file("images.$index.file");
            $storedPath = $this->storeImageFile($file, $folder, "gallery-{$index}");
            $path = $storedPath ?? $image['path'] ?? null;

            if (!$path) {
                continue;
            }

            ServiceImage::create([
                'service_id' => $service->id,
                'path' => $path,
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

    protected function serviceFolder(Service $service): string
    {
        return "images/servicios/{$service->id}-{$service->slug}";
    }

    protected function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title) ?: 'servicio';
        $slug = $baseSlug;
        $suffix = 1;

        $exists = function (string $candidate) use ($ignoreId): bool {
            return Service::where('slug', $candidate)
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
