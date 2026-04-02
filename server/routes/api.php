<?php

use App\Http\Controllers\ChucVuController;
use App\Http\Controllers\CTPhieuHuyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\GiamGiaSPController;
use App\Http\Controllers\HoaDonController;
use App\Http\Controllers\KhachHangController;
use App\Http\Controllers\LoaiSanPhamController;
use App\Http\Controllers\NhaCungCapController;
use App\Http\Controllers\NhanVienController;
use App\Http\Controllers\PhieuHuyController;
use App\Http\Controllers\PhieuNhapController;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\StoreInfoController;
use App\Http\Controllers\TaiKhoanController;
use App\Http\Controllers\TonKhoController;
use App\Http\Controllers\VoucherController;
use App\Models\ChucVu;
use App\Models\GiamGiaSP;
use App\Models\HoaDon;
use App\Models\KhachHang;
use App\Models\LoaiSanPham;
use App\Models\NhaCungCap;
use App\Models\NhanVien;
use App\Models\PhieuHuy;
use App\Models\PhieuNhap;
use App\Models\SanPham;
use App\Models\StoreInfo;
use App\Models\TaiKhoan;
use App\Models\TonKho;
use App\Models\Voucher;
use Illuminate\Support\Facades\Route;

// Đăng ký model binding
Route::model('product', SanPham::class);
Route::model('category', LoaiSanPham::class);
Route::model('supplier', NhaCungCap::class);
Route::model('khachHang', KhachHang::class);
Route::model('employee', NhanVien::class);
Route::model('position', ChucVu::class);
Route::model('invoice', HoaDon::class);
Route::model('purchase_order', PhieuNhap::class);
Route::model('nhanVien', NhanVien::class);
Route::model('chucVu', ChucVu::class);
Route::model('nhaCungCap', NhaCungCap::class);
Route::model('phieuNhap', PhieuNhap::class);
Route::model('disposal_slip', PhieuHuy::class);
Route::model('inventory', TonKho::class);
Route::model('voucher', Voucher::class);
Route::model('discount', GiamGiaSP::class);
Route::model('account', TaiKhoan::class);
Route::model('storeInfo', StoreInfo::class);

Route::post('accounts/bulk', [TaiKhoanController::class, 'bulkStore']);
Route::post('disposal-slips/bulk', [PhieuHuyController::class, 'bulkStore']);
Route::post('discounts/bulk', [GiamGiaSPController::class, 'bulkStore']);
Route::post('vouchers/bulk', [VoucherController::class, 'bulkStore']);

// Role-Permission management (Public routes removed, moved to auth group)

// Auth Routes
Route::prefix('auth')->group(base_path('routes/auth.php'));

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {

    // ── Products ──
    Route::get('products', [SanPhamController::class, 'index'])->middleware('permission:products.view');
    Route::get('products/barcode/{barcode}', [SanPhamController::class, 'findByBarcode'])->middleware('permission:products.view');
    Route::get('products/{product}', [SanPhamController::class, 'show'])->middleware('permission:products.view');
    Route::post('products', [SanPhamController::class, 'store'])->middleware('permission:products.create');
    Route::put('products/{product}', [SanPhamController::class, 'update'])->middleware('permission:products.edit');
    Route::delete('products/{product}', [SanPhamController::class, 'destroy'])->middleware('permission:products.delete');

    // ── Categories ──
    Route::get('categories', [LoaiSanPhamController::class, 'index'])->middleware('permission:categories.view');
    Route::get('categories/{category}', [LoaiSanPhamController::class, 'show'])->middleware('permission:categories.view');
    Route::post('categories', [LoaiSanPhamController::class, 'store'])->middleware('permission:categories.manage');
    Route::put('categories/{category}', [LoaiSanPhamController::class, 'update'])->middleware('permission:categories.manage');
    Route::delete('categories/{category}', [LoaiSanPhamController::class, 'destroy'])->middleware('permission:categories.manage');

    // ── Suppliers ──
    Route::get('suppliers', [NhaCungCapController::class, 'index'])->middleware('permission:suppliers.view');
    Route::get('suppliers/{supplier}', [NhaCungCapController::class, 'show'])->middleware('permission:suppliers.view');
    Route::post('suppliers', [NhaCungCapController::class, 'store'])->middleware('permission:suppliers.create');
    Route::put('suppliers/{supplier}', [NhaCungCapController::class, 'update'])->middleware('permission:suppliers.edit');
    Route::delete('suppliers/{supplier}', [NhaCungCapController::class, 'destroy'])->middleware('permission:suppliers.delete');

    // ── Discounts ──
    Route::get('discounts', [GiamGiaSPController::class, 'index'])->middleware('permission:discounts.view');
    Route::get('discounts/{discount}', [GiamGiaSPController::class, 'show'])->middleware('permission:discounts.view');
    Route::post('discounts', [GiamGiaSPController::class, 'store'])->middleware('permission:discounts.manage');
    Route::put('discounts/{discount}', [GiamGiaSPController::class, 'update'])->middleware('permission:discounts.manage');
    Route::delete('discounts/{discount}', [GiamGiaSPController::class, 'destroy'])->middleware('permission:discounts.manage');

    // ── Vouchers ──
    Route::get('vouchers', [VoucherController::class, 'index'])->middleware('permission:vouchers.view');
    Route::get('vouchers/{voucher}', [VoucherController::class, 'show'])->middleware('permission:vouchers.view');
    Route::post('vouchers', [VoucherController::class, 'store'])->middleware('permission:vouchers.create');
    Route::put('vouchers/{voucher}', [VoucherController::class, 'update'])->middleware('permission:vouchers.edit');
    Route::delete('vouchers/{voucher}', [VoucherController::class, 'destroy'])->middleware('permission:vouchers.delete');

    // ── Customers ──
    Route::get('customers', [KhachHangController::class, 'index'])->middleware('permission:customers.view');
    Route::get('customers/{khachHang}', [KhachHangController::class, 'show'])->middleware('permission:customers.view');
    Route::post('customers', [KhachHangController::class, 'store'])->middleware('permission:customers.create');
    Route::put('customers/{khachHang}', [KhachHangController::class, 'update'])->middleware('permission:customers.edit');
    Route::delete('customers/{khachHang}', [KhachHangController::class, 'destroy'])->middleware('permission:customers.edit');

    // ── Vietnamese aliases (spec-compatible) ──
    Route::apiResource('nhan-vien', NhanVienController::class)
        ->parameters(['nhan-vien' => 'nhanVien'])
        ->middleware([
            'index' => 'permission:employees.view',
            'show' => 'permission:employees.view',
            'store' => 'permission:employees.create',
            'update' => 'permission:employees.edit',
            'destroy' => 'permission:employees.delete',
        ]);
    Route::apiResource('chuc-vu', ChucVuController::class)
        ->parameters(['chuc-vu' => 'chucVu'])
        ->middleware([
            'index' => 'permission:positions.view',
            'show' => 'permission:positions.view',
            'store' => 'permission:positions.manage',
            'update' => 'permission:positions.manage',
            'destroy' => 'permission:positions.manage',
        ]);
    Route::apiResource('nha-cung-cap', NhaCungCapController::class)
        ->parameters(['nha-cung-cap' => 'nhaCungCap'])
        ->middleware([
            'index' => 'permission:suppliers.view',
            'show' => 'permission:suppliers.view',
            'store' => 'permission:suppliers.create',
            'update' => 'permission:suppliers.edit',
            'destroy' => 'permission:suppliers.delete',
        ]);
    Route::apiResource('phieu-nhap', PhieuNhapController::class)
        ->parameters(['phieu-nhap' => 'phieuNhap'])
        ->middleware([
            'index' => 'permission:purchase-orders.view',
            'show' => 'permission:purchase-orders.view',
            'store' => 'permission:purchase-orders.create',
            'update' => 'permission:purchase-orders.approve',
            'destroy' => 'permission:purchase-orders.delete',
        ]);
    Route::patch('phieu-nhap/{phieuNhap}/approve', [PhieuNhapController::class, 'approve'])->middleware('permission:purchase-orders.approve');
    Route::patch('phieu-nhap/{phieuNhap}/cancel', [PhieuNhapController::class, 'cancel'])->middleware('permission:purchase-orders.approve');
    Route::apiResource('khach-hang', KhachHangController::class)
        ->parameters(['khach-hang' => 'khachHang'])
        ->middleware([
            'index' => 'permission:customers.view',
            'show' => 'permission:customers.view',
            'store' => 'permission:customers.create',
            'update' => 'permission:customers.edit',
            'destroy' => 'permission:customers.edit',
        ]);

    // ── Inventories ──
    Route::get('inventories', [TonKhoController::class, 'index'])->middleware('permission:inventories.view');
    Route::get('inventories/{inventory}', [TonKhoController::class, 'show'])->middleware('permission:inventories.view');

    // ── Purchase Orders ──
    Route::post('purchase-orders/bulk', [PhieuNhapController::class, 'bulkStore'])->middleware('permission:purchase-orders.create');
    Route::get('purchase-orders', [PhieuNhapController::class, 'index'])->middleware('permission:purchase-orders.view');
    Route::get('purchase-orders/{purchase_order}', [PhieuNhapController::class, 'show'])->middleware('permission:purchase-orders.view');
    Route::post('purchase-orders', [PhieuNhapController::class, 'store'])->middleware('permission:purchase-orders.create');
    Route::put('purchase-orders/{purchase_order}', [PhieuNhapController::class, 'update'])->middleware('permission:purchase-orders.approve');
    Route::patch('purchase-orders/{purchase_order}/approve', [PhieuNhapController::class, 'approve'])->middleware('permission:purchase-orders.approve');
    Route::patch('purchase-orders/{purchase_order}/cancel', [PhieuNhapController::class, 'cancel'])->middleware('permission:purchase-orders.approve');
    Route::delete('purchase-orders/{purchase_order}', [PhieuNhapController::class, 'destroy'])->middleware('permission:purchase-orders.delete');

    // Chi tiết phiếu nhập
    Route::get('ct-phieu-nhaps', [\App\Http\Controllers\CTPhieuNhapController::class, 'index'])->middleware('permission:purchase-orders.view');
    Route::post('ct-phieu-nhaps', [\App\Http\Controllers\CTPhieuNhapController::class, 'store'])->middleware('permission:purchase-orders.create');
    Route::get('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'show'])->middleware('permission:purchase-orders.view');
    Route::put('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'update'])->middleware('permission:purchase-orders.approve');
    Route::delete('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'destroy'])->middleware('permission:purchase-orders.delete');

    // ── Disposal Slips ──
    Route::get('disposal-slips', [PhieuHuyController::class, 'index'])->middleware('permission:disposal-slips.view');
    Route::get('disposal-slips/{disposal_slip}', [PhieuHuyController::class, 'show'])->middleware('permission:disposal-slips.view');
    Route::post('disposal-slips', [PhieuHuyController::class, 'store'])->middleware('permission:disposal-slips.create');
    Route::put('disposal-slips/{disposal_slip}', [PhieuHuyController::class, 'update'])->middleware('permission:disposal-slips.approve');
    Route::put('disposal-slips/{disposal_slip}/approve', [PhieuHuyController::class, 'approve'])->middleware('permission:disposal-slips.approve');
    Route::put('disposal-slips/{disposal_slip}/reopen', [PhieuHuyController::class, 'reopen'])->middleware('permission:disposal-slips.approve');
    Route::put('disposal-slips/{disposal_slip}/lock', [PhieuHuyController::class, 'lock'])->middleware('permission:disposal-slips.approve');
    Route::put('disposal-slips/{disposal_slip}/unlock', [PhieuHuyController::class, 'unlock'])->middleware('permission:disposal-slips.approve');
    Route::delete('disposal-slips/{disposal_slip}', [PhieuHuyController::class, 'destroy'])->middleware('permission:disposal-slips.approve');

    // Chi tiết phiếu hủy
    Route::get('ct-phieu-huys', [CTPhieuHuyController::class, 'index'])->middleware('permission:disposal-slips.view');
    Route::post('ct-phieu-huys', [CTPhieuHuyController::class, 'store'])->middleware('permission:disposal-slips.create');
    Route::get('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'show'])->middleware('permission:disposal-slips.view');
    Route::put('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'update'])->middleware('permission:disposal-slips.approve');
    Route::delete('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'destroy'])->middleware('permission:disposal-slips.approve');

    // ── Positions ──
    Route::get('positions', [ChucVuController::class, 'index'])->middleware('permission:positions.view');
    Route::get('positions/{position}', [ChucVuController::class, 'show'])->middleware('permission:positions.view');
    Route::post('positions', [ChucVuController::class, 'store'])->middleware('permission:positions.manage');
    Route::put('positions/{position}', [ChucVuController::class, 'update'])->middleware('permission:positions.manage');
    Route::delete('positions/{position}', [ChucVuController::class, 'destroy'])->middleware('permission:positions.manage');

    // ── Employees ──
    Route::get('employees', [NhanVienController::class, 'index'])->middleware('permission:employees.view');
    Route::get('employees/{employee}', [NhanVienController::class, 'show'])->middleware('permission:employees.view');
    Route::post('employees', [NhanVienController::class, 'store'])->middleware('permission:employees.create');
    Route::put('employees/{employee}', [NhanVienController::class, 'update'])->middleware('permission:employees.edit');
    Route::delete('employees/{employee}', [NhanVienController::class, 'destroy'])->middleware('permission:employees.delete');

    // ── Accounts ──
    Route::get('accounts', [TaiKhoanController::class, 'index'])->middleware('permission:accounts.view');
    Route::get('accounts/{account}', [TaiKhoanController::class, 'show'])->middleware('permission:accounts.view');
    Route::post('accounts', [TaiKhoanController::class, 'store'])->middleware('permission:accounts.create');
    Route::put('accounts/{account}', [TaiKhoanController::class, 'update'])->middleware('permission:accounts.edit');
    Route::delete('accounts/{account}', [TaiKhoanController::class, 'destroy'])->middleware('permission:accounts.delete');

    // ── Permissions management ──
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:positions.manage');
    Route::get('permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:positions.manage');
    Route::get('positions/{position}/permissions', [RolePermissionController::class, 'index'])->middleware('permission:positions.manage');
    Route::put('positions/{position}/permissions', [RolePermissionController::class, 'sync'])->middleware('permission:positions.manage');

    // ── Invoices ──
    Route::get('invoices', [HoaDonController::class, 'index'])->middleware('permission:invoices.view');
    Route::get('invoices/{invoice}', [HoaDonController::class, 'show'])->middleware('permission:invoices.view');
    Route::post('invoices', [HoaDonController::class, 'store'])->middleware('permission:invoices.create');
    Route::put('invoices/{invoice}', [HoaDonController::class, 'update'])->middleware('permission:invoices.edit');
    Route::delete('invoices/{invoice}', [HoaDonController::class, 'destroy'])->middleware('permission:invoices.delete');

    // Chi tiết hóa đơn
    Route::get('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'index'])->middleware('permission:invoices.view');
    Route::post('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'store'])->middleware('permission:invoices.create');
    Route::get('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'show'])->middleware('permission:invoices.view');
    Route::put('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'update'])->middleware('permission:invoices.edit');
    Route::delete('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'destroy'])->middleware('permission:invoices.delete');

    // ── Store Information ──
    Route::get('store-info', [StoreInfoController::class, 'index'])->middleware('permission:invoices.view');
    Route::post('store-info', [StoreInfoController::class, 'store'])->middleware('permission:invoices.edit');
    Route::get('store-info/{storeInfo}', [StoreInfoController::class, 'show'])->middleware('permission:invoices.view');
    Route::put('store-info/{storeInfo}', [StoreInfoController::class, 'update'])->middleware('permission:invoices.edit');
    Route::delete('store-info/{storeInfo}', [StoreInfoController::class, 'destroy'])->middleware('permission:invoices.edit');

    // ── Dashboard ──
    Route::get('dashboard/stats', [DashboardController::class, 'stats'])->name('dashboard.stats');
});
