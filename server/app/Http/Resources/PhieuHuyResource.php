<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhieuHuyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'MAPHIEU'    => $this->MAPHIEU,
            'NGAYLAP'    => $this->NGAYLAP?->format('Y-m-d\TH:i'), // Chuẩn datetime-local
            'MANV'       => $this->MANV,
            'LYDO'       => $this->LYDO,
            'IS_DELETED' => $this->IS_DELETED,
            'TRANGTHAI'  => $this->TRANGTHAI,
            'DA_KHOA'    => $this->DA_KHOA,
            'NHANVIEN'   => new NhanVienResource($this->whenLoaded('nhanVien')),
            'chiTiets'   => CTPhieuHuyResource::collection($this->whenLoaded('chiTiets')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
