<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->withCount('projects')
            ->get();

        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->with(['projects' => function($query) {
                $query->with(['categories', 'creator'])->limit(12);
            }])
            ->firstOrFail();

        return response()->json($category);
    }
}