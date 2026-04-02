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
                ->orderBy('updated_at', 'desc')
                ->with(['nhanVien.chucVu'])
                ->get()
                ->filter(function($tk) {
                    // Lọc ra các tài khoản KHÔNG phải role ADMIN
                    return !($tk->nhanVien && $tk->nhanVien->chucVu && $tk->nhanVien->chucVu->CODE === 'ADMIN');
                })
                ->values()
        );
    }

    public function create()
    {
        // Dùng cho form-based, API không cần
    }

    public function store(StoreTaiKhoanRequest $request)
    {
        $data = $request->validated();

        // Xóa vĩnh viễn các bản ghi cũ đã bị "xóa mềm" để tránh xung đột khóa UNIQUE trong DB
        TaiKhoan::where('IS_DELETED', 1)
            ->where(function($q) use ($data) {
                $q->where('MANV', $data['MANV'])
                  ->orWhere('TENTK', $data['TENTK'])
                  ->orWhere('EMAIL', $data['EMAIL']);
            })->delete();

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
        // Kiểm tra nếu tài khoản là ADMIN thì không cho phép sửa
        $account->load(['nhanVien.chucVu']);
        if ($account->nhanVien && $account->nhanVien->chucVu && $account->nhanVien->chucVu->CODE === 'ADMIN') {
            return response()->json([
                'message' => 'Không thể chỉnh sửa tài khoản Quản trị viên!'
            ], 403);
        }

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
        // Không cho phép tự xóa chính mình
        if (auth()->id() === $account->SOTK) {
            return response()->json([
                'message' => 'Bạn không thể tự xóa tài khoản của chính mình!'
            ], 403);
        }

        // Kiểm tra nếu tài khoản là ADMIN thì không cho phép xóa (khóa)
        $account->load(['nhanVien.chucVu']);
        if ($account->nhanVien && $account->nhanVien->chucVu && $account->nhanVien->chucVu->CODE === 'ADMIN') {
            return response()->json([
                'message' => 'Không thể khóa tài khoản Quản trị viên!'
            ], 403);
        }

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
            if (empty($item['TENTK']) || empty($item['MANV'])) {
                continue;
            }

            // 1. Xử lý các bản ghi đã bị "xóa mềm" để tránh xung đột
            TaiKhoan::where('IS_DELETED', 1)
                ->where(function($q) use ($item) {
                    $q->where('MANV', $item['MANV'])
                      ->orWhere('TENTK', $item['TENTK'])
                      ->orWhere((isset($item['EMAIL']) ? 'EMAIL' : 'SOTK'), $item['EMAIL'] ?? '---');
                })->delete();

            // 2. Tìm tài khoản hiện có (active) dựa trên MANV hoặc TENTK
            $existing = TaiKhoan::where('IS_DELETED', 0)
                ->where(function($q) use ($item) {
                    $q->where('MANV', $item['MANV'])
                      ->orWhere('TENTK', $item['TENTK']);
                })->first();

            if ($existing) {
                // Cập nhật thông tin nếu đã tồn tại
                $updateData = [];
                if (!empty($item['EMAIL'])) $updateData['EMAIL'] = $item['EMAIL'];
                if (!empty($item['MATKHAU'])) $updateData['MATKHAU'] = Hash::make($item['MATKHAU']);

                // Ép buộc cập nhật updated_at để hiện lên đầu danh sách
                $updateData['updated_at'] = now();
                $existing->update($updateData);
            } else {
                // Tạo mới nếu chưa có
                if (!empty($item['MATKHAU'])) {
                    $item['MATKHAU'] = Hash::make($item['MATKHAU']);
                } else {
                    $item['MATKHAU'] = Hash::make('123456');
                }
                $item['IS_DELETED'] = 0;
                $item['KHOA_TK'] = 0;
                $item['created_at'] = now();
                $item['updated_at'] = now();
                TaiKhoan::create($item);
            }
            $count++;
        }

        return response()->json(['message' => "Đã xử lý thành công $count tài khoản (đã được đẩy lên đầu danh sách)", 'count' => $count]);
    }
}
