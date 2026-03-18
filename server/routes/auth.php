<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredTaiKhoanController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredTaiKhoanController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [LoginController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth:sanctum', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('logout');

Route::get('/me', function (\Illuminate\Http\Request $request) {
    $taikhoan = $request->user()->load('nhanVien.chucVu');
    $nhanVien = $taikhoan->nhanVien;
    return response()->json([
        'user' => [
            'SOTK'   => $taikhoan->SOTK,
            'TENTK'  => $taikhoan->TENTK,
            'EMAIL'  => $taikhoan->EMAIL,
            'MANV'   => $taikhoan->MANV,
            'TENNV'  => $nhanVien?->TENNV,
            'chucVu' => [
                'MACHUCVU' => $nhanVien?->chucVu?->MACHUCVU,
                'CODE' => $nhanVien?->chucVu?->CODE,
                'TENCHUCVU' => $nhanVien?->chucVu?->TENCHUCVU,
                'MOTA' => $nhanVien?->chucVu?->MOTA,
            ],
            'role' => $nhanVien?->chucVu?->CODE, // For convenience
        ],
    ]);
})->middleware('auth:sanctum')->name('auth.me');

// Get permissions for current user
Route::get('/permissions', [AuthController::class, 'getPermissions'])
    ->middleware('auth:sanctum')
    ->name('auth.permissions');

// Get permissions for specific role (Manager only)
Route::get('/roles/{roleCode}/permissions', [AuthController::class, 'getRolePermissions'])
    ->middleware('auth:sanctum')
    ->name('auth.role-permissions');
