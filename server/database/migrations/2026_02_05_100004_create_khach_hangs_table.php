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
        Schema::create('khach_hangs', function (Blueprint $table) {
            $table->id('MAKH');
            $table->string('TENKH', 50);
            $table->string('SODIENTHOAI', 15)->nullable();
            $table->string('DIACHI', 255)->nullable();
            $table->bigInteger('DIEMTHUONG')->default(0);
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khach_hangs');
    }
};
