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
        Schema::create('phieu_nhaps', function (Blueprint $table) {
            $table->id('MAPHIEU');
            $table->dateTime('NGAYLAP');
            $table->unsignedBigInteger('MANV');
            $table->decimal('TONGTIEN', 15, 0);
            $table->unsignedBigInteger('MANCC');
            $table->string('GCHU', 255)->nullable();
            $table->string('TRANGTHAI', 20)->default('PENDING'); 
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->foreign('MANV')->references('MANV')->on('nhan_viens')->onDelete('cascade');
            $table->foreign('MANCC')->references('MANCC')->on('nha_cung_caps')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phieu_nhaps');
    }
};