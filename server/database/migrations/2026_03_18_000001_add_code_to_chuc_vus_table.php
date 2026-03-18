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
        Schema::table('chuc_vus', function (Blueprint $table) {
            $table->string('CODE', 50)->unique()->after('MACHUCVU')->comment('Mã vai trò: manager, cashier, warehouse');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chuc_vus', function (Blueprint $table) {
            $table->dropColumn('CODE');
        });
    }
};
