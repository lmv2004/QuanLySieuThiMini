<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGiamGiaSPRequest;
use App\Http\Requests\UpdateGiamGiaSPRequest;
use App\Http\Resources\GiamGiaSPResource;
use App\Models\GiamGiaSP;

class GiamGiaSPController extends Controller
{
    public function index()
    {
        return GiamGiaSPResource::collection(
            GiamGiaSP::where('IS_DELETED', 0)
                ->with(['sanPham'])
                ->get()
        );
    }

    public function create()
    {
        // Dùng cho form-based, API không cần
    }

    public function store(StoreGiamGiaSPRequest $request)
    {
        $giamGia = GiamGiaSP::create($request->validated());
        $giamGia->load(['sanPham']);
        return new GiamGiaSPResource($giamGia);
    }

    public function show(GiamGiaSP $discount)
    {
        $discount->load(['sanPham']);
        return new GiamGiaSPResource($discount);
    }

    public function edit(GiamGiaSP $discount)
    {
        $discount->load(['sanPham']);
        return new GiamGiaSPResource($discount);
    }

    public function update(UpdateGiamGiaSPRequest $request, GiamGiaSP $discount)
    {
        $discount->update($request->validated());
        $discount->load(['sanPham']);
        return new GiamGiaSPResource($discount);
    }

    public function destroy(GiamGiaSP $discount)
    {
        $discount->IS_DELETED = true;
        $discount->save();
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
            GiamGiaSP::create($item);
            $count++;
        }

        return response()->json(['message' => "Thành công: Đã import $count Khuyến mãi", 'count' => $count]);
    }
}
