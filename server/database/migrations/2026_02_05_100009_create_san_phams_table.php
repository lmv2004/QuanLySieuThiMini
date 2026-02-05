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
        Schema::create('san_phams', function (Blueprint $table) {
            $table->id('MASP');
            $table->string('BARCODE', 20)->nullable()->comment('Mã vạch EAN-13');
            $table->string('TENSP', 100);
            $table->string('MOTA', 255)->nullable();
            $table->string('DVT', 20)->nullable()->comment('Cái, Hộp, Kg, Lốc...');
            $table->string('HINHANH', 255)->nullable();
            $table->decimal('GIABAN', 15, 0);
            $table->unsignedBigInteger('MALOAI');
            $table->unsignedBigInteger('MANCC');
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->foreign('MALOAI')->references('MALOAI')->on('loai_san_phams')->onDelete('cascade');
            $table->foreign('MANCC')->references('MANCC')->on('nha_cung_caps')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('san_phams');
    }
};
