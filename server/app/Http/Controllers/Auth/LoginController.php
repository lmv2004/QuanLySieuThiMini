<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        $taikhoan = $request->taikhoan();
        $taikhoan->load('nhanVien.chucVu');
        $token = $taikhoan->createToken('main')->plainTextToken;

        $nhanVien = $taikhoan->nhanVien;

        return response()->json([
            'token' => $token,
            'user' => [
                'SOTK'   => $taikhoan->SOTK,
                'TENTK'  => $taikhoan->TENTK,
                'EMAIL'  => $taikhoan->EMAIL,
                'MANV'   => $taikhoan->MANV,
                'TENNV'  => $nhanVien?->TENNV,
                'chucVu' => $nhanVien?->chucVu,
            ],
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
