# Frontend - Restaurant Management System

The Frontend project is built using **ReactJS** on the **Vite** platform, focusing on providing a fast ordering experience and effective restaurant management.

## 📂 Source Code Structure

The source code is located in the `src/` directory and is organized according to a layered architecture as follows:

```text
src/
├── 📂 assets/              # Static assets
│   └── 📂 images/          # Food images, banners, system icons.
│
├── 📂 Components/          # Reusable UI components
│   ├── 📂 Admin/           # Widgets specifically for the admin page (Statistical charts, Input forms...).
│   └── 📂 Order/           # Widgets serving the ordering process (Food cards, Add to cart buttons...).
│
├── 📂 config/
│   └── 📄 api.js           # Axios Client configuration, Base URL for connecting to the Django Backend.
│
├── 📂 hooks/               # Custom Hooks (Separated business logic)
│   ├── 📄 useCart.js           # Cart management logic: add/edit/delete items, calculate total.
│   ├── 📄 useProducts.js       # Logic to fetch food list from API/Mock data.
│   ├── 📄 useProductManager.js # CRUD logic for food items (Admin).
│   └── 📄 useTable.js          # Table status management logic (Empty, Occupied, Reserved).
│
├── 📂 layouts/             # Page Layouts
│   ├── 📄 AdminLayout.jsx  # Admin interface layout (with fixed Sidebar, Header).
│   └── 📄 AdminLayout.css  # Styles specifically for the Admin layout.
│
├── 📂 pages/               # Main View Pages
│   ├── 📂 Admin/           # Dashboard, Menu Management, Staff Management pages.
│   ├── 📂 Staff/           # Staff pages (View table map, Confirm orders).
│   ├── 📂 Client/          # Pages for customers at the table (Scan QR, Order food).
│   ├── 📂 Visitor/         # Pages for walk-in/online visitors (View Menu, Book table).
│   └── 📂 Auth/            # Login and Registration pages.
│
├── 📂 services/            # API Service Layer
│   ├── 📄 adminService.js    # System administration APIs.
│   ├── 📄 bookingService.js  # APIs related to table booking.
│   ├── 📄 employeeService.js # Employee management APIs.
│   ├── 📄 menuService.js     # APIs to fetch menu and categories.
│   ├── 📄 orderService.js    # APIs to submit orders, update order status.
│   └── 📄 tableService.js    # APIs to fetch the table map.
│
├── 📄 App.jsx              # Root component, contains Routing (React Router).
├── 📄 main.jsx             # Application entry point.
└── 📄 mockData.js          # Mock data used for UI testing without Backend.
```

## 🛠 Installation & Development Guide

### 1. Environment Requirements

- Node.js (Recommended version 16+ or 18 LTS)
- NPM or Yarn

### 2. Install Dependencies

In the `Frontend` directory, run the command:

```bash
npm install
```

### 3. Run Development Environment (Dev)

```bash
npm run dev
```

The application will run at: `http://localhost:5173` (or another port if 5173 is occupied).

### 4. Build for Production

To create a build for the production environment:

```bash
npm run build
```

## 🔗 Backend Connection

- API configuration is located in the `src/config/api.js` file.
- Ensure the Backend (Django) is running (default port 8000) before performing ordering or login functions.
