<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSettings;

class SystemSettingsController extends Controller
{
    public function public()
    {
        $settings = SystemSettings::where('is_public', true)
            ->get(['key', 'value', 'type', 'group', 'description']);

        return response()->json($settings);
    }
}
