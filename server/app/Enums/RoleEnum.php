<?php

namespace App\Enums;

enum RoleEnum: string
{
    case MANAGER = 'manager';
    case CASHIER = 'cashier';
    case WAREHOUSE = 'warehouse';

    /**
     * Get display name
     */
    public function displayName(): string
    {
        return match($this) {
            self::MANAGER => 'Quản lý cửa hàng',
            self::CASHIER => 'Nhân viên thu ngân',
            self::WAREHOUSE => 'Nhân viên kho',
        };
    }

    /**
     * Get all role values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
