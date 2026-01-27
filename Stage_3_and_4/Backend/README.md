🥗 E-Menu System - Professional Backend API
E-Menu Backend is a robust, modular RESTful API designed for modern restaurant management. It powers the E-Menu ecosystem by handling high-concurrency ordering, real-time kitchen management, and geofenced security checks.
📑 Table of Contents
✨ Key Features
🏗️ Architecture & Modules
⚙️ Installation & Setup
Docker Setup (Recommended)
Manual Setup
🔑 Environment Variables
📡 API Documentation & Examples
🛡️ Security Logic (Geofencing)
📦 Deployment Guide
🐞 Troubleshooting
✨ Key Features
📍 GPS Geofencing: Prevents spam orders by verifying customer location (Haversine formula). Only allows orders within a 150m radius.
🛒 Smart Order Aggregation: Automatically groups identical items in an order (e.g., "Beer x3" instead of 3 rows), providing a clean receipt view.
🖼️ Flexible Media Handling: Serves relative image paths to prevent Mixed Content errors behind Reverse Proxies (Ngrok/Nginx).
📊 Real-time Analytics: Dashboard APIs for daily revenue, best-selling items, and table occupancy status.
🔐 Role-Based Access Control (RBAC): JWT Authentication separating Customer, Staff, and Admin permissions.
🏗️ Architecture & Modules
The project follows a Modular Monolith pattern for maintainability:

Plaintext


EMENU/
├── models/             # Database Schemas
│   ├── core.py         # Users, Menu (Categories, Items)
│   ├── order.py        # Tables, Orders, OrderItems (Transaction Logic)
│   └── manage.py       # Revenue, Bookings, Notifications
├── views/              # Business Logic Controllers
│   ├── order_views.py  # Handles Order Creation & GPS Check
│   └── ...
├── serializers/        # Data Validation & Transformation
│   ├── order_ser.py    # Custom logic to aggregate order items
│   └── core_ser.py     # Image URL processing
└── ...


⚙️ Installation & Setup
Docker Setup (Recommended)
Clone the repository:
Bash
git clone <your-repo-url>
cd Backend


Start Services:
Bash
docker-compose up --build


Backend: http://localhost:8000
Database: localhost:3307 (Mapped from internal 3306)
Run Migrations (First time only):
Bash
docker-compose exec backend python manage.py migrate


Manual Setup
Create Virtual Environment:
Bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate


Install Dependencies:
Bash
pip install -r requirements.txt


Configure Database:
Update settings.py or set environment variables to connect to your local MySQL.
Run Server:
Bash
python manage.py runserver


🔑 Environment Variables
Create a .env file (if using python-dotenv) or ensure these variables are set in docker-compose.yml:
Variable
Default
Description
DB_NAME
emenu
Database Name
DB_USER
root
Database Username
DB_PASSWORD
(empty)
Database Password
DB_HOST
127.0.0.1
DB Host (db if inside Docker)
DB_PORT
3306
Database Port
DEBUG
True
Set to False in Production
SECRET_KEY
(django-insecure...)
Change this in Production!

📡 API Documentation & Examples
1. Create Order (The most complex endpoint)
Endpoint: POST /api/orders/create/
Description: Creates a new order or updates an existing pending order for a table. Requires GPS coordinates.
Request Body (JSON):

JSON


{
  "table_id": 5,
  "lat": 10.824225, 
  "lon": 106.719581,
  "items": [
    { "id": 101, "quantity": 2, "note": "Cold" },
    { "id": 205, "quantity": 1, "note": "" }
  ]
}


Response (201 Created):

JSON


{
  "id": 12,
  "tableNumber": "5",
  "status": "pending",
  "total": 150000,
  "items": [
    { "name": "Heineken", "quantity": 2, "price": 50000 },
    { "name": "French Fries", "quantity": 1, "price": 50000 }
  ]
}


2. Dashboard Stats
Endpoint: GET /api/dashboard/stats/?range=today
Description: Returns aggregated revenue and best-selling items.
🛡️ Security Logic (Geofencing)
The system enforces location checks in views/order_views.py.
Logic: Haversine(Shop_Coords, User_Coords)
Threshold: Max 150 meters.
⚠️ Development Note:
Currently, the code includes a Bypass Mechanism for HTTP testing:
Python
if not user_lat: user_lat = SHOP_LAT # Auto-bypass
ACTION REQUIRED: Remove lines 120-125 in order_views.py before deploying to Production to enable real security.
📦 Deployment Guide
Serving Static/Media Files
Django's runserver serves media files only in DEBUG=True mode.
For production (Docker/VPS):
Nginx: Configure Nginx to serve /app/media directly.
WhiteNoise: Install for static files (CSS/JS).
Volume Mapping: Always map ./media:/app/media in Docker to persist user-uploaded food images.
HTTPS Requirement
The frontend Geolocation API requires HTTPS.
Local: Use standard http://localhost.
Network/Internet: You MUST use SSL (via Ngrok, Let's Encrypt, or Cloudflare).
🐞 Troubleshooting
Issue
Cause
Solution
GPS Error 403
Coordinates > 150m or missing.
Check frontend permission. Update MAX_DISTANCE in order_views.py.
Image 404
Docker container restarted without Volume.
Ensure volumes: - ./media:/app/media is in docker-compose.yml.
DB Connection Refused
Backend starts before MySQL is ready.
Use restart: on-failure in Docker Compose or wait 10s.

👨‍💻 Maintainers
Project Lead: [Nguyen Van Truong]
Contact: [xtrng73@gmail.com]
