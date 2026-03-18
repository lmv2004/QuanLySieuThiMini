# Hệ thống Phân Quyền (Role-Based Access Control)

## Giới thiệu

Hệ thống phân quyền cho phép kiểm soát truy cập dựa trên 3 vai trò chính:
- **Quản lý cửa hàng (manager)** - Có quyền truy cập toàn bộ hệ thống
- **Nhân viên thu ngân (cashier)** - Xử lý giao dịch bán hàng
- **Nhân viên kho (warehouse)** - Quản lý hàng tồn kho

## Cấu trúc hệ thống

### 1. Models
- **ChucVu** - Vai trò (Role) với trường `CODE` để xác định vai trò

### 2. Enums
- **RoleEnum** - Định nghĩa các vai trò có sẵn

### 3. Constants
- **PermissionConstants** - Định nghĩa quyền và ánh xạ quyền cho từng vai trò

### 4. Middleware
- **CheckRole** - Kiểm tra người dùng có vai trò được phép hay không
- **CheckPermission** - Kiểm tra người dùng có quyền thực hiện hành động cụ thể

### 5. Traits  
- **AuthorizationTrait** - Helper methods cho controller

## Cách sử dụng

### 1. Kiểm tra trong Routes

#### Route với vai trò cụ thể:
```php
Route::middleware('role:manager')->group(function () {
    Route::apiResource('employees', NhanVienController::class);
});
```

#### Route với quyền cụ thể:
```php
Route::middleware('permission:manage_employees')->group(function () {
    // Routes here
});
```

#### Multiple roles:
```php
Route::middleware('role:manager,cashier')->group(function () {
    // Routes accessible by manager or cashier
});
```

### 2. Kiểm tra trong Controller

#### Sử dụng Trait:
```php
<?php

namespace App\Http\Controllers;

use App\Traits\AuthorizationTrait;

class MyController extends Controller
{
    use AuthorizationTrait;

    public function index()
    {
        // Check role
        if ($this->isManager()) {
            // Manager-only code
        }

        // Check permission
        if ($this->hasPermission('manage_employees')) {
            // Do something
        }

        // Get user role
        $role = $this->getUserRole();

        // Get all user permissions
        $permissions = $this->getUserPermissions();
    }
}
```

### 3. Kiểm tra trong Service/Repository

```php
use Illuminate\Support\Facades\Auth;

$user = Auth::user()->load('nhanVien.chucVu');
$role = $user->nhanVien?->chucVu?->CODE;

if ($role === 'manager') {
    // Manager-only logic
}
```

## Vai trò và Quyền

### Manager (Quản lý cửa hàng)
**Quyền:**
- Quản lý nhân viên
- Quản lý nhà cung cấp
- Quản lý sản phẩm, giá cả, VAT
- Tạo, duyệt, hủy phiếu nhập/phiếu hủy
- Xem báo cáo doanh thu
- Toàn bộ quyền khác

**Routes protected by:** `middleware('role:manager')`

### Cashier (Nhân viên thu ngân)
**Quyền:**
- Tạo đơn hàng (invoice)
- Xem tồn kho sản phẩm
- Hủy đơn hàng (chưa thanh toán)
- Thanh toán
- Xuất hóa đơn

**Routes protected by:** `middleware('role:cashier')`

### Warehouse (Nhân viên kho)
**Quyền:**
- Xem trạng thái tồn kho
- Tạo đơn nhập hàng (phiếu nhập)
- Tạo đơn hủy hàng (phiếu hủy)

**Routes protected by:** `middleware('role:warehouse')`

## Kéo dài Hệ thống

### Thêm vai trò mới

1. Cập nhật enum `RoleEnum`:
```php
case NEW_ROLE = 'new_role';
```

2. Cập nhật `PermissionConstants`:
```php
'new_role' => [
    self::SOME_PERMISSION,
    // Add permissions here
],
```

3. Thêm via Seeder hoặc Database

### Thêm quyền mới

1. Thêm constant vào `PermissionConstants`:
```php
const NEW_PERMISSION = 'new_permission';
```

2. Thêm quyền vào vai trò trong `getPermissionsByRole()`:
```php
'manager' => [
    self::NEW_PERMISSION,
    // Other permissions
],
```

3. Sử dụng middleware hoặc trait method để kiểm tra

## Testing

### Test authorization middleware:
```php
$this->actingAs($cashierUser)
    ->postJson('/api/employees')
    ->assertStatus(403); // Should be forbidden

$this->actingAs($managerUser)
    ->postJson('/api/employees')
    ->assertStatus(200); // Should be allowed
```

## Chi tiết Kỹ thuật

### Middleware Flow:
1. Request đến route được bảo vệ
2. `CheckRole` middleware kiểm tra `CODE` từ `nhanVien.chucVu`
3. Nếu không có role hoặc không khớp, trả về 403
4. Nếu OK, chuyển tiếp đến handler tiếp theo

### Database Schema:
```sql
-- Bảng chuc_vus với cột mới CODE
ALTER TABLE chuc_vus ADD COLUMN CODE VARCHAR(50) UNIQUE;

-- Ví dụ dữ liệu:
INSERT INTO chuc_vus (CODE, TENCHUCVU, MOTA) VALUES
('manager', 'Quản lý cửa hàng', 'Người quản lý...'),
('cashier', 'Nhân viên thu ngân', 'Nhân viên xử lý...'),
('warehouse', 'Nhân viên kho', 'Nhân viên quản lý kho...');
```

## Lỗi thường gặp

### 403 Forbidden (401 Unauthorized)
- Yêu cầu: Không xác thực hoặc token hết hạn
- Giải pháp: Gửi token hợp lệ

### 403 Forbidden (Không có vai trò)
- Yêu cầu: Vai trò không khớp với yêu cầu
- Giải pháp: Kiểm tra code của vai trò trong database

### Employee không có chucVu
- Vấn đề: User có MANV nhưng NhanVien không có MACHUCVU
- Giải pháp: Update database để set MACHUCVU cho NhanVien

## Debugging

### Xem role của user hiện tại:
```php
$user = Auth::user()->load('nhanVien.chucVu');
dd($user->nhanVien?->chucVu?->CODE);
```

### Xem quyền của user:
```php
use App\Constants\PermissionConstants;
$role = Auth::user()->nhanVien?->chucVu?->CODE;
dd(PermissionConstants::getPermissionsByRole($role));
```

## Tương lai

- Có thể mở rộng để hỗ trợ dynamic permissions stored in database
- Có thể tạo Policy classes cho granular control
- Có thể thêm audit logging for security tracking
