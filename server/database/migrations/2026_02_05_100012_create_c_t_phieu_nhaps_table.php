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
        Schema::create('c_t_phieu_nhaps', function (Blueprint $table) {
            $table->unsignedBigInteger('MAPHIEU');
            $table->unsignedBigInteger('MASP');
            $table->integer('SOLUONG');
            $table->decimal('DONGIANHAP', 15, 0);
            $table->date('HANSUDUNG')->nullable()->comment('Bắt buộc nhập với thực phẩm');
            $table->timestamps();

            $table->primary(['MAPHIEU', 'MASP']);
            $table->foreign('MAPHIEU')->references('MAPHIEU')->on('phieu_nhaps')->onDelete('cascade');
            $table->foreign('MASP')->references('MASP')->on('san_phams')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_t_phieu_nhaps');
    }
};
