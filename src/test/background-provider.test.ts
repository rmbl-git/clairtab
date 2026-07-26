import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLocalBackgroundProvider } from '../infrastructure/background/local-background-provider'
import type { ThemeId } from '../domain/types'

describe('local-background-provider', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a local SVG fallback for each theme', async () => {
    const provider = createLocalBackgroundProvider()
    const themes: ThemeId[] = ['landscapes', 'architecture', 'minimal', 'nature']

    for (const theme of themes) {
      const result = await provider.getBackground({ theme })
      expect(result.cache.theme).toBe(theme)
      expect(result.cache.imageUrl).toContain('.svg')
      expect(result.batch).toBeNull()
      expect(result.attribution).toBeNull()
    }
  })

  it('falls back to landscapes for unknown theme', async () => {
    const provider = createLocalBackgroundProvider()
    const result = await provider.getBackground({ theme: 'unknown' as ThemeId })
    expect(result.cache.theme).toBe('landscapes')
    expect(result.cache.imageUrl).toContain('landscapes.svg')
  })

  it('returns consistent local fallback', () => {
    const provider = createLocalBackgroundProvider()
    const fallback = provider.getLocalFallback('nature')
    expect(fallback.theme).toBe('nature')
    expect(fallback.color).toBe('#1a3a2a')
  })
})
