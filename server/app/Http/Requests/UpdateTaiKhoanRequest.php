<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaiKhoanRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('account')?->SOTK;
        return [
            'TENTK'    => "sometimes|string|max:100|unique:tai_khoans,TENTK,{$id},SOTK",
            'EMAIL'    => "sometimes|email|max:150|unique:tai_khoans,EMAIL,{$id},SOTK",
            'MATKHAU'  => 'sometimes|string|min:6|max:255',
            'MANV'     => 'sometimes|integer|exists:nhan_viens,MANV',
            'SOLANSAI' => 'sometimes|integer|min:0',
            'KHOA_TK'  => 'sometimes|boolean',
            'IS_DELETED' => 'sometimes|boolean',
        ];
    }
}
