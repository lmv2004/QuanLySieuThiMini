<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKhachHangRequest;
use App\Http\Requests\UpdateKhachHangRequest;
use App\Http\Resources\KhachHangResource;
use App\Models\KhachHang;
use Illuminate\Http\Request;

class KhachHangController extends Controller
{
    /**
     * Display a listing of the resource with pagination and search.
     */
    public function index(Request $request)
    {
        $query = KhachHang::active();

        // Tìm kiếm theo tên hoặc số điện thoại
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('TENKH', 'like', '%' . $search . '%')
                  ->orWhere('SODIENTHOAI', 'like', '%' . $search . '%');
            });
        }

        // Phân trang (mặc định 15 items/page)
        $perPage = $request->input('per_page', 15);
        $customers = $query->paginate($perPage);

        return KhachHangResource::collection($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKhachHangRequest $request)
    {
        $data = $request->validated();
        $customer = KhachHang::create($data);
        return new KhachHangResource($customer);
    }

    /**
     * Display the specified resource.
     */
    public function show(KhachHang $customer)
    {
        abort_if($customer->IS_DELETED, 404);
        return new KhachHangResource($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKhachHangRequest $request, KhachHang $customer)
    {
        $data = $request->validated();
        $customer->update($data);
        return new KhachHangResource($customer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KhachHang $customer)
    {
        $customer->IS_DELETED = true;
        $customer->save();
        return response()->noContent();
    }
}
