<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update phieu_nhaps co TRANGTHAI NULL hoac khong hop le thanh 'PENDING'
        DB::statement("UPDATE phieu_nhaps SET TRANGTHAI = 'PENDING' WHERE TRANGTHAI IS NULL OR TRANGTHAI NOT IN ('PENDING', 'APPROVED', 'EXPIRED')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('phieu_nhaps', function (Blueprint $table) {
            //
        });
    }
};
