<?php

use App\Http\Controllers\ChucVuController;
use App\Http\Controllers\CTPhieuHuyController;
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
Route::model('disposal_slip', PhieuHuy::class);
Route::model('inventory', TonKho::class);
Route::model('voucher', Voucher::class);
Route::model('discount', GiamGiaSP::class);
Route::model('account', TaiKhoan::class);

Route::post('accounts/bulk', [TaiKhoanController::class, 'bulkStore']);
Route::post('disposal-slips/bulk', [PhieuHuyController::class, 'bulkStore']);
Route::post('discounts/bulk', [GiamGiaSPController::class, 'bulkStore']);
Route::post('vouchers/bulk', [VoucherController::class, 'bulkStore']);

// Role-Permission management (Public routes removed, moved to auth group)

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Shared Routes (Routes accessible by multiple roles)
    
    // View Vouchers, Customers, Products, Categories (Manager + Cashier)
    Route::middleware('role:manager,cashier')->group(function () {
        Route::get('vouchers', [VoucherController::class, 'index']);
        Route::get('vouchers/{voucher}', [VoucherController::class, 'show']);
        Route::get('customers', [KhachHangController::class, 'index']);
        Route::get('customers/{khachHang}', [KhachHangController::class, 'show']);
        
        // Xem sản phẩm & danh mục
        Route::get('products', [SanPhamController::class, 'index']);
        Route::get('products/{product}', [SanPhamController::class, 'show']);
        Route::get('categories', [LoaiSanPhamController::class, 'index']);
        Route::get('categories/{category}', [LoaiSanPhamController::class, 'show']);
        Route::get('suppliers', [NhaCungCapController::class, 'index']);
        Route::get('suppliers/{supplier}', [NhaCungCapController::class, 'show']);
        Route::get('discounts', [GiamGiaSPController::class, 'index']);
        Route::get('discounts/{discount}', [GiamGiaSPController::class, 'show']);
    });

    // View Inventories (Manager + Cashier + Warehouse)
    Route::middleware('role:manager,cashier,warehouse')->group(function () {
        Route::get('inventories', [TonKhoController::class, 'index']);
        Route::get('inventories/{inventory}', [TonKhoController::class, 'show']);
    });

    // Purchase Orders & Disposal Slips (Manager + Warehouse)
    Route::middleware('role:manager,warehouse')->group(function () {
        Route::apiResource('purchase-orders', PhieuNhapController::class);
        Route::apiResource('disposal-slips', PhieuHuyController::class);
        
        // Chi tiết phiếu nhập
        Route::get('ct-phieu-nhaps', [\App\Http\Controllers\CTPhieuNhapController::class, 'index']);
        Route::post('ct-phieu-nhaps', [\App\Http\Controllers\CTPhieuNhapController::class, 'store']);
        Route::get('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'show']);
        Route::put('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'update']);
        Route::delete('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'destroy']);
        
        // Chi tiết phiếu hủy
        Route::get('ct-phieu-huys', [CTPhieuHuyController::class, 'index']);
        Route::post('ct-phieu-huys', [CTPhieuHuyController::class, 'store']);
        Route::get('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'show']);
        Route::put('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'update']);
        Route::delete('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'destroy']);
    });

    // Manager Routes (Full management)
    Route::prefix('auth')->group(base_path('routes/auth.php'));
    require __DIR__.'/auth.php';

    // Manager Routes (Quản lý cửa hàng)
    Route::middleware('role:manager')->group(function () {
        // Quản lý chức vụ & nhân viên
        Route::apiResource('positions', ChucVuController::class);
        Route::apiResource('employees', NhanVienController::class);
        Route::apiResource('accounts', TaiKhoanController::class);
        
        // Quản lý danh mục & sản phẩm (các quyền ghi/xóa)
        Route::post('products', [SanPhamController::class, 'store']);
        Route::put('products/{product}', [SanPhamController::class, 'update']);
        Route::delete('products/{product}', [SanPhamController::class, 'destroy']);
        
        Route::post('categories', [LoaiSanPhamController::class, 'store']);
        Route::put('categories/{category}', [LoaiSanPhamController::class, 'update']);
        Route::delete('categories/{category}', [LoaiSanPhamController::class, 'destroy']);
        
        Route::post('suppliers', [NhaCungCapController::class, 'store']);
        Route::put('suppliers/{supplier}', [NhaCungCapController::class, 'update']);
        Route::delete('suppliers/{supplier}', [NhaCungCapController::class, 'destroy']);
        
        Route::post('discounts', [GiamGiaSPController::class, 'store']);
        Route::put('discounts/{discount}', [GiamGiaSPController::class, 'update']);
        Route::delete('discounts/{discount}', [GiamGiaSPController::class, 'destroy']);

        // Quản lý Voucher & Khách hàng (các quyền ghi/xóa)
        Route::post('vouchers', [VoucherController::class, 'store']);
        Route::put('vouchers/{voucher}', [VoucherController::class, 'update']);
        Route::delete('vouchers/{voucher}', [VoucherController::class, 'destroy']);
        
        Route::post('customers', [KhachHangController::class, 'store']);
        Route::put('customers/{khachHang}', [KhachHangController::class, 'update']);
        Route::delete('customers/{khachHang}', [KhachHangController::class, 'destroy']);

        // Quản lý Phân quyền (chỉ dành cho Manager)
        Route::get('permissions', [PermissionController::class, 'index']);
        Route::get('permissions/{permission}', [PermissionController::class, 'show']);
        Route::get('positions/{position}/permissions', [RolePermissionController::class, 'index']);
        Route::put('positions/{position}/permissions', [RolePermissionController::class, 'sync']);
    });

    // Cashier Routes (Các hành động đặc thù thu ngân)
    // Invoice & Invoice Details (Manager + Cashier)
    Route::middleware('role:manager,cashier')->group(function () {
        Route::apiResource('invoices', HoaDonController::class);
        
        // Chi tiết hóa đơn
        Route::get('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'index']);
        Route::post('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'store']);
        Route::get('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'show']);
        Route::put('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'update']);
        Route::delete('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'destroy']);
    });
});
