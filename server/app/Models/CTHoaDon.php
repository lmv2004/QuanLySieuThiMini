<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CTHoaDon extends Model
{
    use HasFactory;

    protected $table = 'c_t_hoa_dons';
    public $incrementing = false;

    protected $fillable = [
        'MAHD',
        'MASP',
        'ID_TONKHO',
        'SOLUONG',
        'GIABAN_GOC',
        'GIABAN_THUCTE',
        'THANHTIEN',
    ];

    protected $casts = [
        'SOLUONG' => 'integer',
        'GIABAN_GOC' => 'decimal:0',
        'GIABAN_THUCTE' => 'decimal:0',
        'THANHTIEN' => 'decimal:0',
    ];

    // Composite primary key
    protected $primaryKey = ['MAHD', 'MASP', 'ID_TONKHO'];

    // Relationships
    public function hoaDon()
    {
        return $this->belongsTo(HoaDon::class, 'MAHD', 'MAHD');
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
