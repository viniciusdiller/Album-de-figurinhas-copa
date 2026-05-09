import { AlbumManager } from "@/components/album-manager"

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-md">
            🏆 Copa do Mundo 2026
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Álbum dos CRIAS! ⚽
          </h1>
          <p className="text-lg md:text-xl text-primary font-semibold">
            Arthur Nunes, Miguel Ramalho e Pedro Pessanha
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Gerencie suas figurinhas da Copa do Mundo 2026. Marque as que você já tem e controle suas repetidas!
          </p>
        </header>

        {/* Album Manager */}
        <AlbumManager />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            🏆 Álbum dos CRIAS - Copa do Mundo 2026 ⚽
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Arthur Nunes | Miguel Ramalho | Pedro Pessanha
          </p>
        </footer>
      </div>
    </main>
  )
}
