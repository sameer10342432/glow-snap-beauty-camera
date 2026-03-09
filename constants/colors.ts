const palette = {
  black: "#0A0A0F",
  darkSurface: "#13131A",
  surface: "#1C1C2A",
  surfaceElevated: "#252535",
  border: "#2E2E42",
  borderLight: "#3A3A52",
  roseGold: "#D4877A",
  coral: "#FF6B8A",
  coraltint: "#FF6B8A22",
  lavender: "#9B8EC4",
  text: "#F0EEF6",
  textSecondary: "#9B99AA",
  textMuted: "#6B6880",
  white: "#FFFFFF",
  danger: "#FF4757",
  success: "#2ED573",
};

export default {
  light: {
    text: palette.black,
    background: "#F5F4F9",
    surface: "#FFFFFF",
    surfaceElevated: "#FAFAFA",
    border: "#E5E3EF",
    tint: palette.coral,
    accent: palette.roseGold,
    tabIconDefault: "#A0A0B0",
    tabIconSelected: palette.coral,
    textSecondary: "#6B6880",
  },
  dark: {
    text: palette.text,
    background: palette.black,
    surface: palette.surface,
    surfaceElevated: palette.surfaceElevated,
    border: palette.border,
    tint: palette.coral,
    accent: palette.roseGold,
    tabIconDefault: palette.textMuted,
    tabIconSelected: palette.coral,
    textSecondary: palette.textSecondary,
  },
};

export { palette };
