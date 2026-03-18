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

    public function bulkStore(\Illuminate\Http\Request $request)
    {
        $data = $request->input('data');
        if (!is_array($data)) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ'], 400);
        }

        $count = 0;
        foreach ($data as $item) {
            if (!isset($item['TENTK']) || TaiKhoan::where('TENTK', $item['TENTK'])->exists()) {
                continue;
            }
            if (!empty($item['MATKHAU'])) {
                $item['MATKHAU'] = Hash::make($item['MATKHAU']);
            }
            TaiKhoan::create($item);
            $count++;
        }

        return response()->json(['message' => "Thành công: Đã import $count tài khoản", 'count' => $count]);
    }
}
