export interface FilterConfig {
  id: string;
  name: string;
  category: string;
  overlay: string;
  overlayOpacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hueRotate?: number;
}

export const FILTERS: FilterConfig[] = [
  { id: 'none', name: 'Original', category: 'Natural', overlay: 'transparent', overlayOpacity: 0, brightness: 1, contrast: 1, saturation: 1 },
  { id: 'glow', name: 'Glow', category: 'Natural', overlay: '#FFF5E0', overlayOpacity: 0.12, brightness: 1.1, contrast: 1.05, saturation: 1.1 },
  { id: 'soft', name: 'Soft', category: 'Natural', overlay: '#FFE8E8', overlayOpacity: 0.15, brightness: 1.05, contrast: 0.9, saturation: 0.9 },
  { id: 'fresh', name: 'Fresh', category: 'Natural', overlay: '#E8F5E9', overlayOpacity: 0.12, brightness: 1.08, contrast: 1.02, saturation: 1.05 },
  { id: 'bloom', name: 'Bloom', category: 'Natural', overlay: '#FFC0CB', overlayOpacity: 0.18, brightness: 1.05, contrast: 0.95, saturation: 1.15 },
  { id: 'sunrise', name: 'Sunrise', category: 'Warm', overlay: '#FF8C42', overlayOpacity: 0.2, brightness: 1.1, contrast: 1.05, saturation: 1.2 },
  { id: 'golden', name: 'Golden', category: 'Warm', overlay: '#FFD700', overlayOpacity: 0.18, brightness: 1.12, contrast: 1.0, saturation: 1.25 },
  { id: 'amber', name: 'Amber', category: 'Warm', overlay: '#FFBF00', overlayOpacity: 0.2, brightness: 1.05, contrast: 1.1, saturation: 1.15 },
  { id: 'sunset', name: 'Sunset', category: 'Warm', overlay: '#FF6B35', overlayOpacity: 0.22, brightness: 1.0, contrast: 1.1, saturation: 1.3 },
  { id: 'rose', name: 'Rose', category: 'Warm', overlay: '#E8829A', overlayOpacity: 0.2, brightness: 1.05, contrast: 1.0, saturation: 1.1 },
  { id: 'arctic', name: 'Arctic', category: 'Cool', overlay: '#A8D8EA', overlayOpacity: 0.2, brightness: 1.05, contrast: 1.05, saturation: 0.85 },
  { id: 'ocean', name: 'Ocean', category: 'Cool', overlay: '#4A90D9', overlayOpacity: 0.18, brightness: 1.0, contrast: 1.1, saturation: 0.9 },
  { id: 'mint', name: 'Mint', category: 'Cool', overlay: '#98FF98', overlayOpacity: 0.15, brightness: 1.08, contrast: 1.0, saturation: 0.95 },
  { id: 'twilight', name: 'Twilight', category: 'Cool', overlay: '#7B68EE', overlayOpacity: 0.2, brightness: 0.95, contrast: 1.15, saturation: 0.8 },
  { id: 'ice', name: 'Ice', category: 'Cool', overlay: '#B0E0E6', overlayOpacity: 0.22, brightness: 1.1, contrast: 0.95, saturation: 0.75 },
  { id: 'retro', name: 'Retro', category: 'Vintage', overlay: '#8B6914', overlayOpacity: 0.25, brightness: 0.95, contrast: 1.15, saturation: 0.7 },
  { id: 'film', name: 'Film', category: 'Vintage', overlay: '#5C4033', overlayOpacity: 0.2, brightness: 0.9, contrast: 1.2, saturation: 0.65 },
  { id: 'kodak', name: 'Kodak', category: 'Vintage', overlay: '#C9A96E', overlayOpacity: 0.22, brightness: 1.0, contrast: 1.1, saturation: 0.8 },
  { id: 'polaroid', name: 'Polaroid', category: 'Vintage', overlay: '#FFFFF0', overlayOpacity: 0.2, brightness: 1.1, contrast: 0.9, saturation: 0.75 },
  { id: 'faded', name: 'Faded', category: 'Vintage', overlay: '#D2B48C', overlayOpacity: 0.28, brightness: 1.05, contrast: 0.85, saturation: 0.6 },
  { id: 'mono', name: 'Mono', category: 'B&W', overlay: '#808080', overlayOpacity: 0.35, brightness: 1.0, contrast: 1.1, saturation: 0 },
  { id: 'silver', name: 'Silver', category: 'B&W', overlay: '#C0C0C0', overlayOpacity: 0.25, brightness: 1.1, contrast: 0.9, saturation: 0 },
  { id: 'noir', name: 'Noir', category: 'B&W', overlay: '#1A1A1A', overlayOpacity: 0.3, brightness: 0.85, contrast: 1.3, saturation: 0 },
  { id: 'dream', name: 'Dream', category: 'Dream', overlay: '#DA70D6', overlayOpacity: 0.2, brightness: 1.1, contrast: 0.9, saturation: 1.2 },
  { id: 'fairy', name: 'Fairy', category: 'Dream', overlay: '#FF85A2', overlayOpacity: 0.22, brightness: 1.12, contrast: 0.88, saturation: 1.3 },
  { id: 'magic', name: 'Magic', category: 'Dream', overlay: '#9370DB', overlayOpacity: 0.2, brightness: 1.05, contrast: 1.0, saturation: 1.15 },
  { id: 'neon', name: 'Neon', category: 'Dream', overlay: '#00FFFF', overlayOpacity: 0.18, brightness: 1.0, contrast: 1.2, saturation: 1.4 },
  { id: 'bright', name: 'Bright', category: 'Bright', overlay: '#FFFFFF', overlayOpacity: 0.15, brightness: 1.2, contrast: 1.05, saturation: 1.1 },
  { id: 'vivid', name: 'Vivid', category: 'Bright', overlay: 'transparent', overlayOpacity: 0, brightness: 1.05, contrast: 1.15, saturation: 1.4 },
  { id: 'clarity', name: 'Clarity', category: 'Bright', overlay: '#F0F8FF', overlayOpacity: 0.1, brightness: 1.15, contrast: 1.1, saturation: 1.05 },
];

export const FILTER_CATEGORIES = ['All', 'Natural', 'Warm', 'Cool', 'Vintage', 'B&W', 'Dream', 'Bright'];

export const STICKER_PACKS: { category: string; stickers: { id: string; icon: string; lib: string; color: string }[] }[] = [
  {
    category: 'Love',
    stickers: [
      { id: 'heart1', icon: 'heart', lib: 'Ionicons', color: '#FF6B8A' },
      { id: 'heart2', icon: 'heart-circle', lib: 'Ionicons', color: '#FF4757' },
      { id: 'heart3', icon: 'rose-outline', lib: 'MaterialCommunityIcons', color: '#FF6B8A' },
      { id: 'star1', icon: 'star', lib: 'Ionicons', color: '#FFD700' },
      { id: 'star2', icon: 'sparkles', lib: 'Ionicons', color: '#FFD700' },
    ],
  },
  {
    category: 'Sparkle',
    stickers: [
      { id: 'spark1', icon: 'flash', lib: 'Ionicons', color: '#FFD700' },
      { id: 'spark2', icon: 'sunny', lib: 'Ionicons', color: '#FFA500' },
      { id: 'spark3', icon: 'diamond', lib: 'Ionicons', color: '#A8D8EA' },
      { id: 'spark4', icon: 'flower-outline', lib: 'MaterialCommunityIcons', color: '#FF85A2' },
      { id: 'spark5', icon: 'crown', lib: 'MaterialCommunityIcons', color: '#FFD700' },
    ],
  },
  {
    category: 'Nature',
    stickers: [
      { id: 'nat1', icon: 'leaf', lib: 'Ionicons', color: '#2ED573' },
      { id: 'nat2', icon: 'water', lib: 'Ionicons', color: '#4A90D9' },
      { id: 'nat3', icon: 'snow', lib: 'Ionicons', color: '#A8D8EA' },
      { id: 'nat4', icon: 'cloud', lib: 'Ionicons', color: '#C0C0C0' },
      { id: 'nat5', icon: 'moon', lib: 'Ionicons', color: '#D4877A' },
    ],
  },
  {
    category: 'Cute',
    stickers: [
      { id: 'cute1', icon: 'paw-outline', lib: 'MaterialCommunityIcons', color: '#FF8C42' },
      { id: 'cute2', icon: 'cat', lib: 'MaterialCommunityIcons', color: '#D4877A' },
      { id: 'cute3', icon: 'butterfly-outline', lib: 'MaterialCommunityIcons', color: '#DA70D6' },
      { id: 'cute4', icon: 'jellyfish-outline', lib: 'MaterialCommunityIcons', color: '#9B8EC4' },
      { id: 'cute5', icon: 'bee-flower', lib: 'MaterialCommunityIcons', color: '#FFD700' },
    ],
  },
];
