<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNhanVienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $nhanVien = $this->route('employee') ?? $this->route('nhanVien');
        $employeeId = $nhanVien ? $nhanVien->MANV : null;

        return [
            'TENNV' => 'sometimes|required|string|max:200',
            'GIOITINH' => 'sometimes|nullable|boolean',
            'CCCD' => 'sometimes|nullable|string|max:20|unique:nhan_viens,CCCD,' . $employeeId . ',MANV',
            'NGAYSINH' => 'sometimes|nullable|date|before:today',
            'SODIENTHOAI' => 'sometimes|nullable|string|regex:/^[0-9]{10,15}$/',
            'EMAIL' => 'sometimes|nullable|email|max:100|unique:nhan_viens,EMAIL,' . $employeeId . ',MANV',
            'DIACHI' => 'sometimes|nullable|string|max:255',
            'NGAYTHAMGIA' => 'sometimes|nullable|date',
            'MACHUCVU' => 'sometimes|required|integer|exists:chuc_vus,MACHUCVU',
        ];
    }

    public function messages(): array
    {
        return [
            'TENNV.required' => 'Tên nhân viên là bắt buộc.',
            'TENNV.max' => 'Tên nhân viên không được vượt quá 200 ký tự.',
            
            'GIOITINH.boolean' => 'Giới tính phải là 0 (Nữ) hoặc 1 (Nam).',
            
            'CCCD.max' => 'CCCD không được vượt quá 20 ký tự.',
            'CCCD.unique' => 'CCCD đã tồn tại.',
            
            'NGAYSINH.date' => 'Ngày sinh phải là định dạng ngày hợp lệ.',
            'NGAYSINH.before' => 'Ngày sinh phải trước ngày hôm nay.',
            
            'SODIENTHOAI.regex' => 'Số điện thoại phải từ 10-15 chữ số.',
            
            'EMAIL.email' => 'Email không đúng định dạng.',
            'EMAIL.max' => 'Email không được vượt quá 100 ký tự.',
            'EMAIL.unique' => 'Email đã tồn tại.',
            
            'DIACHI.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            
            'NGAYTHAMGIA.date' => 'Ngày tham gia phải là định dạng ngày hợp lệ.',
            
            'MACHUCVU.required' => 'Chức vụ là bắt buộc.',
            'MACHUCVU.integer' => 'Mã chức vụ phải là số nguyên.',
            'MACHUCVU.exists' => 'Chức vụ không tồn tại.',
        ];
    }
}
