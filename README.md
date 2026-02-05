# 🛒 Mini Supermarket Management System (Laravel)

## 📌 Giới thiệu
**Mini Supermarket Management System** là hệ thống quản lý siêu thị mini được xây dựng bằng **Laravel**, hỗ trợ các nghiệp vụ cơ bản như quản lý sản phẩm, bán hàng, thanh toán và hóa đơn.  
Dự án phục vụ mục đích **học tập và nghiên cứu**, không sử dụng cho môi trường thương mại thực tế.

---

## 🎯 Mục tiêu dự án
- Quản lý danh mục và sản phẩm trong siêu thị mini  
- Hỗ trợ quy trình bán hàng và thanh toán  
- Tự động lập hóa đơn bán hàng  
- Quản lý người dùng và phân quyền cơ bản  
- Áp dụng mô hình MVC của Laravel  

---

## ⚙️ Công nghệ sử dụng
- **Backend**: Laravel 12.x  
- **Frontend**: Blade Template + Vite  
- **Database**: MySQL  
- **Authentication**: Laravel Auth  
- **ORM**: Eloquent  

---

## 🧩 Chức năng chính

### 👤 Quản lý người dùng
- Đăng nhập / đăng xuất  
- Phân quyền (Admin / Nhân viên thu ngân / Nhân viên kho)

### 📦 Quản lý sản phẩm
- Thêm / sửa / xóa sản phẩm  
- Quản lý giá bán, tồn kho  
- Phân loại sản phẩm

### 🛒 Bán hàng & Thanh toán
- Tạo đơn bán hàng  
- Thanh toán tiền mặt / chuyển khoản (mô phỏng)  
- Tự động tính tổng tiền và thuế (VAT)

### 🧾 Hóa đơn
- Lập hóa đơn sau thanh toán  
- Không cho chỉnh sửa hóa đơn đã hoàn tất  
- Xem lịch sử bán hàng

---


---

## 🚀 Hướng dẫn cài đặt

### 1️⃣ Clone dự án
```bash
git clone https://github.com/lmv2004/QuanLySieuThiMini.git
cd QuanLySieuThiMini
```

### 2️⃣ Cài đặt thư viện
```bash
# Nếu bạn chưa cài đặt PHP thì hãy chạy lệnh sau với quyền ADMIN
# Run as administrator...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
# Run in terminal
composer global require laravel/installer
```

### 3️⃣ Cấu hình môi trường
```bash
cp .env.example .env
php artisan key:generate
```

Cập nhật thông tin database trong file `.env`.

### 4️⃣ Chạy migrate
```bash
php artisan migrate --seed
```

### 5️⃣ Chạy dự án
```bash
#Frontend
cd client
npm install
npm run dev

#Backend
php artisan serve
```

```
Frontend running at: http://localhost:5173
Backend running at: http://localhost:8000


---

## 📜 Cơ sở pháp lý (tham khảo)
- Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân
- Quy định về Hóa đơn điện tử & Thuế
- Quy định về trung gian thanh toán
- Luật Bảo vệ quyền lợi người tiêu dùng
- Quản lý hàng hóa hạn chế kinh doanh

> Hệ thống chỉ mô phỏng nghiệp vụ, **không kết nối hệ thống thuế thực tế**.

---

## 👨‍💻 Tác giả
- **Lmv2004**
- Dự án học phần / đồ án môn học

---

## ⚠️ Lưu ý
- Dự án phục vụ **mục đích học tập**
- Không khuyến nghị sử dụng cho môi trường sản xuất

---

## 📄 License
This project is licensed for educational purposes only.
