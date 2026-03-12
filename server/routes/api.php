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
Route::model('customer', KhachHang::class);
Route::model('employee', NhanVien::class);
Route::model('position', ChucVu::class);
Route::model('invoice', HoaDon::class);
Route::model('purchase_order', PhieuNhap::class);
Route::model('disposal_slip', PhieuHuy::class);
Route::model('inventory', TonKho::class);
Route::model('voucher', Voucher::class);
Route::model('discount', GiamGiaSP::class);
Route::model('account', TaiKhoan::class);

// API Resources
Route::apiResource('products', SanPhamController::class);                    // Sản phẩm
Route::apiResource('categories', LoaiSanPhamController::class);               // Loại sản phẩm
Route::apiResource('suppliers', NhaCungCapController::class);                 // Nhà cung cấp
Route::apiResource('customers', KhachHangController::class);                  // Khách hàng
Route::apiResource('employees', NhanVienController::class);                   // Nhân viên
Route::apiResource('positions', ChucVuController::class);                     // Chức vụ
Route::apiResource('invoices', HoaDonController::class);                      // Hóa đơn
Route::apiResource('purchase-orders', PhieuNhapController::class);            // Phiếu nhập
Route::apiResource('disposal-slips', PhieuHuyController::class);              // Phiếu hủy
Route::apiResource('inventories', TonKhoController::class);                   // Tồn kho
Route::apiResource('vouchers', VoucherController::class);                     // Voucher
Route::apiResource('discounts', GiamGiaSPController::class);                  // Giảm giá sản phẩm
Route::apiResource('accounts', TaiKhoanController::class);                    // Tài khoản
Route::prefix('auth')->group(base_path('routes/auth.php'));
Route::get('ct-phieu-huys', [CTPhieuHuyController::class, 'index']);
Route::post('ct-phieu-huys', [CTPhieuHuyController::class, 'store']);
Route::get('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'show']);
Route::put('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'update']);
Route::delete('ct-phieu-huys/{maphieu}/{masp}', [CTPhieuHuyController::class, 'destroy']);

Route::get('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'index']);
Route::post('ct-hoa-dons', [\App\Http\Controllers\CTHoaDonController::class, 'store']);
Route::get('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'show']);
Route::put('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'update']);
Route::delete('ct-hoa-dons/{mahd}/{masp}/{id_tonkho}', [\App\Http\Controllers\CTHoaDonController::class, 'destroy']);

require __DIR__ . '/auth.php';
