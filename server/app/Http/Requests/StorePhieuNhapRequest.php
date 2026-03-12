<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhieuNhapRequest extends FormRequest
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
            'NGAYLAP' => 'required|date',
            'MANV' => 'required|integer|exists:nhan_viens,MANV',
            'TONGTIEN' => 'nullable|numeric|min:0',
            'GCHU' => 'nullable|string|max:255',
            
            // Chi tiết phiếu nhập
            'chiTiets' => 'nullable|array',
            'chiTiets.*.MASP' => 'required|integer|exists:san_phams,MASP',
            'chiTiets.*.SOLUONG' => 'required|integer|min:1',
            'chiTiets.*.DONGIANHAP' => 'required|numeric|min:0',
            'chiTiets.*.HANSUDUNG' => 'nullable|date|after:today',
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
            'NGAYLAP.required' => 'Ngày lập là bắt buộc.',
            'NGAYLAP.date' => 'Ngày lập phải là định dạng ngày hợp lệ.',

            'MANV.required' => 'Mã nhân viên là bắt buộc.',
            'MANV.integer' => 'Mã nhân viên phải là số nguyên.',
            'MANV.exists' => 'Nhân viên không tồn tại.',

            'TONGTIEN.numeric' => 'Tổng tiền phải là số.',
            'TONGTIEN.min' => 'Tổng tiền không được âm.',

            'GCHU.string' => 'Ghi chú phải là chuỗi ký tự.',
            'GCHU.max' => 'Ghi chú không được vượt quá 255 ký tự.',

            'chiTiets.array' => 'Chi tiết phiếu nhập phải là mảng.',
            'chiTiets.*.MASP.required' => 'Mã sản phẩm là bắt buộc.',
            'chiTiets.*.MASP.integer' => 'Mã sản phẩm phải là số nguyên.',
            'chiTiets.*.MASP.exists' => 'Sản phẩm không tồn tại.',

            'chiTiets.*.SOLUONG.required' => 'Số lượng là bắt buộc.',
            'chiTiets.*.SOLUONG.integer' => 'Số lượng phải là số nguyên.',
            'chiTiets.*.SOLUONG.min' => 'Số lượng phải lớn hơn 0.',

            'chiTiets.*.DONGIANHAP.required' => 'Đơn giá nhập là bắt buộc.',
            'chiTiets.*.DONGIANHAP.numeric' => 'Đơn giá nhập phải là số.',
            'chiTiets.*.DONGIANHAP.min' => 'Đơn giá nhập không được âm.',

            'chiTiets.*.HANSUDUNG.date' => 'Hạn sử dụng phải là định dạng ngày hợp lệ.',
            'chiTiets.*.HANSUDUNG.after' => 'Hạn sử dụng phải sau ngày hôm nay.',
        ];
    }
}
