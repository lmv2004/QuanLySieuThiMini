<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSanPhamRequest extends FormRequest
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
            'BARCODE'=> 'required|string|max:100|unique:san_phams,BARCODE',
            'TENSP' => 'required|string|max:200',
            'MOTA' => 'nullable|string',
            'DVT' => 'nullable|string|max:50',
            'HINHANH' => 'nullable|string|max:255',
            'GIABAN' => 'nullable|numeric',
            'MALOAI' => 'required|integer',
            'MANCC' => 'required|integer'
        ];
    }
    public function messages(): array
    {
        return [
            'BARCODE.required' => 'BARCODE là bắt buộc.',
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

            'MALOAI.integer' => 'Mã loại phải là số nguyên.',

            'MANCC.integer' => 'Mã nhà cung cấp phải là số nguyên.',
        ];
    }
}
