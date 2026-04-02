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
        'TRANGTHAI',
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
        'TRANGTHAI' => 'integer',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function hoaDons()
    {
        return $this->hasMany(HoaDon::class, 'SOVOUCHER', 'SOVOUCHER');
    }

    // Scope: Voucher còn khả dụng
    public function scopeAvailable($query)
    {
        $now = now();
        return $query->where('IS_DELETED', 0)
            ->where('TRANGTHAI', 1)
            ->where(function ($q) use ($now) {
                $q->whereNull('NGAYBD')
                  ->orWhere('NGAYBD', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('NGAYKT')
                  ->orWhere('NGAYKT', '>=', $now);
            })
            ->where(function ($q) {
                $q->where('SOLUOTSD', 0)
                  ->orWhereRaw('SOLUOTSD > SOLUOTSD_DADUNG');
            });
    }

    // Helper: Kiểm tra voucher có còn dùng được không
    public function isAvailable(): bool
    {
        $now = now();
        if ($this->IS_DELETED) return false;
        if ($this->TRANGTHAI !== 1) return false;
        if ($this->NGAYBD && $this->NGAYBD > $now) return false;
        if ($this->NGAYKT && $this->NGAYKT < $now) return false;
        if ($this->SOLUOTSD > 0 && $this->SOLUOTSD_DADUNG >= $this->SOLUOTSD) return false;
        return true;
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
            ->where('TRANGTHAI', 1)
            ->where('NGAYBD', '<=', now())
            ->where('NGAYKT', '>=', now())
            ->whereRaw('DADUNG < SOLUOTSD');
    }
}
