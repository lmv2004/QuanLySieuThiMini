# Quản Lý Siêu Thị Mini - Client

Frontend application cho hệ thống Quản Lý Siêu Thị Mini, xây dựng với React + Vite.

## 🚀 Cấu trúc dự án

```
client/
├── public/                  # Static files
├── src/
│   ├── assets/             # Images, icons, styles
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/         # Reusable components
│   │   ├── common/         # Generic components (Button, Input, Modal, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   │   └── forms/          # Form components
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── Auth/           # Login, Register
│   │   ├── Dashboard/      # Dashboard
│   │   ├── Products/       # Quản lý sản phẩm
│   │   ├── Categories/     # Loại sản phẩm
│   │   ├── Inventory/      # Tồn kho
│   │   ├── Sales/          # Bán hàng
│   │   ├── Customers/      # Khách hàng
│   │   ├── Suppliers/      # Nhà cung cấp
│   │   ├── Employees/      # Nhân viên
│   │   ├── Imports/        # Phiếu nhập
│   │   ├── Disposal/       # Phiếu hủy
│   │   ├── Promotions/     # Giảm giá & Voucher
│   │   └── Reports/        # Báo cáo
│   │
│   ├── config/             # Configuration files
│   │   ├── constants.js    # App constants
│   │   ├── routes.js       # Route paths
│   │   └── api.config.js   # API endpoints
│   │
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js  # Authentication service
│   │   └── productService.js
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   │
│   ├── store/              # State management (tùy chọn)
│   │
│   ├── utils/              # Utility functions
│   │   ├── formatters.js   # Format currency, date, etc.
│   │   ├── validators.js   # Form validation
│   │   └── helpers.js
│   │
│   ├── styles/             # Global styles
│   │
│   ├── routes/             # Route configuration
│   │   ├── index.jsx       # Main router
│   │   ├── PrivateRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
│
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
├── package.json
└── vite.config.js
```

## 📦 Dependencies đã cài đặt

### Core
- **React 19.2.0** - UI Library
- **React DOM 19.2.0** - React rendering
- **Vite 7.2.4** - Build tool

### Routing & HTTP
- **react-router-dom** - Client-side routing
- **axios** - HTTP client

## 🛠️ Cài đặt

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install
```

## 🚀 Chạy ứng dụng

```bash
# Development mode (cổng 5173)
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Environment Variables

Tạo file `.env.development` và `.env.production` với các biến sau:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📝 Hướng dẫn phát triển

### 1. Tạo Component mới

```jsx
// src/components/common/ComponentName/ComponentName.jsx
import React from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### 2. Tạo Page mới

```jsx
// src/pages/PageName/PageName.jsx
import React from 'react';

const PageName = () => {
  return (
    <div>
      <h1>Page Title</h1>
      {/* Page content */}
    </div>
  );
};

export default PageName;
```

### 3. Tạo Service mới

```javascript
// src/services/exampleService.js
import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const exampleService = {
  getAll: async (params) => {
    return await api.get(API_ENDPOINTS.EXAMPLE.LIST, { params });
  },
  
  getById: async (id) => {
    return await api.get(API_ENDPOINTS.EXAMPLE.DETAIL(id));
  },
  
  create: async (data) => {
    return await api.post(API_ENDPOINTS.EXAMPLE.CREATE, data);
  },
  
  update: async (id, data) => {
    return await api.put(API_ENDPOINTS.EXAMPLE.UPDATE(id), data);
  },
  
  delete: async (id) => {
    return await api.delete(API_ENDPOINTS.EXAMPLE.DELETE(id));
  },
};

export default exampleService;
```

### 4. Tạo Custom Hook

```javascript
// src/hooks/useCustomHook.js
import { useState, useEffect } from 'react';

export const useCustomHook = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Logic
  }, []);
  
  return { state, setState };
};
```

## 📚 Các thư viện nên cài thêm

```bash
# State Management
npm install zustand
# hoặc
npm install @reduxjs/toolkit react-redux

# Form Handling
npm install react-hook-form
npm install zod  # Validation schema

# UI Library (tùy chọn)
npm install antd
# hoặc
npm install @mui/material @emotion/react @emotion/styled

# Date utilities
npm install date-fns

# Charts (cho báo cáo)
npm install recharts

# HTTP Query
npm install @tanstack/react-query
```

## 🎨 Coding Standards

### Naming Conventions
- **Components**: PascalCase (VD: `ProductList.jsx`)
- **Hooks**: camelCase với prefix `use` (VD: `useAuth.js`)
- **Services**: camelCase với suffix `Service` (VD: `productService.js`)
- **Utils**: camelCase (VD: `formatters.js`)
- **Constants**: UPPER_SNAKE_CASE (VD: `API_BASE_URL`)

### File Structure
- Mỗi component nên có thư mục riêng với file `.jsx`, `.css`, và `index.js`
- Pages có thể đơn giản hơn, chỉ cần file `.jsx` và `.css`

### Import Order
```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { useNavigate } from 'react-router-dom';

// 3. Internal imports
import { API_ENDPOINTS } from '../config/api.config';
import productService from '../services/productService';

// 4. Component imports
import Button from '../components/common/Button';

// 5. Styles
import './ComponentName.css';
```

## 🔐 Authentication Flow

1. User đăng nhập tại `/login`
2. Server trả về `access_token` và `refresh_token`
3. Token được lưu vào `localStorage`
4. Mọi request sau đó đều gửi kèm token trong header
5. Nếu token hết hạn, tự động refresh token
6. Nếu refresh thất bại, redirect về `/login`

## 🗺️ Routes

- **Public Routes** (không cần đăng nhập):
  - `/login` - Đăng nhập

- **Private Routes** (cần đăng nhập):
  - `/` - Dashboard
  - `/products` - Danh sách sản phẩm
  - `/categories` - Loại sản phẩm
  - `/inventory` - Tồn kho
  - `/sales/pos` - Điểm bán hàng
  - `/sales/invoices` - Danh sách hóa đơn
  - `/customers` - Khách hàng
  - `/suppliers` - Nhà cung cấp
  - `/employees` - Nhân viên
  - `/imports` - Phiếu nhập
  - `/disposal` - Phiếu hủy
  - `/promotions/vouchers` - Voucher
  - `/promotions/discounts` - Giảm giá
  - `/reports/*` - Các báo cáo

## 🐛 Debugging

- Sử dụng React DevTools
- Kiểm tra Network tab trong DevTools để xem API calls
- Xem Console để check errors và warnings

## 📄 License

MIT
