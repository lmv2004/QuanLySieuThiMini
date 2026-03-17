<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhieuNhapRequest extends FormRequest
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
            'NGAYLAP' => 'sometimes|required|date',
            'MANV' => 'sometimes|required|integer|exists:nhan_viens,MANV',
            'TONGTIEN' => 'sometimes|nullable|numeric|min:0',
            'GCHU' => 'sometimes|nullable|string|max:255',
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
        ];
    }
}
