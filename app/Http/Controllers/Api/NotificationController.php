<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\TramiteNotificationService;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request, TramiteNotificationService $notifications)
    {
        $user = $request->user();
        $notifications->generateDueNotificationsFor($user);

        $perPage = min((int) $request->get('per_page', 20), 100);
        $query = $user->notifications()->latest();

        if ($request->filled('read')) {
            $request->boolean('read') ? $query->whereNotNull('read_at') : $query->whereNull('read_at');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->get('type'));
        }

        $paginator = $query->paginate($perPage);
        $items = $paginator->getCollection()->map(fn (DatabaseNotification $notification): array => [
            'id' => $notification->id,
            'type' => $notification->type,
            'data' => $notification->data,
            'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
        ]);

        return response()->json([
            'items' => $items,
            'unread_count' => $user->unreadNotifications()->count(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
            ],
        ]);
    }

    public function markAsRead(Request $request, string $notificationId)
    {
        $notification = $request->user()->notifications()->findOrFail($notificationId);
        $notification->markAsRead();

        return response()->json(['message' => 'Notificacion marcada como leida']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Notificaciones marcadas como leidas']);
    }

    public function preferences(Request $request)
    {
        $existing = DB::table('notification_preferences')
            ->where('user_id', $request->user()->id)
            ->pluck('enabled', 'type');

        $labels = TramiteNotificationService::labels();

        return response()->json([
            'types' => collect(TramiteNotificationService::TYPES)
                ->map(fn (string $type): array => [
                    'type' => $type,
                    'label' => $labels[$type] ?? $type,
                    'enabled' => $existing->has($type) ? (bool) $existing[$type] : true,
                ])
                ->values(),
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $data = $request->validate([
            'preferences' => 'required|array',
            'preferences.*.type' => 'required|string|in:' . implode(',', TramiteNotificationService::TYPES),
            'preferences.*.enabled' => 'required|boolean',
        ]);

        foreach ($data['preferences'] as $preference) {
            DB::table('notification_preferences')->updateOrInsert(
                [
                    'user_id' => $request->user()->id,
                    'type' => $preference['type'],
                ],
                [
                    'enabled' => $preference['enabled'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        return $this->preferences($request);
    }
}
