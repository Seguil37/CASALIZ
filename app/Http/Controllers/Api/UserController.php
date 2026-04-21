<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\DataNormalizer;
use App\Support\ModuleAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $search = trim((string) $request->query('search', ''));
        $matchingRoles = $this->matchingRolesForSearch($search);

        $users = User::whereIn('role', ['admin', 'master_admin', 'operator'])
            ->when($search !== '', function ($query) use ($search, $matchingRoles) {
                $query->where(function ($innerQuery) use ($search, $matchingRoles) {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");

                    if ($matchingRoles !== []) {
                        $innerQuery->orWhereIn('role', $matchingRoles);
                    }
                });
            })
            ->orderBy('name')
            ->paginate(8)
            ->withQueryString();

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $request->merge([
            'email' => DataNormalizer::email($request->input('email')),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,master_admin,operator',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $validated = $this->normalizeUserData($validated);

        $user = User::create([
            ...collect($validated)->except('password', 'is_active')->toArray(),
            'is_active' => $validated['is_active'] ?? true,
            'password' => Hash::make($validated['password']),
        ]);

        ModuleAccess::syncUserDefaults($user);

        return response()->json($user->fresh(), 201);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        if ($request->has('email')) {
            $request->merge([
                'email' => DataNormalizer::email($request->input('email')),
            ]);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:admin,master_admin,operator',
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

        $validated = $this->normalizeUserData($validated);

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

        $roleChanged = array_key_exists('role', $validated) && $validated['role'] !== $user->role;

        $user->update($validated);

        if ($roleChanged) {
            ModuleAccess::syncUserDefaults($user->fresh());
        }

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user->fresh(),
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

    private function matchingRolesForSearch(string $search): array
    {
        $term = Str::of($search)->ascii()->lower()->squish()->toString();

        if (Str::length($term) < 3) {
            return [];
        }

        if (Str::contains($term, 'master')) {
            return ['master_admin'];
        }

        $aliases = [
            'admin' => ['admin', 'administrador', 'administradora', 'administradores'],
            'master_admin' => ['master', 'master admin', 'admin master', 'administrador master', 'master_admin'],
            'operator' => ['operator', 'operador', 'operadora', 'operativo', 'operativa', 'operativos'],
        ];

        return collect($aliases)
            ->filter(fn (array $roleAliases) => collect($roleAliases)->contains(
                fn (string $alias) => Str::contains($alias, $term) || Str::contains($term, $alias)
            ))
            ->keys()
            ->values()
            ->all();
    }

    private function normalizeUserData(array $data): array
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
