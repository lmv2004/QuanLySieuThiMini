<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

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
            'items' => 'required|array|min:1',
            'items.*.MASP' => 'required|exists:san_phams,MASP',
            'items.*.SOLUONG' => 'required|integer|min:1',
            'items.*.GIABAN_THUCTE' => 'required|numeric|min:0',
        ];
    }

    /**
     * Handle the validation logic - validate voucher is active and not expired
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            if ($this->filled('SOVOUCHER')) {
                $voucher = \App\Models\Voucher::find($this->input('SOVOUCHER'));

                if (!$voucher) {
                    $validator->errors()->add('SOVOUCHER', 'Voucher không tồn tại.');
                    return;
                }

                if ($voucher->IS_DELETED) {
                    $validator->errors()->add('SOVOUCHER', 'Voucher đã bị xóa.');
                    return;
                }

                if ($voucher->TRANGTHAI != 1) {
                    $validator->errors()->add('SOVOUCHER', 'Voucher không còn hoạt động.');
                    return;
                }

                if ($voucher->NGAYKT && $voucher->NGAYKT < now()) {
                    $validator->errors()->add('SOVOUCHER', 'Voucher đã hết hạn.');
                    return;
                }

                if ($voucher->NGAYBD && $voucher->NGAYBD > now()) {
                    $validator->errors()->add('SOVOUCHER', 'Voucher chưa bắt đầu có hiệu lực.');
                    return;
                }

                if ($voucher->SOLUOTSD > 0 && $voucher->SOLUOTSD_DADUNG >= $voucher->SOLUOTSD) {
                    $validator->errors()->add('SOVOUCHER', 'Voucher đã hết lượt sử dụng.');
                    return;
                }
            }
        });
    }
}
