<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaiKhoanRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'TENTK'   => [
                'required', 'string', 'max:100',
                Rule::unique('tai_khoans', 'TENTK')->where(function ($query) {
                    return $query->where('IS_DELETED', 0);
                })
            ],
            'EMAIL'   => [
                'required', 'email', 'max:150',
                Rule::unique('tai_khoans', 'EMAIL')->where(function ($query) {
                    return $query->where('IS_DELETED', 0);
                })
            ],
            'MATKHAU' => 'required|string|min:6|max:255',
            'MANV'    => [
                'required', 'integer', 'exists:nhan_viens,MANV',
                Rule::unique('tai_khoans', 'MANV')->where(function ($query) {
                    return $query->where('IS_DELETED', 0);
                })
            ],
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
            'MANV.unique'      => 'Nhân viên này đã có tài khoản rồi.',
        ];
    }
}
