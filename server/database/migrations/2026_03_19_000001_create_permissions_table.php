<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tạo bảng permissions để lưu trữ danh sách các quyền
     */
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id('MAPERMISSION');
            $table->string('CODE', 100)->unique()->comment('Mã quyền: manage_employees, create_invoice');
            $table->string('NAME', 255)->comment('Tên quyền hiển thị');
            $table->text('DESCRIPTION')->nullable()->comment('Mô tả chi tiết quyền');
            $table->string('MODULE', 100)->nullable()->comment('Module: employees, products, invoices');
            $table->string('ACTION', 50)->nullable()->comment('Hành động: create, read, update, delete');
            $table->tinyInteger('IS_DELETED')->default(0);
            $table->timestamps();

            $table->index(['CODE']);
            $table->index(['MODULE']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
