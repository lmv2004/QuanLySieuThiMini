<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSanPhamRequest extends FormRequest
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
        $product = $this->route('product');
        $sanPhamId = $product ? $product->MASP : null;

        return [
            'BARCODE' => 'sometimes|nullable|string|max:100|unique:san_phams,BARCODE,' . $sanPhamId . ',MASP',
            'TENSP' => 'sometimes|required|string|max:200',
            'MOTA' => 'sometimes|nullable|string',
            'DVT' => 'sometimes|nullable|string|max:50',
            'HINHANH' => 'sometimes|nullable|string|max:255',
            'GIABAN' => 'sometimes|nullable|numeric',
            'MALOAI' => 'sometimes|required|integer|exists:loai_san_phams,MALOAI',
            'MANCC' => 'sometimes|required|integer|exists:nha_cung_caps,MANCC'
        ];
    }

    public function messages(): array
    {
        return [
            'BARCODE.string' => 'BARCODE phải là chuỗi ký tự.',
            'BARCODE.max' => 'BARCODE không được vượt quá 100 ký tự.',
            'BARCODE.unique' => 'BARCODE đã tồn tại.',

            'TENSP.required' => 'Tên sản phẩm là bắt buộc.',
            'TENSP.string' => 'Tên sản phẩm phải là chuỗi ký tự.',
            'TENSP.max' => 'Tên sản phẩm không được vượt quá 200 ký tự.',

            'MOTA.string' => 'Mô tả phải là chuỗi ký tự.',

            'DVT.string' => 'Đơn vị tính phải là chuỗi ký tự.',
            'DVT.max' => 'Đơn vị tính không được vượt quá 50 ký tự.',

            'HINHANH.string' => 'Hình ảnh phải là chuỗi ký tự.',
            'HINHANH.max' => 'Hình ảnh không được vượt quá 255 ký tự.',

            'GIABAN.numeric' => 'Giá bán phải là số.',

            'MALOAI.required' => 'Mã loại là bắt buộc.',
            'MALOAI.integer' => 'Mã loại phải là số nguyên.',
            'MALOAI.exists' => 'Mã loại không tồn tại.',

            'MANCC.required' => 'Mã nhà cung cấp là bắt buộc.',
            'MANCC.integer' => 'Mã nhà cung cấp phải là số nguyên.',
            'MANCC.exists' => 'Mã nhà cung cấp không tồn tại.',
        ];
    }
}
