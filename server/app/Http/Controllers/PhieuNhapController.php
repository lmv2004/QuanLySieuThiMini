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

            /** @var \App\Models\TaiKhoan $authUser */
            $authUser = $request->user();
            $manv = $authUser->MANV;

            // Tính TONGTIEN chính xác từ chiTiets (không nhận từ client)
            $tongTien = collect($data['chiTiets'])
                ->sum(fn($ct) => (int)$ct['SOLUONG'] * (float)$ct['DONGIANHAP']);

            $phieuNhap = PhieuNhap::create([
                'NGAYLAP'   => now(),           // hardcode server time
                'MANV'      => $manv,           // hardcode từ auth
                'MANCC'     => $data['MANCC'],
                'TONGTIEN'  => $tongTien,       // tính lại server-side
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
                ->sum(fn($ct) => (int)$ct['SOLUONG'] * (float)$ct['DONGIANHAP']);

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

    /**
     * Bulk import từ file Excel template.
     * Mỗi item trong data = { MANCC, GCHU, chiTiets: [{MASP, SOLUONG, DONGIANHAP, HANSUDUNG}] }
     */
    public function bulkStore(Request $request)
    {
        $rows = $request->input('data', []);

        if (empty($rows)) {
            return response()->json(['message' => 'Không có dữ liệu để import.'], 422);
        }

        /** @var \App\Models\TaiKhoan $authUser */
        $authUser = $request->user();
        $manv = $authUser->MANV;

        DB::beginTransaction();
        try {
            $created = 0;

            foreach ($rows as $row) {
                $mancc     = (int)($row['MANCC'] ?? 0);
                $gchu      = trim($row['GCHU'] ?? '') ?: null;
                $chiTiets  = $row['chiTiets'] ?? [];

                // Lọc bỏ các dòng không hợp lệ
                $validLines = array_filter($chiTiets, fn($ct) =>
                    !empty($ct['MASP']) && (int)($ct['MASP']) > 0 &&
                    !empty($ct['SOLUONG']) && (int)($ct['SOLUONG']) > 0
                );

                if (empty($validLines) || $mancc === 0) continue;

                $tongTien = collect($validLines)
                    ->sum(fn($ct) => (int)$ct['SOLUONG'] * (float)($ct['DONGIANHAP'] ?? 0));

                $phieuNhap = PhieuNhap::create([
                    'NGAYLAP'   => now(),
                    'MANV'      => $manv,
                    'MANCC'     => $mancc,
                    'TONGTIEN'  => $tongTien,
                    'GCHU'      => $gchu,
                    'TRANGTHAI' => PhieuNhap::TRANGTHAI_PENDING,
                ]);

                foreach ($validLines as $ct) {
                    // Sanitize HANSUDUNG: chỉ chấp nhận định dạng YYYY-MM-DD
                    $hansudung = $ct['HANSUDUNG'] ?? null;
                    if ($hansudung && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $hansudung)) {
                        $hansudung = null;
                    }

                    CTPhieuNhap::create([
                        'MAPHIEU'    => $phieuNhap->MAPHIEU,
                        'MASP'       => (int)$ct['MASP'],
                        'SOLUONG'    => (int)$ct['SOLUONG'],
                        'DONGIANHAP' => (float)($ct['DONGIANHAP'] ?? 0),
                        'HANSUDUNG'  => $hansudung,
                    ]);
                }
                $created++;
            }

            DB::commit();
            return response()->json([
                'message' => "Đã tạo {$created} phiếu nhập thành công.",
                'count'   => $created,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi khi import: ' . $e->getMessage()], 500);
        }
    }
}

