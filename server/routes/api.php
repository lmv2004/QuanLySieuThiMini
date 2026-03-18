<?php

use App\Http\Controllers\ChucVuController;
use App\Http\Controllers\CTPhieuHuyController;
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
Route::model('phieuNhap', PhieuNhap::class);
Route::model('disposal_slip', PhieuHuy::class);
Route::model('inventory', TonKho::class);
Route::model('voucher', Voucher::class);
Route::model('discount', GiamGiaSP::class);
Route::model('account', TaiKhoan::class);

Route::post('accounts/bulk', [TaiKhoanController::class, 'bulkStore']);
Route::post('disposal-slips/bulk', [PhieuHuyController::class, 'bulkStore']);
Route::post('discounts/bulk', [GiamGiaSPController::class, 'bulkStore']);
Route::post('vouchers/bulk', [VoucherController::class, 'bulkStore']);

// API Resources
Route::apiResource('products', SanPhamController::class);
Route::apiResource('categories', LoaiSanPhamController::class);
Route::apiResource('suppliers', NhaCungCapController::class);
Route::apiResource('customers', KhachHangController::class);
Route::apiResource('employees', NhanVienController::class);
Route::apiResource('positions', ChucVuController::class);
Route::apiResource('invoices', HoaDonController::class);
Route::apiResource('purchase-orders', PhieuNhapController::class);
Route::apiResource('disposal-slips', PhieuHuyController::class);
Route::apiResource('inventories', TonKhoController::class);
Route::apiResource('vouchers', VoucherController::class);
Route::apiResource('discounts', GiamGiaSPController::class);
Route::apiResource('accounts', TaiKhoanController::class);

// Chi tiết phiếu nhập (composite key)
Route::get('ct-phieu-nhaps', [\App\Http\Controllers\CTPhieuNhapController::class, 'index']);
Route::post('ct-phieu-nhaps', [\App\Http\Controllers\CTPhieuNhapController::class, 'store']);
Route::get('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'show']);
Route::put('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'update']);
Route::delete('ct-phieu-nhaps/{maphieu}/{masp}', [\App\Http\Controllers\CTPhieuNhapController::class, 'destroy']);

// Chi tiết phiếu hủy (composite key)
Route::get('ct-phieu-huys', [CTPhieuHuyController::class, 'index']);
Route::post('ct-phieu-huys', [CTPhieuHuyController::class, 'store']);
Route::get('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'show']);
Route::put('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'update']);
Route::delete('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'destroy']);

// Chi tiết hóa đơn (composite key)
Route::get('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'index']);
Route::post('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'store']);
Route::get('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'show']);
Route::put('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'update']);
Route::delete('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'destroy']);

Route::prefix('auth')->group(base_path('routes/auth.php'));
require __DIR__.'/auth.php';

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Manager Routes (Quản lý cửa hàng)
    Route::middleware('role:manager')->group(function () {
        // Quản lý nhân viên
        Route::apiResource('employees', NhanVienController::class);
        // Quản lý nhà cung cấp
        Route::apiResource('suppliers', NhaCungCapController::class);
        // Quản lý sản phẩm
        Route::apiResource('products', SanPhamController::class);
        Route::apiResource('categories', LoaiSanPhamController::class);
        Route::apiResource('discounts', GiamGiaSPController::class);
        // Quản lý các quyết định
        Route::apiResource('positions', ChucVuController::class);
        Route::apiResource('accounts', TaiKhoanController::class);
        // Phiếu nhập/hủy
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
        // Xem báo cáo (inventories)
        Route::apiResource('inventories', TonKhoController::class);
        Route::apiResource('vouchers', VoucherController::class);
        Route::apiResource('customers', KhachHangController::class);
    });

    // Cashier Routes (Nhân viên thu ngân)
    Route::middleware('role:cashier')->group(function () {
        // Tạo đơn hàng
        Route::post('invoices', [HoaDonController::class, 'store']);
        Route::get('invoices', [HoaDonController::class, 'index']);
        Route::get('invoices/{invoice}', [HoaDonController::class, 'show']);
        Route::put('invoices/{invoice}', [HoaDonController::class, 'update']);
        Route::delete('invoices/{invoice}', [HoaDonController::class, 'destroy']);
        // Xem tồn kho của sản phẩm
        Route::get('inventories', [TonKhoController::class, 'index']);
        Route::get('inventories/{inventory}', [TonKhoController::class, 'show']);
        // Chi tiết hóa đơn
        Route::get('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'index']);
        Route::post('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'store']);
        Route::get('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'show']);
        Route::put('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'update']);
        Route::delete('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'destroy']);
        // Xem vouchers
        Route::get('vouchers', [VoucherController::class, 'index']);
        Route::get('vouchers/{voucher}', [VoucherController::class, 'show']);
        // Xem khách hàng
        Route::get('customers', [KhachHangController::class, 'index']);
        Route::get('customers/{khachHang}', [KhachHangController::class, 'show']);
    });

    // Warehouse Routes (Nhân viên kho)
    Route::middleware('role:warehouse')->group(function () {
        // Xem trạng thái hàng tồn kho
        Route::get('inventories', [TonKhoController::class, 'index']);
        Route::get('inventories/{inventory}', [TonKhoController::class, 'show']);
        // Tạo đơn nhập hàng
        Route::post('purchase-orders', [PhieuNhapController::class, 'store']);
        Route::get('purchase-orders', [PhieuNhapController::class, 'index']);
        Route::get('purchase-orders/{phieuNhap}', [PhieuNhapController::class, 'show']);
        Route::put('purchase-orders/{phieuNhap}', [PhieuNhapController::class, 'update']);
        Route::delete('purchase-orders/{phieuNhap}', [PhieuNhapController::class, 'destroy']);
        // Tạo đơn hủy hàng
        Route::post('disposal-slips', [PhieuHuyController::class, 'store']);
        Route::get('disposal-slips', [PhieuHuyController::class, 'index']);
        Route::get('disposal-slips/{disposal_slip}', [PhieuHuyController::class, 'show']);
        Route::put('disposal-slips/{disposal_slip}', [PhieuHuyController::class, 'update']);
        Route::delete('disposal-slips/{disposal_slip}', [PhieuHuyController::class, 'destroy']);
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
});
