<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCTHoaDonRequest;
use App\Http\Requests\UpdateCTHoaDonRequest;
use App\Http\Resources\CTHoaDonResource;
use App\Models\CTHoaDon;

class CTHoaDonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CTHoaDonResource::collection(CTHoaDon::with(['sanPham', 'tonKho'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCTHoaDonRequest $request)
    {
        $data = $request->validated();
        
        $ctHoaDon = CTHoaDon::create($data);
        $ctHoaDon->load(['sanPham', 'tonKho']);
        
        return new CTHoaDonResource($ctHoaDon);
    }

    /**
     * Display the specified resource.
     */
    public function show($mahd, $masp, $id_tonkho)
    {
        $ctHoaDon = CTHoaDon::where('MAHD', $mahd)
            ->where('MASP', $masp)
            ->where('ID_TONKHO', $id_tonkho)
            ->firstOrFail();

        $ctHoaDon->load(['sanPham', 'tonKho']);
        
        return new CTHoaDonResource($ctHoaDon);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCTHoaDonRequest $request, $mahd, $masp, $id_tonkho)
    {
        $ctHoaDon = CTHoaDon::where('MAHD', $mahd)
            ->where('MASP', $masp)
            ->where('ID_TONKHO', $id_tonkho)
            ->firstOrFail();
            
        abort_if($ctHoaDon->hoaDon->TRANGTHAI == 1, 403, 'Không thể chỉnh sửa chi tiết hóa đơn của hóa đơn đã thanh toán.');

        $data = $request->validated();
        $ctHoaDon->update($data);
        
        $ctHoaDon->load(['sanPham', 'tonKho']);
        
        return new CTHoaDonResource($ctHoaDon);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($mahd, $masp, $id_tonkho)
    {
        $ctHoaDon = CTHoaDon::where('MAHD', $mahd)
            ->where('MASP', $masp)
            ->where('ID_TONKHO', $id_tonkho)
            ->firstOrFail();
            
        abort_if($ctHoaDon->hoaDon->TRANGTHAI == 1, 403, 'Không thể xóa chi tiết hóa đơn của hóa đơn đã thanh toán.');

        $ctHoaDon->delete();
        
        return response()->noContent();
    }
}
