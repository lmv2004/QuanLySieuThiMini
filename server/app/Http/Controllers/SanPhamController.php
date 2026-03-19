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
            // ->with(['loaiSanPham', 'nhaCungCap'])
            ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSanPhamRequest $request)
    {
        $data = $request->validated();
        $product = SanPham::create($data);
        $product->load(['loaiSanPham', 'nhaCungCap']);
        return new SanPhamResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(SanPham $product)
    {
        abort_if($product->IS_DELETED, 404);
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
        return new SanPhamResource($product);
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
