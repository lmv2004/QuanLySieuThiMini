<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoaiSanPham extends Model
{
    use HasFactory;

    protected $table = 'loai_san_phams';
    protected $primaryKey = 'MALOAI';

    protected $fillable = [
        'TENLOAI',
        'MOTA',
        'IS_DELETED',
    ];

    protected $casts = [
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'MALOAI', 'MALOAI');
    }

    // Scope để lọc chưa xóa
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
