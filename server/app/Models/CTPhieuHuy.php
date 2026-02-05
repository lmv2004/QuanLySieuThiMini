<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CTPhieuHuy extends Model
{
    use HasFactory;

    protected $table = 'c_t_phieu_huys';
    public $incrementing = false;

    protected $fillable = [
        'MAPHIEU',
        'MASP',
        'ID_TONKHO',
        'SOLUONG',
    ];

    protected $casts = [
        'SOLUONG' => 'integer',
    ];

    // Composite primary key
    protected $primaryKey = ['MAPHIEU', 'MASP'];

    // Relationships
    public function phieuHuy()
    {
        return $this->belongsTo(PhieuHuy::class, 'MAPHIEU', 'MAPHIEU');
    }

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'MASP', 'MASP');
    }

    public function tonKho()
    {
        return $this->belongsTo(TonKho::class, 'ID_TONKHO', 'ID');
    }
}
