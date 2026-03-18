# RBAC System - Database-Driven Implementation

## Tổng Quan

Hệ thống RBAC (Role-Based Access Control) được thiết kế với cấu trúc database-driven, cho phép quản lý quyền một cách linh hoạt, rõ ràng và dễ mở rộng.

## Kiến Trúc

### 1. Database Structure

```
┌─────────────────┐
│   tai_khoans    │
└────────┬────────┘
         │ MANV
         │
┌────────▼────────┐
│  nhan_viens     │
└────────┬────────┘
         │ MACHUCVU
         │
┌────────▼────────┐         ┌──────────────────┐
│   chuc_vus      │◄────────│  permissions     │
└─────────────────┘  N to M  └──────────────────┘
                        via
             ┌──────────────────────┐
             │  role_permissions    │
             │  (pivot table)       │
             └──────────────────────┘
```

### 2. Database Tables

#### a. chuc_vus (Roles)
```sql
CREATE TABLE chuc_vus (
    MACHUCVU BIGINT PRIMARY KEY,
    CODE VARCHAR(50) UNIQUE,          -- 'manager', 'cashier', 'warehouse'
    TENCHUCVU VARCHAR(50) NOT NULL,
    MOTA VARCHAR(100),
    IS_DELETED TINYINT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### b. permissions (Quyền)
```sql
CREATE TABLE permissions (
    MAPERMISSION BIGINT PRIMARY KEY AUTO_INCREMENT,
    CODE VARCHAR(100) UNIQUE,         -- 'employees.create', 'products.edit'
    NAME VARCHAR(255) NOT NULL,       -- 'Tạo nhân viên'
    DESCRIPTION TEXT,                 -- Mô tả chi tiết
    MODULE VARCHAR(100),              -- 'employees', 'products'
    ACTION VARCHAR(50),               -- 'create', 'read', 'update', 'delete'
    IS_DELETED TINYINT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    INDEX (CODE), INDEX (MODULE)
);
```

#### c. role_permissions (Pivot Table)
```sql
CREATE TABLE role_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    MACHUCVU BIGINT,                 -- Foreign key
    MAPERMISSION BIGINT,             -- Foreign key
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (MACHUCVU) REFERENCES chuc_vus(MACHUCVU) ON DELETE CASCADE,
    FOREIGN KEY (MAPERMISSION) REFERENCES permissions(MAPERMISSION) ON DELETE CASCADE,
    UNIQUE KEY (MACHUCVU, MAPERMISSION)
);
```

## Models

### 1. ChucVu Model (Role)

**File:** `app/Models/ChucVu.php`

```php
// Relationships
$chucVu->permissions();           // Lấy danh sách permissions

// Methods
$chucVu->hasPermission('employees.create');   // Check permission
$chucVu->hasAnyPermission('create', 'edit');  // Check any
$chucVu->hasAllPermissions('create', 'edit'); // Check all
$chucVu->grantPermission('employees.view');   // Gán quyền
$chucVu->revokePermission('products.delete'); // Gỡ quyền
$chucVu->syncPermissions('create', 'edit');   // Đồng bộ quyền
```

### 2. Permission Model

**File:** `app/Models/Permission.php`

```php
// Relationships
$permission->roles();  // Các vai trò có quyền này

// Scopes
Permission::active();              // Lấy chỉ permissions chưa bị xóa
Permission::byModule('employees'); // Filter theo module
Permission::byAction('create');    // Filter theo action

// Methods
$permission->delete();     // Soft delete
$permission->restore();    // Restore
```

## Usage Examples

### 1. Check Permission in Controller

```php
<?php

use App\Traits\AuthorizationTrait;

class ProductController extends Controller
{
    use AuthorizationTrait;

    public function index()
    {
        // Check role
        if ($this->isManager()) {
            return Product::all(); // Toàn bộ
        }

        return Product::active();  // Chỉ active
    }

    public function store(Request $request)
    {
        // Require permission
        $this->requirePermission('products.create');

        // Or check manually
        if (!$this->hasPermission('products.create')) {
            return response()->json(['message' => 'No permission'], 403);
        }

        // Create product
    }

    public function show(Product $product)
    {
        // Get all user permissions
        $permissions = $this->getUserPermissions();
        // Output: ['products.view', 'products.edit', ...]

        // Check multiple permissions (any)
        if ($this->hasAnyPermission('products.edit', 'admin.manage')) {
            // Can edit
        }

        // Check multiple permissions (all)
        if ($this->hasAllPermissions('products.edit', 'products.delete')) {
            // Can edit and delete
        }
    }
}
```

### 2. Protect Routes with Middleware

```php
// Route protection
Route::middleware(['auth:sanctum', 'role:manager'])->group(function () {
    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('suppliers', SupplierController::class);
});

// Multiple roles
Route::middleware(['auth:sanctum', 'role:manager,warehouse'])->group(function () {
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
});

// Permission-based
Route::middleware(['auth:sanctum', 'permission:products.create'])->group(function () {
    Route::post('products', [ProductController::class, 'store']);
});

// Multiple permissions (any)
Route::middleware(['auth:sanctum', 'permission:products.edit,products.delete'])->group(function () {
    Route::put('products/{product}', [ProductController::class, 'update']);
});
```

### 3. Grant/Revoke Permissions

```php
$manager = ChucVu::where('CODE', 'manager')->first();

// Grant single permission
$manager->grantPermission('reports.export');

// Revoke permission
$manager->revokePermission('reports.export');

// Sync permissions (replace all)
$manager->syncPermissions(
    'employees.view', 'employees.create',
    'products.view', 'products.create',
    'vouchers.view', 'vouchers.create'
);
```

## Setup & Migration

### Step 1: Run Migrations

```bash
# Create permissions table
php artisan migrate

# This creates:
# - permissions table
# - role_permissions pivot table
```

### Step 2: Seed Permissions

```bash
# Create all permission records
php artisan db:seed --class=PermissionSeeder

# This creates:
# - permissions for employees (view, create, edit, delete)
# - permissions for products (view, create, edit, delete)
# - permissions for invoices (view, create, edit, payment)
# - ... and many more
```

### Step 3: Assign Permissions to Roles

```bash
# Assign permissions to manager, cashier, warehouse
php artisan db:seed --class=RolePermissionSeeder

# This creates relationships in role_permissions table
```

### Verify Setup

```bash
php artisan tinker

# Check permissions
>>> App\Models\Permission::count();
(Should be ~45 permissions)

# Check roles
>>> App\Models\ChucVu::with('permissions')->get();

# Check specific role
>>> $manager = App\Models\ChucVu::where('CODE', 'manager')->first();
>>> $manager->permissions->count();
(Should be ~36 permissions for manager)
```

## Permission Categories

### Employees (Nhân viên)
- `employees.view` - Xem danh sách
- `employees.create` - Tạo mới
- `employees.edit` - Chỉnh sửa
- `employees.delete` - Xóa

### Products (Sản phẩm)
- `products.view` - Xem danh sách
- `products.create` - Tạo mới
- `products.edit` - Chỉnh sửa
- `products.delete` - Xóa

### Invoices (Hóa đơn)
- `invoices.view` - Xem danh sách
- `invoices.create` - Tạo mới
- `invoices.edit` - Chỉnh sửa
- `invoices.delete` - Xóa
- `invoices.payment` - Xử lý thanh toán

### Purchase Orders (Phiếu nhập)
- `purchase-orders.view` - Xem
- `purchase-orders.create` - Tạo
- `purchase-orders.approve` - Duyệt
- `purchase-orders.delete` - Hủy

### Reports (Báo cáo)
- `reports.view` - Xem
- `reports.export` - Xuất dữ liệu

## Role Permissions Matrix

| Permission | Manager | Cashier | Warehouse |
|-----------|---------|---------|-----------|
| employees.* | ✅ | ❌ | ❌ |
| products.* | ✅ | ❌ | ❌ |
| invoices.* | ✅ | ✅ | ❌ |
| purchase-orders.* | ✅ | ❌ | ✅ |
| reports.view | ✅ | ✅ | ✅ |
| reports.export | ✅ | ❌ | ❌ |

## Middleware

### CheckRole Middleware

**File:** `app/Http/Middleware/CheckRole.php`

Kiểm tra role của user.

```php
// Usage
Route::middleware('role:manager')->group(...);
Route::middleware('role:manager,cashier')->group(...);
```

**Response on Failure:**
```json
{
    "message": "Bạn không có quyền truy cập tài nguyên này",
    "user_role": "cashier",
    "required_roles": ["manager"],
    "status": "insufficient_role"
}
```

### CheckPermission Middleware

**File:** `app/Http/Middleware/CheckPermission.php`

Kiểm tra quyền cụ thể của user.

```php
// Usage
Route::middleware('permission:employees.create')->group(...);
Route::middleware('permission:products.view,products.edit')->group(...);
```

## AuthorizationTrait

**File:** `app/Traits/AuthorizationTrait.php`

Helper trait cho các controller.

```php
use AuthorizationTrait;

// Methods
$this->getUserRole();                        // Get role object
$this->getUserRoleCode();                    // 'manager', 'cashier', etc
$this->hasRole('manager');
$this->hasAnyRole('manager', 'cashier');
$this->hasPermission('employees.create');
$this->hasAnyPermission('create', 'edit');
$this->hasAllPermissions('create', 'edit', 'delete');
$this->getUserPermissions();                 // Array of permission codes
$this->isManager();
$this->isCashier();
$this->isWarehouse();
$this->requireRole('manager');               // Throw 403 if not
$this->requirePermission('employees.edit');  // Throw 403 if not
```

## Files Structure

```
app/
├── Models/
│   ├── ChucVu.php           (Updated with permissions relationship)
│   ├── Permission.php       (NEW)
│   └── NhanVien.php
│
├── Http/
│   ├── Middleware/
│   │   ├── CheckRole.php    (Updated)
│   │   └── CheckPermission.php (Updated)
│   │
│   └── Controllers/
│       └── (Controllers using AuthorizationTrait)
│
├── Traits/
│   └── AuthorizationTrait.php (Updated)
│
└── Enums/
    └── RoleEnum.php

database/
├── migrations/
│   ├── 2026_03_19_000001_create_permissions_table.php
│   └── 2026_03_19_000002_create_role_permissions_table.php
│
└── seeders/
    ├── PermissionSeeder.php (NEW)
    ├── RolePermissionSeeder.php (NEW)
    └── ...existing seeders
```

## Best Practices

1. **Always use migrations:**
   - Never modify database schema directly
   - Always rollback and remigrate if needed

2. **Use database-driven permissions:**
   - More flexible than constants
   - Can be modified without code changes
   - Better for enterprise applications

3. **Cache permissions:**
   ```php
   // Cache user permissions for performance
   Cache::rememberForever("user.{$userId}.permissions", function() {
       return $user->nhanVien->chucVu->permissions()->pluck('CODE')->toArray();
   });
   ```

4. **Log permission checks:**
   - For audit trail
   - Helps with debugging
   - Security monitoring

5. **Use meaningful permission names:**
   - `MODULE.ACTION` format: `employees.create`
   - Clear hierarchy: `products.edit` vs `products.edit.own`

6. **Soft delete:**
   - Don't hard delete permissions
   - Use `IS_DELETED` flag
   - Better for audit trails

## Troubleshooting

### Issue: "Bạn không có quyền truy cập tài nguyên này"

**Check:**
1. User has valid role:
   ```bash
   php artisan tinker
   >>> $user->nhanVien->chucVu->CODE
   ```

2. Role has permissions:
   ```bash
   >>> $role = App\Models\ChucVu::where('CODE', 'manager')->first();
   >>> $role->permissions->count()
   ```

3. Permission exists:
   ```bash
   >>> App\Models\Permission::where('CODE', 'employees.create')->first()
   ```

### Issue: Permission not loading

**Solution:**
```php
// Always load relationships before checking
$user->load('nhanVien.chucVu.permissions');

// Or in model
protected $with = ['nhanVien.chucVu.permissions'];
```

## Migration Path

**From Constant-based to Database-driven:**

1. Run migrations (step 1)
2. Run seeders (step 2 & 3)
3. Update middleware (already done)
4. Update controllers to use AuthorizationTrait
5. Remove PermissionConstants (optional)

The system is backward compatible during transition.

## Security Notes

- Manager role bypasses all permission checks (`hasPermission()` returns true for any permission)
- Soft delete preserves audit trail
- Foreign key constraints prevent orphaned data
- Unique constraint prevents duplicate role-permission assignments
