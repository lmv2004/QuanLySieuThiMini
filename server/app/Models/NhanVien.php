<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhanVien extends Model
{
    use HasFactory;

    protected $table = 'nhan_viens';
    protected $primaryKey = 'MANV';

    protected $fillable = [
        'TENNV',
        'GIOITINH',
        'CCCD',
        'NGAYSINH',
        'SODIENTHOAI',
        'EMAIL',
        'DIACHI',
        'NGAYTHAMGIA',
        'MACHUCVU',
        'IS_DELETED',
    ];

    protected $casts = [
        'GIOITINH' => 'boolean',
        'NGAYSINH' => 'date',
        'NGAYTHAMGIA' => 'date',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function chucVu()
    {
        return $this->belongsTo(ChucVu::class, 'MACHUCVU', 'MACHUCVU');
    }

    public function taiKhoan()
    {
        return $this->hasOne(TaiKhoan::class, 'MANV', 'MANV');
    }

    public function phieuNhaps()
    {
        return $this->hasMany(PhieuNhap::class, 'MANV', 'MANV');
    }

    public function phieuHuys()
    {
        return $this->hasMany(PhieuHuy::class, 'MANV', 'MANV');
    }

    public function hoaDons()
    {
        return $this->hasMany(HoaDon::class, 'MANV', 'MANV');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
