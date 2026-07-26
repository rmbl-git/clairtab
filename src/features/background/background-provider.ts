import type { ThemeId, BackgroundCache } from '../../domain/types'

/**
 * Theme image URLs are local SVG fallbacks (V1). They serve as the fallback
 * for the final photographic backgrounds that task 003 will add. If a remote
 * image provider fails, these SVGs (or their CSS gradient equivalents) are
 * used instead. The four themes remain visually distinguishable from each other.
 */
const THEME_IMAGES: Record<ThemeId, string> = {
  landscapes: '/backgrounds/landscapes.svg',
  architecture: '/backgrounds/architecture.svg',
  minimal: '/backgrounds/minimal.svg',
  nature: '/backgrounds/nature.svg',
}

const FALLBACK_THEME: ThemeId = 'landscapes'

const COLOR_FALLBACKS: Record<ThemeId, string> = {
  landscapes: '#1a2a3a',
  architecture: '#2a2a3a',
  minimal: '#1a1a2a',
  nature: '#1a3a2a',
}

export function getBackgroundForTheme(theme: ThemeId): BackgroundCache {
  const imageUrl = THEME_IMAGES[theme] || THEME_IMAGES[FALLBACK_THEME]
  const color = COLOR_FALLBACKS[theme] || COLOR_FALLBACKS[FALLBACK_THEME]
  const now = new Date().toISOString()
  const expires = new Date(Date.now() + 3600000).toISOString()
  return {
    theme,
    imageUrl,
    color,
    alt: `${theme} background`,
    fetchedAt: now,
    expiresAt: expires,
  }
}

export function getBackgroundImageUrl(theme: ThemeId): string {
  return THEME_IMAGES[theme] || THEME_IMAGES[FALLBACK_THEME]
}

export function getBackgroundOverlay(theme: ThemeId, intensity: string): string {
  const color = COLOR_FALLBACKS[theme] || COLOR_FALLBACKS[FALLBACK_THEME]
  const overlayMap: Record<string, string> = {
    light: color + '66',
    medium: color + '99',
    strong: color + 'CC',
  }
  return overlayMap[intensity] || overlayMap.medium
}

export function getBackgroundColor(theme: ThemeId): string {
  return COLOR_FALLBACKS[theme] || COLOR_FALLBACKS[FALLBACK_THEME]
}

export function getFallbackTheme(): ThemeId {
  return FALLBACK_THEME
}