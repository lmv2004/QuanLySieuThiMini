<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNhaCungCapRequest;
use App\Http\Requests\UpdateNhaCungCapRequest;
use App\Http\Resources\NhaCungCapResource;
use App\Models\NhaCungCap;
use Illuminate\Http\Request;

class NhaCungCapController extends Controller
{
    /**
     * Display a listing of the resource with pagination and search.
     */
    public function index(Request $request)
    {
        $query = NhaCungCap::active();

        // Tìm kiếm theo tên, số điện thoại hoặc email
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('TENNCC', 'like', '%' . $search . '%')
                  ->orWhere('SDT', 'like', '%' . $search . '%')
                  ->orWhere('EMAIL', 'like', '%' . $search . '%');
            });
        }

        // Phân trang (mặc định 15 items/page)
        $perPage = $request->input('per_page', 15);
        $suppliers = $query->paginate($perPage);

        return NhaCungCapResource::collection($suppliers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNhaCungCapRequest $request)
    {
        $data = $request->validated();
        $supplier = NhaCungCap::create($data);
        return new NhaCungCapResource($supplier);
    }

    /**
     * Display the specified resource.
     */
    public function show(NhaCungCap $supplier)
    {
        abort_if($supplier->IS_DELETED, 404);
        return new NhaCungCapResource($supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNhaCungCapRequest $request, NhaCungCap $supplier)
    {
        $data = $request->validated();
        $supplier->update($data);
        return new NhaCungCapResource($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NhaCungCap $supplier)
    {
        $supplier->IS_DELETED = true;
        $supplier->save();
        return response()->noContent();
    }
}
