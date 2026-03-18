# 🔐 Role-Based Access Control System - Complete Implementation

## 📋 Tổng Quan

Hệ thống phân quyền (RBAC) dựa trên 3 vai trò chính đã được triển khai đầy đủ cho backend Laravel của QuanLySieuThiMini:

- **👔 Manager (Quản lý)** - Quyền truy cập toàn bộ hệ thống
- **💳 Cashier (Thu ngân)** - Xử lý giao dịch bán hàng
- **📦 Warehouse (Kho)** - Quản lý hàng tồn kho

---

## ✅ Những gì đã hoàn thành

### 1. **Database & Models**
- ✅ Migration: Thêm cột `CODE` vào bảng `chuc_vus`
- ✅ Model: Cập nhật `ChucVu.php` với cột CODE
- ✅ Seeder: Khởi tạo 3 vai trò cơ bản

### 2. **Authorization Layer**
- ✅ Enum: `RoleEnum` - Định nghĩa các vai trò
- ✅ Constants: `PermissionConstants` - Ánh xạ vai trò ↔ quyền
- ✅ Middleware: `CheckRole` - Kiểm tra vai trò
- ✅ Middleware: `CheckPermission` - Kiểm tra quyền hành động

### 3. **Helper & Config**
- ✅ Trait: `AuthorizationTrait` - Helper methods cho controller
- ✅ Bootstrap: Đăng ký middleware trong `bootstrap/app.php`

### 4. **Routes & APIs**
- ✅ Rewrite: `routes/api.php` - Áp dụng middleware phân quyền
- ✅ Updated: `AuthController.login()` - Trả về role info
- ✅ Updated: `/api/auth/me` - Trả về role info

### 5. **Documentation**
- ✅ `INSTALLATION.md` - Hướng dẫn cài đặt chi tiết
- ✅ `AUTHORIZATION_GUIDE.md` - Tài liệu sử dụng đầy đủ
- ✅ `API_ENDPOINTS_BY_ROLE.md` - Reference endpoints theo vai trò
- ✅ `ROLE_BASED_ACCESS_SUMMARY.md` - Tóm tắt triển khai

---

## 🚀 Cách Triển Khai Ngay Bây Giờ

### Step 1: Chạy Migration
```bash
cd server
php artisan migrate
```

### Step 2: Chạy Seeder
```bash
php artisan db:seed --class=ChucVuSeeder
```

### Step 3: Xác nhận
```bash
php artisan tinker
App\Models\ChucVu::all();
```

---

## 📁 File Structure

```
server/
├── app/
│   ├── Enums/
│   │   └── RoleEnum.php                    # Vai trò enum
│   ├── Constants/
│   │   └── PermissionConstants.php         # Quyền constants
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── AuthController.php          # Updated (role in response)
│   │   └── Middleware/
│   │       ├── CheckRole.php               # Role middleware
│   │       └── CheckPermission.php         # Permission middleware
│   ├── Traits/
│   │   └── AuthorizationTrait.php          # Helper trait
│   └── Models/
│       └── ChucVu.php                      # Updated (CODE fillable)
├── bootstrap/
│   └── app.php                             # Updated (middleware aliases)
├── database/
│   ├── migrations/
│   │   └── 2026_03_18_000001_add_code_to_chuc_vus_table.php
│   └── seeders/
│       └── ChucVuSeeder.php                # Updated
├── routes/
│   ├── api.php                             # Rewritten (role-based)
│   └── auth.php                            # Updated (/me endpoint)
├── INSTALLATION.md                         # Setup guide
├── AUTHORIZATION_GUIDE.md                  # Complete guide
├── API_ENDPOINTS_BY_ROLE.md               # API reference
└── ROLE_BASED_ACCESS_SUMMARY.md           # Implementation summary
```

---

## 🔐 Quyền chi tiết

### 👔 Manager - Truy cập toàn bộ:
```
✅ manage_employees
✅ manage_suppliers
✅ manage_products
✅ manage_purchase_orders
✅ view_reports
✅ view_inventory
✅ create_invoice
✅ cancel_invoice
✅ process_payment
✅ export_invoice
✅ view_warehouse_inventory
✅ create_purchase_order
✅ create_disposal_slip
```

### 💳 Cashier - Thu ngân:
```
✅ create_invoice
✅ view_inventory
✅ cancel_invoice
✅ process_payment
✅ export_invoice
```

### 📦 Warehouse - Kho:
```
✅ view_warehouse_inventory
✅ create_purchase_order
✅ create_disposal_slip
```

---

## 💻 Sử dụng trong Code

### Route Protection:
```php
// Chỉ manager
Route::middleware('role:manager')->group(function () {
    Route::apiResource('employees', NhanVienController::class);
});

// Manager hoặc Cashier
Route::middleware('role:manager,cashier')->group(function () {
    Route::get('invoices', [HoaDonController::class, 'index']);
});

// Với quyền cụ thể
Route::middleware('permission:manage_products')->group(function () {
    Route::apiResource('products', SanPhamController::class);
});
```

### Controller:
```php
use App\Traits\AuthorizationTrait;

class MyController extends Controller
{
    use AuthorizationTrait;
    
    public function index()
    {
        if ($this->isManager()) {
            // Manager only
        }
        
        if ($this->hasPermission('manage_employees')) {
            // Do something
        }
        
        $role = $this->getUserRole(); // 'manager', 'cashier', 'warehouse'
        $perms = $this->getUserPermissions(); // Array of permissions
    }
}
```

---

## 📊 Response Format

### Login Response:
```json
{
    "token": "1|xxxxx",
    "user": {
        "SOTK": 1,
        "TENTK": "manager1",
        "EMAIL": "manager@example.com",
        "MANV": 1,
        "TENNV": "Manager Name",
        "chucVu": {
            "MACHUCVU": 1,
            "CODE": "manager",
            "TENCHUCVU": "Quản lý cửa hàng",
            "MOTA": "..."
        },
        "role": "manager"
    }
}
```

---

## 🧪 Testing

### Test 1: Check role seeded
```bash
php artisan tinker
App\Models\ChucVu::where('CODE', 'manager')->exists();  // true
App\Models\ChucVu::where('CODE', 'cashier')->exists();  // true
App\Models\ChucVu::where('CODE', 'warehouse')->exists(); // true
```

### Test 2: Login getRole
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager1","password":"password"}'
# Should return role: "manager" in response
```

### Test 3: Access Control
```bash
# Manager access OK
curl -X GET http://localhost:8000/api/employees \
  -H "Authorization: Bearer {token_manager}"
# 200 OK

# Cashier access forbidden
curl -X GET http://localhost:8000/api/employees \
  -H "Authorization: Bearer {token_cashier}"
# 403 Forbidden
```

---

## ⚠️ Troubleshooting

### Issue: CODE column not migrating
```bash
# Check migration status
php artisan migrate:status

# Reset and retry
php artisan migrate:refresh --seed
```

### Issue: Role not recognized
```bash
# Check credentials
php artisan tinker
$user = Auth::user()->load('nhanVien.chucVu');
dd($user->nhanVien?->chucVu?->CODE);
```

### Issue: Routes not updating
```bash
# Clear cache
php artisan route:clear
php artisan cache:clear
```

---

## 📖 Tài liệu

| File | Mục đích |
|------|---------|
| **INSTALLATION.md** | Setup & configuration |
| **AUTHORIZATION_GUIDE.md** | Usage & examples |
| **API_ENDPOINTS_BY_ROLE.md** | API reference |
| **ROLE_BASED_ACCESS_SUMMARY.md** | Implementation overview |

---

## 🎯 Endpoints by Role

### Manager Routes:
- `/api/employees/*`
- `/api/suppliers/*`
- `/api/products/*`
- `/api/categories/*`
- `/api/purchase-orders/*`
- `/api/disposal-slips/*`
- `/api/inventories/*`
- Tất cả endpoints khác

### Cashier Routes:
- `/api/invoices/*`
- `/api/ct-hoa-dons/*`
- `/api/inventories` (GET only)
- `/api/vouchers` (GET only)
- `/api/customers` (GET only)

### Warehouse Routes:
- `/api/inventories` (GET only)
- `/api/purchase-orders/*`
- `/api/ct-phieu-nhaps/*`
- `/api/disposal-slips/*`
- `/api/ct-phieu-huys/*`

---

## 🔄 Mở rộng trong tương lai

1. **Dynamic Permissions** - Lưu quyền trong database
2. **Policy Classes** - Laravel Policy cho granular control
3. **Audit Logging** - Track ai làm gì lúc nào
4. **Rate Limiting** - Giới hạn API calls
5. **JWT Tokens** - Alternative to Sanctum if needed

---

## ✨ Key Features

✅ **3-tier Role System** - Manager, Cashier, Warehouse  
✅ **10+ Permissions** - Fine-grained access control  
✅ **Middleware-based** - Fast, early authorization checks  
✅ **Trait Helpers** - Easy controller usage  
✅ **Seeded Data** - Ready to use  
✅ **Comprehensive Docs** - 4 documentation files  
✅ **Type-safe** - Using Enums (PHP 8.1+)  
✅ **Production-ready** - Tested patterns  

---

## 📞 Support

Nếu gặp vấn đề:
1. Xem `INSTALLATION.md` - Setup issues
2. Xem `AUTHORIZATION_GUIDE.md` - Usage issues
3. Check logs: `storage/logs/laravel.log`
4. Test in Tinker: `php artisan tinker`

---

**Status**: ✅ Complete & Ready  
**Last Updated**: March 18, 2026  
**Version**: 1.0
