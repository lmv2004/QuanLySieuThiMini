<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhieuNhapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'NGAYLAP'               => 'sometimes|required|date',
            'MANV'                  => 'sometimes|required|integer|exists:nhan_viens,MANV',
            'MANCC'                 => 'required|integer|exists:nha_cung_caps,MANCC',
            'GCHU'                  => 'nullable|string|max:255',
            'chiTiets'              => 'required|array|min:1',
            'chiTiets.*.MASP'       => 'required|integer|exists:san_phams,MASP',
            'chiTiets.*.SOLUONG'    => 'required|integer|min:1',
            'chiTiets.*.DONGIANHAP' => 'required|numeric|min:0',
            'chiTiets.*.HANSUDUNG'  => 'nullable|date|after:today',
        ];
    }

    public function messages(): array
    {
        return [
            'NGAYLAP.required' => 'Ngày lập phiếu là bắt buộc.',
            'NGAYLAP.date'     => 'Ngày lập phải là định dạng ngày hợp lệ.',

            'MANV.required' => 'Mã nhân viên lập phiếu là bắt buộc.',
            'MANV.integer'  => 'Mã nhân viên phải là số nguyên.',
            'MANV.exists'   => 'Nhân viên không tồn tại trong hệ thống.',

            'GCHU.max' => 'Ghi chú không được vượt quá 255 ký tự.',

            'chiTiets.required' => 'Mảng chi tiết sản phẩm không được rỗng.',
            'chiTiets.array'    => 'Danh sách chi tiết phiếu nhập phải là mảng.',
            'chiTiets.min'      => 'Phiếu nhập phải có ít nhất 1 sản phẩm.',

            'chiTiets.*.MASP.required' => 'Mã sản phẩm là bắt buộc.',
            'chiTiets.*.MASP.integer'  => 'Mã sản phẩm phải là số nguyên.',
            'chiTiets.*.MASP.exists'   => 'Sản phẩm không tồn tại trong hệ thống.',

            'chiTiets.*.SOLUONG.required' => 'Số lượng nhập là bắt buộc.',
            'chiTiets.*.SOLUONG.integer'  => 'Số lượng nhập phải là số nguyên.',
            'chiTiets.*.SOLUONG.min'      => 'Số lượng nhập phải lớn hơn 0.',

            'chiTiets.*.DONGIANHAP.required' => 'Đơn giá nhập là bắt buộc.',
            'chiTiets.*.DONGIANHAP.numeric'  => 'Đơn giá nhập phải là số.',
            'chiTiets.*.DONGIANHAP.min'      => 'Đơn giá nhập không được âm.',

            'chiTiets.*.HANSUDUNG.date'  => 'Hạn sử dụng phải là định dạng ngày hợp lệ.',
            'chiTiets.*.HANSUDUNG.after' => 'Hạn sử dụng phải sau ngày hôm nay.',
        ];
    }
}
