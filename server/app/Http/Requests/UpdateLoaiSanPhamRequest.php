<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoaiSanPhamRequest extends FormRequest
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
        $category = $this->route('category');
        $categoryId = $category ? $category->MALOAI : null;

        return [
            'TENLOAI' => 'sometimes|required|string|max:100|unique:loai_san_phams,TENLOAI,' . $categoryId . ',MALOAI',
            'MOTA' => 'sometimes|nullable|string',
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
