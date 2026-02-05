<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginDetail extends Model
{
    use HasFactory;

    protected $table = 'login_details';
    protected $primaryKey = 'LOGIN_ID';

    protected $fillable = [
        'SOTK',
        'IP_ADDRESS',
        'LOGIN_TIME',
        'LOGOUT_TIME',
    ];

    protected $casts = [
        'LOGIN_TIME' => 'datetime',
        'LOGOUT_TIME' => 'datetime',
    ];

    // Relationships
    public function taiKhoan()
    {
        return $this->belongsTo(TaiKhoan::class, 'SOTK', 'SOTK');
    }
}
