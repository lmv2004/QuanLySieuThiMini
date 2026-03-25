<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVoucherRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('voucher')?->SOVOUCHER;
        return [
            'MAVOUCHER'      => "sometimes|string|max:50|unique:vouchers,MAVOUCHER,{$id},SOVOUCHER",
            'MOTA'           => 'nullable|string',
            'NGAYBD'         => 'sometimes|date',
            'NGAYKT'         => 'sometimes|date|after:NGAYBD',
            'GIATRITOITHIEU' => 'sometimes|numeric|min:0',
            'KMTOITHIEU'     => 'sometimes|numeric|min:0',
            'KMTOIDA'        => 'sometimes|numeric|min:0',
            'PTGIAM'         => 'sometimes|integer|min:0|max:100',
            'SOLUOTSD'       => 'sometimes|integer|min:1',
            'SOLUOTSD_DADUNG' => 'sometimes|integer|min:0',
            'TRANGTHAI'      => 'sometimes|integer|in:0,1,2',
            'IS_DELETED'     => 'sometimes|boolean',
        ];
    }
}
