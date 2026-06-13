// ─── monday.com-inspired Design Tokens ─────────────────────────────────────
// Adapted for React Native from DESIGN-monday-style.md
// Font: platform system font (fallback; swap to Poppins when loaded)

export const colors = {
  mondayViolet: '#6161ff',
  ink: '#333333',
  slate: '#535768',
  iron: '#808080',
  fog: '#cacbcd',
  mist: '#d0d4e4',
  pebble: '#dddfeb',
  cloud: '#f5f6f8',
  snow: '#ffffff',

  // Pastel accents
  mint: '#bcfe90',
  sky: '#abf0ff',
  apricot: '#ff8940',
  lavender: '#eddff7',
  periwinkle: '#e7ecff',
  cornflower: '#93beff',
  aqua: '#d1faff',
  cottonCandy: '#e98dfe',
  ultraViolet: '#9450fd',
  electricCyan: '#3ac9ff',
  forest: '#2a5c4e',
  peony: '#fcd0f8',
  periwinkleWash: '#dbdbff',
  prism: '#8181ff',
  // Shadow tint
  shadowDust: '#e6e7ea',

  // Status-specific (not part of monday spec but needed)
  statusDraft: '#FFF8E1',
  statusDraftText: '#F57F17',
  statusReceived: '#E3F2FD',
  statusReceivedText: '#1565C0',
  statusProcess: '#F3E5F5',
  statusProcessText: '#6A1B9A',
  statusPayment: '#FCE4EC',
  statusPaymentText: '#C2185B',
  statusDone: '#C8E6C9',
  statusDoneText: '#1B5E20',
  statusCancelled: '#EEEEEE',
  statusCancelledText: '#424242',

  // Semantic
  error: '#E53935',
  success: '#43A047',
  warning: '#FB8C00',
} as const;

export const spacing = {
  unit: 8,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
  80: 80,
  96: 96,
} as const;

export const radius = {
  nav: 6,
  cards: 24,
  badges: 6,
  images: 12,
  inputs: 6,
  buttons: 999,
  // Named aliases
  sm: 6,
  md: 6,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 999,
} as const;

// RN shadow helper — returns style object
export function cardShadow(level: 'default' | 'elevated' | 'ai' = 'default') {
  const shadows: Record<string, object> = {
    default: {
      shadowColor: '#cdd0df',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 48,
      elevation: 4,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.15,
      shadowRadius: 45,
      elevation: 8,
    },
    ai: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 40,
      elevation: 6,
    },
  };
  return shadows[level];
}

export const typography = {
  fontFamily: undefined as string | undefined, // platform default; set to 'Poppins' when loaded
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  sizes: {
    caption: 12,
    bodySm: 14,
    body: 16,
    subheading: 20,
    headingSm: 24,
    heading: 36,
    headingLg: 48,
    display: 64,
  },
  lineHeight: {
    caption: 1.45,
    bodySm: 1.5,
    body: 1.5,
    subheading: 1.4,
    headingSm: 1.3,
    heading: 1.2,
    headingLg: 1.15,
    display: 1.15,
  },
  letterSpacing: {
    caption: -0.12,
    body: -0.16,
    subheading: -0.22,
    headingSm: -0.36,
    heading: -0.54,
    headingLg: -0.96,
    display: -2.56,
  },
} as const;

// ─── Reusable StyleSheet helpers ──────────────────────────────────────────

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const themeStyles = StyleSheet.create({
  // Card surface
  card: {
    backgroundColor: colors.snow,
    borderRadius: radius.cards,
    padding: spacing[24],
    ...cardShadow('default'),
  } as ViewStyle,

  // Section title
  sectionTitle: {
    fontSize: typography.sizes.subheading,
    fontWeight: typography.weights.medium,
    color: colors.ink,
    marginBottom: spacing[16],
  } as TextStyle,

  // Body text
  bodyText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    color: colors.ink,
    lineHeight: typography.sizes.body * typography.lineHeight.body,
  } as TextStyle,

  // Secondary text
  secondaryText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.regular,
    color: colors.slate,
    lineHeight: typography.sizes.bodySm * typography.lineHeight.bodySm,
  } as TextStyle,

  // Pill button (primary)
  primaryButton: {
    backgroundColor: colors.mondayViolet,
    borderRadius: radius.buttons,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,

  primaryButtonText: {
    color: colors.snow,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  } as TextStyle,

  // Outlined button
  outlinedButton: {
    backgroundColor: 'transparent',
    borderRadius: radius.buttons,
    borderWidth: 1,
    borderColor: colors.slate,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,

  outlinedButtonText: {
    color: colors.ink,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  } as TextStyle,

  // Text input
  input: {
    backgroundColor: colors.snow,
    borderWidth: 1,
    borderColor: colors.pebble,
    borderRadius: radius.inputs,
    paddingHorizontal: spacing[16],
    paddingVertical: 12,
    fontSize: typography.sizes.body,
    color: colors.ink,
  } as ViewStyle,

  // Status pill
  statusPill: {
    borderRadius: radius.badges,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start' as const,
  } as ViewStyle,

  statusPillText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
  } as TextStyle,

  // Page layout
  page: {
    flex: 1,
    backgroundColor: colors.cloud,
  } as ViewStyle,

  // Page section wrapper
  section: {
    paddingHorizontal: spacing[16],
    marginBottom: spacing[24],
  } as ViewStyle,

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.fog,
    marginVertical: spacing[16],
  } as ViewStyle,
});
