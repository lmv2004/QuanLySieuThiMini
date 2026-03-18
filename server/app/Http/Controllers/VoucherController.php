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
            Voucher::where('IS_DELETED', 0)->get()
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

    public function bulkStore(\Illuminate\Http\Request $request)
    {
        // Frontend voucher array duoc gui duoi key 'items'
        $data = $request->input('items');
        if (!is_array($data)) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ'], 400);
        }

        $count = 0;
        foreach ($data as $item) {
            if (!isset($item['MAVOUCHER']) || Voucher::where('MAVOUCHER', $item['MAVOUCHER'])->exists()) {
                continue;
            }
            Voucher::create($item);
            $count++;
        }

        return response()->json(['message' => "Thành công: Đã import $count Voucher", 'count' => $count]);
    }
}
