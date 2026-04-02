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
            'MAPHIEU'   => $this->MAPHIEU,
            'NGAYLAP'   => $this->NGAYLAP?->format('Y-m-d H:i:s'),
            'MANV'      => $this->MANV,
            'MANCC'     => $this->MANCC,
            'TONGTIEN'  => $this->TONGTIEN,
            'GCHU'      => $this->GCHU,
            'TRANGTHAI' => $this->TRANGTHAI,
            'IS_DELETED'=> $this->IS_DELETED,
            'nhanVien'  => new NhanVienResource($this->whenLoaded('nhanVien')),
            'nhaCungCap'=> new NhaCungCapResource($this->whenLoaded('nhaCungCap')),
            'chiTiets'  => CTPhieuNhapResource::collection($this->whenLoaded('chiTiets')),
            'created_at'=> $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'=> $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
