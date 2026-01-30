<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procedure_template_id')
                ->constrained('procedure_templates')
                ->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('client_name');
            $table->string('property_name');
            $table->string('location')->nullable();
            $table->foreignId('general_responsible_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('pending');
            $table->date('started_at')->nullable();
            $table->date('estimated_end_at')->nullable();
            $table->date('finished_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
