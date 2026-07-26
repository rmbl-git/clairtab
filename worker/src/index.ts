const THEME_QUERIES: Record<string, string[]> = {
  landscapes: ['landscape mountains desert', 'mountain landscape', 'desert landscape'],
  architecture: ['architecture modern building', 'modern architecture', 'geometric building'],
  nature: ['nature forest ocean', 'forest nature', 'ocean nature plants'],
  minimal: ['minimal abstract monochrome', 'minimal abstract', 'monochrome composition'],
}

const ALLOWED_THEMES = new Set(Object.keys(THEME_QUERIES))

interface PixabayHit {
  id: number
  largeImageURL: string
  webformatURL: string
  previewURL: string
  tags: string
  user: string
  userImageURL: string
  pageURL: string
}

interface PhotoItem {
  photoId: string
  imageUrl: string
  previewUrl: string
  alt: string
  color: string
  photographer: string
  photographerUrl: string
  provider: string
  providerUrl: string
}

function buildPhotoItem(hit: PixabayHit): PhotoItem {
  const imageUrl = hit.largeImageURL || hit.webformatURL || hit.previewURL
  const alt = hit.tags ? hit.tags.split(',').slice(0, 5).join(', ') : 'Pixabay photo'
  const color = '#000000'

  return {
    photoId: String(hit.id),
    imageUrl,
    previewUrl: hit.previewURL,
    alt,
    color,
    photographer: hit.user,
    photographerUrl: hit.userImageURL,
    provider: 'Pixabay',
    providerUrl: 'https://pixabay.com',
  }
}

function pickQueries(theme: string): string[] {
  const queries = THEME_QUERIES[theme]
  if (!queries) return ['landscape mountains desert']
  return queries
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function corsResponse(body: string, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  })
}

export async function handleRequest(request: Request, env: Record<string, string>): Promise<Response> {
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    })
  }

  const theme = url.searchParams.get('theme')

  if (!theme || !ALLOWED_THEMES.has(theme)) {
    return corsResponse(JSON.stringify({ error: 'Invalid theme' }), 400)
  }

  if (!env.PIXABAY_API_KEY) {
    return corsResponse(JSON.stringify({ error: 'Server misconfigured' }), 500)
  }

  const queries = pickQueries(theme)
  const query = queries[Math.floor(Math.random() * queries.length)]
  const perPage = 20

  const pixabayUrl = new URL('https://pixabay.com/api/')
  pixabayUrl.searchParams.set('key', env.PIXABAY_API_KEY)
  pixabayUrl.searchParams.set('q', query)
  pixabayUrl.searchParams.set('image_type', 'photo')
  pixabayUrl.searchParams.set('orientation', 'horizontal')
  pixabayUrl.searchParams.set('per_page', String(perPage))
  pixabayUrl.searchParams.set('page', '1')
  pixabayUrl.searchParams.set('safesearch', 'true')

  try {
    const response = await fetch(pixabayUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        return corsResponse(JSON.stringify({ error: 'Rate limit exceeded' }), 429)
      }
      return corsResponse(JSON.stringify({ error: 'Upstream error' }), response.status)
    }

    const data = (await response.json()) as unknown
    const hits: PixabayHit[] = (data as { hits?: PixabayHit[] }).hits || []

    const validHits = hits.filter((hit) => hit.largeImageURL || hit.webformatURL)

    if (!validHits.length) {
      return corsResponse(JSON.stringify({ error: 'No photos' }), 502)
    }

    const images: PhotoItem[] = validHits.map(buildPhotoItem)
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
          ...CORS_HEADERS,
        },
      }
    )
  } catch {
    return corsResponse(JSON.stringify({ error: 'Network error' }), 502)
  }
}

export default {
  fetch: handleRequest,
}
