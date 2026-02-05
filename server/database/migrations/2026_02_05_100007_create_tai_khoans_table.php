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
        Schema::create('tai_khoans', function (Blueprint $table) {
            $table->id('SOTK');
            $table->string('TENTK', 50)->unique();
            $table->string('MATKHAU', 255);
            $table->unsignedBigInteger('MANV')->unique();
            $table->integer('SOLANSAI')->default(0);
            $table->tinyInteger('KHOA_TK')->default(0);
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->foreign('MANV')->references('MANV')->on('nhan_viens')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tai_khoans');
    }
};
