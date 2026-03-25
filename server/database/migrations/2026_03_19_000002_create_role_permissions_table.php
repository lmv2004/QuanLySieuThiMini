<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tạo bảng pivot: role_permissions
     * Liên kết giữa roles (chuc_vus) và permissions
     */
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('MACHUCVU')->comment('Foreign key to chuc_vus');
            $table->unsignedBigInteger('MAPERMISSION')->comment('Foreign key to permissions');
            $table->timestamps();

            // Foreign keys
            $table->foreign('MACHUCVU')->references('MACHUCVU')->on('chuc_vus')->onDelete('cascade');
            $table->foreign('MAPERMISSION')->references('MAPERMISSION')->on('permissions')->onDelete('cascade');

            // Unique constraint to prevent duplicates
            $table->unique(['MACHUCVU', 'MAPERMISSION']);

            // Indexes
            $table->index(['MACHUCVU']);
            $table->index(['MAPERMISSION']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};
