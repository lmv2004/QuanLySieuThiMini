<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhieuHuyRequest;
use App\Http\Requests\UpdatePhieuHuyRequest;
use App\Http\Resources\PhieuHuyResource;
use App\Models\PhieuHuy;

class PhieuHuyController extends Controller
{
    public function index()
    {
        return PhieuHuyResource::collection(
            PhieuHuy::active()
                ->with(['nhanVien', 'chiTiets'])
                ->get()
        );
    }

    public function create()
    {
        // Dùng cho form-based, API không cần
    }

    public function store(StorePhieuHuyRequest $request)
    {
        $phieuHuy = PhieuHuy::create($request->validated());
        $phieuHuy->load(['nhanVien', 'chiTiets']);
        return new PhieuHuyResource($phieuHuy);
    }

    public function show(PhieuHuy $disposal_slip)
    {
        $disposal_slip->load(['nhanVien', 'chiTiets.sanPham']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function edit(PhieuHuy $disposal_slip)
    {
        $disposal_slip->load(['nhanVien', 'chiTiets']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function update(UpdatePhieuHuyRequest $request, PhieuHuy $disposal_slip)
    {
        $disposal_slip->update($request->validated());
        $disposal_slip->load(['nhanVien', 'chiTiets']);
        return new PhieuHuyResource($disposal_slip);
    }

    public function destroy(PhieuHuy $disposal_slip)
    {
        $disposal_slip->IS_DELETED = true;
        $disposal_slip->save();
        return response()->noContent();
    }
}
