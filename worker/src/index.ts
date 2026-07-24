const THEME_QUERIES: Record<string, string[]> = {
  landscapes: ['landscapes', 'mountains', 'desert dunes'],
  architecture: ['modern architecture', 'brutalism', 'geometric building'],
  nature: ['forest', 'ocean', 'botanical'],
  minimal: ['minimal abstract', 'minimal interior', 'monochrome composition'],
}

const ALLOWED_THEMES = new Set(Object.keys(THEME_QUERIES))

interface Photo {
  id: string
  urls: {
    regular: string
    small: string
  }
  alt_description: string | null
  color: string | null
  user: {
    name: string
    links: {
      html: string
    }
  }
}

interface PhotoItem {
  photoId: string
  imageUrl: string
  alt: string
  color: string
  photographer: string
  photographerUrl: string
  provider: string
  providerUrl: string
}

function buildPhotoItem(photo: Photo): PhotoItem {
  return {
    photoId: photo.id,
    imageUrl: photo.urls.regular,
    alt: photo.alt_description || 'Unsplash photo',
    color: photo.color || '#000000',
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    provider: 'Unsplash',
    providerUrl: 'https://unsplash.com',
  }
}

function pickQueries(theme: string): string[] {
  const queries = THEME_QUERIES[theme]
  if (!queries) return ['landscapes']
  return queries
}

export default {
  async fetch(request: Request, env: Record<string, string>): Promise<Response> {
    const url = new URL(request.url)
    const theme = url.searchParams.get('theme')

    if (!theme || !ALLOWED_THEMES.has(theme)) {
      return new Response(JSON.stringify({ error: 'Invalid theme' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!env.UNSPLASH_ACCESS_KEY) {
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const queries = pickQueries(theme)
    const query = queries[Math.floor(Math.random() * queries.length)]
    const count = 12

    const unsplashUrl = new URL('https://api.unsplash.com/photos/random')
    unsplashUrl.searchParams.set('query', query)
    unsplashUrl.searchParams.set('count', String(count))
    unsplashUrl.searchParams.set('orientation', 'landscape')
    unsplashUrl.searchParams.set('client_id', env.UNSPLASH_ACCESS_KEY)

    try {
      const response = await fetch(unsplashUrl.toString(), {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return new Response(JSON.stringify({ error: 'Upstream error' }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const data = (await response.json()) as unknown
      const photos: Photo[] = Array.isArray(data) ? data : [data]

      if (!photos.length) {
        return new Response(JSON.stringify({ error: 'No photos' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const images: PhotoItem[] = photos.map(buildPhotoItem)
      const now = new Date().toISOString()
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

      return new Response(
        JSON.stringify({
          theme,
          images,
          fetchedAt: now,
          expiresAt: expires,
          lastDisplayedPhotoId: null,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
          },
        }
      )
    } catch {
      return new Response(JSON.stringify({ error: 'Network error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
}
