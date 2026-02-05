<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KhachHang extends Model
{
    use HasFactory;

    protected $table = 'khach_hangs';
    protected $primaryKey = 'MAKH';

    protected $fillable = [
        'TENKH',
        'SODIENTHOAI',
        'DIACHI',
        'DIEMTHUONG',
        'IS_DELETED',
    ];

    protected $casts = [
        'DIEMTHUONG' => 'integer',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function hoaDons()
    {
        return $this->hasMany(HoaDon::class, 'MAKH', 'MAKH');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
