import type { ThemeId, BackgroundBatch, BackgroundCache } from '../../domain/types'

export interface BackgroundProviderOptions {
  theme: ThemeId
  forceRefresh?: boolean
  excludePhotoId?: string | null
}

export interface BackgroundProviderResult {
  cache: BackgroundCache
  batch: BackgroundBatch | null
  attribution: {
    photographer: string
    photographerUrl: string
    provider: string
    providerUrl: string
  } | null
}

export interface BackgroundProvider {
  getBackground(options: BackgroundProviderOptions): Promise<BackgroundProviderResult>
  getLocalFallback(theme: ThemeId): BackgroundCache
}
