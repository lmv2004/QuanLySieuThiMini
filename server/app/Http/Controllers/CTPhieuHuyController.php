<?php

namespace App\Http\Controllers;

use App\Http\Resources\CTPhieuHuyResource;
use App\Models\CTPhieuHuy;
use App\Models\PhieuHuy;
use Illuminate\Http\Request;

class CTPhieuHuyController extends Controller
{
    /**
     * Lấy tất cả chi tiết phiếu hủy (có thể lọc theo MAPHIEU)
     * GET /api/ct-phieu-huys?MAPHIEU=1
     */
    public function index(Request $request)
    {
        $query = CTPhieuHuy::with(['sanPham', 'tonKho', 'phieuHuy']);

        if ($request->has('MAPHIEU')) {
            $query->where('MAPHIEU', $request->MAPHIEU);
        }

        return CTPhieuHuyResource::collection($query->get());
    }

    /**
     * Tạo chi tiết phiếu hủy mới
     * POST /api/ct-phieu-huys
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'MAPHIEU'    => 'required|integer|exists:phieu_huys,MAPHIEU',
            'MASP'       => 'required|integer|exists:san_phams,MASP',
            'ID_TONKHO'  => 'required|integer|exists:ton_khos,ID',
            'SOLUONG'    => 'required|integer|min:1',
        ], [
            'MAPHIEU.required'   => 'Mã phiếu là bắt buộc.',
            'MAPHIEU.exists'     => 'Phiếu hủy không tồn tại.',
            'MASP.required'      => 'Mã sản phẩm là bắt buộc.',
            'MASP.exists'        => 'Sản phẩm không tồn tại.',
            'ID_TONKHO.required' => 'Mã tồn kho là bắt buộc.',
            'ID_TONKHO.exists'   => 'Lô hàng tồn kho không tồn tại.',
            'SOLUONG.required'   => 'Số lượng là bắt buộc.',
            'SOLUONG.min'        => 'Số lượng phải lớn hơn 0.',
        ]);

        // Kiểm tra trùng composite key
        $exists = CTPhieuHuy::where('MAPHIEU', $data['MAPHIEU'])
            ->where('MASP', $data['MASP'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Sản phẩm này đã tồn tại trong phiếu hủy.'
            ], 422);
        }

        $chiTiet = CTPhieuHuy::create($data);
        $chiTiet->load(['sanPham', 'tonKho']);
        return new CTPhieuHuyResource($chiTiet);
    }

    /**
     * Xem chi tiết theo MAPHIEU + MASP
     * GET /api/ct-phieu-huys/{MAPHIEU}/{MASP}
     */
    public function show(string $maphieu, string $masp)
    {
        $chiTiet = CTPhieuHuy::where('MAPHIEU', $maphieu)
            ->where('MASP', $masp)
            ->with(['sanPham', 'tonKho', 'phieuHuy'])
            ->firstOrFail();

        return new CTPhieuHuyResource($chiTiet);
    }

    /**
     * Cập nhật chi tiết phiếu hủy
     * PUT /api/ct-phieu-huys/{MAPHIEU}/{MASP}
     */
    public function update(Request $request, string $maphieu, string $masp)
    {
        $chiTiet = CTPhieuHuy::where('MAPHIEU', $maphieu)
            ->where('MASP', $masp)
            ->firstOrFail();

        $data = $request->validate([
            'ID_TONKHO' => 'sometimes|integer|exists:ton_khos,ID',
            'SOLUONG'   => 'sometimes|integer|min:1',
        ], [
            'ID_TONKHO.exists' => 'Lô hàng tồn kho không tồn tại.',
            'SOLUONG.min'      => 'Số lượng phải lớn hơn 0.',
        ]);

        $chiTiet->update($data);
        $chiTiet->load(['sanPham', 'tonKho']);
        return new CTPhieuHuyResource($chiTiet);
    }

    /**
     * Xóa chi tiết phiếu hủy
     * DELETE /api/ct-phieu-huys/{MAPHIEU}/{MASP}
     */
    public function destroy(string $maphieu, string $masp)
    {
        $chiTiet = CTPhieuHuy::where('MAPHIEU', $maphieu)
            ->where('MASP', $masp)
            ->firstOrFail();

        $chiTiet->delete();
        return response()->noContent();
    }
}
