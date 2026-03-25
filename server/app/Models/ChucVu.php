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
        'CODE',
        'TENCHUCVU',
        'MOTA',
        'IS_DELETED',
    ];

    protected $casts = [
        'IS_DELETED' => 'boolean',
    ];

    // ============ Relationships ============

    /**
     * Nhân viên có vai trò này
     */
    public function nhanViens()
    {
        return $this->hasMany(NhanVien::class, 'MACHUCVU', 'MACHUCVU');
    }

    /**
     * Các quyền của vai trò này
     */
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permissions',
            'MACHUCVU',
            'MAPERMISSION'
        )->where('permissions.IS_DELETED', 0);
    }

    // ============ Scopes ============

    /**
     * Lấy chỉ các role chưa bị xóa
     */
    public function scopeActive($query)
    {
        return $query->where('IS_DELETED', 0);
    }

    // ============ Methods ============

    /**
     * Kiểm tra role có quyền cụ thể không
     *
     * Hỗ trợ các cách kiểm tra:
     * - hasPermission('employees.create')
     * - hasPermission('manage_employees')
     * - hasPermission('*') - tất cả quyền
     */
    public function hasPermission(string $permission): bool
    {
        // Manager có toàn bộ quyền
        if ($this->CODE === 'manager') {
            return true;
        }

        // Wildcard - tất cả quyền
        if ($permission === '*') {
            return $this->permissions()->count() > 0;
        }

        // Strip alias if present (e.g., 'p.CODE')
        $permission = str_replace('p.', '', $permission);

        // Load permissions if not already loaded
        if (!isset($this->relations['permissions'])) {
            $this->load('permissions');
        }

        // Check by CODE
        foreach ($this->permissions as $perm) {
            if ($perm->CODE === $permission) {
                return true;
            }
            // Also check MODULE.ACTION format
            if ($perm->MODULE && $perm->ACTION) {
                if ("{$perm->MODULE}.{$perm->ACTION}" === $permission) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Kiểm tra role có bất kỳ quyền nào không
     */
    public function hasAnyPermission(...$permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Kiểm tra role có tất cả quyền không
     */
    public function hasAllPermissions(...$permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Gán quyền cho role
     */
    public function grantPermission($permission): void
    {
        $perm = Permission::where('CODE', $permission)->first();
        if ($perm && !$this->permissions->contains($perm)) {
            $this->permissions()->attach($perm->MAPERMISSION);
        }
    }

    /**
     * Gỡ bỏ quyền khỏi role
     */
    public function revokePermission($permission): void
    {
        $perm = Permission::where('CODE', $permission)->first();
        if ($perm) {
            $this->permissions()->detach($perm->MAPERMISSION);
        }
    }

    /**
     * Gán nhiều quyền cho role
     */
    public function syncPermissions(...$permissions): void
    {
        $permissionIds = Permission::whereIn('CODE', $permissions)
            ->active()
            ->pluck('MAPERMISSION')
            ->toArray();

        $this->permissions()->sync($permissionIds);
    }

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
