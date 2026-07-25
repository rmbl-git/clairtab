export default function App() {
  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gray-800" aria-hidden="true" />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-wide text-white/90">ClairTab</h1>
            <p className="mt-1 text-sm text-gray-400">Votre point de départ.</p>
          </div>
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
            <p className="text-gray-300 text-sm">Prêt.</p>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2" role="list" aria-label="Shortcuts">
              <span className="block w-14 h-14 bg-black/40 border border-white/10 rounded-xl" role="listitem" aria-hidden="true" />
              <span className="block w-14 h-14 bg-black/40 border border-white/10 rounded-xl" role="listitem" aria-hidden="true" />
              <span className="block w-14 h-14 bg-black/40 border border-white/10 rounded-xl" role="listitem" aria-hidden="true" />
            </div>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">ClairTab</p>
      </footer>
    </div>
  )
}