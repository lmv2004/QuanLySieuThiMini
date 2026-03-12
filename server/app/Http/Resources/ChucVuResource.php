<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChucVuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'MACHUCVU' => $this->MACHUCVU,
            'TENCHUCVU' => $this->TENCHUCVU,
            'MOTA' => $this->MOTA,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
