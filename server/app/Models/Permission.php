<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $table = 'permissions';
    protected $primaryKey = 'MAPERMISSION';
    public $timestamps = true;

    protected $fillable = [
        'CODE',
        'NAME',
        'DESCRIPTION',
        'MODULE',
        'ACTION',
        'IS_DELETED',
    ];

    protected $casts = [
        'IS_DELETED' => 'boolean',
    ];

    // ============ Relationships ============

    /**
     * Các vai trò có quyền này
     */
    public function roles()
    {
        return $this->belongsToMany(
            ChucVu::class,
            'role_permissions',
            'MAPERMISSION',
            'MACHUCVU'
        )->where('chuc_vus.IS_DELETED', 0);
    }

    // ============ Scopes ============

    /**
     * Lấy chỉ permissions chưa bị xóa
     */
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }

    /**
     * Lấy permissions theo module
     */
    public function scopeByModule($query, string $module)
    {
        return $query->where('MODULE', $module);
    }

    /**
     * Lấy permissions theo action
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('ACTION', $action);
    }

    // ============ Accessors ============

    /**
     * Full identifier: MODULE.ACTION hoặc chỉ CODE
     */
    public function getFullIdentifierAttribute(): string
    {
        if ($this->MODULE && $this->ACTION) {
            return "{$this->MODULE}.{$this->ACTION}";
        }
        return $this->CODE;
    }

    // ============ Methods ============

    /**
     * Soft delete
     */
    public function delete()
    {
        return $this->update(['IS_DELETED' => true]);
    }

    /**
     * Restore
     */
    public function restore()
    {
        return $this->update(['IS_DELETED' => false]);
    }
}
