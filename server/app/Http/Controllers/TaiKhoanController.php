<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaiKhoanRequest;
use App\Http\Requests\UpdateTaiKhoanRequest;
use App\Http\Resources\TaiKhoanResource;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\Hash;

class TaiKhoanController extends Controller
{
    public function index()
    {
        return TaiKhoanResource::collection(
            TaiKhoan::active()
                ->with(['nhanVien'])
                ->get()
        );
    }

    public function create()
    {
        // Dùng cho form-based, API không cần
    }

    public function store(StoreTaiKhoanRequest $request)
    {
        $data = $request->validated();
        $data['MATKHAU'] = Hash::make($data['MATKHAU']);
        $taiKhoan = TaiKhoan::create($data);
        $taiKhoan->load(['nhanVien']);
        return new TaiKhoanResource($taiKhoan);
    }

    public function show(TaiKhoan $account)
    {
        $account->load(['nhanVien']);
        return new TaiKhoanResource($account);
    }

    public function edit(TaiKhoan $account)
    {
        $account->load(['nhanVien']);
        return new TaiKhoanResource($account);
    }

    public function update(UpdateTaiKhoanRequest $request, TaiKhoan $account)
    {
        $data = $request->validated();
        if (!empty($data['MATKHAU'])) {
            $data['MATKHAU'] = Hash::make($data['MATKHAU']);
        }
        $account->update($data);
        $account->load(['nhanVien']);
        return new TaiKhoanResource($account);
    }

    public function destroy(TaiKhoan $account)
    {
        $account->IS_DELETED = true;
        $account->save();
        return response()->noContent();
    }
}
