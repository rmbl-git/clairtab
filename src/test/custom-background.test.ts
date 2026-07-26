import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  processImageFile,
  readCustomBackground,
  writeCustomBackground,
  removeCustomBackground,
} from '../features/background/custom-background'

function mockImage(width: number, height: number) {
  vi.stubGlobal('Image', class {
    naturalWidth = width
    naturalHeight = height
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    set src(_val: string) {
      setTimeout(() => {
        if (this.onload) this.onload()
      }, 0)
    }
  })
}

function mockCanvas() {
  const mockCtx = {
    drawImage: vi.fn(),
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D | null)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/webp;base64,mockwebp')
  return mockCtx
}

describe('processImageFile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects files over 8 MB', async () => {
    const file = new File([new ArrayBuffer(9 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' })
    await expect(processImageFile(file)).rejects.toThrow('The selected photo exceeds the maximum allowed size of 8 MB.')
  })

  it('rejects unsupported file types', async () => {
    const file = new File(['hello'], 'doc.pdf', { type: 'application/pdf' })
    await expect(processImageFile(file)).rejects.toThrow('Unsupported file format.')
  })

  it('accepts jpeg, png, webp, jpg', async () => {
    const types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    for (const type of types) {
      mockImage(100, 100)
      mockCanvas()
      const file = new File(['x'], 'test', { type })
      const promise = processImageFile(file)
      await expect(promise).resolves.toBeDefined()
      vi.unstubAllGlobals()
    }
  })

  it('converts small image to webp without resizing', async () => {
    mockImage(100, 100)
    mockCanvas()

    const dataUrl = 'data:image/png;base64,mockdata'
    const file = new File([dataUrl], 'small.png', { type: 'image/png' })

    const result = await processImageFile(file)
    expect(result).toBe('data:image/webp;base64,mockwebp')
    vi.unstubAllGlobals()
  })

  it('resizes image exceeding max dimensions', async () => {
    mockImage(4000, 3000)
    const ctx = mockCanvas()

    const dataUrl = 'data:image/png;base64,mockdata'
    const file = new File([dataUrl], 'wide.png', { type: 'image/png' })

    const result = await processImageFile(file)
    expect(result).toBe('data:image/webp;base64,mockwebp')
    expect(ctx.drawImage).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })

  it('handles file read errors', async () => {
    const file = new File(['x'], 'test.png', { type: 'image/png' })
    const mockReader = {
      readAsDataURL: vi.fn(),
      result: null,
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
    }
    vi.spyOn(globalThis, 'FileReader').mockImplementation(() => mockReader as unknown as FileReader)

    setTimeout(() => {
      mockReader.onerror?.()
    }, 10)

    await expect(processImageFile(file)).rejects.toThrow('An error occurred while reading the file.')
  })
})

describe('custom background storage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('reads custom background from chrome.storage.local', async () => {
    const stored: Record<string, unknown> = { customBackground: 'data:image/webp;base64,abc' }
    const mockChrome = {
      storage: {
        local: {
          get: vi.fn((_keys: string[], cb: (result: Record<string, unknown>) => void) => cb(stored)),
          set: vi.fn(),
          remove: vi.fn(),
        },
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)

    const result = await readCustomBackground()
    expect(result).toBe('data:image/webp;base64,abc')
    vi.unstubAllGlobals()
  })

  it('returns null when chrome.storage is unavailable', async () => {
    vi.stubGlobal('chrome', { storage: { local: null }, runtime: { lastError: null } })
    const result = await readCustomBackground()
    expect(result).toBeNull()
    vi.unstubAllGlobals()
  })

  it('writes custom background to chrome.storage.local', async () => {
    const mockChrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn((_data: object, cb: () => void) => cb()),
          remove: vi.fn(),
        },
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)

    await writeCustomBackground('data:image/webp;base64,xyz')
    expect(mockChrome.storage.local.set).toHaveBeenCalledWith({ customBackground: 'data:image/webp;base64,xyz' }, expect.any(Function))
    vi.unstubAllGlobals()
  })

  it('removes custom background from chrome.storage.local', async () => {
    const mockChrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
          remove: vi.fn((_keys: string[], cb: () => void) => cb()),
        },
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)

    await removeCustomBackground()
    expect(mockChrome.storage.local.remove).toHaveBeenCalledWith(['customBackground'], expect.any(Function))
    vi.unstubAllGlobals()
  })
})
