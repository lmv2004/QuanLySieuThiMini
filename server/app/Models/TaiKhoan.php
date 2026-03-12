<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class TaiKhoan extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'tai_khoans';
    protected $primaryKey = 'SOTK';

    protected $fillable = [
        'TENTK',
        'MATKHAU',
        'EMAIL',
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

    // 👈 Thêm method này để Auth::attempt dùng đúng field mật khẩu
    public function getAuthPasswordName()
    {
        return 'MATKHAU';
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

    public function getEmailForPasswordReset()
    {
        return $this->EMAIL;
    }

    public function getEmailForVerification()
    {
        return $this->EMAIL;
    }

    public function initials()
    {
        $name = $this->name;
        $words = explode(' ', $name);

        if (count($words) >= 2) {
            return mb_strtoupper(
                mb_substr($words[count($words) - 2], 0, 1) .
                mb_substr($words[count($words) - 1], 0, 1)
            );
        }

        return mb_strtoupper(mb_substr($name, 0, 2));
    }
}
