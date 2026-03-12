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
        Schema::table('hoa_dons', function (Blueprint $table) {
            $table->tinyInteger('TRANGTHAI')->default(0)->after('TONG_THANHTOAN')->comment('0: Chưa thanh toán, 1: Đã thanh toán');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hoa_dons', function (Blueprint $table) {
            $table->dropColumn('TRANGTHAI');
        });
    }
};
