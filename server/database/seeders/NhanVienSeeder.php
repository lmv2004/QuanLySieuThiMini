<?php

namespace Database\Seeders;

use App\Models\NhanVien;
use App\Models\ChucVu;
use Illuminate\Database\Seeder;

class NhanVienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy ID của các chức vụ
        $admin = ChucVu::where('CODE', 'ADMIN')->first();
        $quanly = ChucVu::where('CODE', 'QUANLY')->first();
        $thungan = ChucVu::where('CODE', 'THUNGAN')->first();
        $nvkho = ChucVu::where('CODE', 'NVKHO')->first();

        $data = [
            [
                'TENNV' => 'Ngô Văn Tuấn',
                'GIOITINH' => true, // Nam
                'CCCD' => '001234567890',
                'NGAYSINH' => '1995-05-15',
                'SODIENTHOAI' => '0987654321',
                'EMAIL' => 'admin@gmail.com',
                'DIACHI' => '123 Đường Lê Lợi, TP. HCM',
                'NGAYTHAMGIA' => '2024-01-01',
                'MACHUCVU' => $admin->MACHUCVU,
                'IS_DELETED' => false,
            ],
            [
                'TENNV' => 'Trần Thị Liên',
                'GIOITINH' => false, // Nữ
                'CCCD' => '001234567891',
                'NGAYSINH' => '1996-08-20',
                'SODIENTHOAI' => '0912345678',
                'EMAIL' => 'quanly@gmail.com',
                'DIACHI' => '456 Đường Nguyễn Huệ, TP. HCM',
                'NGAYTHAMGIA' => '2024-01-05',
                'MACHUCVU' => $quanly->MACHUCVU,
                'IS_DELETED' => false,
            ],
            [
                'TENNV' => 'Lê Văn Ạt Min',
                'GIOITINH' => true, // Nam
                'CCCD' => '001234567892',
                'NGAYSINH' => '1998-03-10',
                'SODIENTHOAI' => '0923456789',
                'EMAIL' => 'thungan@gmail.com',
                'DIACHI' => '789 Đường Trần Hưng Đạo, TP. HCM',
                'NGAYTHAMGIA' => '2024-02-01',
                'MACHUCVU' => $thungan->MACHUCVU,
                'IS_DELETED' => false,
            ],
            [
                'TENNV' => 'Phạm Minh Khôi',
                'GIOITINH' => true, // Nam
                'CCCD' => '001234567893',
                'NGAYSINH' => '1997-11-25',
                'SODIENTHOAI' => '0934567890',
                'EMAIL' => 'nvkho@gmail.com',
                'DIACHI' => '321 Đường Võ Văn Kiệt, TP. HCM',
                'NGAYTHAMGIA' => '2024-02-15',
                'MACHUCVU' => $nvkho->MACHUCVU,
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $nhanVien) {
            NhanVien::create($nhanVien);
        }
    }
}
