# Theme System - Quick Reference

## 🎨 Theme Toggle Location
- **Desktop**: Top right corner of navbar (next to Register button or user menu)
- **Mobile**: Top right corner next to hamburger menu
- **Button**: Shows current theme ("☀️ Light" or "🌙 Dark")

## 🔧 How Users Switch Themes
1. Click the theme button (☀️ or 🌙) in the navbar
2. Theme changes instantly with smooth transition
3. Choice is automatically saved to browser

## 💾 Where Theme Preference is Saved
- Browser's localStorage
- Key: `theme-storage`
- Persists across sessions

## 📋 Available Themes
1. **Light Theme** - Bright white background, dark text
2. **Dark Theme** - Black background, light text (default)

## 🎯 Styling Colors by Theme

### Light Theme Colors
```
Background: #ffffff (white)
Text: #171717 (dark gray)
Navigation: #ffffff (white)
Navigation Border: #e5e7eb (light gray)
Navigation Text: #000000 (black)
Hover Effect: #f3f4f6 (very light gray)
```

### Dark Theme Colors
```
Background: #0a0a0a (almost black)
Text: #ededed (light gray)
Navigation: #000000 (black)
Navigation Border: #1f2937 (dark gray)
Navigation Text: #ffffff (white)
Hover Effect: #1f2937 (dark gray)
```

## 🔌 Using Theme in Your Code

### Access Current Theme
```typescript
import { useThemeStore } from '@/store/themeStore';

export default function MyComponent() {
  const theme = useThemeStore((state) => state.theme);
  
  return <div>{theme === 'dark' ? '🌙' : '☀️'}</div>;
}
```

### Apply Conditional Styling
```typescript
const isDark = theme === 'dark';

<button
  style={{
    backgroundColor: isDark ? '#000000' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
  }}
>
  Click me
</button>
```

### Use CSS Variables (Recommended)
```typescript
<button
  style={{
    backgroundColor: 'var(--nav-bg)',
    color: 'var(--nav-text)',
    borderColor: 'var(--nav-border)',
  }}
>
  Click me
</button>
```

## 🎨 CSS Variables Available

```css
--background        /* Page background */
--foreground        /* Main text color */
--nav-bg            /* Navigation background */
--nav-border        /* Navigation border */
--nav-text          /* Navigation text */
--nav-hover         /* Navigation hover state */
--card-bg           /* Card background */
--card-border       /* Card border */
--input-bg          /* Input background */
--input-border      /* Input border */
--button-hover      /* Button hover state */
```

## 📝 Files Involved

```
frontend/
├── store/
│   └── themeStore.ts          ← Theme state management
├── components/
│   ├── ThemeProvider.tsx       ← Initializes theme
│   └── Navbar.tsx              ← Theme toggle button
├── app/
│   ├── globals.css             ← Theme variables
│   └── layout.tsx              ← ThemeProvider wrapper
└── THEME_IMPLEMENTATION.md     ← Full documentation
```

## 🚀 Testing the Theme

1. Click the theme button in navbar
2. Verify colors change instantly
3. Refresh page - theme should persist
4. Open in new tab - same theme should apply
5. Check mobile view - button should work there too

## 🔄 Default Behavior

- **First Visit**: Dark theme (hardcoded default)
- **Subsequent Visits**: Saved preference from localStorage
- **No Saved Preference**: Detects system dark mode setting

## 🎯 Future Enhancements

To add more themes in future:
1. Add new type to `themeStore.ts`
2. Add CSS variables to `globals.css`
3. Add selection UI in settings page
4. Done! All components automatically support the new theme

## 🐛 Troubleshooting

**Theme not persisting?**
- Check browser allows localStorage
- Check browser console for errors
- Clear browser cache and try again

**Styling not updating?**
- Ensure you're using CSS variables or inline styles
- Avoid hardcoded color values
- Check Navbar.tsx for example

**Mobile theme button not working?**
- Make sure you're clicking the icon (☀️ or 🌙)
- Check browser console for errors
- Try different browser/device

