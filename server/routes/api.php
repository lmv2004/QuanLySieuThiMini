<?php

use App\Http\Controllers\SanPhamController;
use Illuminate\Support\Facades\Route;

Route::apiResource('products', SanPhamController::class);
