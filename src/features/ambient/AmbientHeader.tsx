const QUOTES = [
  'What matters is to keep going.',
  'Every step brings you closer to what matters.',
  'Calm begins here.',
  'One action at a time.',
  'What matters is ahead of you.',
  'Attention is your greatest resource.',
  'Starting is already moving forward.',
  'The next step is waiting.',
]

function getQuote(): string {
  const index = new Date().getDate() % QUOTES.length
  return QUOTES[index]
}

export function AmbientHeader() {
  return (
    <div className="claritab-ambient" aria-hidden="true">
      <p className="claritab-quote">{getQuote()}</p>
    </div>
  )
}