<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSettings;
use Illuminate\Http\Request;

class SystemSettingsController extends Controller
{
    public function public(Request $request)
    {
        $query = SystemSettings::query()
            ->where('is_public', true);

        if ($request->has('group')) {
            $query->where('group', $request->query('group'));
        }

        $settings = $query->get()->mapWithKeys(function (SystemSettings $setting) {
            return [$setting->key => $this->castValue($setting->value, $setting->type)];
        });

        return response()->json($settings);
    }

    private function castValue(?string $value, string $type)
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'json' => json_decode($value ?? '', true) ?? [],
            default => $value,
        };
    }
}
