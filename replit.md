# GlowSnap – Beauty Camera & Selfie Filters

## Overview
GlowSnap is a polished beauty camera mobile app built with Expo React Native. It provides selfie filters, beauty tools, stickers, a gallery, and a collage maker.

## Architecture
- **Frontend**: Expo Router (file-based routing), React Native
- **Backend**: Express.js (serves landing page and API routes)
- **State**: React Context + AsyncStorage for persistence
- **Styling**: React Native StyleSheet, expo-linear-gradient, react-native-reanimated

## Color Theme
- Primary accent: `#FF6B8A` (coral/rose)
- Secondary accent: `#D4877A` (rose gold)
- Dark bg: `#0A0A0F`
- Dark surface: `#1C1C2A`
- Text: `#F0EEF6`
- Font: Inter (400, 500, 600, 700)

## App Structure
```
app/
  _layout.tsx          — Root layout (providers: QueryClient, SafeArea, App, Gesture)
  (tabs)/
    _layout.tsx        — Tab bar (NativeTabs for iOS 26+, ClassicTabs fallback)
    index.tsx          — Camera screen (main)
    effects.tsx        — AR Effects & Stickers browser
    gallery.tsx        — Photo gallery with viewer
    collage.tsx        — Collage maker with 6 grid layouts
    profile.tsx        — Settings, premium, theme switcher

context/
  AppContext.tsx        — Shared state: savedPhotos, theme, premium

constants/
  colors.ts            — Design system colors
  filters.ts           — 30 photo filter configs + sticker packs
```

## Key Features
1. **Camera** — Full-screen camera with front/back switch, flash toggle, filter overlay, beauty sliders (Glow/Smooth/Brightness/Warm/Cool), and draggable stickers
2. **Filters** — 30 filters across 8 categories (Natural, Warm, Cool, Vintage, B&W, Dream, Bright)
3. **Stickers** — 4 packs (Love, Sparkle, Nature, Cute) with draggable placement via PanResponder
4. **Beauty Panel** — Animated slide-up panel with 5 real-time overlay sliders
5. **Gallery** — Grid view of saved photos with filter overlay replay, full-screen viewer, delete
6. **Collage** — 6 grid layouts with gallery quick-pick and external photo picker
7. **Profile** — Theme toggle (dark/light/auto), premium upsell, haptics toggle, stats

## Dependencies
- expo-camera — Camera capture
- expo-image-picker — Photo library picker
- expo-media-library — Saving to device (future)
- expo-haptics — Tactile feedback
- expo-linear-gradient — Gradients and overlays
- expo-blur — Tab bar blur (iOS)
- react-native-reanimated — Panel animations
- @react-native-async-storage/async-storage — Photo + preference persistence
- @tanstack/react-query — API state management
