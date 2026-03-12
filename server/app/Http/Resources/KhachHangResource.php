<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KhachHangResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MAKH' => $this->MAKH,
            'TENKH' => $this->TENKH,
            'SODIENTHOAI' => $this->SODIENTHOAI,
            'DIACHI' => $this->DIACHI,
            'DIEMTHUONG' => $this->DIEMTHUONG,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
