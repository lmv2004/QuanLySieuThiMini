<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoaiSanPhamRequest extends FormRequest
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
            'TENLOAI' => 'required|string|max:100|unique:loai_san_phams,TENLOAI',
            'MOTA' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'TENLOAI.required' => 'Tên loại sản phẩm là bắt buộc.',
            'TENLOAI.string' => 'Tên loại sản phẩm phải là chuỗi ký tự.',
            'TENLOAI.max' => 'Tên loại sản phẩm không được vượt quá 100 ký tự.',
            'TENLOAI.unique' => 'Tên loại sản phẩm đã tồn tại.',
            
            'MOTA.string' => 'Mô tả phải là chuỗi ký tự.',
        ];
    }
}
