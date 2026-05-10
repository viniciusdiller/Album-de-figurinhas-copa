"use client"

import { cn } from "@/lib/utils"

interface SectionFilterProps {
  sections: string[]
  selectedSections: string[]
  onToggleSection: (section: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

// Mapa de nomes de seções para PT-BR
const sectionLabels: Record<string, string> = {
  // Grupos do álbum (adicione mais conforme necessário)
  "GROUP_A": "Grupo A",
  "GROUP_B": "Grupo B",
  "GROUP_C": "Grupo C",
  "GROUP_D": "Grupo D",
  "GROUP_E": "Grupo E",
  "GROUP_F": "Grupo F",
  "GROUP_G": "Grupo G",
  "GROUP_H": "Grupo H",
  "INTRO": "Introdução",
  "STADIUMS": "Estádios",
  "LEGENDS": "Lendas",
  "PLAYERS": "Jogadores",
  "TEAMS": "Seleções",
  "SPECIAL": "Especiais",
  "WORLD_CUP": "Copa do Mundo",
  "FIFA": "FIFA",
  "HOSTS": "Países Sede",
  "USA": "Estados Unidos",
  "CANADA": "Canadá",
  "MEXICO": "México",
}

function getSectionLabel(section: string): string {
  return sectionLabels[section] ?? section
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
        <h4 className="text-sm font-semibold text-foreground">Filtrar por Seleção 🌍</h4>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
          >
            Todas
          </button>
          <span className="text-muted-foreground">|</span>
          {/* Limpar = desmarcar todas as seleções para facilitar escolher só 1 */}
          <button
            onClick={onClearAll}
            className="text-xs text-destructive hover:text-destructive/80 hover:underline font-medium transition-colors"
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
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
              selectedSections.includes(section)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            {getSectionLabel(section)}
          </button>
        ))}
      </div>

      {selectedSections.length === 0 && sections.length > 0 && (
        <p className="text-xs text-muted-foreground italic">
          💡 Dica: clique em uma seleção para ver suas figurinhas
        </p>
      )}
    </div>
  )
}
