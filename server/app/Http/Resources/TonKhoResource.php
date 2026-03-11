<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TonKhoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'ID'             => $this->ID,
            'MASP'           => $this->MASP,
            'SOLUONG_CON_LAI'=> $this->SOLUONG_CON_LAI,
            'GIANHAP'        => $this->GIANHAP,
            'HANSUDUNG'      => $this->HANSUDUNG?->format('Y-m-d'),
            'NGAYNHAP'       => $this->NGAYNHAP?->format('Y-m-d'),
            'MAPHIEUNHAP'    => $this->MAPHIEUNHAP,
            'IS_ACTIVE'      => $this->IS_ACTIVE,
            'SANPHAM'        => new SanPhamResource($this->whenLoaded('sanPham')),
            'created_at'     => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'     => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
