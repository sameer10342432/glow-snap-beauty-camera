# GlowSnap – Beauty Camera & Selfie Filters

## Overview
GlowSnap is a polished beauty camera mobile app built with Expo React Native. It provides selfie filters, beauty adjustment tools, AR effects, stickers, a photo gallery with before/after comparison, a collage maker, and a profile/settings screen.

## Architecture
- **Frontend**: Expo Router (file-based routing), React Native
- **Backend**: Express.js (serves landing page and API routes)
- **State**: React Context + AsyncStorage for persistence
- **Styling**: React Native StyleSheet, expo-linear-gradient, react-native-reanimated

## Color Theme
- Primary gradient: `#FF6B9A` → `#FF8E53` (coral/pink)
- Dark bg: `#0A0A0F`, Dark surface: `#1C1C2A`
- Light bg: `#F8F8FA`
- Text: `#F0EEF6` (dark), `#1A1A2E` (light)
- Font: Inter (400, 500, 600, 700) via @expo-google-fonts/inter

## App Structure
```
app/
  _layout.tsx          — Root layout (providers: QueryClient, SafeArea, App, Gesture)
  (tabs)/
    _layout.tsx        — Tab bar (NativeTabs for iOS 26+, ClassicTabs fallback)
    index.tsx          — Camera screen (full BeautyCam-style)
    effects.tsx        — AR Effects & Stickers browser
    gallery.tsx        — Photo gallery with before/after slider & photo editor
    collage.tsx        — Collage maker with border/background/spacing controls
    profile.tsx        — Profile, settings, premium, stats

context/
  AppContext.tsx        — Shared state: savedPhotos, themeMode, isPremium

constants/
  colors.ts            — Design system colors (dark/light + palette)
  filters.ts           — 30 photo filter configs + sticker packs
```

## Key Features

### Camera Screen (index.tsx)
- Full-screen CameraView with live filter overlays
- **Top bar**: Flash toggle (off/on/auto), Timer selector (off/3s/10s), Ratio selector (4:3/1:1/16:9), Beauty panel toggle
- **Bottom bar**: Filter intensity slider, horizontal filter carousel with 30 filters, Capture button, Gallery preview thumbnail, Flip camera button
- **Side bar**: Flip camera, Sticker panel, Filter intensity, Trash (remove stickers)
- **Beauty Tools panel** (slides up): Smooth Skin, Brighten, Face Slim, Eye Enlarge, Whiten Teeth — each with individual slider
- **Stickers panel**: Draggable stickers from categorized packs
- Countdown timer overlay (3s/10s) with haptic feedback
- Capture flash animation

### Effects Screen (effects.tsx)
- AR Effects / Stickers toggle (tab switch)
- Category tabs: Trending, Face, Light, Cute, Party
- Animated effect cards with pulse/rotate animation when selected
- HOT badge for trending, PRO badge for premium-locked effects
- Pro upsell banner for free users
- 16 AR effects with locked premium effects

### Gallery Screen (gallery.tsx)
- 3 tabs: Recent, Saved, Edited
- Tap photo → full-screen viewer modal
- **Before/After comparison slider** (drag divider left/right to compare)
- **Edit panel**: Brightness, Contrast, Warmth sliders
- **Share** via device share sheet
- **Delete** with confirmation dialog
- **Photo info** overlay (filter name, date, category)
- Dot indicator on edited photos

### Collage Screen (collage.tsx)
- 6 layouts: 2×1, 3×1, Feature, 2×2, Left, Stack
- **Control bar**: Layout, Border, Background, Spacing tabs
- **Border**: Thickness picker (0–8px) + 8 color swatches
- **Background**: 8 background color swatches
- **Spacing**: Cell spacing picker (0–8px)
- Quick-pick from saved photos
- Progress bar when partially filled
- Save Collage button when all cells filled

### Profile Screen (profile.tsx)
- Stats cards: Total Photos, Edited, Filters Used
- Premium upgrade card / Premium active badge
- Theme selector (Auto / Dark / Light)
- Toggle: Haptic Feedback, GlowSnap Watermark
- Premium features list (Unlock All Filters, All AR Effects, Remove Ads, Cloud Backup)
- Support: Rate GlowSnap, Share App, Contact Support
- Legal: Privacy Policy, Terms of Service, App Version
- Footer with GlowSnap logo

## Notes
- Beauty tools simulate effects via semi-transparent overlays (no native processing in Expo Go)
- Filters use CSS-style colored View overlays at configurable opacity
- `pointerEvents` uses `as any` cast in style object for web/React Native Web compatibility
- expo-camera exports `CameraType` and `FlashMode` via `export * from './Camera.types'`
