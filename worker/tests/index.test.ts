import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleRequest } from '../src/index.ts'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('worker', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockFetch.mockReset()
  })

  it('rejects invalid theme', async () => {
    const request = new Request('https://example.com/?theme=invalid', { method: 'GET' })
    const response = await handleRequest(request, {})
    expect(response.status).toBe(400)
  })

  it('rejects missing theme', async () => {
    const request = new Request('https://example.com/', { method: 'GET' })
    const response = await handleRequest(request, {})
    expect(response.status).toBe(400)
  })

  it('returns 500 when pixabay key is missing', async () => {
    const request = new Request('https://example.com/?theme=landscapes', { method: 'GET' })
    const response = await handleRequest(request, {})
    expect(response.status).toBe(500)
  })

  it('fetches photos from Pixabay and returns normalized batch', async () => {
    const mockHits = Array.from({ length: 12 }).map((_, i) => ({
      id: 1000 + i,
      largeImageURL: `https://cdn.pixabay.com/photo/large-${i}`,
      webformatURL: `https://cdn.pixabay.com/photo/webformat-${i}`,
      previewURL: `https://cdn.pixabay.com/photo/preview-${i}`,
      tags: `tag${i}, nature, landscape`,
      user: `User${i}`,
      userImageURL: `https://pixabay.com/users/user${i}`,
      pageURL: `https://pixabay.com/photos/photo-${i}`,
    }))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ hits: mockHits }),
    })

    const request = new Request('https://example.com/?theme=landscapes', { method: 'GET' })
    const response = await handleRequest(request, { PIXABAY_API_KEY: 'test-key' })
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.theme).toBe('landscapes')
    expect(data.images).toHaveLength(12)
    expect(data.images[0].photoId).toBe('1000')
    expect(data.images[0].photographer).toBe('User0')
    expect(data.images[0].provider).toBe('Pixabay')
    expect(data.images[0].imageUrl).toBe('https://cdn.pixabay.com/photo/large-0')
    expect(data.fetchedAt).toBeDefined()
    expect(data.expiresAt).toBeDefined()
  })

  it('handles Pixabay rate limit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    })

    const request = new Request('https://example.com/?theme=nature', { method: 'GET' })
    const response = await handleRequest(request, { PIXABAY_API_KEY: 'test-key' })
    expect(response.status).toBe(429)
  })

  it('filters hits without usable image URL', async () => {
    const mockHits = [
      {
        id: 1,
        largeImageURL: '',
        webformatURL: '',
        previewURL: '',
        tags: 'test',
        user: 'User1',
        userImageURL: 'https://pixabay.com/users/user1',
        pageURL: 'https://pixabay.com/photos/photo-1',
      },
      {
        id: 2,
        largeImageURL: 'https://cdn.pixabay.com/photo/large-2',
        webformatURL: '',
        previewURL: '',
        tags: 'test',
        user: 'User2',
        userImageURL: 'https://pixabay.com/users/user2',
        pageURL: 'https://pixabay.com/photos/photo-2',
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ hits: mockHits }),
    })

    const request = new Request('https://example.com/?theme=architecture', { method: 'GET' })
    const response = await handleRequest(request, { PIXABAY_API_KEY: 'test-key' })
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.images).toHaveLength(1)
    expect(data.images[0].photoId).toBe('2')
  })

  it('returns CORS headers on successful response', async () => {
    const mockHits = Array.from({ length: 3 }).map((_, i) => ({
      id: 2000 + i,
      largeImageURL: `https://cdn.pixabay.com/photo/large-${i}`,
      webformatURL: `https://cdn.pixabay.com/photo/webformat-${i}`,
      previewURL: `https://cdn.pixabay.com/photo/preview-${i}`,
      tags: `tag${i}, nature, landscape`,
      user: `User${i}`,
      userImageURL: `https://pixabay.com/users/user${i}`,
      pageURL: `https://pixabay.com/photos/photo-${i}`,
    }))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ hits: mockHits }),
    })

    const request = new Request('https://example.com/?theme=landscapes', { method: 'GET' })
    const response = await handleRequest(request, { PIXABAY_API_KEY: 'test-key' })
    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS')
    expect(response.headers.get('access-control-allow-headers')).toBe('Content-Type')
  })

  it('returns CORS headers on error response', async () => {
    const request = new Request('https://example.com/?theme=invalid', { method: 'GET' })
    const response = await handleRequest(request, {})
    expect(response.status).toBe(400)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS')
    expect(response.headers.get('access-control-allow-headers')).toBe('Content-Type')
  })

  it('handles OPTIONS preflight request', async () => {
    const request = new Request('https://example.com/?theme=landscapes', { method: 'OPTIONS' })
    const response = await handleRequest(request, { PIXABAY_API_KEY: 'test-key' })
    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS')
    expect(response.headers.get('access-control-allow-headers')).toBe('Content-Type')
  })
})
