<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhieuNhapResource extends JsonResource
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
            'NGAYLAP' => $this->NGAYLAP?->format('Y-m-d H:i:s'),
            'MANV' => $this->MANV,
            'TONGTIEN' => $this->TONGTIEN,
            'GCHU' => $this->GCHU,
            'nhanVien' => new NhanVienResource($this->whenLoaded('nhanVien')),
            'chiTiets' => CTPhieuNhapResource::collection($this->whenLoaded('chiTiets')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
