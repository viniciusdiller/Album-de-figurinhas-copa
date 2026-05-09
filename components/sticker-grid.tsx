"use client"

import { StickerWithStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StickerGridProps {
  section: string
  stickers: StickerWithStatus[]
  onToggleObtained: (sticker: StickerWithStatus) => void
  onIncrementRepeated: (sticker: StickerWithStatus) => void
  onDecrementRepeated: (sticker: StickerWithStatus) => void
  isLoading?: boolean
}

export function StickerGrid({
  section,
  stickers,
  onToggleObtained,
  onIncrementRepeated,
  onDecrementRepeated,
  isLoading,
}: StickerGridProps) {
  const sectionStickers = stickers.filter((s) => s.section === section)
  const obtainedCount = sectionStickers.filter((s) => s.obtained).length

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="bg-muted px-4 py-3 flex items-center justify-between">
        <h4 className="font-bold text-foreground">{section}</h4>
        <span className="text-sm text-muted-foreground">
          {obtainedCount}/{sectionStickers.length}
        </span>
      </div>
      
      <div className="p-3 grid grid-cols-5 gap-2">
        {sectionStickers.map((sticker) => (
          <div
            key={sticker.id}
            className={cn(
              "relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer select-none",
              sticker.obtained
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
              sticker.is_special && "ring-2 ring-accent",
              isLoading && "opacity-50 pointer-events-none"
            )}
            onClick={() => onToggleObtained(sticker)}
          >
            <span className="text-[10px] md:text-xs leading-none">
              {sticker.code.split(" ")[1]}
            </span>
            
            {sticker.obtained && sticker.repeated_count > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {sticker.repeated_count}
              </span>
            )}
          </div>
        ))}
      </div>

      {sectionStickers.some((s) => s.obtained) && (
        <div className="px-3 pb-3">
          <p className="text-[10px] text-muted-foreground mb-2">
            Repetidas (clique para ajustar):
          </p>
          <div className="flex flex-wrap gap-1">
            {sectionStickers
              .filter((s) => s.obtained)
              .map((sticker) => (
                <div
                  key={sticker.id}
                  className="flex items-center gap-1 bg-muted rounded px-2 py-1"
                >
                  <span className="text-[10px] font-medium text-foreground">
                    {sticker.code.split(" ")[1]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDecrementRepeated(sticker)
                    }}
                    disabled={sticker.repeated_count === 0 || isLoading}
                    className="w-4 h-4 rounded bg-muted-foreground/20 text-foreground text-[10px] flex items-center justify-center hover:bg-muted-foreground/30 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-[10px] text-secondary font-bold min-w-[12px] text-center">
                    {sticker.repeated_count}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onIncrementRepeated(sticker)
                    }}
                    disabled={isLoading}
                    className="w-4 h-4 rounded bg-muted-foreground/20 text-foreground text-[10px] flex items-center justify-center hover:bg-muted-foreground/30 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
