<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NhaCungCapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'MANCC' => $this->MANCC,
            'TENNCC' => $this->TENNCC,
            'DIACHI' => $this->DIACHI,
            'SDT' => $this->SDT,
            'EMAIL' => $this->EMAIL,
            'CREATED_AT' => $this->CREATED_AT,
            'UPDATED_AT' => $this->UPDATED_AT,
        ];
    }
}
