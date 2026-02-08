<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TaiKhoan;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredTaiKhoanController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'TENTK' => ['required', 'string', 'max:255', 'unique:tai_khoans,TENTK'],
            'MATKHAU' => ['required', 'confirmed', Rules\Password::defaults()],
            'MANV' => ['required', 'integer', 'exists:nhan_viens,MANV', 'unique:tai_khoans,MANV'],
        ]);

        // Tạo tài khoản
        $taiKhoan = TaiKhoan::create([
            'TENTK' => $request->TENTK,
            'MATKHAU' => Hash::make($request->MATKHAU),
            'MANV' => $request->MANV,
            'SOLANSAI' => 0,
            'KHOA_TK' => false,
            'IS_DELETED' => false,
        ]);

        event(new Registered($taiKhoan));

        Auth::login($taiKhoan);

        return response()->noContent();
    }
}
