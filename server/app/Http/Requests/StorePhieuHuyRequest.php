<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhieuHuyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'NGAYLAP' => 'required|date',
            'MANV'    => 'required|integer|exists:nhan_viens,MANV',
            'LYDO'    => 'required|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'NGAYLAP.required' => 'Ngày lập là bắt buộc.',
            'MANV.required'    => 'Mã nhân viên là bắt buộc.',
            'MANV.exists'      => 'Nhân viên không tồn tại.',
            'LYDO.required'    => 'Lý do hủy là bắt buộc.',
        ];
    }
}
