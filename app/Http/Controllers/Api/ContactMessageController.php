<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'service_type' => ['required', 'string', 'max:120', 'exists:services,slug'],
            'message' => ['required', 'string'],
        ]);

        $contact = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo.',
            'data' => $contact,
        ], 201);
    }
}
