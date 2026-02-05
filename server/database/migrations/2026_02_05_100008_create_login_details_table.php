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
        Schema::create('login_details', function (Blueprint $table) {
            $table->id('LOGIN_ID');
            $table->unsignedBigInteger('SOTK');
            $table->string('IP_ADDRESS', 50)->nullable();
            $table->dateTime('LOGIN_TIME');
            $table->dateTime('LOGOUT_TIME')->nullable();
            $table->timestamps();

            $table->foreign('SOTK')->references('SOTK')->on('tai_khoans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_details');
    }
};
