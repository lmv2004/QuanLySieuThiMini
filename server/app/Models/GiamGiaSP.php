<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiamGiaSP extends Model
{
    use HasFactory;

    protected $table = 'giam_gia_s_p_s';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'MASP',
        'TEN_CHUONG_TRINH',
        'LOAI_GIAM',
        'GIATRI_GIAM',
        'NGAYBD',
        'NGAYKT',
        'TRANGTHAI',
        'IS_DELETED',
    ];

    protected $casts = [
        'LOAI_GIAM' => 'integer',
        'GIATRI_GIAM' => 'decimal:0',
        'NGAYBD' => 'datetime',
        'NGAYKT' => 'datetime',
        'TRANGTHAI' => 'boolean',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'MASP', 'MASP');
    }

    // Helper: Tính giá sau giảm
    public function calculateDiscountedPrice($giaBan)
    {
        if ($this->LOAI_GIAM == 0) {
            // Giảm theo %
            return $giaBan * (1 - $this->GIATRI_GIAM / 100);
        } else {
            // Giảm tiền mặt
            return max(0, $giaBan - $this->GIATRI_GIAM);
        }
    }

    // Scope: Khuyến mãi đang chạy
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0)
            ->where('TRANGTHAI', 1)
            ->where('NGAYBD', '<=', now())
            ->where('NGAYKT', '>=', now());
    }
}
