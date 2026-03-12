<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HoaDonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MAHD' => $this->MAHD,
            'NGAYHD' => $this->NGAYHD?->format('Y-m-d H:i:s'),
            'HINHTHUC' => $this->HINHTHUC,
            'TONGTIEN_HANG' => $this->TONGTIEN_HANG,
            'TIEN_GIAM_VOUCHER' => $this->TIEN_GIAM_VOUCHER,
            'TONG_THANHTOAN' => $this->TONG_THANHTOAN,
            'TRANGTHAI' => $this->TRANGTHAI,
            'MANV' => $this->MANV,
            'MAKH' => $this->MAKH,
            'SOVOUCHER' => $this->SOVOUCHER,
            'nhanVien' => new NhanVienResource($this->whenLoaded('nhanVien')),
            'khachHang' => new KhachHangResource($this->whenLoaded('khachHang')),
            'voucher' => new VoucherResource($this->whenLoaded('voucher')),
            'chiTiets' => CTHoaDonResource::collection($this->whenLoaded('chiTiets')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
