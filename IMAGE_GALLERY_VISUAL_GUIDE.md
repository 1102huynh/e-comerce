# Image Gallery Visual Guide

## Product Detail Page - Image Gallery Feature

### Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Product Detail Page                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────┐  ┌──────────────────────────┐   │
│  │                           │  │  Product Information     │   │
│  │    Main Gallery Image     │  │  - Category & Stock      │   │
│  │                           │  │  - Title                 │   │
│  │    [<]    Image    [>]    │  │  - Description           │   │
│  │                           │  │  - Price                 │   │
│  │       • • • • •          │  │  - Quantity Selector     │   │
│  │    (indicator dots)       │  │  - Add to Cart Button    │   │
│  └───────────────────────────┘  └──────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────┐                                   │
│  │  [img] [img] [img] [img] │  (Thumbnail Strip)               │
│  └───────────────────────────┘                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Gallery Features

#### 1. Main Image Display
```
┌──────────────────────────┐
│                          │
│   ┌───┐           ┌───┐ │
│   │ < │  IMAGE    │ > │ │  ← Navigation Buttons
│   └───┘           └───┘ │
│                          │
│      • • • • •          │  ← Dot Indicators
└──────────────────────────┘
```

**Features:**
- Large, high-quality image display
- Hover zoom effect (scale: 110%)
- Gradient overlay for depth
- Decorative corner elements

#### 2. Navigation Controls

**Left/Right Arrow Buttons:**
```css
Position: Absolute, centered vertically
Size: 48px × 48px
Style: Semi-transparent black background
Icon: ‹ and › characters (text-2xl)
Hover: Scale up to 110%
```

**Indicator Dots:**
```
Inactive:  •  (small, 40% opacity)
Active:    ━  (elongated, full white)
Position:  Bottom center of main image
Clickable: Yes, jump to specific image
```

#### 3. Thumbnail Strip
```
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│ img │  │ img │  │ img │  │ img │
│  1  │  │  2  │  │  3  │  │  4  │
└─────┘  └─────┘  └─────┘  └─────┘
  ▲
  └── Active (thick border + shadow)
```

**Features:**
- Size: 80px × 80px per thumbnail
- Border: 2px normal, 4px active
- Active state: Thick border + shadow
- Inactive state: 60% opacity
- Hover: Scale 105% + full opacity
- Layout: Horizontal scroll for overflow

### Interaction Methods

#### Method 1: Arrow Buttons
```
User clicks [<] or [>] buttons
   ↓
Navigate to previous/next image
   ↓
Update current index (circular)
   ↓
Image transitions smoothly
```

#### Method 2: Thumbnail Click
```
User clicks thumbnail #3
   ↓
Jump directly to image #3
   ↓
Update visual indicators
   ↓
Highlight thumbnail #3
```

#### Method 3: Dot Indicators
```
User clicks dot #2
   ↓
Navigate to image #2
   ↓
Dot #2 expands
   ↓
Image changes
```

#### Method 4: Keyboard Navigation
```
User presses ← (Left Arrow)
   ↓
Go to previous image
   ↓
Circular navigation (last → first)

User presses → (Right Arrow)
   ↓
Go to next image
   ↓
Circular navigation (first → last)
```

### State Management

```javascript
State Variables:
├── currentImageIndex: number (0-based)
├── galleryImages: string[] (parsed from backend)
└── product: Product (includes images field)

Helper Functions:
├── getGalleryImages()
│   ├── Parse product.images (comma-separated)
│   └── Fallback to [product.imageUrl]
├── prevImage()
│   └── (currentIndex - 1 + length) % length
└── nextImage()
    └── (currentIndex + 1) % length
```

### Responsive Behavior

```
Mobile (< 768px):
├── Main image: height 384px (h-96)
├── Thumbnails: Horizontal scroll
└── Touch-friendly button sizes

Desktop (≥ 768px):
├── Main image: height 500px (h-[500px])
├── Thumbnails: Full display (scrollable if many)
└── Larger hover areas
```

### Data Flow

```
Backend (Java)
    │
    ├── Product.images field
    │   └── "url1,url2,url3,url4"
    │
    ↓
Frontend (TypeScript)
    │
    ├── API Response
    │   └── { images: "url1,url2,url3,url4" }
    │
    ├── getGalleryImages()
    │   └── Split by comma → ["url1", "url2", "url3", "url4"]
    │
    └── Render Gallery
        ├── Main Image: galleryImages[currentImageIndex]
        ├── Thumbnails: map over galleryImages
        └── Indicators: galleryImages.length dots
```

### CSS Variables Used

```css
--background       → Page background
--foreground       → Text color
--card-bg          → Image container background
--card-border      → Border colors
--nav-bg           → Active thumbnail border
--input-bg         → Thumbnail background
```

### Accessibility Features

```
✓ ARIA labels on all buttons
  - "Previous image"
  - "Next image"
  - "View image 1", "View image 2", etc.

✓ Keyboard navigation
  - Left/Right arrows work globally
  - Focus states on interactive elements

✓ Alt text on all images
  - Main: "Product Name - Image N"
  - Thumbnails: "Product Name thumbnail N"

✓ Visual indicators
  - Clear active states
  - High contrast buttons
  - Hover feedback
```

### Performance Optimizations

```
✓ Next.js Image component
  - Automatic lazy loading (thumbnails)
  - Priority loading (main image)
  - Responsive image sizing

✓ Event cleanup
  - Keyboard listeners removed on unmount
  - No memory leaks

✓ State resets
  - Index resets when product changes
  - Prevents showing wrong image
```

### Example Product Data

**Backend (DataInitializer.java):**
```java
product1.setImageUrl("https://images.unsplash.com/photo-1.jpg");
product1.setImages("https://images.unsplash.com/photo-1.jpg,"
                 + "https://images.unsplash.com/photo-2.jpg,"
                 + "https://images.unsplash.com/photo-3.jpg,"
                 + "https://images.unsplash.com/photo-4.jpg");
```

**Frontend Parse Result:**
```javascript
galleryImages = [
  "https://images.unsplash.com/photo-1.jpg",
  "https://images.unsplash.com/photo-2.jpg",
  "https://images.unsplash.com/photo-3.jpg",
  "https://images.unsplash.com/photo-4.jpg"
]
```

### Visual States

#### Single Image (No Gallery)
```
┌──────────────────────────┐
│                          │
│        IMAGE             │  ← No navigation controls
│                          │  ← No indicators
└──────────────────────────┘
(No thumbnail strip shown)
```

#### Multiple Images (Gallery Active)
```
┌──────────────────────────┐
│   ┌───┐         ┌───┐   │
│   │ < │  IMAGE  │ > │   │  ← Controls visible
│   └───┘         └───┘   │
│      • • ━ • •          │  ← Indicators visible
└──────────────────────────┘
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  ← Thumbnails visible
│ img │ │ img │ │ IMG │ │ img │
└─────┘ └─────┘ └─────┘ └─────┘
```

### Animation Effects

```
Main Image:
├── Transition: transform 700ms
└── Hover: scale(1.1)

Thumbnails:
├── Transition: all 300ms
├── Hover: scale(1.05)
└── Active: border-width 4px

Buttons:
├── Transition: all 300ms
└── Hover: scale(1.1)

Indicators:
├── Transition: all 300ms
├── Active: width expands
└── Inactive: small dot
```

This visual guide shows all the components and interactions of the image gallery feature!

