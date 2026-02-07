<?php

use App\Http\Controllers\SanPhamController;
use App\Models\SanPham;
use Illuminate\Support\Facades\Route;

Route::model('product', SanPham::class);// Đăng ký model binding
Route::apiResource('products', SanPhamController::class);

