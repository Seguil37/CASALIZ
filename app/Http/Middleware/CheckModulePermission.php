<?php

namespace App\Http\Middleware;

use App\Support\ModuleAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModulePermission
{
    public function handle(Request $request, Closure $next, string ...$modules): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado. Por favor inicia sesión.',
            ], 401);
        }

        $canAccess = collect($modules)->contains(fn ($module) => ModuleAccess::can($user, $module));

        if (!$canAccess) {
            return response()->json([
                'message' => 'No tienes permiso para acceder a este módulo.',
            ], 403);
        }

        return $next($request);
    }
}
