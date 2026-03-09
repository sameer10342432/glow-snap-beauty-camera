# GlowSnap — Product Requirements Document

## Overview

**App Name:** GlowSnap  
**Platform:** iOS & Android (React Native / Expo)  
**Bundle ID:** `com.glowsnap`  
**Version:** 1.0.0  
**Category:** Photo & Video / Beauty Camera  

GlowSnap is a beauty camera and selfie filter app inspired by Snapchat and BeautyCam. It lets users capture selfies with live AR face filters, apply color grading, add stickers, create collages, and manage a photo gallery — all from a polished, dark-themed mobile UI.

---

## Design System

| Token | Value |
|-------|-------|
| Primary Gradient | `#FF6B9A → #FF8E53` |
| Dark Background | `#0A0A0F` |
| Surface | `#1C1C2A` |
| Light Background | `#F8F8FA` |
| Font | Inter (400 / 500 / 600 / 700) |

---

## Screens & Features

### 1. Camera Screen (`/`)

The main screen — a full-screen BeautyCam-style camera interface.

#### Camera Controls (Top Bar)
- **Flash toggle** — cycles through Off / On / Auto with color-coded icons
- **Timer** — cycles through Off / 3s / 10s with countdown overlay and haptic feedback
- **Aspect Ratio** — cycles through 4:3 / 1:1 / 16:9, dynamically resizes camera viewport
- **Beauty Tools toggle** — opens the Beauty panel

#### Side Buttons
- **Flip Camera** — switches between front and back camera
- **Sticker Panel toggle** — opens sticker selector
- **Trash** — clears all placed stickers (visible only when stickers are present)
- **Intensity toggle** — opens filter intensity slider

#### AR Face Filters (Face Tab)
26 live face overlay filters rendered on top of the camera in real time:

| ID | Name | Visual Effect |
|----|------|---------------|
| ar_none | Off | No overlay |
| ar_dog | Puppy | Brown dog ears, black nose, orange blush |
| ar_cat | Kitty | Pointy cat ears, pink nose, whisker lines, cheek blush |
| ar_bunny | Bunny | Tall white ears with pink center, bunny nose, whiskers |
| ar_tiger | Tiger | Orange tiger ears, black stripe marks on cheeks |
| ar_bear | Bear | Round brown ears, large dark nose, blush |
| ar_unicorn | Unicorn | Unicorn horn, rainbow shimmer panel, spinning sparkles |
| ar_flowers | Bloom | Row of 🌸🌺🌼 flowers across top of head |
| ar_sakura | Sakura | Cherry blossom petals spinning and drifting downward |
| ar_butterfly | Flutter | 6 animated butterflies flying around the face |
| ar_angel | Angel | Pulsing gold halo above head, soft blush |
| ar_devil | Devil | Red triangle horns, red tint overlay |
| ar_crown | Queen | Large gold crown, rotating sparkles around face |
| ar_sunglasses | Sunnies | Reflective sunglasses at eye level with light shine |
| ar_hearts | Love | Heart emojis at each eye, hearts floating upward |
| ar_stars | Star | 12 twinkling ✨⭐💫🌟 sparkles around face |
| ar_rainbow | Rainbow | Animated pulsing rainbow arc over head |
| ar_galaxy | Galaxy | Deep purple space tint, 12 twinkling colored stars |
| ar_disco | Disco | Spinning disco ball, alternating pink/cyan light beams |
| ar_confetti | Party | Colored confetti shapes spinning and falling |
| ar_money | Money | 💰 crown, 💸 bills raining down, green tint |
| ar_bubble | Bubbles | Iridescent bubbles floating upward with sway |
| ar_snow | Frost | Ice crown, snowflakes + snowmen drifting down |
| ar_alien | Alien | Green skin tint, 👽 face overlay, green blush |
| ar_fire | Fire | 🔥 crown, flames shooting upward |
| ar_neon | Neon | Animated cyan/magenta neon glow outline around face |

#### Color Grade Filters (Color Tab)
29 photo color grade filters organized by category:

- **Natural:** Original, Glow, Soft, Fresh, Bloom
- **Warm:** Sunrise, Golden, Amber, Sunset, Rose
- **Cool:** Arctic, Ocean, Mint, Twilight, Ice
- **Vintage:** Retro, Film, Kodak, Polaroid, Faded
- **B&W:** Mono, Silver, Noir
- **Dream:** Dream, Fairy, Magic, Neon
- **Bright:** Bright, Vivid, Clarity

Filter intensity is adjustable via a dedicated slider panel.

#### Beauty Tools Panel
Five AI-style beauty tools (simulated via semi-transparent overlays):
- **Smooth** — skin smoothing effect
- **Brighten** — skin brightening
- **Slim** — face slimming
- **Enlarge** — eye enlargement
- **Teeth** — teeth whitening

Each tool has an individual intensity slider.

#### Sticker Panel
20 draggable stickers in 4 categories (Love, Sparkle, Nature, Cute).  
Stickers can be placed anywhere on the camera view by dragging.  
Long-press a sticker to remove it.

#### Capture
- **Shutter button** — gradient pink/orange circle, scales on press
- **Flash overlay** — brief white flash animation on capture
- **Countdown display** — large animated countdown for timer mode
- **Gallery thumbnail** — bottom-left shows last captured photo; taps navigate to Gallery
- **Flip camera** — bottom-right shortcut

#### Photo Saving
- Photos are saved to the in-app gallery (persisted via context)
- On iOS: photos are automatically saved to the native Camera Roll
- On Android (Expo Go): in-app gallery only (native save requires dev build)

---

### 2. Effects Screen (`/effects`)

Browse and preview AR filter effects with category tabs.

- Category tabs: All, Face, Animals, Fantasy, Party, Vibes
- Animated filter cards with gradient thumbnails
- PRO badge on locked premium effects
- Tapping a free effect navigates to camera with that filter pre-selected

---

### 3. Gallery Screen (`/gallery`)

Three-tab photo management screen.

#### Tabs
- **Recents** — all photos in reverse chronological order
- **Favorites** — photos marked as favorite
- **Edited** — photos that had a filter applied

#### Photo Grid
- 3-column responsive grid
- Filter name badge overlay on each photo
- Tap photo to open full-screen viewer

#### Full-Screen Photo Viewer
- Swipe-up modal presentation
- Before/After comparison slider — drag to reveal original vs filtered version
- Edit panel with filter presets
- Share, Download, Delete actions
- Favorite toggle

---

### 4. Collage Screen (`/collage`)

Create multi-photo collages with customization controls.

#### Layout Picker
- 6 grid layout options (1×1, 2×1, 1×2, 2×2, 3×1, freestyle)

#### Customization Panels
- **Border** — border width slider (0–20px)
- **Background** — color picker (white, black, pink, purple, gold, teal)
- **Spacing** — gap between photos slider (0–20px)

#### Actions
- Add photos from gallery
- Save collage to gallery
- Share collage

---

### 5. Profile Screen (`/profile`)

User profile and app settings.

#### Stats Row
- Photos taken count
- Filters used count
- Collages created count

#### Sections
- **Rate App** — opens App Store rating prompt
- **Share App** — native share sheet with app link
- **Contact Support** — opens email client
- **Privacy Policy** — opens web link
- **Terms of Service** — opens web link

#### Settings
- Theme toggle (Light / Dark mode)
- Premium upgrade button (PRO badge unlock)

---

## Technical Architecture

### Frontend
- **Framework:** Expo SDK 54 / React Native
- **Router:** Expo Router (file-based, tab layout)
- **State:** React Context (`AppContext`) + `useState`
- **Server State:** TanStack React Query
- **Animations:** React Native Animated API + Reanimated 3
- **Fonts:** Inter via `@expo-google-fonts/inter` (loaded with 3.5s timeout fallback)
- **Gestures:** PanResponder (sticker dragging)

### Backend
- **Framework:** Express.js (TypeScript)
- **Port:** 5000
- **Purpose:** Static file serving + API endpoint base

### Key Libraries
| Library | Purpose |
|---------|---------|
| `expo-camera` | Camera capture |
| `expo-media-library` | Save to device gallery (iOS) |
| `expo-haptics` | Tactile feedback |
| `expo-linear-gradient` | Gradient UI elements |
| `expo-font` | Font loading |
| `react-native-safe-area-context` | Notch/inset handling |
| `react-native-reanimated` | Smooth animations |
| `@expo/vector-icons` | Ionicons + MaterialCommunityIcons |

### Shared State (`AppContext`)
- `savedPhotos` — array of captured photos with URI, filter ID, timestamp
- `addPhoto(photo)` — adds photo to gallery
- `deletePhoto(id)` — removes photo
- `isDark` — current theme mode
- `isPremium` — PRO status

---

## File Structure

```
app/
  _layout.tsx          # Root layout, font loading, providers
  (tabs)/
    _layout.tsx        # Tab bar configuration
    index.tsx          # Camera screen
    effects.tsx        # Effects browser
    gallery.tsx        # Photo gallery
    collage.tsx        # Collage maker
    profile.tsx        # Profile & settings

components/
  ARFilterOverlay.tsx  # 26 AR face filter components
  ErrorBoundary.tsx    # Global error boundary

constants/
  filters.ts           # 29 color grade filter configs + sticker packs
  colors.ts            # Design system palette

context/
  AppContext.tsx        # Global app state

assets/
  images/              # App icon, splash screen
```

---

## Known Limitations

- AR filters use fixed-position overlays (no real face detection). Users align their face with the filter.
- Media library save on Android requires a dev build (not available in Expo Go due to permission constraints).
- Beauty tool effects are simulated visually; no actual image processing is applied to saved photos.
- PRO features (locked effects) are UI-only; no payment system is integrated yet.
