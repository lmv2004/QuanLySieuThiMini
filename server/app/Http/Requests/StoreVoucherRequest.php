<?php
// ========== StoreVoucherRequest.php ==========
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoucherRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'MAVOUCHER'      => 'required|string|max:50|unique:vouchers,MAVOUCHER',
            'MOTA'           => 'nullable|string',
            'NGAYBD'         => 'required|date',
            'NGAYKT'         => 'required|date|after:NGAYBD',
            'GIATRITOITHIEU' => 'required|numeric|min:0',
            'KMTOITHIEU'     => 'required|numeric|min:0',
            'KMTOIDA'        => 'required|numeric|min:0|gte:KMTOITHIEU',
            'PTGIAM'         => 'required|integer|min:0|max:100',
            'SOLUOTSD'       => 'required|integer|min:1',
            'TRANGTHAI'      => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'MAVOUCHER.required'      => 'Mã voucher là bắt buộc.',
            'MAVOUCHER.unique'        => 'Mã voucher đã tồn tại.',
            'NGAYBD.required'         => 'Ngày bắt đầu là bắt buộc.',
            'NGAYKT.required'         => 'Ngày kết thúc là bắt buộc.',
            'NGAYKT.after'            => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'GIATRITOITHIEU.required' => 'Giá trị tối thiểu là bắt buộc.',
            'KMTOITHIEU.required'     => 'Khuyến mãi tối thiểu là bắt buộc.',
            'KMTOIDA.required'        => 'Khuyến mãi tối đa là bắt buộc.',
            'KMTOIDA.gte'             => 'Khuyến mãi tối đa phải >= tối thiểu.',
            'PTGIAM.required'         => 'Phần trăm giảm là bắt buộc.',
            'PTGIAM.max'              => 'Phần trăm giảm không được vượt quá 100.',
            'SOLUOTSD.required'       => 'Số lượt sử dụng là bắt buộc.',
        ];
    }
}
