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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id('SOVOUCHER');
            $table->string('MAVOUCHER', 20)->unique();
            $table->string('MOTA', 100)->nullable();
            $table->dateTime('NGAYBD');
            $table->dateTime('NGAYKT');
            $table->decimal('GIATRITOITHIEU', 15, 0)->default(0);
            $table->decimal('KMTOITHIEU', 15, 0)->default(0);
            $table->decimal('KMTOIDA', 15, 0)->default(0);
            $table->integer('PTGIAM')->default(0);
            $table->integer('SOLUOTSD')->default(0);
            $table->integer('SOLUOTSD_DADUNG')->default(0);
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
