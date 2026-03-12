<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoaiSanPhamRequest;
use App\Http\Requests\UpdateLoaiSanPhamRequest;
use App\Http\Resources\LoaiSanPhamResource;
use App\Models\LoaiSanPham;

class LoaiSanPhamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LoaiSanPhamResource::collection(LoaiSanPham::active()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLoaiSanPhamRequest $request)
    {
        $data = $request->validated();
        $category = LoaiSanPham::create($data);
        return new LoaiSanPhamResource($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(LoaiSanPham $category)
    {
        abort_if($category->IS_DELETED, 404);
        return new LoaiSanPhamResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLoaiSanPhamRequest $request, LoaiSanPham $category)
    {
        $data = $request->validated();
        $category->update($data);
        return new LoaiSanPhamResource($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoaiSanPham $category)
    {
        $category->IS_DELETED = true;
        $category->save();
        return response()->noContent();
    }
}
