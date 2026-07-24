import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProxyBackgroundProvider } from '../infrastructure/background/proxy-background-provider'
import type { ThemeId, BackgroundCache, BackgroundBatch } from '../domain/types'

function createMockBatch(theme: ThemeId, count: number = 12): BackgroundBatch {
  return {
    theme,
    images: Array.from({ length: count }).map((_, i) => ({
      photoId: `photo-${i}`,
      imageUrl: `https://images.unsplash.com/photo-${i}`,
      alt: `Test photo ${i}`,
      color: '#ffffff',
      photographer: `Photographer ${i}`,
      photographerUrl: `https://unsplash.com/photographer-${i}`,
      provider: 'Unsplash',
      providerUrl: 'https://unsplash.com',
    })),
    fetchedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    lastDisplayedPhotoId: null,
  }
}

function createLocalFallbackForTheme(theme: ThemeId): BackgroundCache {
  const urls: Record<ThemeId, string> = {
    landscapes: '/backgrounds/landscapes.svg',
    architecture: '/backgrounds/architecture.svg',
    minimal: '/backgrounds/minimal.svg',
    nature: '/backgrounds/nature.svg',
  }
  const colors: Record<ThemeId, string> = {
    landscapes: '#1a2a3a',
    architecture: '#2a2a3a',
    minimal: '#1a1a2a',
    nature: '#1a3a2a',
  }
  return {
    theme,
    imageUrl: urls[theme] || urls.landscapes,
    color: colors[theme] || colors.landscapes,
    alt: `${theme} background`,
    fetchedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  }
}

describe('proxy-background-provider', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.stubGlobal('import.meta', { env: { VITE_BACKGROUND_PROXY_URL: 'https://proxy.example.com' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns local fallback when proxy is not configured', async () => {
    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('landscapes'), '')
    const result = await provider.getBackground({ theme: 'landscapes' })
    expect(result.cache.imageUrl).toContain('landscapes.svg')
    expect(result.batch).toBeNull()
    expect(result.attribution).toBeNull()
  })

  it('fetches batch from proxy and returns attribution', async () => {
    const mockBatch = createMockBatch('landscapes')
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBatch),
    })
    vi.stubGlobal('fetch', mockFetch)
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('landscapes'), 'https://proxy.example.com')
    const result = await provider.getBackground({ theme: 'landscapes' })

    expect(result.cache.imageUrl).toBe(mockBatch.images[0].imageUrl)
    expect(result.cache.color).toBe(mockBatch.images[0].color)
    expect(result.batch).not.toBeNull()
    expect(result.batch?.images).toHaveLength(12)
    expect(result.attribution?.photographer).toBe('Photographer 0')
    expect(result.attribution?.provider).toBe('Unsplash')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('returns local fallback for requested theme on network error', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', mockFetch)

    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('nature'), 'https://proxy.example.com')
    const result = await provider.getBackground({ theme: 'nature' })

    expect(result.cache.imageUrl).toContain('nature.svg')
    expect(result.cache.theme).toBe('nature')
    expect(result.batch).toBeNull()
    expect(result.attribution).toBeNull()
  })

  it('returns local fallback for requested theme on invalid response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: true }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('architecture'), 'https://proxy.example.com')
    const result = await provider.getBackground({ theme: 'architecture' })

    expect(result.cache.imageUrl).toContain('architecture.svg')
    expect(result.cache.theme).toBe('architecture')
    expect(result.batch).toBeNull()
  })

  it('returns local fallback for requested theme on proxy error status', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    vi.stubGlobal('fetch', mockFetch)

    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('minimal'), 'https://proxy.example.com')
    const result = await provider.getBackground({ theme: 'minimal' })

    expect(result.cache.imageUrl).toContain('minimal.svg')
    expect(result.cache.theme).toBe('minimal')
    expect(result.batch).toBeNull()
  })

  it('excludes last displayed photo when picking new image', async () => {
    const mockBatch = createMockBatch('landscapes')
    mockBatch.lastDisplayedPhotoId = 'photo-0'
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBatch),
    })
    vi.stubGlobal('fetch', mockFetch)
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('landscapes'), 'https://proxy.example.com')
    const result = await provider.getBackground({ theme: 'landscapes', excludePhotoId: 'photo-0' })

    expect(result.cache.imageUrl).toBe(mockBatch.images[1].imageUrl)
    expect(result.batch?.lastDisplayedPhotoId).toBe('photo-1')
  })

  it('returns an image from the batch that is different from the excluded one', async () => {
    const mockBatch = createMockBatch('landscapes')
    mockBatch.lastDisplayedPhotoId = 'photo-0'
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBatch),
    })
    vi.stubGlobal('fetch', mockFetch)
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const provider = createProxyBackgroundProvider(() => createLocalFallbackForTheme('landscapes'), 'https://proxy.example.com')
    const result = await provider.getBackground({ theme: 'landscapes', excludePhotoId: 'photo-0' })

    const selectedImage = mockBatch.images.find((img) => img.imageUrl === result.cache.imageUrl)
    expect(selectedImage).toBeDefined()
    expect(selectedImage?.photoId).not.toBe('photo-0')
    expect(result.batch?.lastDisplayedPhotoId).toBe(selectedImage?.photoId)
  })
})
