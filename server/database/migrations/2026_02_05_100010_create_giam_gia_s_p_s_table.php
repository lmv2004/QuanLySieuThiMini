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
        Schema::create('giam_gia_s_p_s', function (Blueprint $table) {
            $table->id('ID');
            $table->unsignedBigInteger('MASP');
            $table->string('TEN_CHUONG_TRINH', 100);
            $table->tinyInteger('LOAI_GIAM')->comment('0: Giảm theo %, 1: Giảm tiền mặt');
            $table->decimal('GIATRI_GIAM', 15, 0);
            $table->dateTime('NGAYBD');
            $table->dateTime('NGAYKT');
            $table->tinyInteger('TRANGTHAI')->default(1)->comment('1: Đang chạy, 0: Tạm dừng');
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->foreign('MASP')->references('MASP')->on('san_phams')->onDelete('cascade');
            $table->index(['MASP', 'TRANGTHAI']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giam_gia_s_p_s');
    }
};
