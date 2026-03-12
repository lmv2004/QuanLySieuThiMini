<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHoaDonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'NGAYHD' => 'sometimes|nullable|date',
            'HINHTHUC' => 'sometimes|required|string|max:50',
            'TONGTIEN_HANG' => 'sometimes|required|numeric|min:0',
            'TIEN_GIAM_VOUCHER' => 'sometimes|nullable|numeric|min:0',
            'TONG_THANHTOAN' => 'sometimes|required|numeric|min:0',
            'TRANGTHAI' => 'sometimes|required|in:0,1',
            'MANV' => 'sometimes|required|integer|exists:nhan_viens,MANV',
            'MAKH' => 'sometimes|nullable|integer|exists:khach_hangs,MAKH',
            'SOVOUCHER' => 'sometimes|nullable|string|exists:vouchers,SOVOUCHER',
        ];
    }
}
