"use client"

import { cn } from "@/lib/utils"

interface SectionFilterProps {
  sections: string[]
  selectedSections: string[]
  onToggleSection: (section: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export function SectionFilter({
  sections,
  selectedSections,
  onToggleSection,
  onSelectAll,
  onClearAll,
}: SectionFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Filtrar por Selecao</h4>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs text-primary hover:underline"
          >
            Todas
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={onClearAll}
            className="text-xs text-primary hover:underline"
          >
            Limpar
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => onToggleSection(section)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              selectedSections.includes(section)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {section}
          </button>
        ))}
      </div>
    </div>
  )
}
