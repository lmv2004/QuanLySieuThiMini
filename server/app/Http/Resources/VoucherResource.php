<?php
// ========== VoucherResource.php ==========
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'SOVOUCHER'       => $this->SOVOUCHER,
            'MAVOUCHER'       => $this->MAVOUCHER,
            'MOTA'            => $this->MOTA,
            'NGAYBD'          => $this->NGAYBD?->format('Y-m-d H:i:s'),
            'NGAYKT'          => $this->NGAYKT?->format('Y-m-d H:i:s'),
            'GIATRITOITHIEU'  => $this->GIATRITOITHIEU,
            'KMTOITHIEU'      => $this->KMTOITHIEU,
            'KMTOIDA'         => $this->KMTOIDA,
            'PTGIAM'          => $this->PTGIAM,
            'SOLUOTSD'        => $this->SOLUOTSD,
            'SOLUOTSD_DADUNG' => $this->SOLUOTSD_DADUNG,
            'IS_AVAILABLE'    => $this->isAvailable(),
            'IS_DELETED'      => $this->IS_DELETED,
            'created_at'      => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'      => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
