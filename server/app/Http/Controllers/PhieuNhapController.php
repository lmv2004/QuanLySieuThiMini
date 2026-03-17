<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhieuNhapRequest;
use App\Http\Requests\UpdatePhieuNhapRequest;
use App\Http\Resources\PhieuNhapResource;
use App\Models\PhieuNhap;
use App\Models\CTPhieuNhap;
use App\Models\TonKho;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PhieuNhapController extends Controller
{
    /**
     * Display a listing of the resource with pagination and search.
     */
    public function index(Request $request)
    {
        $query = PhieuNhap::active()->with(['nhanVien.chucVu']);

        // Tìm kiếm theo mã phiếu hoặc tên nhân viên
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('MAPHIEU', 'like', '%' . $search . '%')
                  ->orWhere('GCHU', 'like', '%' . $search . '%')
                  ->orWhereHas('nhanVien', function ($nv) use ($search) {
                      $nv->where('TENNV', 'like', '%' . $search . '%');
                  });
            });
        }

        // Lọc theo ngày
        if ($request->has('from_date')) {
            $query->whereDate('NGAYLAP', '>=', $request->input('from_date'));
        }
        if ($request->has('to_date')) {
            $query->whereDate('NGAYLAP', '<=', $request->input('to_date'));
        }

        // Phân trang
        $perPage = $request->input('per_page', 15);
        $phieuNhaps = $query->orderBy('NGAYLAP', 'desc')->paginate($perPage);

        return PhieuNhapResource::collection($phieuNhaps);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePhieuNhapRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            
            // Tạo phiếu nhập
            $phieuNhap = PhieuNhap::create([
                'NGAYLAP' => $data['NGAYLAP'],
                'MANV' => $data['MANV'],
                'TONGTIEN' => $data['TONGTIEN'] ?? 0,
                'GCHU' => $data['GCHU'] ?? null,
            ]);

            // Tạo chi tiết phiếu nhập nếu có
            if (isset($data['chiTiets']) && is_array($data['chiTiets'])) {
                foreach ($data['chiTiets'] as $chiTiet) {
                    $ctPhieuNhap = CTPhieuNhap::create([
                        'MAPHIEU' => $phieuNhap->MAPHIEU,
                        'MASP' => $chiTiet['MASP'],
                        'SOLUONG' => $chiTiet['SOLUONG'],
                        'DONGIANHAP' => $chiTiet['DONGIANHAP'],
                        'HANSUDUNG' => $chiTiet['HANSUDUNG'] ?? null,
                    ]);

                    // Tự động tạo tồn kho
                    TonKho::create([
                        'MASP' => $chiTiet['MASP'],
                        'MAPHIEUNHAP' => $phieuNhap->MAPHIEU,
                        'SOLUONGTON' => $chiTiet['SOLUONG'],
                        'DONGIANHAP' => $chiTiet['DONGIANHAP'],
                        'HANSUDUNG' => $chiTiet['HANSUDUNG'] ?? null,
                    ]);
                }
            }

            DB::commit();
            
            $phieuNhap->load(['nhanVien.chucVu', 'chiTiets.sanPham']);
            return new PhieuNhapResource($phieuNhap);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi tạo phiếu nhập: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PhieuNhap $purchase_order)
    {
        abort_if($purchase_order->IS_DELETED, 404);
        $purchase_order->load(['nhanVien.chucVu', 'chiTiets.sanPham']);
        return new PhieuNhapResource($purchase_order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePhieuNhapRequest $request, PhieuNhap $purchase_order)
    {
        $data = $request->validated();
        $purchase_order->update($data);
        $purchase_order->load(['nhanVien.chucVu', 'chiTiets.sanPham']);
        return new PhieuNhapResource($purchase_order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PhieuNhap $purchase_order)
    {
        $purchase_order->IS_DELETED = true;
        $purchase_order->save();
        return response()->noContent();
    }
}
