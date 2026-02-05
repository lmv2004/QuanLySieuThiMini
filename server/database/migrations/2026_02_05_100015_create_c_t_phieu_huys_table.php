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
        Schema::create('c_t_phieu_huys', function (Blueprint $table) {
            $table->unsignedBigInteger('MAPHIEU');
            $table->unsignedBigInteger('MASP');
            $table->unsignedBigInteger('ID_TONKHO')->comment('Phải chỉ rõ hủy hàng của lô nào');
            $table->integer('SOLUONG');
            $table->timestamps();

            $table->primary(['MAPHIEU', 'MASP']);
            $table->foreign('MAPHIEU')->references('MAPHIEU')->on('phieu_huys')->onDelete('cascade');
            $table->foreign('MASP')->references('MASP')->on('san_phams')->onDelete('cascade');
            $table->foreign('ID_TONKHO')->references('ID')->on('ton_khos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_t_phieu_huys');
    }
};
