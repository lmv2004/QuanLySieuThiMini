<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaiKhoanRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'TENTK'   => 'required|string|max:100|unique:tai_khoans,TENTK',
            'EMAIL'   => 'required|email|max:150|unique:tai_khoans,EMAIL',
            'MATKHAU' => 'required|string|min:6|max:255',
            'MANV'    => 'required|integer|exists:nhan_viens,MANV',
            'KHOA_TK' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'TENTK.required'   => 'Tên tài khoản là bắt buộc.',
            'TENTK.unique'     => 'Tên tài khoản đã tồn tại.',
            'EMAIL.required'   => 'Email là bắt buộc.',
            'EMAIL.email'      => 'Email không hợp lệ.',
            'EMAIL.unique'     => 'Email đã được sử dụng.',
            'MATKHAU.required' => 'Mật khẩu là bắt buộc.',
            'MATKHAU.min'      => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'MANV.required'    => 'Mã nhân viên là bắt buộc.',
            'MANV.exists'      => 'Nhân viên không tồn tại.',
        ];
    }
}
