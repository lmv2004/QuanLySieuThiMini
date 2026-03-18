<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhieuHuyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'NGAYLAP'               => 'required|date',
            'MANV'                  => 'required|integer|exists:nhan_viens,MANV',
            'LYDO'                  => 'required|string|max:500',
            'chiTiets'              => 'sometimes|array',
            'chiTiets.*.MASP'       => 'required_with:chiTiets|integer|exists:san_phams,MASP',
            'chiTiets.*.ID_TONKHO'  => 'required_with:chiTiets|integer|exists:ton_khos,ID',
            'chiTiets.*.SOLUONG'    => 'required_with:chiTiets|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'NGAYLAP.required'               => 'Ngày lập là bắt buộc.',
            'MANV.required'                  => 'Mã nhân viên là bắt buộc.',
            'MANV.exists'                    => 'Nhân viên không tồn tại.',
            'LYDO.required'                  => 'Lý do hủy là bắt buộc.',
            'chiTiets.*.MASP.required_with'  => 'Mã sản phẩm chi tiết không được để trống.',
            'chiTiets.*.MASP.exists'         => 'Sản phẩm chi tiết không tồn tại.',
            'chiTiets.*.ID_TONKHO.exists'    => 'Lô hàng tồn kho của chi tiết không tồn tại.',
            'chiTiets.*.SOLUONG.min'         => 'Số lượng hủy phải lớn hơn 0.',
        ];
    }
}
