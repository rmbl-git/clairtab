declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[], callback?: (result: Record<string, unknown>) => void): void
      set(items: Record<string, unknown>, callback?: () => void): void
      remove(keys: string | string[], callback?: () => void): void
      clear(callback?: () => void): void
      getBytesInUse(keys: string | string[], callback?: (bytes: number) => void): void
    }
    const local: StorageArea
  }
  namespace runtime {
    let lastError: { message: string } | undefined
  }
}