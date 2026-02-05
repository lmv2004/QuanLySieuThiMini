<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CTPhieuNhap extends Model
{
    use HasFactory;

    protected $table = 'c_t_phieu_nhaps';
    public $incrementing = false;

    protected $fillable = [
        'MAPHIEU',
        'MASP',
        'SOLUONG',
        'DONGIANHAP',
        'HANSUDUNG',
    ];

    protected $casts = [
        'SOLUONG' => 'integer',
        'DONGIANHAP' => 'decimal:0',
        'HANSUDUNG' => 'date',
    ];

    // Composite primary key
    protected $primaryKey = ['MAPHIEU', 'MASP'];

    // Relationships
    public function phieuNhap()
    {
        return $this->belongsTo(PhieuNhap::class, 'MAPHIEU', 'MAPHIEU');
    }

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'MASP', 'MASP');
    }

    // Helper: Tính thành tiền
    public function getThanhTienAttribute()
    {
        return $this->SOLUONG * $this->DONGIANHAP;
    }
}
