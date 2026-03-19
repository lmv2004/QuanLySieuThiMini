<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChucVuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $chucVu = $this->route('position');
        $positionId = $chucVu ? $chucVu->MACHUCVU : null;

        return [
            'CODE'      => 'sometimes|nullable|string|max:50|unique:chuc_vus,CODE,' . $positionId . ',MACHUCVU|regex:/^[a-z0-9_]+$/',
            'TENCHUCVU' => 'sometimes|required|string|max:100|unique:chuc_vus,TENCHUCVU,' . $positionId . ',MACHUCVU',
            'MOTA'      => 'sometimes|nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'CODE.string'   => 'Code phải là chuỗi ký tự.',
            'CODE.max'      => 'Code không được vượt quá 50 ký tự.',
            'CODE.unique'   => 'Code này đã được sử dụng.',
            'CODE.regex'    => 'Code chỉ được chứa chữ thường, số và dấu gạch dưới (a-z, 0-9, _).',

            'TENCHUCVU.required' => 'Tên chức vụ là bắt buộc.',
            'TENCHUCVU.string'   => 'Tên chức vụ phải là chuỗi ký tự.',
            'TENCHUCVU.max'      => 'Tên chức vụ không được vượt quá 100 ký tự.',
            'TENCHUCVU.unique'   => 'Tên chức vụ đã tồn tại.',

            'MOTA.string' => 'Mô tả phải là chuỗi ký tự.',
            'MOTA.max'    => 'Mô tả không được vượt quá 100 ký tự.',
        ];
    }
}
