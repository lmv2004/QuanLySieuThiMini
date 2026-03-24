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
        Schema::table('phieu_huys', function (Blueprint $table) {
            $table->string('TRANGTHAI', 20)->default('PENDING')->after('LYDO');
            $table->boolean('DA_KHOA')->default(0)->after('TRANGTHAI');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('phieu_huys', function (Blueprint $table) {
            $table->dropColumn(['TRANGTHAI', 'DA_KHOA']);
        });
    }
};
