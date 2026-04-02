<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHoaDonRequest;
use App\Http\Requests\UpdateHoaDonRequest;
use App\Http\Resources\HoaDonResource;
use App\Models\HoaDon;
use App\Models\TonKho;
use App\Models\CTHoaDon;
use Illuminate\Support\Facades\DB;

class HoaDonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return HoaDonResource::collection(HoaDon::active()
            ->with(['nhanVien', 'khachHang', 'voucher'])
            ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     * Áp dụng FEFO (First Expire First Out) - xuất lô sắp hết hạn trước
     */
    public function store(StoreHoaDonRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $items = $data['items'] ?? [];
            unset($data['items']);

            // Kiểm tra có items không
            if (empty($items)) {
                throw new \Exception("Hóa đơn phải có ít nhất một sản phẩm");
            }

            // Kiểm tra tồn kho trước khi tạo hóa đơn
            foreach ($items as $item) {
                $soLuongCanTru = $item['SOLUONG'];
                $masp = $item['MASP'];

                $soLuongTonKho = TonKho::where('MASP', $masp)
                    ->where('IS_ACTIVE', 1)
                    ->sum('SOLUONG_CON_LAI');

                if ($soLuongTonKho < $soLuongCanTru) {
                    throw new \Exception("Sản phẩm {$masp} không đủ hàng. Tồn kho: {$soLuongTonKho}, cần: {$soLuongCanTru}");
                }
            }

            // Tạo hóa đơn
            $invoice = HoaDon::create($data);

            // Tạo chi tiết hóa đơn và trừ tồn kho (FEFO)
            foreach ($items as $item) {
                $soLuongCanTru = $item['SOLUONG'];
                $masp = $item['MASP'];

                // Lấy danh sách lô hàng của sản phẩm, sắp xếp theo HANSUDUNG (FEFO)
                $tonKhos = TonKho::where('MASP', $masp)
                    ->where('IS_ACTIVE', 1)
                    ->where('SOLUONG_CON_LAI', '>', 0)
                    ->orderBy('HANSUDUNG', 'asc') // FEFO: hạn sớm nhất trước
                    ->get();

                foreach ($tonKhos as $tonKho) {
                    if ($soLuongCanTru <= 0) break;

                    // Tính số lượng trừ từ lô này
                    $soLuongTruTuLo = min($soLuongCanTru, $tonKho->SOLUONG_CON_LAI);

                    // Tạo chi tiết hóa đơn cho lô này
                    CTHoaDon::create([
                        'MAHD' => $invoice->MAHD,
                        'MASP' => $masp,
                        'ID_TONKHO' => $tonKho->ID,
                        'SOLUONG' => $soLuongTruTuLo,
                        'GIABAN_GOC' => $item['GIABAN_THUCTE'],
                        'GIABAN_THUCTE' => $item['GIABAN_THUCTE'],
                        'THANHTIEN' => $soLuongTruTuLo * $item['GIABAN_THUCTE'],
                    ]);

                    // Trừ tồn kho của lô này
                    TonKho::where('ID', $tonKho->ID)->decrement('SOLUONG_CON_LAI', $soLuongTruTuLo);

                    // Lấy lại giá trị mới từ database
                    $tonKho = TonKho::find($tonKho->ID);

                    // Nếu lô hết → đánh dấu không còn hiệu lực
                    if ($tonKho->SOLUONG_CON_LAI <= 0) {
                        TonKho::where('ID', $tonKho->ID)->update(['IS_ACTIVE' => 0]);
                    }

                    $soLuongCanTru -= $soLuongTruTuLo;
                }

                // Nếu không đủ hàng → phát sinh lỗi
                if ($soLuongCanTru > 0) {
                    throw new \Exception("Sản phẩm {$masp} không đủ hàng. Thiếu: {$soLuongCanTru}");
                }
            }

            $invoice->load(['nhanVien', 'khachHang', 'voucher', 'chiTiets.sanPham', 'chiTiets.tonKho']);
            return new HoaDonResource($invoice);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(HoaDon $invoice)
    {
        abort_if($invoice->IS_DELETED, 404);
        $invoice->load(['nhanVien', 'khachHang', 'voucher', 'chiTiets.sanPham', 'chiTiets.tonKho']);
        return new HoaDonResource($invoice);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHoaDonRequest $request, HoaDon $invoice)
    {
        abort_if($invoice->TRANGTHAI == 1, 403, 'Không thể chỉnh sửa hóa đơn đã thanh toán.');

        $data = $request->validated();
        $invoice->update($data);
        $invoice->load(['nhanVien', 'khachHang', 'voucher']);
        return new HoaDonResource($invoice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HoaDon $invoice)
    {
        abort_if($invoice->TRANGTHAI == 1, 403, 'Không thể xóa hóa đơn đã thanh toán.');

        $invoice->IS_DELETED = true;
        $invoice->save();
        return response()->noContent();
    }
}
