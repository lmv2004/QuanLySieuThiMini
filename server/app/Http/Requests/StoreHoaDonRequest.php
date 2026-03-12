<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHoaDonRequest extends FormRequest
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
            'NGAYHD' => 'nullable|date',
            'HINHTHUC' => 'required|string|max:50',
            'TONGTIEN_HANG' => 'required|numeric|min:0',
            'TIEN_GIAM_VOUCHER' => 'nullable|numeric|min:0',
            'TONG_THANHTOAN' => 'required|numeric|min:0',
            'TRANGTHAI' => 'nullable|in:0,1',
            'MANV' => 'required|integer|exists:nhan_viens,MANV',
            'MAKH' => 'nullable|integer|exists:khach_hangs,MAKH',
            'SOVOUCHER' => 'nullable|string|exists:vouchers,SOVOUCHER',
        ];
    }
}
