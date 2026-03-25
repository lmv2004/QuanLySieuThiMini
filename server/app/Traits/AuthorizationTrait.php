<?php

namespace App\Traits;

trait AuthorizationTrait
{
    /**
     * Get user's role (ChucVu)
     */
    protected function getUserRole()
    {
        return auth()->user()?->nhanVien?->chucVu;
    }

    /**
     * Get user's role code
     */
    protected function getUserRoleCode(): ?string
    {
        return auth()->user()?->nhanVien?->chucVu?->CODE;
    }

    /**
     * Check if user has specific role
     */
    protected function hasRole(string $role): bool
    {
        return $this->getUserRoleCode() === $role;
    }

    /**
     * Check if user is any of the roles
     */
    protected function hasAnyRole(...$roles): bool
    {
        $userRole = $this->getUserRoleCode();
        return in_array($userRole, $roles);
    }

    /**
     * Check if user has specific permission
     */
    protected function hasPermission(string $permission): bool
    {
        $chucVu = $this->getUserRole();
        return $chucVu ? $chucVu->hasPermission($permission) : false;
    }

    /**
     * Check if user has any of the permissions
     */
    protected function hasAnyPermission(...$permissions): bool
    {
        $chucVu = $this->getUserRole();
        if (!$chucVu) return false;

        return $chucVu->hasAnyPermission(...$permissions);
    }

    /**
     * Check if user has all permissions
     */
    protected function hasAllPermissions(...$permissions): bool
    {
        $chucVu = $this->getUserRole();
        if (!$chucVu) return false;

        return $chucVu->hasAllPermissions(...$permissions);
    }

    /**
     * Get all permissions of user
     */
    protected function getUserPermissions()
    {
        $chucVu = $this->getUserRole();
        return $chucVu ? $chucVu->permissions()->pluck('CODE')->toArray() : [];
    }

    /**
     * Check if user is manager
     */
    protected function isManager(): bool
    {
        return $this->hasRole('manager');
    }

    /**
     * Check if user is cashier
     */
    protected function isCashier(): bool
    {
        return $this->hasRole('cashier');
    }

    /**
     * Check if user is warehouse staff
     */
    protected function isWarehouse(): bool
    {
        return $this->hasRole('warehouse');
    }

    /**
     * Require specific role or throw 403
     */
    protected function requireRole(string $role): void
    {
        if (!$this->hasRole($role)) {
            abort(403, "Require role: {$role}");
        }
    }

    /**
     * Require specific permission or throw 403
     */
    protected function requirePermission(string $permission): void
    {
        if (!$this->hasPermission($permission)) {
            abort(403, "Require permission: {$permission}");
        }
    }
}
