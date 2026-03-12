<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoaiSanPhamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MALOAI' => $this->MALOAI,
            'TENLOAI' => $this->TENLOAI,
            'MOTA' => $this->MOTA,
            'CREATED_AT' => $this->created_at?->format('Y-m-d H:i:s'),
            'UPDATED_AT' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
