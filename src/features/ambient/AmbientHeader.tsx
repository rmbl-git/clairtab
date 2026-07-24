const QUOTES = [
  'L\'important c\'est de ne pas s\'arrêter.',
  'Chaque geste est un pas vers l\'essentiel.',
  'Le calme commence ici.',
  'Une action à la fois.',
  'Ce qui compte est devant vous.',
  'L\'attention est la première richesse.',
  'Commencer, c\'est déjà avancer.',
  'La prochaine étape vous attend.',
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