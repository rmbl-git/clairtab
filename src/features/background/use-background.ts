import { useState, useEffect, useCallback, useRef } from 'react'
import type { BackgroundCache, BackgroundBatch } from '../../domain/types'
import { createLocalBackgroundProvider } from '../../infrastructure/background/local-background-provider'

const LOCAL_PROVIDER = createLocalBackgroundProvider()
const FALLBACK_THEME = 'landscapes' as const

export interface BackgroundState {
  cache: BackgroundCache | null
  batch: BackgroundBatch | null
  loading: boolean
  error: string | null
}

export function useBackground() {
  const [state, setState] = useState<BackgroundState>({
    cache: null,
    batch: null,
    loading: false,
    error: null,
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  const refresh = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await LOCAL_PROVIDER.getBackground({ theme: FALLBACK_THEME })
      if (controller.signal.aborted) return

      setState({
        cache: result.cache,
        batch: result.batch,
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
  }, [])

  useEffect(() => {
    refresh()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [refresh])

  return {
    ...state,
    refresh,
    localFallback: LOCAL_PROVIDER.getLocalFallback(FALLBACK_THEME),
  }
}
