"use client"

import { StickerWithStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StickerGridProps {
  section: string
  stickers: StickerWithStatus[]
  // Clique principal: se não obtida → marca; se obtida → incrementa contribuição
  onStickerClick: (sticker: StickerWithStatus) => void
  onDecrementContributed: (sticker: StickerWithStatus) => void
}

export function StickerGrid({
  section,
  stickers,
  onStickerClick,
  onDecrementContributed,
}: StickerGridProps) {
  const sectionStickers = stickers.filter((s) => s.section === section)
  const obtainedCount = sectionStickers.filter((s) => s.obtained).length
  const percentage = sectionStickers.length > 0
    ? (obtainedCount / sectionStickers.length) * 100
    : 0

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Cabeçalho */}
      <div className="bg-muted px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="font-bold text-foreground text-sm">🌍 {section}</h4>
          <span className="text-xs font-semibold text-primary">
            {obtainedCount}/{sectionStickers.length}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, oklch(0.40 0.18 145), oklch(0.78 0.18 85))`
            }}
          />
        </div>
      </div>

      {/* Grid de figurinhas */}
      <div className="p-3 grid grid-cols-5 gap-2">
        {sectionStickers.map((sticker) => (
          <div
            key={sticker.id}
            title={sticker.obtained ? `Clique para +1 em ${sticker.code}` : `Clique para marcar ${sticker.code}`}
            className={cn(
              "relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95",
              sticker.obtained
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/80"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              sticker.is_special && "ring-2 ring-secondary ring-offset-1"
            )}
            onClick={() => onStickerClick(sticker)}
          >
            <span className="text-[10px] md:text-xs leading-none">
              {sticker.code.split(" ")[1]}
            </span>

            {sticker.obtained && sticker.contributed_count > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {sticker.contributed_count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Ajuste fino de contribuições (botão - para corrigir erros) */}
      {sectionStickers.some((s) => s.obtained && s.contributed_count > 0) && (
        <div className="px-3 pb-3">
          <p className="text-[10px] text-muted-foreground mb-2 font-medium">
            📊 Contribuições (clique na figurinha para +1, use − para corrigir):
          </p>
          <div className="flex flex-wrap gap-1">
            {sectionStickers
              .filter((s) => s.obtained && s.contributed_count > 0)
              .map((sticker) => (
                <div
                  key={sticker.id}
                  className="flex items-center gap-1 bg-muted rounded-md px-2 py-1"
                >
                  <span className="text-[10px] font-medium text-foreground">
                    {sticker.code.split(" ")[1]}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDecrementContributed(sticker) }}
                    disabled={sticker.contributed_count === 0}
                    className="w-4 h-4 rounded bg-destructive/20 text-destructive text-[10px] flex items-center justify-center hover:bg-destructive/30 disabled:opacity-30 font-bold"
                  >
                    −
                  </button>
                  <span className="text-[10px] text-secondary-foreground font-bold min-w-[12px] text-center">
                    {sticker.contributed_count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
