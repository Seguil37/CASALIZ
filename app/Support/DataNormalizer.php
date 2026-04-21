<?php

namespace App\Support;

use Illuminate\Support\Str;

class DataNormalizer
{
    public static function text(?string $value): ?string
    {
        $value = self::squish($value);

        return $value === '' ? null : $value;
    }

    public static function title(?string $value): ?string
    {
        $value = self::text($value);

        return $value === null ? null : Str::title(Str::lower($value));
    }

    public static function sentence(?string $value): ?string
    {
        $value = self::text($value);

        if ($value === null) {
            return null;
        }

        return Str::ucfirst(Str::lower($value));
    }

    public static function email(?string $value): ?string
    {
        $value = self::text($value);

        return $value === null ? null : Str::lower($value);
    }

    public static function phone(?string $value): ?string
    {
        $value = self::text($value);

        if ($value === null) {
            return null;
        }

        $phone = preg_replace('/[^\d+]/', '', $value);

        if (str_starts_with($phone, '00')) {
            $phone = '+' . substr($phone, 2);
        }

        return $phone === '' ? null : $phone;
    }

    public static function code(?string $value): ?string
    {
        $value = self::text($value);

        if ($value === null) {
            return null;
        }

        return Str::of($value)
            ->ascii()
            ->upper()
            ->replaceMatches('/[^A-Z0-9-]+/', '-')
            ->replaceMatches('/-+/', '-')
            ->trim('-')
            ->toString();
    }

    public static function location(?string $value): ?string
    {
        $value = self::text($value);

        if ($value === null) {
            return null;
        }

        $parts = array_filter(array_map(
            fn (string $part): ?string => self::title($part),
            explode(',', $value)
        ));

        return implode(', ', $parts);
    }

    public static function url(?string $value): ?string
    {
        return self::text($value);
    }

    private static function squish(?string $value): string
    {
        return Str::of((string) $value)
            ->replace(["\r", "\n", "\t"], ' ')
            ->squish()
            ->toString();
    }
}
