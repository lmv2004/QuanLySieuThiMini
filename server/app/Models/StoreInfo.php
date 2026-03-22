<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreInfo extends Model
{
    use HasFactory;

    protected $table = 'store_infos';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'address',
        'phone',
        'tax_code',
        'note',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
