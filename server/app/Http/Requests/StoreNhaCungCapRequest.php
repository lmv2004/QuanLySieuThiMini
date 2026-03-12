<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNhaCungCapRequest extends FormRequest
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
            'TENNCC' => 'required|string|max:200',
            'DIACHI' => 'nullable|string|max:255',
            'SDT' => 'nullable|string|regex:/^[0-9]{10,15}$/|unique:nha_cung_caps,SDT',
            'EMAIL' => 'nullable|email|max:100|unique:nha_cung_caps,EMAIL',
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
            'TENNCC.required' => 'Tên nhà cung cấp là bắt buộc.',
            'TENNCC.string' => 'Tên nhà cung cấp phải là chuỗi ký tự.',
            'TENNCC.max' => 'Tên nhà cung cấp không được vượt quá 200 ký tự.',

            'DIACHI.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'DIACHI.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

            'SDT.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'SDT.regex' => 'Số điện thoại phải từ 10-15 chữ số.',
            'SDT.unique' => 'Số điện thoại đã tồn tại.',

            'EMAIL.email' => 'Email không đúng định dạng.',
            'EMAIL.max' => 'Email không được vượt quá 100 ký tự.',
            'EMAIL.unique' => 'Email đã tồn tại.',
        ];
    }
}
