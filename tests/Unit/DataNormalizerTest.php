<?php

namespace Tests\Unit;

use App\Support\DataNormalizer;
use PHPUnit\Framework\TestCase;

class DataNormalizerTest extends TestCase
{
    public function test_it_normalizes_names_and_text(): void
    {
        $this->assertSame('Juan Perez', DataNormalizer::title('  JUAN   perez  '));
        $this->assertSame('Texto con espacios', DataNormalizer::text("  Texto \n con   espacios  "));
    }

    public function test_it_normalizes_identifiers(): void
    {
        $this->assertSame('TIPO-TRAMITE-01', DataNormalizer::code(' tipo tramite 01 '));
        $this->assertSame('usuario@example.com', DataNormalizer::email(' Usuario@Example.COM '));
        $this->assertSame('+51999111222', DataNormalizer::phone('00 51 999-111-222'));
    }

    public function test_it_normalizes_locations(): void
    {
        $this->assertSame(
            'Lima, Lima, Miraflores',
            DataNormalizer::location(' lima ,  LIMA, miraflores ')
        );
    }
}
