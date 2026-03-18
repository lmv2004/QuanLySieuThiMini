# API Endpoints Reference by Role

## 🔐 Authentication Endpoints (Public)

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/auth/login` | ❌ No | Login user |
| POST | `/api/auth/logout` | ✅ Yes | Logout user |
| GET | `/api/auth/me` | ✅ Yes | Get current user info |
| POST | `/api/auth/register` | ❌ No | Register new account |
| POST | `/api/auth/forgot-password` | ❌ No | Request password reset |
| POST | `/api/auth/reset-password` | ❌ No | Reset password |

---

## 👔 Manager Endpoints (`role:manager`)

Quản lý viên có truy cập toàn bộ hệ thống.

### 👥 Quản lý Nhân viên
```
GET    /api/employees          - Danh sách nhân viên
POST   /api/employees          - Tạo nhân viên
GET    /api/employees/{id}     - Chi tiết nhân viên
PUT    /api/employees/{id}     - Cập nhật nhân viên
DELETE /api/employees/{id}     - Xóa nhân viên
```

### 🏭 Quản lý Nhà cung cấp
```
GET    /api/suppliers          - Danh sách nhà cung cấp
POST   /api/suppliers          - Tạo nhà cung cấp
GET    /api/suppliers/{id}     - Chi tiết nhà cung cấp
PUT    /api/suppliers/{id}     - Cập nhật nhà cung cấp
DELETE /api/suppliers/{id}     - Xóa nhà cung cấp
```

### 📦 Quản lý Sản phẩm
```
GET    /api/products           - Danh sách sản phẩm
POST   /api/products           - Tạo sản phẩm
GET    /api/products/{id}      - Chi tiết sản phẩm
PUT    /api/products/{id}      - Cập nhật sản phẩm (giá, VAT)
DELETE /api/products/{id}      - Xóa sản phẩm

GET    /api/categories         - Danh sách loại sản phẩm
POST   /api/categories         - Tạo loại sản phẩm
GET    /api/categories/{id}    - Chi tiết loại
PUT    /api/categories/{id}    - Cập nhật loại
DELETE /api/categories/{id}    - Xóa loại

GET    /api/discounts          - Danh sách giảm giá
POST   /api/discounts          - Tạo khuyến mại
GET    /api/discounts/{id}     - Chi tiết khuyến mại
PUT    /api/discounts/{id}     - Cập nhật khuyến mại
DELETE /api/discounts/{id}     - Xóa khuyến mại
```

### 📋 Phiếu Nhập/Hủy
```
GET    /api/purchase-orders           - Danh sách phiếu nhập
POST   /api/purchase-orders           - Tạo phiếu nhập
GET    /api/purchase-orders/{id}      - Chi tiết phiếu nhập
PUT    /api/purchase-orders/{id}      - Cập nhật/Duyệt phiếu nhập
DELETE /api/purchase-orders/{id}      - Hủy phiếu nhập

GET    /api/disposal-slips            - Danh sách phiếu hủy
POST   /api/disposal-slips            - Tạo phiếu hủy
GET    /api/disposal-slips/{id}       - Chi tiết phiếu hủy
PUT    /api/disposal-slips/{id}       - Cập nhật/Duyệt phiếu hủy
DELETE /api/disposal-slips/{id}       - Hủy phiếu hủy

GET    /api/ct-phieu-nhaps            - Chi tiết các phiếu nhập
POST   /api/ct-phieu-nhaps            - Thêm chi tiết phiếu nhập
GET    /api/ct-phieu-nhaps/{ma}/{sp}  - Chi tiết một dòng
PUT    /api/ct-phieu-nhaps/{ma}/{sp}  - Cập nhật chi tiết
DELETE /api/ct-phieu-nhaps/{ma}/{sp}  - Xóa chi tiết

GET    /api/ct-phieu-huys             - Chi tiết các phiếu hủy
POST   /api/ct-phieu-huys             - Thêm chi tiết phiếu hủy
GET    /api/ct-phieu-huys/{ma}/{sp}   - Chi tiết một dòng
PUT    /api/ct-phieu-huys/{ma}/{sp}   - Cập nhật chi tiết
DELETE /api/ct-phieu-huys/{ma}/{sp}   - Xóa chi tiết
```

### 📊 Báo cáo & Tồn kho
```
GET    /api/inventories        - Xem tồn kho
GET    /api/inventories/{id}   - Chi tiết tồn kho
```

### 🎫 Khác
```
GET    /api/positions          - Danh sách chức vụ
POST   /api/positions          - Tạo chức vụ
GET    /api/positions/{id}     - Chi tiết chức vụ
PUT    /api/positions/{id}     - Cập nhật chức vụ
DELETE /api/positions/{id}     - Xóa chức vụ

GET    /api/accounts           - Danh sách tài khoản
POST   /api/accounts           - Tạo tài khoản
GET    /api/accounts/{id}      - Chi tiết tài khoản
PUT    /api/accounts/{id}      - Cập nhật tài khoản
DELETE /api/accounts/{id}      - Xóa tài khoản

GET    /api/vouchers           - Danh sách mã voucher
POST   /api/vouchers           - Tạo voucher
GET    /api/vouchers/{id}      - Chi tiết voucher
PUT    /api/vouchers/{id}      - Cập nhật voucher
DELETE /api/vouchers/{id}      - Xóa voucher

GET    /api/customers          - Danh sách khách hàng
POST   /api/customers          - Tạo khách hàng
GET    /api/customers/{id}     - Chi tiết khách hàng
PUT    /api/customers/{id}     - Cập nhật khách hàng
DELETE /api/customers/{id}     - Xóa khách hàng
```

---

## 💳 Cashier Endpoints (`role:cashier`)

Nhân viên thu ngân - xử lý giao dịch bán hàng.

### 🛒 Quản lý Đơn hàng/Hóa đơn
```
GET    /api/invoices           - Danh sách hóa đơn
POST   /api/invoices           - Tạo hóa đơn (đơn hàng)
GET    /api/invoices/{id}      - Chi tiết hóa đơn
PUT    /api/invoices/{id}      - Cập nhật hóa đơn (thanh toán, cập nhật)
DELETE /api/invoices/{id}      - Hủy hóa đơn (nếu chưa thanh toán)

GET    /api/ct-hoa-dons        - Chi tiết tất cả hóa đơn
POST   /api/ct-hoa-dons        - Thêm sản phẩm vào hóa đơn
GET    /api/ct-hoa-dons/{mahd}/{masp}/{tonkho}  - Chi tiết một dòng hóa đơn
PUT    /api/ct-hoa-dons/{mahd}/{masp}/{tonkho}  - Cập nhật chi tiết hóa đơn
DELETE /api/ct-hoa-dons/{mahd}/{masp}/{tonkho}  - Xóa dòng hóa đơn
```

### 📦 Xem Tồn kho
```
GET    /api/inventories        - Xem tồn kho sản phẩm (báo groomsman khách hàng)
GET    /api/inventories/{id}   - Chi tiết tồn kho một sản phẩm
```

### 🎫 Khác
```
GET    /api/vouchers           - Xem danh sách voucher có sẵn
GET    /api/vouchers/{id}      - Chi tiết một voucher

GET    /api/customers          - Xem danh sách khách hàng
GET    /api/customers/{id}     - Chi tiết khách hàng
```

---

## 📦 Warehouse Endpoints (`role:warehouse`)

Nhân viên kho - quản lý hàng tồn kho.

### 📊 Xem Tồn kho
```
GET    /api/inventories        - Xem trạng thái hàng tồn kho
GET    /api/inventories/{id}   - Chi tiết tồn kho một sản phẩm
```

### 📥 Tạo Đơn Nhập hàng
```
GET    /api/purchase-orders    - Danh sách phiếu nhập
POST   /api/purchase-orders    - Tạo phiếu nhập hàng
GET    /api/purchase-orders/{id} - Chi tiết phiếu nhập
PUT    /api/purchase-orders/{id} - Cập nhật phiếu nhập
DELETE /api/purchase-orders/{id} - Xóa phiếu nhập chưa duyệt

GET    /api/ct-phieu-nhaps     - Chi tiết các phiếu nhập
POST   /api/ct-phieu-nhaps     - Thêm sản phẩm vào phiếu nhập
GET    /api/ct-phieu-nhaps/{ma}/{sp} - Chi tiết một dòng
PUT    /api/ct-phieu-nhaps/{ma}/{sp} - Cập nhật chi tiết
DELETE /api/ct-phieu-nhaps/{ma}/{sp} - Xóa chi tiết
```

### 🗑️ Tạo Đơn Hủy hàng
```
GET    /api/disposal-slips     - Danh sách phiếu hủy
POST   /api/disposal-slips     - Tạo phiếu hủy (hết HSD, hư hỏng)
GET    /api/disposal-slips/{id} - Chi tiết phiếu hủy
PUT    /api/disposal-slips/{id} - Cập nhật phiếu hủy
DELETE /api/disposal-slips/{id} - Xóa phiếu hủy chưa duyệt

GET    /api/ct-phieu-huys      - Chi tiết các phiếu hủy
POST   /api/ct-phieu-huys      - Thêm sản phẩm vào phiếu hủy
GET    /api/ct-phieu-huys/{ma}/{sp} - Chi tiết một dòng
PUT    /api/ct-phieu-huys/{ma}/{sp} - Cập nhật chi tiết
DELETE /api/ct-phieu-huys/{ma}/{sp} - Xóa chi tiết
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
    "message": "Chưa xác thực"
}
```
**Nguyên nhân:** Không gửi token hoặc token hết hạn
**Giải pháp:** Gửi header `Authorization: Bearer {token}`

### 403 Forbidden (Role)
```json
{
    "message": "Bạn không có quyền truy cập tài nguyên này"
}
```
**Nguyên nhân:** Vai trò không khớp
**Giải pháp:** Đăng nhập với tài khoản có vai trò phù hợp

### 403 Forbidden (Permission)
```json
{
    "message": "Bạn không có quyền thực hiện hành động này",
    "required_permission": "manage_employees"
}
```
**Nguyên nhân:** Không có quyền thực hiện hành động
**Giải pháp:** Kiểm tra role của user

---

## 📝 Request Headers

Tất cả request (ngoại trừ auth) cần header:
```
Authorization: Bearer {token_từ_login}
Content-Type: application/json
```

---

## 🧪 Testing Tips

### Curl Example - Manager
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager1","password":"password"}' | jq '.token')

# Access manager route
curl -X GET http://localhost:8000/api/employees \
  -H "Authorization: Bearer $TOKEN"
```

### Curl Example - Cashier
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cashier1","password":"password"}' | jq '.token')

# Try to access manager-only route (should get 403)
curl -X GET http://localhost:8000/api/employees \
  -H "Authorization: Bearer $TOKEN"

# Access cashier route (should work)
curl -X GET http://localhost:8000/api/invoices \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔑 Quick Reference

| Role | Can Create Invoice | Can Manage Products | Can Create Purchase Order | Can See Reports |
|------|:------------------:|:------------------:|:------------------------:|:----------------:|
| Cashier | ✅ | ❌ | ❌ | ❌ |
| Warehouse | ❌ | ❌ | ✅ | ❌ |
| Manager | ✅ | ✅ | ✅ | ✅ |
