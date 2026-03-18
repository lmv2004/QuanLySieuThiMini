# Role-Based Access Control Implementation Summary

## 📋 Overview
Hệ thống phân quyền (RBAC) dựa trên 3 vai trò đã được triển khai thành công.

## 📁 Files Created/Modified

### Created Files:
1. **app/Enums/RoleEnum.php** - Định nghĩa enum cho các vai trò
2. **app/Constants/PermissionConstants.php** - Định nghĩa quyền và ánh xạ vai trò-quyền
3. **app/Http/Middleware/CheckRole.php** - Middleware kiểm tra vai trò
4. **app/Http/Middleware/CheckPermission.php** - Middleware kiểm tra quyền
5. **app/Traits/AuthorizationTrait.php** - Helper trait cho controllers
6. **database/migrations/2026_03_18_000001_add_code_to_chuc_vus_table.php** - Migration thêm cột CODE
7. **database/seeders/ChucVuSeeder.php** - Seeder khởi tạo vai trò
8. **AUTHORIZATION_GUIDE.md** - Tài liệu hướng dẫn chi tiết

### Modified Files:
1. **bootstrap/app.php** - Đăng ký middleware
2. **app/Models/ChucVu.php** - Thêm CODE vào fillable
3. **routes/api.php** - Rewrite routes với middleware phân quyền

## 🎯 Vai trò và Quyền

### 1. **Manager (Quản lý cửa hàng)** - Code: `manager`
   - ✅ Quản lý nhân viên
   - ✅ Quản lý nhà cung cấp
   - ✅ Quản lý sản phẩm (thêm, giá, VAT)
   - ✅ Tạo/duyệt/hủy phiếu nhập và phiếu hủy
   - ✅ Xem báo cáo doanh thu
   - ✅ Tất cả quyền khác (full access)

### 2. **Cashier (Nhân viên thu ngân)** - Code: `cashier`
   - ✅ Tạo đơn hàng (invoice)
   - ✅ Xem tồn kho sản phẩm
   - ✅ Hủy đơn hàng (chưa thanh toán)
   - ✅ Thanh toán
   - ✅ Xuất hóa đơn

### 3. **Warehouse (Nhân viên kho)** - Code: `warehouse`
   - ✅ Xem trạng thái tồn kho
   - ✅ Tạo đơn nhập hàng
   - ✅ Tạo đơn hủy hàng (hết HSD, hư hỏng)

## 🚀 Cách Triển Khai

### Step 1: Chạy Migration
```bash
php artisan migrate
```

### Step 2: Chạy Seeder
```bash
php artisan db:seed --class=ChucVuSeeder
```

### Step 3: Xác nhận dữ liệu
```bash
php artisan tinker
>>> App\Models\ChucVu::all();
```

## 📝 Cách Sử Dụng

### Route Protection:
```php
// Manager only
Route::middleware('role:manager')->group(function () {
    Route::apiResource('employees', NhanVienController::class);
});

// Multiple roles
Route::middleware('role:manager,cashier')->group(function () {
    // accessible by both
});

// Permission-based
Route::middleware('permission:manage_products')->group(function () {
    // only users with this permission
});
```

### Controller Usage:
```php
use App\Traits\AuthorizationTrait;

class MyController extends Controller
{
    use AuthorizationTrait;
    
    public function index()
    {
        if ($this->isManager()) {
            // Manager code
        }
        
        if ($this->hasPermission('manage_employees')) {
            // Do something
        }
    }
}
```

## ✅ Testing Checklist

- [ ] Run migrations: `php artisan migrate`
- [ ] Run seeders: `php artisan db:seed --class=ChucVuSeeder`
- [ ] Test login as manager account
- [ ] Test login as cashier account
- [ ] Test login as warehouse account
- [ ] Verify middleware blocks unauthorized access
- [ ] Check response includes user role info
- [ ] Test route access for each role

## 📊 Database Changes

### chuc_vus table:
- New column: `CODE` (VARCHAR(50), UNIQUE)
- Example data inserted via seeder:
  - CODE='manager', TENCHUCVU='Quản lý cửa hàng'
  - CODE='cashier', TENCHUCVU='Nhân viên thu ngân'
  - CODE='warehouse', TENCHUCVU='Nhân viên kho'

## 🔍 Troubleshooting

### User can't access route (403 error):
1. Check user's role CODE in database
2. Verify role matches middleware requirement
3. Check if employee has chucVu relationship

### Role information not showing:
1. Make sure NhanVien has MACHUCVU set
2. Verify ChucVu record has CODE filled
3. Test: `Auth::user()->load('nhanVien.chucVu')->nhanVien?->chucVu?->CODE`

## 📚 Documentation
See `AUTHORIZATION_GUIDE.md` for complete documentation.

## 🔐 Security Notes
- All protected routes require `auth:sanctum` middleware
- Role checking happens at middleware level (early exit)
- Permissions are checked before handler execution
- Consider adding audit logging for security tracking
