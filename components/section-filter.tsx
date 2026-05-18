"use client"

import { cn } from "@/lib/utils"

interface SectionFilterProps {
  sections: string[]
  selectedSections: string[]
  onToggleSection: (section: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

// Ordem canônica dos grupos (Grupos A-L)
export const SECTION_ORDER: string[] = [
  "GROUP_A",
  "GROUP_B",
  "GROUP_C",
  "GROUP_D",
  "GROUP_E",
  "GROUP_F",
  "GROUP_G",
  "GROUP_H",
  "GROUP_I",
  "GROUP_J",
  "GROUP_K",
  "GROUP_L",
]

// Mapa de nomes de seções para PT-BR
const sectionLabels: Record<string, string> = {
  // Grupos A–L
  "GROUP_A": "Grupo A",
  "GROUP_B": "Grupo B",
  "GROUP_C": "Grupo C",
  "GROUP_D": "Grupo D",
  "GROUP_E": "Grupo E",
  "GROUP_F": "Grupo F",
  "GROUP_G": "Grupo G",
  "GROUP_H": "Grupo H",
  "GROUP_I": "Grupo I",
  "GROUP_J": "Grupo J",
  "GROUP_K": "Grupo K",
  "GROUP_L": "Grupo L",
  // Demais seções
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

// Rótulos das seleções dentro de cada grupo
export const GROUP_TEAM_LABELS: Record<string, string[]> = {
  GROUP_A: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
  GROUP_B: ["Canadá", "Bósnia e Herzegovina", "Catar", "Suíça"],
  GROUP_C: ["Brasil", "Marrocos", "Haiti", "Escócia"],
  GROUP_D: ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
  GROUP_E: ["Alemanha", "Curaçao", "Costa do Marfim", "Equador"],
  GROUP_F: ["Países Baixos", "Japão", "Tunísia", "Suécia"],
  GROUP_G: ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
  GROUP_H: ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
  GROUP_I: ["França", "Senegal", "Noruega", "Iraque"],
  GROUP_J: ["Argentina", "Áustria", "Argélia", "Jordânia"],
  GROUP_K: ["Portugal", "Colômbia", "Uzbequistão", "República Democrática do Congo"],
  GROUP_L: ["Inglaterra", "Croácia", "Gana", "Panamá"],
}

function getSectionLabel(section: string): string {
  return sectionLabels[section] ?? section
}

/**
 * Ordena um array de seções respeitando SECTION_ORDER.
 * Seções não previstas vão para o final, mantendo a ordem original entre elas.
 */
export function sortSections(sections: string[]): string[] {
  return [...sections].sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a)
    const ib = SECTION_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return 0
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

export function SectionFilter({
  sections,
  selectedSections,
  onToggleSection,
  onSelectAll,
  onClearAll,
}: SectionFilterProps) {
  const ordered = sortSections(sections)

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
        {ordered.map((section) => (
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
