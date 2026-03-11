<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhieuHuyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'NGAYLAP'    => 'sometimes|date',
            'MANV'       => 'sometimes|integer|exists:nhan_viens,MANV',
            'LYDO'       => 'sometimes|string|max:500',
            'IS_DELETED' => 'sometimes|boolean',
        ];
    }
}
