<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tramite_instance_subphases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_phase_instance_id')->constrained('tramite_instance_phases')->cascadeOnDelete();
            $table->foreignId('tramite_subphase_id')->nullable()->constrained('tramite_subphases')->nullOnDelete();
            $table->string('name');
            $table->unsignedInteger('order')->default(1);
            $table->enum('status', ['pending', 'in_progress', 'observed', 'completed'])->default('pending');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tramite_instance_subphases');
    }
};

