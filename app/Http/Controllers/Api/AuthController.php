<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\DataNormalizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->merge([
            'email' => DataNormalizer::email($request->input('email')),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'country' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
        ]);

        $validated = $this->normalizeProfileData($validated);

        $user = User::create([
            ...$validated,
            'role' => 'client',
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->merge([
            'email' => DataNormalizer::email($request->input('email')),
        ]);

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Tu cuenta está desactivada. Contacta al soporte.'
            ], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if ($request->has('email')) {
            $request->merge([
                'email' => DataNormalizer::email($request->input('email')),
            ]);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'country' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'avatar' => 'nullable|image|max:2048',
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $validated = $this->normalizeProfileData($validated);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        if (isset($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['La contraseña actual no es correcta.'],
                ]);
            }

            $validated['password'] = Hash::make($validated['password']);
            unset($validated['current_password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'user' => $user,
        ]);
    }

    private function normalizeProfileData(array $data): array
    {
        foreach (['name', 'country', 'state', 'city'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = DataNormalizer::title($data[$field]);
            }
        }

        if (array_key_exists('email', $data)) {
            $data['email'] = DataNormalizer::email($data['email']);
        }

        if (array_key_exists('phone', $data)) {
            $data['phone'] = DataNormalizer::phone($data['phone']);
        }

        if (array_key_exists('bio', $data)) {
            $data['bio'] = DataNormalizer::text($data['bio']);
        }

        return $data;
    }
}
