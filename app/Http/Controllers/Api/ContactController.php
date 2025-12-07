<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'serviceType' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        Log::info('Solicitud de contacto CASALIZ', $data);

        return response()->json([
            'message' => 'Gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo en breve.',
        ], 201);
    }
}
