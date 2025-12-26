<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',  // 👈 AGREGAR ESTE
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'https://casaliz-arquitectura.com',
        'https://www.casaliz-arquitectura.com',
        'https://api.casaliz-arquitectura.com',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
