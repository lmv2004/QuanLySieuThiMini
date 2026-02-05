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
        Schema::create('nhan_viens', function (Blueprint $table) {
            $table->id('MANV');
            $table->string('TENNV', 50);
            $table->tinyInteger('GIOITINH')->nullable()->comment('0: Nữ, 1: Nam');
            $table->string('CCCD', 20)->nullable();
            $table->date('NGAYSINH')->nullable();
            $table->string('SODIENTHOAI', 15)->nullable();
            $table->string('EMAIL', 100)->nullable();
            $table->string('DIACHI', 255)->nullable();
            $table->date('NGAYTHAMGIA')->nullable();
            $table->unsignedBigInteger('MACHUCVU');
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->foreign('MACHUCVU')->references('MACHUCVU')->on('chuc_vus')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nhan_viens');
    }
};
