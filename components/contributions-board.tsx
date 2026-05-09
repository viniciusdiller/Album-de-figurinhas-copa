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

const podiumColors = [
  { bg: "bg-secondary/30 border-secondary/50", text: "text-secondary-foreground", medal: "🥇" },
  { bg: "bg-muted border-border", text: "text-foreground", medal: "🥈" },
  { bg: "bg-muted border-border", text: "text-foreground", medal: "🥉" },
]

export function ContributionsBoard({ contributions, totalObtained, totalStickers }: ContributionsBoardProps) {
  const sorted = [...contributions].sort((a, b) => b.contributedCount - a.contributedCount)
  const loser = sorted[sorted.length - 1]
  const totalContributed = contributions.reduce((acc, c) => acc + c.contributedCount, 0)

  return (
    <div className="mt-8">
      {/* Divisor temático */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm font-bold text-primary flex items-center gap-2">
          🏆 PLACAR DOS CRIAS 🏆
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 3 boxes de contribuições */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {sorted.map((contribution, index) => {
          const emoji = userEmojis[contribution.user.name] ?? "👤"
          const color = podiumColors[index] ?? podiumColors[2]
          const pct = totalContributed > 0
            ? ((contribution.contributedCount / totalContributed) * 100).toFixed(0)
            : "0"
          const barWidth = totalContributed > 0
            ? (contribution.contributedCount / totalContributed) * 100
            : 0

          return (
            <div
              key={contribution.user.id}
              className={`rounded-xl border-2 p-5 text-center ${color.bg} transition-all duration-300`}
            >
              <div className="text-3xl mb-2">{color.medal}</div>
              <div className="text-2xl mb-1">{emoji}</div>
              <p className="font-bold text-base text-foreground">
                {contribution.user.name.split(" ")[0]}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {contribution.user.name.split(" ").slice(1).join(" ")}
              </p>

              {/* Número grande de contribuições */}
              <div className="my-3">
                <span className={`text-4xl font-black ${color.text}`}>
                  {contribution.contributedCount}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">figurinhas trazidas</p>
              </div>

              {/* Barra proporcional */}
              <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background: index === 0
                      ? `linear-gradient(90deg, oklch(0.78 0.18 85), oklch(0.65 0.20 75))`
                      : `linear-gradient(90deg, oklch(0.40 0.18 145), oklch(0.55 0.16 145))`
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{pct}% do total</p>
            </div>
          )
        })}
      </div>

      {/* Mensagem do último */}
      {loser && loser.contributedCount < sorted[0]?.contributedCount && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
          <p className="text-sm font-bold text-destructive">
            🤭 {loser.user.name.split(" ")[0]} está com menos figurinhas...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Quem contribuir menos no final vai <strong>mamar o Vineco</strong>! 🤫
          </p>
        </div>
      )}

      {/* Progresso geral do álbum */}
      <div className="mt-4 bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">📖 Álbum geral</span>
          <span className="text-sm font-bold text-primary">
            {totalObtained}/{totalStickers} ({totalStickers > 0 ? ((totalObtained / totalStickers) * 100).toFixed(1) : "0"}%)
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
