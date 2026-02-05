<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhaCungCap extends Model
{
    use HasFactory;

    protected $table = 'nha_cung_caps';
    protected $primaryKey = 'MANCC';

    protected $fillable = [
        'TENNCC',
        'DIACHI',
        'SDT',
        'EMAIL',
        'IS_DELETED',
    ];

    protected $casts = [
        'IS_DELETED' => 'boolean',
    ];

    // Relationships
    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'MANCC', 'MANCC');
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }
}
