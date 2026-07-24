import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch globally for worker tests
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Import worker handler after mocking
const workerModule = await import('../src/index.ts')
const handler = workerModule.default

describe('worker', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockFetch.mockReset()
  })

  it('rejects invalid theme', async () => {
    const request = new Request('https://example.com/?theme=invalid', { method: 'GET' })
    const response = await handler(request, {})
    expect(response.status).toBe(400)
  })

  it('rejects missing theme', async () => {
    const request = new Request('https://example.com/', { method: 'GET' })
    const response = await handler(request, {})
    expect(response.status).toBe(400)
  })

  it('returns 500 when unsplash key is missing', async () => {
    const request = new Request('https://example.com/?theme=landscapes', { method: 'GET' })
    const response = await handler(request, {})
    expect(response.status).toBe(500)
  })

  it('fetches photos from Unsplash and returns normalized batch', async () => {
    const mockPhotos = Array.from({ length: 12 }).map((_, i) => ({
      id: `photo-${i}`,
      urls: { regular: `https://images.unsplash.com/photo-${i}`, small: `https://images.unsplash.com/small-${i}` },
      alt_description: `Test photo ${i}`,
      color: '#ffffff',
      user: { name: `Photographer ${i}`, links: { html: `https://unsplash.com/photographer-${i}` } },
    }))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPhotos),
    })

    const request = new Request('https://example.com/?theme=landscapes', { method: 'GET' })
    const response = await handler(request, { UNSPLASH_ACCESS_KEY: 'test-key' })
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.theme).toBe('landscapes')
    expect(data.images).toHaveLength(12)
    expect(data.images[0].photoId).toBe('photo-0')
    expect(data.images[0].photographer).toBe('Photographer 0')
    expect(data.images[0].provider).toBe('Unsplash')
    expect(data.fetchedAt).toBeDefined()
    expect(data.expiresAt).toBeDefined()
  })

  it('handles Unsplash rate limit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    })

    const request = new Request('https://example.com/?theme=nature', { method: 'GET' })
    const response = await handler(request, { UNSPLASH_ACCESS_KEY: 'test-key' })
    expect(response.status).toBe(429)
  })
})
