<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $table = 'vouchers';
    protected $primaryKey = 'SOVOUCHER';

    protected $fillable = [
        'MAVOUCHER',
        'MOTA',
        'NGAYBD',
        'NGAYKT',
        'GIATRITOITHIEU',
        'KMTOITHIEU',
        'KMTOIDA',
        'PTGIAM',
        'SOLUOTSD',
        'SOLUOTSD_DADUNG',
        'IS_DELETED',
    ];

    protected $casts = [
        'NGAYBD' => 'datetime',
        'NGAYKT' => 'datetime',
        'GIATRITOITHIEU' => 'decimal:0',
        'KMTOITHIEU' => 'decimal:0',
        'KMTOIDA' => 'decimal:0',
        'PTGIAM' => 'integer',
        'SOLUOTSD' => 'integer',
        'SOLUOTSD_DADUNG' => 'integer',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function hoaDons()
    {
        return $this->hasMany(HoaDon::class, 'SOVOUCHER', 'SOVOUCHER');
    }

    // Helper: Kiểm tra voucher có còn dùng được không
    public function isAvailable()
    {
        return $this->IS_DELETED == 0
            && $this->NGAYBD <= now()
            && $this->NGAYKT >= now()
            && $this->SOLUOTSD_DADUNG < $this->SOLUOTSD;
    }

    // Helper: Tính tiền giảm theo voucher
    public function calculateDiscount($tongTien)
    {
        if ($tongTien < $this->GIATRITOITHIEU) {
            return 0;
        }

        $tienGiam = $tongTien * ($this->PTGIAM / 100);

        // Áp dụng giảm tối thiểu và tối đa
        $tienGiam = max($this->KMTOITHIEU, $tienGiam);
        $tienGiam = min($this->KMTOIDA, $tienGiam);

        return $tienGiam;
    }

    // Scope: Voucher đang hoạt động
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0)
            ->where('NGAYBD', '<=', now())
            ->where('NGAYKT', '>=', now())
            ->whereRaw('SOLUOTSD_DADUNG < SOLUOTSD');
    }
}
