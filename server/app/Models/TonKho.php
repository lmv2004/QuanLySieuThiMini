<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TonKho extends Model
{
    use HasFactory;

    protected $table = 'ton_khos';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'MASP',
        'SOLUONG_CON_LAI',
        'GIANHAP',
        'HANSUDUNG',
        'NGAYNHAP',
        'MAPHIEUNHAP',
        'IS_ACTIVE',
    ];

    protected $casts = [
        'SOLUONG_CON_LAI' => 'integer',
        'GIANHAP' => 'decimal:0',
        'HANSUDUNG' => 'date',
        'NGAYNHAP' => 'date',
        'IS_ACTIVE' => 'boolean',
    ];

    // Relationships
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'MASP', 'MASP');
    }

    public function phieuNhap()
    {
        return $this->belongsTo(PhieuNhap::class, 'MAPHIEUNHAP', 'MAPHIEU');
    }

    public function ctPhieuHuys()
    {
        return $this->hasMany(CTPhieuHuy::class, 'ID_TONKHO', 'ID');
    }

    public function ctHoaDons()
    {
        return $this->hasMany(CTHoaDon::class, 'ID_TONKHO', 'ID');
    }

    // Scope: Lô hàng còn hoạt động
    public function scopeActive($query)
    {
        return $query->where('IS_ACTIVE', 1)->where('SOLUONG_CON_LAI', '>', 0);
    }

    // Scope: FEFO - Hết hạn trước xuất trước
    public function scopeFEFO($query)
    {
        return $query->active()->orderBy('HANSUDUNG', 'asc');
    }

    // Scope: Lô hàng sắp hết hạn (trong vòng 7 ngày)
    public function scopeSapHetHan($query, $days = 7)
    {
        return $query->active()
            ->whereDate('HANSUDUNG', '<=', now()->addDays($days))
            ->whereDate('HANSUDUNG', '>=', now());
    }
}
