<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ModulePermissionController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureMaster($request);

        return response()->json([
            'modules' => ModuleAccess::modules(),
            'roles' => [
                'admin' => ModuleAccess::forRole('admin'),
                'operator' => ModuleAccess::forRole('operator'),
            ],
            'defaults' => [
                'admin' => ModuleAccess::defaults()['admin'],
                'operator' => ModuleAccess::defaults()['operator'],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $this->ensureMaster($request);

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'operator'])],
            'permissions' => ['required', 'array'],
        ]);

        return response()->json([
            'role' => $validated['role'],
            'permissions' => ModuleAccess::syncRole($validated['role'], $validated['permissions']),
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $this->ensureMaster($request);

        if ($user->isMasterAdmin()) {
            throw ValidationException::withMessages([
                'user' => 'El Master mantiene acceso total y no requiere permisos individuales.',
            ]);
        }

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
        ]);

        return response()->json([
            'user_id' => $user->id,
            'permissions' => ModuleAccess::syncUser($user, $validated['permissions']),
        ]);
    }

    private function ensureMaster(Request $request): void
    {
        if (!$request->user()?->isMasterAdmin()) {
            abort(403, 'Solo el Master puede administrar permisos.');
        }
    }
}
