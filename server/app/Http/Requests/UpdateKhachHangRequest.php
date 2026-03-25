<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKhachHangRequest extends FormRequest
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
        // Lấy ID từ route model binding
        $customer = $this->route('khachHang') ?? $this->route('customer');
        $customerId = $customer ? $customer->MAKH : null;

        return [
            'TENKH' => 'sometimes|required|string|max:200',
            'SODIENTHOAI' => 'sometimes|required|string|regex:/^[0-9]{10,15}$/|unique:khach_hangs,SODIENTHOAI,' . $customerId . ',MAKH',
            'DIACHI' => 'sometimes|nullable|string|max:255',
            'DIEMTHUONG' => 'sometimes|nullable|integer|min:0',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'TENKH.required' => 'Tên khách hàng là bắt buộc.',
            'TENKH.string' => 'Tên khách hàng phải là chuỗi ký tự.',
            'TENKH.max' => 'Tên khách hàng không được vượt quá 200 ký tự.',

            'SODIENTHOAI.required' => 'Số điện thoại là bắt buộc.',
            'SODIENTHOAI.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'SODIENTHOAI.regex' => 'Số điện thoại phải từ 10-15 chữ số.',
            'SODIENTHOAI.unique' => 'Số điện thoại đã tồn tại.',

            'DIACHI.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'DIACHI.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

            'DIEMTHUONG.integer' => 'Điểm thưởng phải là số nguyên.',
            'DIEMTHUONG.min' => 'Điểm thưởng không được âm.',
        ];
    }
}
