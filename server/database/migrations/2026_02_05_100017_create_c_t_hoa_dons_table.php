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
        Schema::create('c_t_hoa_dons', function (Blueprint $table) {
            $table->unsignedBigInteger('MAHD');
            $table->unsignedBigInteger('MASP');
            $table->unsignedBigInteger('ID_TONKHO')->comment('Bán từ lô hàng nào?');
            $table->integer('SOLUONG');
            $table->decimal('GIABAN_GOC', 15, 0);
            $table->decimal('GIABAN_THUCTE', 15, 0)->comment('Giá sau khi trừ KM sản phẩm');
            $table->decimal('THANHTIEN', 15, 0);
            $table->timestamps();

            $table->primary(['MAHD', 'MASP', 'ID_TONKHO']);
            $table->foreign('MAHD')->references('MAHD')->on('hoa_dons')->onDelete('cascade');
            $table->foreign('MASP')->references('MASP')->on('san_phams')->onDelete('cascade');
            $table->foreign('ID_TONKHO')->references('ID')->on('ton_khos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_t_hoa_dons');
    }
};
