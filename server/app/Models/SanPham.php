<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanPham extends Model
{
    use HasFactory;

    protected $table = 'san_phams';
    protected $primaryKey = 'MASP';

    protected $fillable = [
        'BARCODE',
        'TENSP',
        'MOTA',
        'DVT',
        'HINHANH',
        'GIABAN',
        'MALOAI',
        'MANCC',
        'IS_DELETED',
    ];

    protected $casts = [
        'GIABAN' => 'decimal:0',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function loaiSanPham()
    {
        return $this->belongsTo(LoaiSanPham::class, 'MALOAI', 'MALOAI');
    }

    public function nhaCungCap()
    {
        return $this->belongsTo(NhaCungCap::class, 'MANCC', 'MANCC');
    }

    public function tonKhos()
    {
        return $this->hasMany(TonKho::class, 'MASP', 'MASP');
    }

    public function giamGias()
    {
        return $this->hasMany(GiamGiaSP::class, 'MASP', 'MASP');
    }

    public function ctPhieuNhaps()
    {
        return $this->hasMany(CTPhieuNhap::class, 'MASP', 'MASP');
    }

    public function ctPhieuHuys()
    {
        return $this->hasMany(CTPhieuHuy::class, 'MASP', 'MASP');
    }

    public function ctHoaDons()
    {
        return $this->hasMany(CTHoaDon::class, 'MASP', 'MASP');
    }

    // Helper: Lấy tổng tồn kho
    public function getTongTonKhoAttribute()
    {
        return $this->tonKhos()->where('IS_ACTIVE', 1)->sum('SOLUONG_CON_LAI');
    }

    // Helper: Lấy giá sau giảm (nếu có KM đang chạy)
    public function getGiaSauGiamAttribute()
    {
        $giamGia = $this->giamGias()
            ->where('TRANGTHAI', 1)
            ->where('NGAYBD', '<=', now())
            ->where('NGAYKT', '>=', now())
            ->first();

        if (!$giamGia) {
            return $this->GIABAN;
        }

        if ($giamGia->LOAI_GIAM == 0) {
            // Giảm theo %
            return $this->GIABAN * (1 - $giamGia->GIATRI_GIAM / 100);
        } else {
            // Giảm tiền mặt
            return max(0, $this->GIABAN - $giamGia->GIATRI_GIAM);
        }
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
