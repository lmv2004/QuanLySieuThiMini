<?php

namespace App\Traits;

use App\Constants\PermissionConstants;

trait AuthorizationTrait
{
    /**
     * Get user role code
     */
    protected function getUserRole()
    {
        return auth()->user()?->nhanVien?->chucVu?->CODE;
    }

    /**
     * Check if user has specific role
     */
    protected function hasRole(string $role): bool
    {
        return $this->getUserRole() === $role;
    }

    /**
     * Check if user has any of the roles
     */
    protected function hasAnyRole(...$roles): bool
    {
        return in_array($this->getUserRole(), $roles);
    }

    /**
     * Check if user has permission
     */
    protected function hasPermission(string $permission): bool
    {
        $role = $this->getUserRole();
        return $role && PermissionConstants::hasPermission($role, $permission);
    }

    /**
     * Get user permissions
     */
    protected function getUserPermissions(): array
    {
        $role = $this->getUserRole();
        return $role ? PermissionConstants::getPermissionsByRole($role) : [];
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
}
