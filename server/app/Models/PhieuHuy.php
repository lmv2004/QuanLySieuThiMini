<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhieuHuy extends Model
{
    use HasFactory;

    protected $table = 'phieu_huys';
    protected $primaryKey = 'MAPHIEU';

    protected $fillable = [
        'NGAYLAP',
        'MANV',
        'LYDO',
        'IS_DELETED',
    ];

    protected $casts = [
        'NGAYLAP' => 'datetime',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'MANV', 'MANV');
    }

    public function chiTiets()
    {
        return $this->hasMany(CTPhieuHuy::class, 'MAPHIEU', 'MAPHIEU');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
