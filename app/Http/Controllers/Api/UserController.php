<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::whereIn('role', ['admin', 'master_admin'])
            ->orderBy('name')
            ->paginate(20);

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,master_admin',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            ...collect($validated)->except('password', 'is_active')->toArray(),
            'is_active' => $validated['is_active'] ?? true,
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:admin,master_admin',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $authUser = $request->user();

        if (!$authUser->isMasterAdmin()) {
            unset($validated['role'], $validated['is_active'], $validated['email']);
        }

        $desiredRole = $validated['role'] ?? $user->role;
        $desiredActive = array_key_exists('is_active', $validated)
            ? (bool) $validated['is_active']
            : $user->is_active;

        if ($authUser->id === $user->id) {
            if ($user->is_active && !$desiredActive) {
                throw ValidationException::withMessages([
                    'is_active' => 'No puedes desactivar tu propia cuenta.',
                ]);
            }

            if ($user->role === 'master_admin' && $desiredRole !== 'master_admin') {
                throw ValidationException::withMessages([
                    'role' => 'No puedes degradar tu propio rol de master admin.',
                ]);
            }
        }

        $demotingMaster = $user->role === 'master_admin' && $desiredRole !== 'master_admin';
        $deactivatingMaster = $user->role === 'master_admin' && $user->is_active && !$desiredActive;

        if (($demotingMaster || $deactivatingMaster) && $this->isLastActiveMaster($user)) {
            $errors = [];

            if ($demotingMaster) {
                $errors['role'] = 'Debe existir al menos un master admin activo en el sistema.';
            }

            if ($deactivatingMaster) {
                $errors['is_active'] = 'Debe existir al menos un master admin activo en el sistema.';
            }

            throw ValidationException::withMessages($errors);
        }

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user,
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        if ($request->user()->id === $user->id) {
            throw ValidationException::withMessages([
                'user' => 'No puedes eliminar tu propia cuenta.',
            ]);
        }

        if ($user->role === 'master_admin' && $this->isLastActiveMaster($user)) {
            throw ValidationException::withMessages([
                'user' => 'Debe existir al menos un master admin activo en el sistema.',
            ]);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente',
        ]);
    }

    private function isLastActiveMaster(User $target): bool
    {
        return User::where('role', 'master_admin')
            ->where('is_active', true)
            ->where('id', '!=', $target->id)
            ->doesntExist();
    }
}
