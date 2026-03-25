<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaiKhoanRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('account')?->SOTK;
        return [
            'TENTK'    => [
                'sometimes', 'string', 'max:100',
                Rule::unique('tai_khoans', 'TENTK')->ignore($id, 'SOTK')->where(function ($query) {
                    return $query->where('IS_DELETED', 0);
                })
            ],
            'EMAIL'    => [
                'sometimes', 'email', 'max:150',
                Rule::unique('tai_khoans', 'EMAIL')->ignore($id, 'SOTK')->where(function ($query) {
                    return $query->where('IS_DELETED', 0);
                })
            ],
            'MATKHAU'  => 'sometimes|string|min:6|max:255',
            'MANV'     => 'sometimes|integer|exists:nhan_viens,MANV',
            'SOLANSAI' => 'sometimes|integer|min:0',
            'KHOA_TK'  => 'sometimes|boolean',
            'IS_DELETED' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'TENTK.unique'     => 'Tên tài khoản đã tồn tại.',
            'EMAIL.email'      => 'Email không hợp lệ.',
            'EMAIL.unique'     => 'Email đã được sử dụng.',
            'MATKHAU.min'      => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'MANV.exists'      => 'Nhân viên không tồn tại.',
        ];
    }
}
