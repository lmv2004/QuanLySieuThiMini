<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CTHoaDonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MAHD' => $this->MAHD,
            'MASP' => $this->MASP,
            'ID_TONKHO' => $this->ID_TONKHO,
            'SOLUONG' => $this->SOLUONG,
            'GIABAN_GOC' => $this->GIABAN_GOC,
            'GIABAN_THUCTE' => $this->GIABAN_THUCTE,
            'THANHTIEN' => $this->THANHTIEN,
            'sanPham' => new SanPhamResource($this->whenLoaded('sanPham')),
            'tonKho' => new TonKhoResource($this->whenLoaded('tonKho')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
