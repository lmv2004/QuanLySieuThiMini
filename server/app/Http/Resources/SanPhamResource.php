<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SanPhamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MASP' => $this->MASP,
            'BARCODE' => $this->BARCODE,
            'TENSP' => $this->TENSP,
            'MOTA' => $this->MOTA,
            'DVT' => $this->DVT,
            'HINHANH' => $this->HINHANH,
            'GIABAN' => $this->GIABAN,
            'LOAISP' => new LoaiSanPhamResource($this->whenLoaded('loaiSanPham')),
            'NHACC' => new NhaCungCapResource($this->whenLoaded('nhaCungCap')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
