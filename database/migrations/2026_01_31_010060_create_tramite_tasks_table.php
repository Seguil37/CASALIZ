<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tramite_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_id')->constrained('tramites')->cascadeOnDelete();
            $table->foreignId('tramite_phase_instance_id')->nullable()->constrained('tramite_instance_phases')->nullOnDelete();
            $table->foreignId('tramite_subphase_instance_id')->nullable()->constrained('tramite_instance_subphases')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'in_progress', 'blocked', 'done'])->default('pending');
            $table->unsignedInteger('progress')->default(0);
            $table->date('due_date')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tramite_tasks');
    }
};

