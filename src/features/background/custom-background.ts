const CUSTOM_BACKGROUND_KEY = 'customBackground'
const MAX_FILE_SIZE = 8 * 1024 * 1024
const MAX_WIDTH = 2560
const MAX_HEIGHT = 1440
const WEBP_QUALITY = 0.82
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export function isAllowedImageType(type: string): boolean {
  return ALLOWED_TYPES.includes(type.toLowerCase())
}

export async function processImageFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('La photo sélectionnée dépasse la taille maximale autorisée de 8 Mo.')
  }

  if (!isAllowedImageType(file.type)) {
    throw new Error('Format de fichier non pris en charge.')
  }

  const dataUrl = await readFileAsDataURL(file)
  const image = await loadImage(dataUrl)

  let width = image.naturalWidth
  let height = image.naturalHeight

  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Impossible de traiter l\'image.')
  }
  ctx.drawImage(image, 0, 0, width, height)

  const webpDataUrl = canvas.toDataURL('image/webp', WEBP_QUALITY)
  return webpDataUrl
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Erreur lors du décodage de l\'image.'))
    image.src = src
  })
}

export async function readCustomBackground(): Promise<string | null> {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return null
  }
  return new Promise<string | null>((resolve) => {
    chrome.storage.local.get([CUSTOM_BACKGROUND_KEY], (result) => {
      if (chrome.runtime.lastError) {
        resolve(null)
        return
      }
      const value = result[CUSTOM_BACKGROUND_KEY]
      resolve(typeof value === 'string' ? value : null)
    })
  })
}

export async function writeCustomBackground(dataUrl: string): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return
  }
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set({ [CUSTOM_BACKGROUND_KEY]: dataUrl }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

export async function removeCustomBackground(): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return
  }
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.remove([CUSTOM_BACKGROUND_KEY], () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}
