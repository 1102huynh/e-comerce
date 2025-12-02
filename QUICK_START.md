# 🚀 Quick Start Guide

## Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- npm or yarn

## Backend Setup (5 minutes)

### 1. Build Backend
```bash
./mvnw clean install
```

### 2. Run Backend
```bash
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

## Frontend Setup (5 minutes)

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Demo Accounts

### Admin
- Email: admin@example.com
- Password: admin123

### User
- Email: user@example.com
- Password: user123

## Key Features to Try

1. **Browse Products** - Go to /products
2. **Search & Filter** - Use search, sort, and category filters
3. **Pagination** - Navigate through pages (12 items per page)
4. **Add to Cart** - Click on products to view details and add to cart
5. **Checkout** - Try different payment methods based on region
6. **Admin Dashboard** - Login as admin to manage products, categories, orders
7. **Orders** - View your order history with detailed breakdown

## Troubleshooting

### Port Already in Use
If port 8080 (backend) or 3000 (frontend) is in use:

**Backend:** Edit `application.properties` and change `server.port=8080` to another port

**Frontend:** Run with `PORT=3001 npm run dev`

### Dependencies Issues
If Maven dependencies fail:
```bash
./mvnw clean install -U
```

If npm dependencies fail:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read [ENHANCEMENT_SUMMARY.md](./frontend/ENHANCEMENT_SUMMARY.md) for UI/UX details
- Check [IMPLEMENTATION_GUIDE.md](./frontend/IMPLEMENTATION_GUIDE.md) for technical details
- Review API endpoints in main README.md

---

**That's it! You're ready to go!** 🎉
