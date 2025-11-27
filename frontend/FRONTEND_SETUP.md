# Frontend Setup & Configuration

## Prerequisites
- Node.js 18 or higher
- npm or yarn

## Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Homepage
│   ├── login/page.tsx       # Login page
│   ├── register/page.tsx    # Registration page
│   ├── products/
│   │   ├── page.tsx          # Products list with pagination
│   │   └── [id]/page.tsx     # Product detail
│   ├── cart/page.tsx       # Shopping cart
│   ├── checkout/page.tsx   # Checkout with payments
│   ├── orders/page.tsx     # Order history
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── products/page.tsx
│   │   ├── categories/page.tsx
│   │   └── orders/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx         # Navigation bar
│   └── ProductCard.tsx    # Product card component
├── lib/
│   └── api.ts            # API client with interceptors
├── store/
│   ├── authStore.ts      # Authentication state
│   └── cartStore.ts      # Shopping cart state
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.ts
```

## Technologies Used

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **UI:** Responsive & Professional Design

## Key Features

- ✅ **Authentication** - JWT-based login/register
- ✅ **Product Browsing** - Search, filter, sort, pagination
- ✅ **Shopping Cart** - Add/remove items, calculate totals
- ✅ **Checkout** - Region-based payments, automatic deduction
- ✅ **Order Management** - View order history with details
- ✅ **Admin Panel** - Manage products, categories, orders
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Professional UI** - Modern design with smooth animations

## API Integration

The frontend communicates with backend API at:
```
http://localhost:8080/api
```

### Key API Features:
- JWT authentication with automatic token refresh
- Automatic 401 handling (redirects to login)
- Request/response interceptors
- Error handling with user feedback

## Performance Optimizations

- ✅ Code splitting with Next.js
- ✅ Image optimization
- ✅ Debounced search (500ms)
- ✅ Efficient state management with Zustand
- ✅ Memoization for expensive components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### API Connection Error
- Ensure backend is running on port 8080
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and restart dev server

### Build Errors
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Port 3000 Already in Use
```bash
PORT=3001 npm run dev
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:8080/api | Backend API URL |

---

**Status:** ✅ Ready for development and production
