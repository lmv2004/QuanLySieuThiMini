<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CTPhieuNhapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MAPHIEU' => $this->MAPHIEU,
            'MASP' => $this->MASP,
            'SOLUONG' => $this->SOLUONG,
            'DONGIANHAP' => $this->DONGIANHAP,
            'HANSUDUNG' => $this->HANSUDUNG?->format('Y-m-d'),
            'THANHTIEN' => $this->THANHTIEN,
            'sanPham' => new SanPhamResource($this->whenLoaded('sanPham')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
