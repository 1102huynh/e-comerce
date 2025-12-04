# Image Gallery - Quick Start Guide

## 🚀 Quick Start

### Step 1: Start the Backend
```bash
cd D:\practices\e-comerce
mvn spring-boot:run
```
Wait for the message: "Sample data initialized successfully!"

### Step 2: Start the Frontend
```bash
cd D:\practices\e-comerce\frontend
npm run dev
```
Open browser at: http://localhost:3000

### Step 3: Test the Gallery

#### Option A: Direct Product Links
Navigate to any of these products with galleries:
- http://localhost:3000/products/1 (Classic Black Baseball Cap)
- http://localhost:3000/products/2 (Urban Streetwear Snapback)
- http://localhost:3000/products/3 (Vintage Trucker Hat)
- http://localhost:3000/products/4 (Cozy Knit Beanie)
- http://localhost:3000/products/5 (Summer Bucket Hat)
- http://localhost:3000/products/6 (Classic Wool Fedora)

#### Option B: Browse from Homepage
1. Go to http://localhost:3000
2. Click "Shop Now" or "Browse Products"
3. Click on any of the first 12 products
4. View the image gallery

## ✅ Testing Checklist

### Visual Tests
- [ ] Main image displays correctly
- [ ] 4 thumbnail images appear below main image
- [ ] Left arrow button (‹) visible on left side
- [ ] Right arrow button (›) visible on right side
- [ ] 4 dot indicators visible at bottom of main image
- [ ] Active dot is elongated (━)
- [ ] Inactive dots are circular (•)

### Interaction Tests

#### Button Navigation
- [ ] Click right arrow → next image shows
- [ ] Click left arrow → previous image shows
- [ ] Click right on last image → loops to first image
- [ ] Click left on first image → loops to last image
- [ ] Buttons scale up on hover

#### Thumbnail Navigation
- [ ] Click thumbnail 2 → jumps to image 2
- [ ] Active thumbnail has thick border
- [ ] Active thumbnail has shadow
- [ ] Inactive thumbnails are 60% opacity
- [ ] Hover on thumbnail → scales up and brightens

#### Dot Indicators
- [ ] Click dot 3 → jumps to image 3
- [ ] Active dot expands horizontally
- [ ] Inactive dots remain small and circular
- [ ] All 4 dots are clickable

#### Keyboard Navigation
- [ ] Press → (Right Arrow) → next image
- [ ] Press ← (Left Arrow) → previous image
- [ ] Keyboard works from anywhere on page
- [ ] Navigation loops correctly

### Edge Cases
- [ ] Visit product 13+ → shows single image (no gallery)
- [ ] Single image has NO arrow buttons
- [ ] Single image has NO dot indicators
- [ ] Single image has NO thumbnail strip
- [ ] Navigate to product 1 from product 13 → gallery appears
- [ ] Image index resets to 0 when changing products

## 🎨 Visual Verification

### Expected Behavior

**Main Image:**
- Height: ~500px on desktop, ~384px on mobile
- Rounded corners (border-radius: 24px)
- Border: 2px solid
- Hover effect: Image scales to 110%

**Arrow Buttons:**
- Size: 48px × 48px circular
- Background: Semi-transparent black
- Icon: White ‹ and › symbols
- Position: Vertically centered on left/right

**Dot Indicators:**
- Position: Bottom center of main image
- Active: White bar (~32px wide)
- Inactive: Small white dots (~10px)
- Gap between dots: 8px

**Thumbnails:**
- Size: 80px × 80px
- Border radius: 12px
- Active border: 4px + shadow
- Inactive opacity: 60%
- Layout: Horizontal row with gap

## 🐛 Common Issues & Solutions

### Issue: Gallery doesn't show
**Solution:** 
- Check that you're viewing products 1-12
- Products 13+ only have single images

### Issue: Images don't load
**Solution:**
- Check internet connection (using Unsplash CDN)
- Open browser console for network errors
- Images may be blocked by firewall

### Issue: Keyboard navigation doesn't work
**Solution:**
- Click on the page first to ensure focus
- Check browser console for JavaScript errors
- Ensure you're on the product detail page

### Issue: Thumbnails don't appear
**Solution:**
- Ensure window width is sufficient
- Check if `getGalleryImages().length > 1`
- View browser inspector for CSS issues

### Issue: Backend won't start
**Solution:**
```bash
# Clean and rebuild
mvn clean install -DskipTests
mvn spring-boot:run
```

### Issue: Frontend build errors
**Solution:**
```bash
# Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📊 Test Data Summary

Products with galleries (4 images each):
1. Classic Black Baseball Cap
2. Urban Streetwear Snapback
3. Vintage Trucker Hat
4. Cozy Knit Beanie
5. Summer Bucket Hat
6. Classic Wool Fedora
7. Sports Performance Cap
8. Vintage Denim Snapback
9. Chunky Cable Knit Beanie
10. Reversible Bucket Hat
11. Wide Brim Panama Hat
12. Camo Trucker Cap

Products with single image (no gallery):
13-50: All other products

## 🎯 Success Criteria

The implementation is successful if:
1. ✅ All 4 navigation methods work (buttons, thumbnails, dots, keyboard)
2. ✅ Visual feedback is clear (active states, hover effects)
3. ✅ Navigation loops correctly (circular)
4. ✅ Single image products still work (graceful fallback)
5. ✅ No console errors in browser
6. ✅ Smooth animations and transitions
7. ✅ Responsive on mobile and desktop
8. ✅ Accessible with keyboard and screen readers

## 📝 Notes

- Gallery images are hosted on Unsplash CDN
- Images are comma-separated in database
- Frontend parses and displays automatically
- Fallback to single image if no gallery data
- State resets when product changes
- Keyboard listeners cleaned up on unmount

## 🎉 Demo Script

### Quick Demo (2 minutes)
1. Navigate to Product 1
2. Click right arrow → "See image 2"
3. Click thumbnail 4 → "Jump to last image"
4. Press left arrow key → "Go to image 3"
5. Click dot 1 → "Jump back to first"
6. Navigate to Product 15 → "Single image, no gallery"

### Full Demo (5 minutes)
1. Show products page
2. Click on Product 1
3. Demonstrate all 4 navigation methods
4. Show hover effects
5. Test keyboard navigation
6. Navigate to different product
7. Show gallery resets
8. Test product without gallery
9. Show responsive behavior (resize window)
10. Demonstrate accessibility features

Enjoy your new image gallery feature! 🎨✨

