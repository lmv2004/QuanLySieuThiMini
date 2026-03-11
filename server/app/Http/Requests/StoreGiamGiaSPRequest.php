<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGiamGiaSPRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'MASP'             => 'required|integer|exists:san_phams,MASP',
            'TEN_CHUONG_TRINH' => 'required|string|max:200',
            'LOAI_GIAM'        => 'required|integer|in:0,1',
            'GIATRI_GIAM'      => 'required|numeric|min:0',
            'NGAYBD'           => 'required|date',
            'NGAYKT'           => 'required|date|after:NGAYBD',
            'TRANGTHAI'        => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'MASP.required'             => 'Mã sản phẩm là bắt buộc.',
            'MASP.exists'               => 'Sản phẩm không tồn tại.',
            'TEN_CHUONG_TRINH.required' => 'Tên chương trình là bắt buộc.',
            'LOAI_GIAM.required'        => 'Loại giảm là bắt buộc.',
            'LOAI_GIAM.in'              => 'Loại giảm phải là 0 (%) hoặc 1 (tiền mặt).',
            'GIATRI_GIAM.required'      => 'Giá trị giảm là bắt buộc.',
            'NGAYBD.required'           => 'Ngày bắt đầu là bắt buộc.',
            'NGAYKT.required'           => 'Ngày kết thúc là bắt buộc.',
            'NGAYKT.after'              => 'Ngày kết thúc phải sau ngày bắt đầu.',
        ];
    }
}
