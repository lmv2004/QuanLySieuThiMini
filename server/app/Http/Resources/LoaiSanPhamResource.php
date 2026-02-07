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
            'CREATED_AT' => $this->CREATED_AT,
            'UPDATED_AT' => $this->UPDATED_AT,
        ];
    }
}
