<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhieuHuyRequest;
use App\Http\Requests\UpdatePhieuHuyRequest;
use App\Http\Resources\PhieuHuyResource;
use App\Models\PhieuHuy;
use App\Models\CTPhieuHuy;
use App\Models\TonKho;
use Illuminate\Support\Facades\DB;

class PhieuHuyController extends Controller
{
    public function index()
    {
        return PhieuHuyResource::collection(
            PhieuHuy::active()
                ->latest()
                ->with(['nhanVien', 'chiTiets.sanPham', 'chiTiets.tonKho'])
                ->get()
        );
    }

    public function create()
    {
        // Dùng cho form-based, API không cần
    }

    public function store(StorePhieuHuyRequest $request)
    {
        $validated = $request->validated();
        
        $phieuHuy = DB::transaction(function () use ($validated) {
            // 1. Tạo Phiếu Mẹ
            $newPhieu = PhieuHuy::create([
                'NGAYLAP' => $validated['NGAYLAP'],
                'MANV'    => $validated['MANV'],
                'LYDO'    => $validated['LYDO'],
            ]);

            // 2. Tạo Chi Tiết (Nếu có gửi kèm Danh sách Array)
            if (isset($validated['chiTiets']) && is_array($validated['chiTiets'])) {
                foreach ($validated['chiTiets'] as $ct) {
                    CTPhieuHuy::create([
                        'MAPHIEU'   => $newPhieu->MAPHIEU,
                        'MASP'      => $ct['MASP'],
                        'ID_TONKHO' => $ct['ID_TONKHO'],
                        'SOLUONG'   => $ct['SOLUONG'],
                    ]);
                }
            }

            return $newPhieu;
        });

        $phieuHuy->load(['nhanVien', 'chiTiets.sanPham']);
        return new PhieuHuyResource($phieuHuy);
    }

    public function show(PhieuHuy $disposal_slip)
    {
        $disposal_slip->load(['nhanVien', 'chiTiets.sanPham']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function edit(PhieuHuy $disposal_slip)
    {
        $disposal_slip->load(['nhanVien', 'chiTiets']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function update(UpdatePhieuHuyRequest $request, PhieuHuy $disposal_slip)
    {
        $disposal_slip->update($request->validated());
        $disposal_slip->load(['nhanVien', 'chiTiets']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function destroy(PhieuHuy $disposal_slip)
    {
        $disposal_slip->IS_DELETED = true;
        $disposal_slip->save();
        return response()->noContent();
    }

    public function approve(PhieuHuy $disposal_slip)
    {
        if ($disposal_slip->TRANGTHAI === 'APPROVED') {
            return response()->json(['message' => 'Phiếu này đã được duyệt'], 400);
        }

        DB::transaction(function () use ($disposal_slip) {
            $disposal_slip->update(['TRANGTHAI' => 'APPROVED']);
            
            foreach ($disposal_slip->chiTiets as $ct) {
                $tonKho = TonKho::find($ct->ID_TONKHO);
                if ($tonKho) {
                    $tonKho->decrement('SOLUONG_CON_LAI', $ct->SOLUONG);
                }
            }
        });

        $disposal_slip->load(['nhanVien', 'chiTiets.sanPham']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function reopen(PhieuHuy $disposal_slip)
    {
        if ($disposal_slip->TRANGTHAI !== 'APPROVED') {
            return response()->json(['message' => 'Chỉ có thể mở lại phiếu đã duyệt'], 400);
        }

        DB::transaction(function () use ($disposal_slip) {
            $disposal_slip->update(['TRANGTHAI' => 'PENDING']);
            
            foreach ($disposal_slip->chiTiets as $ct) {
                $tonKho = TonKho::find($ct->ID_TONKHO);
                if ($tonKho) {
                    $tonKho->increment('SOLUONG_CON_LAI', $ct->SOLUONG);
                }
            }
        });

        $disposal_slip->load(['nhanVien', 'chiTiets.sanPham']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function lock(PhieuHuy $disposal_slip)
    {
        $disposal_slip->update(['DA_KHOA' => true]);
        return new PhieuHuyResource($disposal_slip);
    }

    public function unlock(PhieuHuy $disposal_slip)
    {
        $disposal_slip->update(['DA_KHOA' => false]);
        return new PhieuHuyResource($disposal_slip);
    }

    public function bulkStore(\Illuminate\Http\Request $request)
    {
        $data = $request->input('data');
        if (!is_array($data)) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ'], 400);
        }

        $count = 0;
        foreach ($data as $item) {
            PhieuHuy::create($item);
            $count++;
        }

        return response()->json(['message' => "Thành công: Đã import $count Phiếu hủy", 'count' => $count]);
    }
}
