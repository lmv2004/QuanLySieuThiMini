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
        Schema::create('hoa_dons', function (Blueprint $table) {
            $table->id('MAHD');
            $table->dateTime('NGAYHD');
            $table->string('HINHTHUC', 20)->comment('Tiền mặt, CK, QR...');
            $table->decimal('TONGTIEN_HANG', 15, 0);
            $table->decimal('TIEN_GIAM_VOUCHER', 15, 0)->default(0);
            $table->decimal('TONG_THANHTOAN', 15, 0);
            $table->unsignedBigInteger('MANV');
            $table->unsignedBigInteger('MAKH')->nullable();
            $table->unsignedBigInteger('SOVOUCHER')->nullable();
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->foreign('MANV')->references('MANV')->on('nhan_viens')->onDelete('cascade');
            $table->foreign('MAKH')->references('MAKH')->on('khach_hangs')->onDelete('cascade');
            $table->foreign('SOVOUCHER')->references('SOVOUCHER')->on('vouchers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoa_dons');
    }
};
