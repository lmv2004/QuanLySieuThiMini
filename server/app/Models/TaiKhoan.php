<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class TaiKhoan extends Authenticatable
{
    use HasFactory;

    protected $table = 'tai_khoans';
    protected $primaryKey = 'SOTK';

    protected $fillable = [
        'TENTK',
        'MATKHAU',
        'MANV',
        'SOLANSAI',
        'KHOA_TK',
        'IS_DELETED',
    ];

    protected $hidden = [
        'MATKHAU',
        'remember_token',
    ];

    // Override Auth methods
    public function getAuthIdentifierName()
    {
        return 'SOTK';
    }

    public function getAuthPassword()
    {
        return $this->MATKHAU;
    }

    protected $casts = [
        'SOLANSAI' => 'integer',
        'KHOA_TK' => 'boolean',
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'MANV', 'MANV');
    }

    public function loginDetails()
    {
        return $this->hasMany(LoginDetail::class, 'SOTK', 'SOTK');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0)->where('KHOA_TK', 0);
    }

    // Accessors for authentication UI
    public function getNameAttribute()
    {
        return $this->nhanVien ? $this->nhanVien->TENNV : $this->TENTK;
    }

    public function getEmailAttribute()
    {
        return $this->nhanVien?->EMAIL ?? '';
    }

    public function initials()
    {
        $name = $this->name;
        $words = explode(' ', $name);

        if (count($words) >= 2) {
            // Lấy chữ cái đầu của 2 từ cuối (Họ và Tên trong tiếng Việt)
            return mb_strtoupper(
                mb_substr($words[count($words) - 2], 0, 1) .
                mb_substr($words[count($words) - 1], 0, 1)
            );
        }

        // Nếu chỉ có 1 từ, lấy 2 chữ cái đầu
        return mb_strtoupper(mb_substr($name, 0, 2));
    }
}
