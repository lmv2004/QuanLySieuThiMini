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
        return SanPhamResource::collection(SanPham::with(['loaiSanPham', 'nhaCungCap'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSanPhamRequest $request)
    {
        $data = $request->validated();
        $sp = SanPham::create($data);
        $sp->load(['loaiSanPham', 'nhaCungCap']);
        return response()->json(new SanPhamResource($sp), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SanPham $product)
    {
        $product->load(['loaiSanPham', 'nhaCungCap']);
        return new SanPhamResource($product);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSanPhamRequest $request, SanPham $product)
    {
        $data = $request->validated();
        $product->update($data);
        $product->load(['loaiSanPham', 'nhaCungCap']);
        return response()->json(new SanPhamResource($product), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SanPham $product)
    {
        $product->IS_DELETED = true;
        $product->save();
        return response()->noContent();
    }
}
