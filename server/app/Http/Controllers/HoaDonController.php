<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHoaDonRequest;
use App\Http\Requests\UpdateHoaDonRequest;
use App\Http\Resources\HoaDonResource;
use App\Models\HoaDon;

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
     */
    public function store(StoreHoaDonRequest $request)
    {
        $data = $request->validated();
        $invoice = HoaDon::create($data);
        $invoice->load(['nhanVien', 'khachHang', 'voucher']);
        return new HoaDonResource($invoice);
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
