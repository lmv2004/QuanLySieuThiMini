<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSanPhamRequest;
use App\Http\Requests\UpdateSanPhamRequest;
use App\Http\Resources\SanPhamResource;
use App\Models\SanPham;

class SanPhamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SanPhamResource::collection(SanPham::active()
            ->with(['loaiSanPham', 'nhaCungCap'])
            ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSanPhamRequest $request)
    {
        $data = $request->validated();
        $sanPham = SanPham::create($data);
        $sanPham->load(['loaiSanPham', 'nhaCungCap']);
        return new SanPhamResource($sanPham);
    }

    /**
     * Display the specified resource.
     */
    public function show(SanPham $sanPham)
    {
        $sanPham->load(['loaiSanPham', 'nhaCungCap'])::active();
        return new SanPhamResource($sanPham);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSanPhamRequest $request, SanPham $sanPham)
    {
        $data = $request->validated();
        $sanPham->update($data);
        $sanPham->load(['loaiSanPham', 'nhaCungCap']);
        return new SanPhamResource($sanPham);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SanPham $sanPham)
    {
        $sanPham->IS_DELETED = true;
        $sanPham->save();
        return response()->noContent();
    }
}
