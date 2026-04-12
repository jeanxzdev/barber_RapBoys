# RapBoys Barber Shop - eCommerce Modular MVP

This is a full-stack eCommerce application for the brand RapBoys, focus on security, anti-spam, and professional aesthetics.

## 🚀 How to Run

### Prerequisites
- Docker & Docker Compose
- Windows / Linux / MacOS

### Installation

1. **Clone the repository** (if you haven't already).
2. **Start the containers**:
   ```bash
   docker-compose up --build
   ```
3. **Run Migrations (Backend)**:
   Open a new terminal and run:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
4. **Create Superuser (Admin Panel)**:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Accessing the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

---

## 🎨 Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Axios, Framer Motion, Lucide Icons.
- **Backend**: Django, Django REST Framework, JWT Auth.
- **Database**: MySQL 8.0.
- **Security**: Modular Anti-Fraud (OTP, Rate limiting).

---

## 🔒 Key Features Implemented

### 1. Unified Modular Backend
Organized into `users`, `products`, `orders`, `payments`, and `anti_fraud`.

### 2. Anti-Spam & Fraud Prevention
- **OTP Verification**: Mandatory before any order is created.
- **Rate Limiting**: Max 3 OTP requests and 3 orders per phone per hour.
- **Pending Order Limit**: Max 2 active pending orders per user to prevent spam.
- **Phone Validation**: Peruvian format (9 digits, starts with 9).

### 3. Yape Payment Flow
- Manual payment proof upload system.
- QR code display after order creation.
- Status tracking: `pending_payment` -> `paid` (after admin check).

### 4. Urban Aesthetics
- Dark mode theme with blue accents.
- Responsive design.
- Premium interactions and layout.

---

## 📦 Deliverables
- [x] Backend API Structure
- [x] Database Models
- [x] OTP Verification Middleware
- [x] Frontend Core Pages
- [x] Docker Containerization
- [x] Admin Panel Integration
