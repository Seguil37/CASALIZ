<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procedure_subphase_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procedure_subphase_id')
                ->constrained('procedure_subphases')
                ->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->nullable();
            $table->unsignedTinyInteger('progress')->nullable();
            $table->text('comment');
            $table->json('attachments')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procedure_subphase_updates');
    }
};
