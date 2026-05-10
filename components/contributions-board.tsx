"use client"

import { UserContribution } from "@/lib/types"

interface ContributionsBoardProps {
  contributions: UserContribution[]
  totalObtained: number
  totalStickers: number
}

const userEmojis: Record<string, string> = {
  "Arthur Nunes": "⚽",
  "Miguel Ramalho": "🏆",
  "Pedro Pessanha": "🎴",
}

export function ContributionsBoard({ contributions, totalObtained, totalStickers }: ContributionsBoardProps) {
  const sorted = [...contributions].sort((a, b) => b.contributedCount - a.contributedCount)
  const totalContributed = contributions.reduce((acc, c) => acc + c.contributedCount, 0)

  // Loser = quem tem MENOS contribuições (último depois de ordenado)
  const loser = sorted.length > 0 ? sorted[sorted.length - 1] : null
  // Só mostrar mensagem se houver contribuições e alguém realmente atrás
  const showLoserMsg = loser !== null && totalContributed > 0 && loser.contributedCount < sorted[0].contributedCount

  const podiumStyles = [
    {
      border: "border-yellow-400/60",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      numColor: "text-yellow-600 dark:text-yellow-400",
      barColor: "linear-gradient(90deg, oklch(0.78 0.18 85), oklch(0.65 0.20 75))",
      medal: "🥇",
    },
    {
      border: "border-slate-400/60",
      bg: "bg-slate-50 dark:bg-slate-900/40",
      numColor: "text-slate-600 dark:text-slate-300",
      barColor: "linear-gradient(90deg, oklch(0.55 0.06 220), oklch(0.65 0.06 220))",
      medal: "🥈",
    },
    {
      border: "border-orange-400/60",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      numColor: "text-orange-600 dark:text-orange-400",
      barColor: "linear-gradient(90deg, oklch(0.65 0.14 55), oklch(0.72 0.16 60))",
      medal: "🥉",
    },
  ]

  return (
    <div className="mt-8">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm font-bold text-primary flex items-center gap-2">
          🏆 PLACAR DOS CRIAS 🏆
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 3 boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {sorted.map((contribution, index) => {
          const emoji = userEmojis[contribution.user.name] ?? "👤"
          const style = podiumStyles[index] ?? podiumStyles[2]
          const barWidth = totalContributed > 0
            ? (contribution.contributedCount / totalContributed) * 100
            : 0
          const pct = totalContributed > 0
            ? ((contribution.contributedCount / totalContributed) * 100).toFixed(0)
            : "0"
          const firstName = contribution.user.name.split(" ")[0]
          const lastName = contribution.user.name.split(" ").slice(1).join(" ")

          return (
            <div
              key={contribution.user.id}
              className={`rounded-xl border-2 p-5 text-center transition-all duration-300 ${style.border} ${style.bg}`}
            >
              <div className="text-3xl mb-1">{style.medal}</div>
              <div className="text-4xl mb-2">{emoji}</div>

              <p className="font-bold text-base text-foreground">{firstName}</p>
              <p className="text-xs text-muted-foreground mb-4">{lastName}</p>

              {/* Número grande */}
              <div className="mb-4">
                <span className={`text-5xl font-black ${style.numColor}`}>
                  {contribution.contributedCount}
                </span>
                <p className="text-xs text-muted-foreground mt-1">figurinhas trazidas</p>
              </div>

              {/* Barra */}
              <div className="w-full bg-border rounded-full h-2.5 overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, background: style.barColor }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{pct}% do total contribuído</p>
            </div>
          )
        })}
      </div>

      {/* 🔥 Mensagem do Vineco */}
      {showLoserMsg && loser && (
        <div className="relative overflow-hidden rounded-xl border-2 border-red-400/50 bg-red-50 dark:bg-red-950/30 p-5 text-center">
          <div className="text-4xl mb-2">😬</div>
          <p className="text-base font-black text-red-600 dark:text-red-400">
            Atenção, {loser.user.name.split(" ")[0]}!
          </p>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Tá contribuindo menos que os outros... Cuidado!
          </p>
          <p className="text-lg font-black text-red-600 dark:text-red-400 mt-2">
            Quem ficar em último vai <span className="underline decoration-wavy">mamar o Vineco</span>! 🤫
          </p>
        </div>
      )}

      {/* Barra geral do álbum */}
      <div className="mt-4 bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">📖 Álbum geral</span>
          <span className="text-sm font-bold text-primary">
            {totalObtained}/{totalStickers}
            ({totalStickers > 0 ? ((totalObtained / totalStickers) * 100).toFixed(1) : "0"}%)
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${totalStickers > 0 ? (totalObtained / totalStickers) * 100 : 0}%`,
              background: `linear-gradient(90deg, oklch(0.40 0.18 145) 0%, oklch(0.78 0.18 85) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  )
}
