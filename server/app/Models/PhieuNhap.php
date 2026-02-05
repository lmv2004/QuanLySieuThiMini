<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhieuNhap extends Model
{
    use HasFactory;

    protected $table = 'phieu_nhaps';
    protected $primaryKey = 'MAPHIEU';

    protected $fillable = [
        'NGAYLAP',
        'MANV',
        'TONGTIEN',
        'GCHU',
        'IS_DELETED',
    ];

    protected $casts = [
        'NGAYLAP' => 'datetime',
        'TONGTIEN' => 'decimal:0',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'MANV', 'MANV');
    }

    public function chiTiets()
    {
        return $this->hasMany(CTPhieuNhap::class, 'MAPHIEU', 'MAPHIEU');
    }

    public function tonKhos()
    {
        return $this->hasMany(TonKho::class, 'MAPHIEUNHAP', 'MAPHIEU');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
