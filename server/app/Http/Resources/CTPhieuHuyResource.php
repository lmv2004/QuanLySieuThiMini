<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CTPhieuHuyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'MAPHIEU'  => $this->MAPHIEU,
            'MASP'     => $this->MASP,
            'ID_TONKHO'=> $this->ID_TONKHO,
            'SOLUONG'  => $this->SOLUONG,
            'SANPHAM'  => new SanPhamResource($this->whenLoaded('sanPham')),
            'TONKHO'   => new TonKhoResource($this->whenLoaded('tonKho')),
        ];
    }
}
