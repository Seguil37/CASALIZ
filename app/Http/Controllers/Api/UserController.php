<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
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

    public function clients(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $search = trim((string) $request->query('search', ''));

        $clients = User::query()
            ->where('role', 'client')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone', 'role', 'is_active']);

        return response()->json($clients);
    }

    public function clientsDashboard(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $search = trim((string) $request->query('search', ''));
        $filter = trim((string) $request->query('filter', 'all'));
        $perPage = min(max((int) $request->query('per_page', 8), 1), 30);

        $query = User::query()
            ->where('role', 'client')
            ->when($filter === 'with_tramites', fn ($query) => $query->has('tramites'))
            ->when($filter === 'without_tramites', fn ($query) => $query->doesntHave('tramites'))
            ->when($filter === 'active_tramites', function ($query) {
                $query->whereHas('tramites', fn ($tramiteQuery) => $tramiteQuery->whereIn('status', [
                    Tramite::STATUS_PENDING,
                    Tramite::STATUS_IN_PROGRESS,
                    Tramite::STATUS_OBSERVED,
                ]));
            })
            ->when($filter === 'recurrent', fn ($query) => $query->has('tramites', '>=', 2))
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereHas('tramites', function ($tramiteQuery) use ($search) {
                            $tramiteQuery
                                ->where('code', 'like', "%{$search}%")
                                ->orWhere('project_name', 'like', "%{$search}%");
                        });
                });
            })
            ->withCount([
                'tramites',
                'tramites as active_tramites_count' => fn ($query) => $query->whereIn('status', [
                    Tramite::STATUS_PENDING,
                    Tramite::STATUS_IN_PROGRESS,
                    Tramite::STATUS_OBSERVED,
                ]),
                'tramites as completed_tramites_count' => fn ($query) => $query->where('status', Tramite::STATUS_COMPLETED),
            ])
            ->with([
                'tramites' => fn ($query) => $query
                    ->select('id', 'client_id', 'code', 'project_name', 'property_name', 'status', 'registered_at', 'due_date', 'updated_at')
                    ->orderByDesc('registered_at')
                    ->orderByDesc('id'),
            ])
            ->orderBy('name')
            ->select(['id', 'name', 'email', 'phone', 'role', 'city', 'state', 'country', 'is_active', 'created_at']);

        $paginator = $query->paginate($perPage)->withQueryString();
        $clients = $paginator->getCollection();

        $totalClients = User::where('role', 'client')->count();
        $clientsWithActive = User::where('role', 'client')
            ->whereHas('tramites', fn ($query) => $query->whereIn('status', [
                Tramite::STATUS_PENDING,
                Tramite::STATUS_IN_PROGRESS,
                Tramite::STATUS_OBSERVED,
            ]))
            ->count();
        $recurrentClients = User::where('role', 'client')
            ->has('tramites', '>=', 2)
            ->count();
        $unlinkedTramites = Tramite::whereNull('client_id')->count();

        return response()->json([
            'summary' => [
                'total_clients' => $totalClients,
                'clients_with_active_tramites' => $clientsWithActive,
                'recurrent_clients' => $recurrentClients,
                'unlinked_tramites' => $unlinkedTramites,
            ],
            'clients' => $clients->map(function (User $client) {
                $latestTramite = $client->tramites->sortByDesc('updated_at')->first();

                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'city' => $client->city,
                    'state' => $client->state,
                    'country' => $client->country,
                    'is_active' => $client->is_active,
                    'created_at' => optional($client->created_at)->toDateString(),
                    'tramites_count' => $client->tramites_count,
                    'active_tramites_count' => $client->active_tramites_count,
                    'completed_tramites_count' => $client->completed_tramites_count,
                    'latest_tramite' => $latestTramite ? $this->presentDashboardTramite($latestTramite) : null,
                    'tramites' => $client->tramites
                        ->take(6)
                        ->map(fn (Tramite $tramite) => $this->presentDashboardTramite($tramite))
                        ->values(),
                    'opportunities' => $this->clientOpportunities($client),
                ];
            })->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
            ],
        ]);
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

        if (!$request->user()->isMasterAdmin() && $validated['role'] === 'master_admin') {
            throw ValidationException::withMessages([
                'role' => 'Solo el Master puede crear usuarios Master.',
            ]);
        }

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

        if (!$authUser->isMasterAdmin() && !ModuleAccess::can($authUser, ModuleAccess::ADMIN_USERS)) {
            unset($validated['role'], $validated['is_active'], $validated['email']);
        }

        $validated = $this->normalizeUserData($validated);

        $desiredRole = $validated['role'] ?? $user->role;
        $desiredActive = array_key_exists('is_active', $validated)
            ? (bool) $validated['is_active']
            : $user->is_active;

        if (!$authUser->isMasterAdmin() && ($user->role === 'master_admin' || $desiredRole === 'master_admin')) {
            throw ValidationException::withMessages([
                'role' => 'Solo el Master puede administrar usuarios Master.',
            ]);
        }

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

    private function tramiteStatusLabel(?string $status): string
    {
        return match ($status) {
            Tramite::STATUS_IN_PROGRESS => 'En proceso',
            Tramite::STATUS_OBSERVED => 'Observado',
            Tramite::STATUS_COMPLETED => 'Finalizado',
            default => 'Pendiente',
        };
    }

    private function presentDashboardTramite(Tramite $tramite): array
    {
        return [
            'id' => $tramite->id,
            'code' => $tramite->code,
            'project_name' => $tramite->project_name,
            'property_name' => $tramite->property_name,
            'status' => $tramite->status,
            'status_label' => $this->tramiteStatusLabel($tramite->status),
            'registered_at' => optional($tramite->registered_at)->toDateString(),
            'due_date' => optional($tramite->due_date)->toDateString(),
            'updated_at' => optional($tramite->updated_at)->toISOString(),
        ];
    }

    private function clientOpportunities(User $client): array
    {
        $tramiteText = $client->tramites
            ->map(fn (Tramite $tramite) => strtolower("{$tramite->project_name} {$tramite->code}"))
            ->implode(' ');

        if ($client->tramites_count >= 2) {
            return ['Cliente recurrente: revisar beneficios, seguimiento preferente o paquete de servicios.'];
        }

        if (str_contains($tramiteText, 'licencia')) {
            return ['Recomendar declaratoria de fabrica o regularizacion posterior a la licencia.'];
        }

        if (str_contains($tramiteText, 'saneamiento') || str_contains($tramiteText, 'compra')) {
            return ['Recomendar revision documental, tasacion o saneamiento fisico legal complementario.'];
        }

        if ($client->active_tramites_count > 0) {
            return ['Tiene tramites activos: mantener comunicacion y validar proximas fechas.'];
        }

        return ['Sin oportunidad automatica. Revisar historial antes de contactar.'];
    }
}
