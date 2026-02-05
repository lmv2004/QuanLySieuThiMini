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
        Schema::create('ton_khos', function (Blueprint $table) {
            $table->id('ID');
            $table->unsignedBigInteger('MASP');
            $table->integer('SOLUONG_CON_LAI')->comment('Số lượng thực tế còn lại của lô này');
            $table->decimal('GIANHAP', 15, 0)->comment('Giá vốn của lô này');
            $table->date('HANSUDUNG')->nullable()->comment('Dùng để chạy FEFO');
            $table->date('NGAYNHAP');
            $table->unsignedBigInteger('MAPHIEUNHAP');
            $table->tinyInteger('IS_ACTIVE')->default(1)->comment('0 nếu lô này đã bán hết');
            $table->timestamps();

            $table->foreign('MASP')->references('MASP')->on('san_phams')->onDelete('cascade');
            $table->foreign('MAPHIEUNHAP')->references('MAPHIEU')->on('phieu_nhaps')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ton_khos');
    }
};
