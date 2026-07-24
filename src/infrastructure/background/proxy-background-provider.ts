import type { BackgroundProvider, BackgroundProviderOptions, BackgroundProviderResult } from './background-provider'
import type { ThemeId, BackgroundImage, BackgroundBatch, BackgroundCache } from '../../domain/types'

function isBackgroundImage(obj: unknown): obj is BackgroundImage {
  if (!obj || typeof obj !== 'object') return false
  const item = obj as Record<string, unknown>
  return (
    typeof item.photoId === 'string' &&
    typeof item.imageUrl === 'string' &&
    typeof item.alt === 'string' &&
    typeof item.color === 'string' &&
    typeof item.photographer === 'string' &&
    typeof item.photographerUrl === 'string' &&
    typeof item.provider === 'string' &&
    typeof item.providerUrl === 'string'
  )
}

function isBackgroundBatch(obj: unknown): obj is BackgroundBatch {
  if (!obj || typeof obj !== 'object') return false
  const batch = obj as Record<string, unknown>
  if (typeof batch.theme !== 'string') return false
  if (!Array.isArray(batch.images)) return false
  if (!batch.images.every(isBackgroundImage)) return false
  if (typeof batch.fetchedAt !== 'string') return false
  if (typeof batch.expiresAt !== 'string') return false
  if (batch.lastDisplayedPhotoId !== null && typeof batch.lastDisplayedPhotoId !== 'string') return false
  return true
}

export function createProxyBackgroundProvider(
  getLocalFallback: (theme: ThemeId) => BackgroundCache,
  proxyUrl?: string
): BackgroundProvider {
  const rawProxyUrl = proxyUrl ?? import.meta.env.VITE_BACKGROUND_PROXY_URL
  const PROXY_URL = rawProxyUrl || undefined
  const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours
  const REQUEST_TIMEOUT_MS = 1000 * 15 // 15 seconds

  async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { signal: controller.signal })
      return response
    } finally {
      clearTimeout(timeout)
    }
  }

  async function requestBatch(theme: ThemeId): Promise<BackgroundBatch | null> {
    if (!PROXY_URL) {
      throw new Error('Proxy not configured')
    }
    const url = `${PROXY_URL}?theme=${encodeURIComponent(theme)}`
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS)
    if (!response.ok) {
      throw new Error(`Proxy responded with ${response.status}`)
    }
    const data = (await response.json()) as unknown
    if (!isBackgroundBatch(data)) {
      throw new Error('Invalid batch response')
    }
    if (data.theme !== theme) {
      throw new Error('Theme mismatch in batch response')
    }
    return data
  }

  function pickImage(batch: BackgroundBatch, excludePhotoId: string | null): BackgroundImage {
    const available = excludePhotoId
      ? batch.images.filter((img: BackgroundImage) => img.photoId !== excludePhotoId)
      : batch.images
    if (available.length === 0) {
      return batch.images[0]
    }
    const index = Math.floor(Math.random() * available.length)
    return available[index]
  }

  return {
    async getBackground(options: BackgroundProviderOptions): Promise<BackgroundProviderResult> {
      const { theme, excludePhotoId = null } = options

      if (!PROXY_URL) {
        return {
          cache: getLocalFallback(theme),
          batch: null,
          attribution: null,
        }
      }

      try {
        const batch = await requestBatch(theme)
        if (!batch) {
          return {
            cache: getLocalFallback(theme),
            batch: null,
            attribution: null,
          }
        }

        const image = pickImage(batch, excludePhotoId)
        const cache: BackgroundCache = {
          theme,
          imageUrl: image.imageUrl,
          color: image.color,
          alt: image.alt,
          fetchedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
        }

        const attribution = {
          photographer: image.photographer,
          photographerUrl: image.photographerUrl,
          provider: image.provider,
          providerUrl: image.providerUrl,
        }

        return {
          cache,
          batch: {
            ...batch,
            lastDisplayedPhotoId: image.photoId,
          },
          attribution,
        }
      } catch {
        return {
          cache: getLocalFallback(theme),
          batch: null,
          attribution: null,
        }
      }
    },
    getLocalFallback(theme: ThemeId): BackgroundCache {
      return getLocalFallback(theme)
    },
  }
}
