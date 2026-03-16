<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json(['message' => 'Sai thông tin'], 401);
        }

        $user = Auth::user()->load('nhanVien.chucVu');
        $token = $user->createToken('api-token')->plainTextToken;

        $nhanVien = $user->nhanVien;

        return response()->json([
            'token' => $token,
            'user' => [
                'SOTK'   => $user->SOTK,
                'TENTK'  => $user->TENTK,
                'EMAIL'  => $user->EMAIL,
                'MANV'   => $user->MANV,
                'TENNV'  => $nhanVien?->TENNV,
                'chucVu' => $nhanVien?->chucVu,
            ],
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

}
