<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGiamGiaSPRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'MASP'             => 'sometimes|integer|exists:san_phams,MASP',
            'TEN_CHUONG_TRINH' => 'sometimes|string|max:200',
            'LOAI_GIAM'        => 'sometimes|integer|in:0,1',
            'GIATRI_GIAM'      => 'sometimes|numeric|min:0',
            'NGAYBD'           => 'sometimes|date',
            'NGAYKT'           => 'sometimes|date|after:NGAYBD',
            'TRANGTHAI'        => 'sometimes|boolean',
            'IS_DELETED'       => 'sometimes|boolean',
        ];
    }
}
