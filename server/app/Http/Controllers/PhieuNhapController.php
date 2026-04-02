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
    public function index(Request $request)
    {
        $query = PhieuNhap::active()->with(['nhanVien.chucVu', 'nhaCungCap', 'chiTiets.sanPham']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('MAPHIEU', 'like', '%' . $search . '%')
                  ->orWhere('GCHU', 'like', '%' . $search . '%')
                  ->orWhereHas('nhanVien', fn($nv) => $nv->where('TENNV', 'like', '%' . $search . '%'));
            });
        }

        if ($request->filled('from_date')) {
            $query->whereDate('NGAYLAP', '>=', $request->input('from_date'));
        }
        if ($request->filled('to_date')) {
            $query->whereDate('NGAYLAP', '<=', $request->input('to_date'));
        }
        if ($request->filled('trangthai')) {
            $query->where('TRANGTHAI', $request->input('trangthai'));
        }

        $perPage = $request->input('per_page', 15);
        $phieuNhaps = $query->orderBy('NGAYLAP', 'desc')->paginate($perPage);

        return PhieuNhapResource::collection($phieuNhaps);
    }

    public function store(StorePhieuNhapRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Tính TONGTIEN từ chiTiets
            $tongTien = collect($data['chiTiets'])
                ->sum(fn($ct) => $ct['SOLUONG'] * $ct['DONGIANHAP']);

            $phieuNhap = PhieuNhap::create([
                'NGAYLAP'   => $data['NGAYLAP'],
                'MANV'      => $data['MANV'],
                'MANCC' => $data['MANCC'],
                'TONGTIEN'  => $tongTien,
                'GCHU'      => $data['GCHU'] ?? null,
                'TRANGTHAI' => PhieuNhap::TRANGTHAI_PENDING,
            ]);

            foreach ($data['chiTiets'] as $chiTiet) {
                CTPhieuNhap::create([
                    'MAPHIEU'    => $phieuNhap->MAPHIEU,
                    'MASP'       => $chiTiet['MASP'],
                    'SOLUONG'    => $chiTiet['SOLUONG'],
                    'DONGIANHAP' => $chiTiet['DONGIANHAP'],
                    'HANSUDUNG'  => $chiTiet['HANSUDUNG'] ?? null,
                ]);
            }

            DB::commit();

            $phieuNhap->load(['nhanVien.chucVu', 'nhaCungCap', 'chiTiets.sanPham']);
            return (new PhieuNhapResource($phieuNhap))->response()->setStatusCode(201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi khi tạo phiếu nhập: ' . $e->getMessage()], 500);
        }
    }

    public function show(PhieuNhap $phieuNhap)
    {
        $phieuNhap->load(['nhanVien.chucVu', 'nhaCungCap', 'chiTiets.sanPham']);
        return new PhieuNhapResource($phieuNhap);
    }

    public function update(UpdatePhieuNhapRequest $request, PhieuNhap $phieuNhap)
    {
        if ($phieuNhap->TRANGTHAI !== PhieuNhap::TRANGTHAI_PENDING) {
            return response()->json([
                'message' => 'Chỉ được sửa phiếu nhập đang ở trạng thái chờ duyệt (PENDING).',
            ], 403);
        }

        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Xóa chi tiết cũ và insert lại
            $phieuNhap->chiTiets()->delete();

            $tongTien = collect($data['chiTiets'])
                ->sum(fn($ct) => $ct['SOLUONG'] * $ct['DONGIANHAP']);

            $phieuNhap->update([
                'NGAYLAP'  => $data['NGAYLAP'] ?? $phieuNhap->NGAYLAP,
                'MANV'     => $data['MANV'] ?? $phieuNhap->MANV,
                'MANCC'    => $data['MANCC'],
                'TONGTIEN' => $tongTien,
                'GCHU'     => $data['GCHU'] ?? $phieuNhap->GCHU,
            ]);

            foreach ($data['chiTiets'] as $chiTiet) {
                CTPhieuNhap::create([
                    'MAPHIEU'    => $phieuNhap->MAPHIEU,
                    'MASP'       => $chiTiet['MASP'],
                    'SOLUONG'    => $chiTiet['SOLUONG'],
                    'DONGIANHAP' => $chiTiet['DONGIANHAP'],
                    'HANSUDUNG'  => $chiTiet['HANSUDUNG'] ?? null,
                ]);
            }

            DB::commit();

            $phieuNhap->load(['nhanVien.chucVu', 'nhaCungCap', 'chiTiets.sanPham']);
            return new PhieuNhapResource($phieuNhap);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi khi cập nhật phiếu nhập: ' . $e->getMessage()], 500);
        }
    }

    public function approve(PhieuNhap $phieuNhap)
    {
        if ($phieuNhap->TRANGTHAI !== PhieuNhap::TRANGTHAI_PENDING) {
            return response()->json([
                'message' => 'Chỉ có thể duyệt phiếu nhập đang ở trạng thái chờ duyệt (PENDING).',
            ], 403);
        }

        DB::beginTransaction();
        try {
            $phieuNhap->update(['TRANGTHAI' => PhieuNhap::TRANGTHAI_APPROVED]);

            foreach ($phieuNhap->chiTiets as $chiTiet) {
                TonKho::create([
                    'MASP'          => $chiTiet->MASP,
                    'MAPHIEUNHAP'   => $phieuNhap->MAPHIEU,
                    'SOLUONG_CON_LAI' => $chiTiet->SOLUONG,
                    'GIANHAP'       => $chiTiet->DONGIANHAP,
                    'HANSUDUNG'     => $chiTiet->HANSUDUNG,
                    'NGAYNHAP'      => $phieuNhap->NGAYLAP,
                    'IS_ACTIVE'     => true,
                ]);
            }

            DB::commit();

            $phieuNhap->load(['nhanVien.chucVu', 'nhaCungCap', 'chiTiets.sanPham']);
            return new PhieuNhapResource($phieuNhap);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi khi duyệt phiếu nhập: ' . $e->getMessage()], 500);
        }
    }

    public function cancel(PhieuNhap $phieuNhap)
    {
        if ($phieuNhap->TRANGTHAI === PhieuNhap::TRANGTHAI_APPROVED) {
            return response()->json([
                'message' => 'Không thể hủy phiếu nhập đã được duyệt.',
            ], 403);
        }

        if ($phieuNhap->TRANGTHAI === PhieuNhap::TRANGTHAI_CANCELLED) {
            return response()->json([
                'message' => 'Phiếu nhập này đã bị hủy trước đó.',
            ], 422);
        }

        $phieuNhap->update(['TRANGTHAI' => PhieuNhap::TRANGTHAI_CANCELLED]);

        $phieuNhap->load(['nhanVien.chucVu', 'nhaCungCap', 'chiTiets.sanPham']);
        return new PhieuNhapResource($phieuNhap);
    }

    public function destroy(PhieuNhap $phieuNhap)
    {
        if ($phieuNhap->TRANGTHAI === PhieuNhap::TRANGTHAI_APPROVED) {
            return response()->json([
                'message' => 'Không thể xóa phiếu nhập đã được duyệt.',
            ], 403);
        }

        $phieuNhap->IS_DELETED = true;
        $phieuNhap->save();
        return response()->noContent();
    }
}

