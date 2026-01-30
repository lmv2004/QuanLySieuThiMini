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
- Phân quyền (Admin / Nhân viên)

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

## 🗄️ Cấu trúc thư mục chính
```
├── app/
│   ├── Models/
│   ├── Http/Controllers/
├── resources/
│   ├── views/        # Blade templates
│   ├── js/           # Vite assets
├── routes/
│   ├── web.php
│   ├── api.php
├── database/
│   ├── migrations/
```

---

## 🚀 Hướng dẫn cài đặt

### 1️⃣ Clone dự án
```bash
git clone https://github.com/lmv2004/QuanLySieuThiMini.git
cd QuanLySieuThiMini
```

### 2️⃣ Cài đặt thư viện
```bash
composer install
npm install
```

### 3️⃣ Cấu hình môi trường
```bash
cp .env.example .env
php artisan key:generate
```

Cập nhật thông tin database trong file `.env`.

### 4️⃣ Chạy migrate
```bash
php artisan migrate
```

### 5️⃣ Chạy dự án
```bash
php artisan serve
npm run dev
```

- Laravel: http://localhost:8000  
- Vite: http://localhost:5173  

---

## 📜 Cơ sở pháp lý (tham khảo)
- Luật Quản lý thuế Việt Nam 2019  
- Nghị định 123/2020/NĐ-CP về hóa đơn điện tử  
- Luật Kế toán 2015  

> Hệ thống chỉ mô phỏng nghiệp vụ, **không kết nối hệ thống thuế thực tế**.

---

## 👨‍💻 Tác giả
- **Llmv2004**
- Dự án học phần / đồ án môn học

---

## ⚠️ Lưu ý
- Dự án phục vụ **mục đích học tập**
- Không khuyến nghị sử dụng cho môi trường sản xuất

---

## 📄 License
This project is licensed for educational purposes only.
