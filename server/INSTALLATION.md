# Installation Guide - Role-Based Access Control

## 📦 Prerequisites
- Laravel 11.x
- MySQL/MariaDB
- PHP 8.1+

## 🔧 Installation Steps

### 1. **Chạy Migration**
Migration thêm cột `CODE` vào bảng `chuc_vus`:

```bash
php artisan migrate
```

Nếu bạn chỉ muốn chạy migration mới nhất:
```bash
php artisan migrate --path=database/migrations/2026_03_18_000001_add_code_to_chuc_vus_table.php
```

### 2. **Chạy Seeder**
Seeder sẽ khởi tạo ba vai trò cơ bản:

```bash
php artisan db:seed --class=ChucVuSeeder
```

Hoặc chạy tất cả seeders:
```bash
php artisan db:seed
```

### 3. **Xác nhận Dữ liệu**
Kiểm tra xem các vai trò đã được tạo:

```bash
php artisan tinker
```

Sau đó trong console:
```php
App\Models\ChucVu::all();
```

Kết quả sẽ trông như này:
```
=> Illuminate\Database\Eloquent\Collection {
     all: [
       App\Models\ChucVu {
         MACHUCVU: 1,
         CODE: "manager",
         TENCHUCVU: "Quản lý cửa hàng",
         MOTA: "Người quản lý cửa hàng có quyền quản lý toàn bộ hệ thống",
         ...
       },
       App\Models\ChucVu {
         MACHUCVU: 2,
         CODE: "cashier",
         TENCHUCVU: "Nhân viên thu ngân",
         MOTA: "Nhân viên thu ngân xử lý các giao dịch bán hàng",
         ...
       },
       App\Models\ChucVu {
         MACHUCVU: 3,
         CODE: "warehouse",
         TENCHUCVU: "Nhân viên kho",
         MOTA: "Nhân viên kho quản lý hàng tồn kho",
         ...
       },
     ],
   }
```

### 4. **Xác nhận Middleware được đăng ký**
Kiểm tra `bootstrap/app.php` để xác nhận middleware aliases:

```php
$middleware->alias([
    'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
    'role' => \App\Http\Middleware\CheckRole::class,
    'permission' => \App\Http\Middleware\CheckPermission::class,
]);
```

## 📝 Database Changes

### Bảng chuc_vus

**Cột mới:**
- `CODE` (VARCHAR(50)) - Unique identifier cho vai trò
  - `manager` - Quản lý
  - `cashier` - Thu ngân
  - `warehouse` - Kho

**Ví dụ SQL:**
```sql
SELECT * FROM chuc_vus;
```

## 🧪 Testing the Setup

### Test 1: Check roles seeded correctly
```bash
php artisan tinker
App\Models\ChucVu::where('CODE', 'manager')->first();
App\Models\ChucVu::where('CODE', 'cashier')->first();
App\Models\ChucVu::where('CODE', 'warehouse')->first();
```

### Test 2: Create test users with different roles
```bash
php artisan tinker

// Create manager user
$manager = App\Models\TaiKhoan::create([
    'TENTK' => 'manager1',
    'EMAIL' => 'manager@example.com',
    'password' => Hash::make('password'),
    'MANV' => 1, // link to employee
]);

// Create employee with manager role
$emp = App\Models\NhanVien::create([
    'TENNV' => 'Manager Name',
    'MACHUCVU' => 1, // manager
]);

// Update account to link to employee
TaiKhoan::find(1)->update(['MANV' => $emp->MANV]);
```

### Test 3: API endpoint test
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager1","password":"password"}'

# Expected response:
{
    "token": "1|...",
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

## 🔍 Verification Checklist

- [ ] Migration ran successfully
- [ ] Seeder created 3 roles
- [ ] Middleware registered in bootstrap/app.php
- [ ] AuthController login returns role info
- [ ] /api/auth/me endpoint returns role info
- [ ] Routes have correct middleware
- [ ] Test access with manager account
- [ ] Test access with cashier account
- [ ] Test access with warehouse account
- [ ] Unauthorized access returns 403

## 🐛 Troubleshooting

### Migration fails with "Column already exists"
```bash
# Check if CODE column exists
php artisan tinker
DB::table('chuc_vus')->getConnection()->getSchemaBuilder()->getColumns('chuc_vus');

# If it exists, remove the migration from migrations table
php artisan migrate:reset
php artisan migrate
```

### Seeder doesn't create roles
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Run seeder again
php artisan db:seed --class=ChucVuSeeder
```

### User can't access routes
1. Check user's NhanVien has MACHUCVU set
2. Check ChucVu record has CODE filled
3. Test role retrieval: `Auth::user()->nhanVien?->chucVu?->CODE`

### "Role not found" error
1. Verify role CODE in route middleware matches database CODE
2. Case-sensitive: use lowercase (manager, cashier, warehouse)
3. Check for typos in middleware definition

## 📚 Next Steps

1. Update your frontend to use the new `role` field from login response
2. Configure UI based on user role
3. Implement authorization checks in frontend
4. Add audit logging for security tracking
5. Create API documentation for each role's endpoints

## 📖 Documentation Files

- **AUTHORIZATION_GUIDE.md** - Complete authorization guide
- **ROLE_BASED_ACCESS_SUMMARY.md** - Summary of implementation
- **INSTALLATION.md** - This file

## 🤝 Support
If you encounter issues:
1. Check error logs: `storage/logs/laravel.log`
2. Verify database schema: `php artisan migrate:status`
3. Test manually in Tinker shell
4. Review AUTHORIZATION_GUIDE.md for usage examples
