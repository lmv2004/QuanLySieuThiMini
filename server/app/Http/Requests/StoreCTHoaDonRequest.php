<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCTHoaDonRequest extends FormRequest
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
            'MAHD' => 'required|integer|exists:hoa_dons,MAHD',
            'MASP' => 'required|integer|exists:san_phams,MASP',
            'ID_TONKHO' => 'required|integer|exists:ton_khos,ID',
            'SOLUONG' => 'required|integer|min:1',
            'GIABAN_GOC' => 'required|numeric|min:0',
            'GIABAN_THUCTE' => 'required|numeric|min:0',
            'THANHTIEN' => 'required|numeric|min:0',
        ];
    }
}
