<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCTPhieuNhapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'SOLUONG' => 'sometimes|required|integer|min:1',
            'DONGIANHAP' => 'sometimes|required|numeric|min:0',
            'HANSUDUNG' => 'sometimes|nullable|date|after:today',
        ];
    }

    public function messages(): array
    {
        return [
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
