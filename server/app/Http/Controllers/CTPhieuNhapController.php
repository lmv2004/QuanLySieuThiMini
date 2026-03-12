<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCTPhieuNhapRequest;
use App\Http\Requests\UpdateCTPhieuNhapRequest;
use App\Http\Resources\CTPhieuNhapResource;
use App\Models\CTPhieuNhap;
use App\Models\TonKho;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CTPhieuNhapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CTPhieuNhap::with(['phieuNhap', 'sanPham']);

        // Lọc theo mã phiếu
        if ($request->has('MAPHIEU')) {
            $query->where('MAPHIEU', $request->input('MAPHIEU'));
        }

        $chiTiets = $query->get();
        return CTPhieuNhapResource::collection($chiTiets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCTPhieuNhapRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            
            // Tạo chi tiết phiếu nhập
            $ctPhieuNhap = CTPhieuNhap::create($data);

            // Tự động tạo tồn kho
            TonKho::create([
                'MASP' => $data['MASP'],
                'MAPHIEUNHAP' => $data['MAPHIEU'],
                'SOLUONGTON' => $data['SOLUONG'],
                'DONGIANHAP' => $data['DONGIANHAP'],
                'HANSUDUNG' => $data['HANSUDUNG'] ?? null,
            ]);

            DB::commit();
            
            $ctPhieuNhap->load(['phieuNhap', 'sanPham']);
            return new CTPhieuNhapResource($ctPhieuNhap);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi tạo chi tiết phiếu nhập: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($maphieu, $masp)
    {
        $ctPhieuNhap = CTPhieuNhap::where('MAPHIEU', $maphieu)
            ->where('MASP', $masp)
            ->with(['phieuNhap', 'sanPham'])
            ->firstOrFail();
            
        return new CTPhieuNhapResource($ctPhieuNhap);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCTPhieuNhapRequest $request, $maphieu, $masp)
    {
        $ctPhieuNhap = CTPhieuNhap::where('MAPHIEU', $maphieu)
            ->where('MASP', $masp)
            ->firstOrFail();
            
        $data = $request->validated();
        $ctPhieuNhap->update($data);
        
        $ctPhieuNhap->load(['phieuNhap', 'sanPham']);
        return new CTPhieuNhapResource($ctPhieuNhap);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($maphieu, $masp)
    {
        $ctPhieuNhap = CTPhieuNhap::where('MAPHIEU', $maphieu)
            ->where('MASP', $masp)
            ->firstOrFail();
            
        $ctPhieuNhap->delete();
        return response()->noContent();
    }
}
