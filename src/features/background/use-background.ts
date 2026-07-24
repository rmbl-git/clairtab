import { useState, useEffect, useCallback, useRef } from 'react'
import type { BackgroundCache, BackgroundBatch, Preferences } from '../../domain/types'
import { createLocalBackgroundProvider } from '../../infrastructure/background/local-background-provider'
import { createProxyBackgroundProvider } from '../../infrastructure/background/proxy-background-provider'

const LOCAL_PROVIDER = createLocalBackgroundProvider()

export interface BackgroundState {
  cache: BackgroundCache | null
  batch: BackgroundBatch | null
  attribution: {
    photographer: string
    photographerUrl: string
    provider: string
    providerUrl: string
  } | null
  loading: boolean
  error: string | null
}

export function useBackground(preferences: Preferences) {
  const [state, setState] = useState<BackgroundState>({
    cache: null,
    batch: null,
    attribution: null,
    loading: false,
    error: null,
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  const provider = preferences.localBackgroundsOnly
    ? LOCAL_PROVIDER
    : (() => {
        const proxy = createProxyBackgroundProvider(
          () => LOCAL_PROVIDER.getLocalFallback(preferences.theme),
          import.meta.env.VITE_BACKGROUND_PROXY_URL
        )
        return proxy
      })()

  const refresh = useCallback(
    async (force: boolean = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      const controller = new AbortController()
      abortControllerRef.current = controller

      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const result = await provider.getBackground({
          theme: preferences.theme,
          forceRefresh: force,
          excludePhotoId: state.batch?.lastDisplayedPhotoId ?? null,
        })

        if (controller.signal.aborted) return

        setState({
          cache: result.cache,
          batch: result.batch,
          attribution: result.attribution,
          loading: false,
          error: null,
        })
      } catch (err) {
        if (controller.signal.aborted) return
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load background',
        }))
      }
    },
    [provider, preferences.theme, preferences.localBackgroundsOnly, state.batch?.lastDisplayedPhotoId]
  )

  useEffect(() => {
    refresh()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [preferences.theme, preferences.localBackgroundsOnly])

  return {
    ...state,
    refresh,
    localFallback: LOCAL_PROVIDER.getLocalFallback(preferences.theme),
  }
}
