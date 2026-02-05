<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nha_cung_caps', function (Blueprint $table) {
            $table->id('MANCC');
            $table->string('TENNCC', 100);
            $table->string('DIACHI', 255)->nullable();
            $table->string('SDT', 15)->nullable();
            $table->string('EMAIL', 100)->nullable();
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nha_cung_caps');
    }
};
