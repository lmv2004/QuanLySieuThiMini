<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NhanVienResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'MANV'        => $this->MANV,
            'TENNV'       => $this->TENNV,
            'GIOITINH'    => $this->GIOITINH,
            'CCCD'        => $this->CCCD,
            'NGAYSINH'    => $this->NGAYSINH?->format('Y-m-d'),
            'SODIENTHOAI' => $this->SODIENTHOAI,
            'EMAIL'       => $this->EMAIL,
            'DIACHI'      => $this->DIACHI,
            'NGAYTHAMGIA' => $this->NGAYTHAMGIA?->format('Y-m-d'),
            'MACHUCVU'    => $this->MACHUCVU,
            'IS_DELETED'  => $this->IS_DELETED,
            'CHUCVU'      => new ChucVuResource($this->whenLoaded('chucVu')),
            'created_at'  => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'  => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
