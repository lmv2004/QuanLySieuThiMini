<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCTPhieuNhapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'MAPHIEU' => 'required|integer|exists:phieu_nhaps,MAPHIEU',
            'MASP' => 'required|integer|exists:san_phams,MASP',
            'SOLUONG' => 'required|integer|min:1',
            'DONGIANHAP' => 'required|numeric|min:0',
            'HANSUDUNG' => 'nullable|date|after:today',
        ];
    }

    public function messages(): array
    {
        return [
            'MAPHIEU.required' => 'Mã phiếu là bắt buộc.',
            'MAPHIEU.integer' => 'Mã phiếu phải là số nguyên.',
            'MAPHIEU.exists' => 'Phiếu nhập không tồn tại.',

            'MASP.required' => 'Mã sản phẩm là bắt buộc.',
            'MASP.integer' => 'Mã sản phẩm phải là số nguyên.',
            'MASP.exists' => 'Sản phẩm không tồn tại.',

            'SOLUONG.required' => 'Số lượng là bắt buộc.',
            'SOLUONG.integer' => 'Số lượng phải là số nguyên.',
            'SOLUONG.min' => 'Số lượng phải lớn hơn 0.',

            'DONGIANHAP.required' => 'Đơn giá nhập là bắt buộc.',
            'DONGIANHAP.numeric' => 'Đơn giá nhập phải là số.',
            'DONGIANHAP.min' => 'Đơn giá nhập không được âm.',

            'HANSUDUNG.date' => 'Hạn sử dụng phải là định dạng ngày hợp lệ.',
            'HANSUDUNG.after' => 'Hạn sử dụng phải sau ngày hôm nay.',
        ];
    }
}
