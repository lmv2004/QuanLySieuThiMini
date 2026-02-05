<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChucVu extends Model
{
    use HasFactory;

    protected $table = 'chuc_vus';
    protected $primaryKey = 'MACHUCVU';

    protected $fillable = [
        'TENCHUCVU',
        'MOTA',
        'IS_DELETED',
    ];

    protected $casts = [
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function nhanViens()
    {
        return $this->hasMany(NhanVien::class, 'MACHUCVU', 'MACHUCVU');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
