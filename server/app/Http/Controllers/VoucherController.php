<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;

class VoucherController extends Controller
{
    public function index()
    {
        return VoucherResource::collection(
            Voucher::active()->get()
        );
    }

    public function create()
    {
        // Dùng cho form-based, API không cần
    }

    public function store(StoreVoucherRequest $request)
    {
        $voucher = Voucher::create($request->validated());
        return new VoucherResource($voucher);
    }

    public function show(Voucher $voucher)
    {
        return new VoucherResource($voucher);
    }

    public function edit(Voucher $voucher)
    {
        return new VoucherResource($voucher);
    }

    public function update(UpdateVoucherRequest $request, Voucher $voucher)
    {
        $voucher->update($request->validated());
        return new VoucherResource($voucher);
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->IS_DELETED = true;
        $voucher->save();
        return response()->noContent();
    }
}
