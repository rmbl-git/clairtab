import { useState } from 'react'

interface Props {
  onSubmit: (query: string) => string | null
}

export function SearchPanel({ onSubmit }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) {
      setError("Search query cannot be empty.")
      return
    }
    const err = onSubmit(trimmed)
    if (err) {
      setError(err)
    } else {
      setInput('')
      setError(null)
    }
  }

  return (
    <form className="claritab-search-panel" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="sr-only">
        Search Google
      </label>
      <input
        id="search-input"
        type="search"
        className="claritab-search-input"
        placeholder="Search Google..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          if (error) setError(null)
        }}
        aria-describedby={error ? 'search-error' : undefined}
      />
      <button
        type="submit"
        className="claritab-search-submit"
        aria-label="Submit search"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      {error && (
        <p id="search-error" className="claritab-search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}