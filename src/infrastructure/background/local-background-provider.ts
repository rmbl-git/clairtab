import type { ThemeId, BackgroundCache } from '../../domain/types'
import type { BackgroundProvider, BackgroundProviderOptions, BackgroundProviderResult } from './background-provider'

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

function buildCache(theme: ThemeId): BackgroundCache {
  const normalized = THEME_IMAGES[theme] ? theme : FALLBACK_THEME
  const imageUrl = THEME_IMAGES[normalized]
  const color = COLOR_FALLBACKS[normalized]
  const now = new Date().toISOString()
  const expires = new Date(Date.now() + 3600000).toISOString()
  return {
    theme: normalized,
    imageUrl,
    color,
    alt: `${normalized} background`,
    fetchedAt: now,
    expiresAt: expires,
  }
}

export function createLocalBackgroundProvider(): BackgroundProvider {
  return {
    async getBackground(_options: BackgroundProviderOptions): Promise<BackgroundProviderResult> {
      const cache = buildCache(_options.theme)
      return {
        cache,
        batch: null,
        attribution: null,
      }
    },
    getLocalFallback(theme: ThemeId): BackgroundCache {
      return buildCache(theme)
    },
  }
}
