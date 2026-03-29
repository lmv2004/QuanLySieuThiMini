<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GiamGiaSPResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'ID'               => $this->ID,
            'MASP'             => $this->MASP,
            'TEN_CHUONG_TRINH' => $this->TEN_CHUONG_TRINH,
            'LOAI_GIAM'        => $this->LOAI_GIAM,
            'LOAI_GIAM_TEXT'   => $this->LOAI_GIAM == 0 ? 'Phần trăm (%)' : 'Tiền mặt (VNĐ)',
            'GIATRI_GIAM'      => $this->GIATRI_GIAM,
            'NGAYBD'           => $this->NGAYBD?->format('Y-m-d H:i:s'),
            'NGAYKT'           => $this->NGAYKT?->format('Y-m-d H:i:s'),
            'TRANGTHAI'        => $this->TRANGTHAI,
            'IS_DELETED'       => $this->IS_DELETED,
            'SANPHAM'          => new SanPhamResource($this->whenLoaded('sanPham')),
            'created_at'       => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'       => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
