<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HoaDon extends Model
{
    use HasFactory;

    protected $table = 'hoa_dons';
    protected $primaryKey = 'MAHD';

    protected $fillable = [
        'NGAYHD',
        'HINHTHUC',
        'TONGTIEN_HANG',
        'TIEN_GIAM_VOUCHER',
        'TONG_THANHTOAN',
        'MANV',
        'MAKH',
        'SOVOUCHER',
        'IS_DELETED',
    ];

    protected $casts = [
        'NGAYHD' => 'datetime',
        'TONGTIEN_HANG' => 'decimal:0',
        'TIEN_GIAM_VOUCHER' => 'decimal:0',
        'TONG_THANHTOAN' => 'decimal:0',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'MANV', 'MANV');
    }

    public function khachHang()
    {
        return $this->belongsTo(KhachHang::class, 'MAKH', 'MAKH');
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'SOVOUCHER', 'SOVOUCHER');
    }

    public function chiTiets()
    {
        return $this->hasMany(CTHoaDon::class, 'MAHD', 'MAHD');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
