# 🛍️ E-Commerce Platform

> A modern, professional e-commerce application with advanced features including region-based payment methods, automatic payment processing, and comprehensive order management.

## ✨ Features

### 🛒 Customer Features
- **User Authentication**
  - Registration with progress tracking
  - Secure login with "Remember Me" option
  - JWT-based authentication

- **Product Browsing**
  - Advanced search with debouncing (500ms)
  - Category filtering
  - Multiple sort options (newest, price, popular)
  - Grid and List view toggle
  - **Pagination (12 items per page)** with smart page calculation
  - Related products display

- **Shopping Cart**
  - Add/remove items
  - Quantity adjustment
  - Order summary with pricing breakdown
  - Sticky cart sidebar

- **Checkout & Payments**
  - Region selection (Vietnam & Europe)
  - **Region-specific payment methods:**
    - **Vietnam:** COD, Momo, Bank Transfer, Mastercard/Visa
    - **Europe:** Bank Transfer, Mastercard/Visa, PayPal
  - **Automatic payment processing** for digital methods (Momo, Card, PayPal)
  - Real-time validation for shipping address and phone number
  - Order summary with tax (10%) and smart shipping (free over $50)
  - **Detailed invoice sent to email after order**

- **Order Management**
  - View all orders with detailed breakdown
  - Order statistics (total, delivered, in progress, total spent)
  - Order items grid with pricing
  - Region and payment method display
  - Invoice confirmation
  - Shipping details display

### ⚙️ Admin Features
- **Dashboard**
  - Quick statistics (total products, orders, categories, pending)
  - Quick action buttons
  - Admin navigation

- **Product Management**
  - Create, Read, Update, Delete products
  - Category assignment
  - Stock management

- **Category Management**
  - Create, Read, Update, Delete categories
  - Category organization

- **Order Management**
  - View all orders
  - Update order status
  - Order details

### 🎨 UI/UX Features
- **Modern Design**
  - Professional black/gray/white color scheme
  - Gradient backgrounds
  - Smooth animations and transitions
  - Professional shadows and borders

- **Responsive Design**
  - Mobile-first approach
  - Fully responsive on all screen sizes
  - Mobile hamburger menu in navbar
  - Touch-friendly buttons

## 🏗️ Technology Stack

### Backend
- Java 17
- Spring Boot 3.0+
- Spring Security with JWT
- Spring Data JPA
- H2 Database / MySQL
- Maven

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand for state management
- Axios for API
- React Hot Toast for notifications

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 10 minutes
- [Features List](./FEATURES.md) - Complete feature documentation
- [Frontend Enhancements](./frontend/ENHANCEMENT_SUMMARY.md) - UI/UX details

## 🚀 Quick Start

### Backend
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔓 Demo Accounts

**Admin:** admin@example.com / admin123
**User:** user@example.com / user123

## 🌍 Supported Regions

- **Vietnam:** COD, Momo, Bank Transfer, Mastercard/Visa
- **Europe:** Bank Transfer, Mastercard/Visa, PayPal

## 💳 Payment Methods

- Momo (Automatic deduction)
- Mastercard/Visa (Automatic charging)
- PayPal (Automatic deduction)
- Bank Transfer (Manual)
- COD (On delivery)

## ✅ Status

🎉 **PRODUCTION READY** - All features implemented and tested

---

**Last Updated:** November 27, 2025
