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
        Schema::create('phieu_huys', function (Blueprint $table) {
            $table->id('MAPHIEU');
            $table->dateTime('NGAYLAP');
            $table->unsignedBigInteger('MANV');
            $table->string('LYDO', 255)->nullable()->comment('Hàng hết hạn, Vỡ hỏng...');
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
        Schema::dropIfExists('phieu_huys');
    }
};
