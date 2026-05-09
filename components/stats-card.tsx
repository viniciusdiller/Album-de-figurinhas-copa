"use client"

import { UserStats } from "@/lib/types"

interface StatsCardProps {
  stats: UserStats | null
}

export function StatsCard({ stats }: StatsCardProps) {
  if (!stats) return null

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4">
        🏅 Progresso do Álbum
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
          <p className="text-2xl font-bold text-primary">{stats.obtainedStickers}</p>
          <p className="text-xs text-muted-foreground">✅ No álbum</p>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.totalStickers - stats.obtainedStickers}</p>
          <p className="text-xs text-muted-foreground">❌ Faltando</p>
        </div>
        <div className="bg-secondary/20 rounded-lg p-4 text-center border border-secondary/30">
          <p className="text-2xl font-bold text-secondary-foreground">{stats.contributedStickers}</p>
          <p className="text-xs text-muted-foreground">🌟 Contribuías por {stats.user.name.split(" ")[0]}</p>
        </div>
      </div>

      {/* Barra de progresso com gradiente Copa */}
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${stats.percentage}%`,
            background: `linear-gradient(90deg, oklch(0.40 0.18 145) 0%, oklch(0.78 0.18 85) 100%)`
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1 text-right">
        {stats.obtainedStickers} de {stats.totalStickers} figurinhas ({stats.percentage.toFixed(1)}%)
      </p>
    </div>
  )
}
