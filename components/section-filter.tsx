"use client"

import { cn } from "@/lib/utils"

interface SectionFilterProps {
  sections: string[]
  selectedSections: string[]
  onToggleSection: (section: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

/**
 * Ordem canônica das seções (códigos reais do banco),
 * seguindo a ordem especificada: MEX, RSA, KOR, CZE, CAN, BIH, QAT, SUI...
 * FWC fica primeiro por ser a seção de capa/introdução.
 * Seções não listadas ficam ao final.
 */
export const SECTION_ORDER: string[] = [
  "FWC",  // Copa do Mundo (capa)
  "MEX",  // México
  "RSA",  // África do Sul
  "KOR",  // Coreia do Sul
  "CZE",  // República Tcheca
  "CAN",  // Canadá
  "BIH",  // Bósnia e Herzegovina
  "QAT",  // Catar
  "SUI",  // Suíça
  "BRA",  // Brasil
  "MAR",  // Marrocos
  "HAI",  // Haiti
  "SCO",  // Escócia
  "USA",  // Estados Unidos
  "PAR",  // Paraguai
  "AUS",  // Austrália
  "TUR",  // Turquia
  "GER",  // Alemanha
  "CUW",  // Curaçao
  "CIV",  // Costa do Marfim
  "ECU",  // Equador
  "NED",  // Países Baixos
  "JPN",  // Japão
  "TUN",  // Tunísia
  "SWE",  // Suécia
  "BEL",  // Bélgica
  "EGY",  // Egito
  "IRN",  // Irã
  "NZL",  // Nova Zelândia
  "FRA",  // França
  "SEN",  // Senegal
  "NOR",  // Noruega
  "IRQ",  // Iraque
  "ARG",  // Argentina
  "AUT",  // Áustria
  "ALG",  // Argélia
  "JOR",  // Jordânia
  "POR",  // Portugal
  "COL",  // Colômbia
  "UZB",  // Uzbequistão
  "COD",  // República Democrática do Congo
  "ENG",  // Inglaterra
  "CRO",  // Croácia
  "GHA",  // Gana
  "PAN",  // Panamá
]

// Mapa de códigos de seções para nomes em PT-BR
const sectionLabels: Record<string, string> = {
  "FWC": "FWC",
  "MEX": "México",
  "RSA": "África do Sul",
  "KOR": "Coreia do Sul",
  "CZE": "República Tcheca",
  "CAN": "Canadá",
  "BIH": "Bósnia e Herzegovina",
  "QAT": "Catar",
  "SUI": "Suíça",
  "BRA": "Brasil",
  "MAR": "Marrocos",
  "HAI": "Haiti",
  "SCO": "Escócia",
  "USA": "Estados Unidos",
  "PAR": "Paraguai",
  "AUS": "Austrália",
  "TUR": "Turquia",
  "GER": "Alemanha",
  "CUW": "Curaçao",
  "CIV": "Costa do Marfim",
  "ECU": "Equador",
  "NED": "Países Baixos",
  "JPN": "Japão",
  "TUN": "Tunísia",
  "SWE": "Suécia",
  "BEL": "Bélgica",
  "EGY": "Egito",
  "IRN": "Irã",
  "NZL": "Nova Zelândia",
  "FRA": "França",
  "SEN": "Senegal",
  "NOR": "Noruega",
  "IRQ": "Iraque",
  "ARG": "Argentina",
  "AUT": "Áustria",
  "ALG": "Argélia",
  "JOR": "Jordânia",
  "POR": "Portugal",
  "COL": "Colômbia",
  "UZB": "Uzbequistão",
  "COD": "República Democrática do Congo",
  "ENG": "Inglaterra",
  "CRO": "Croácia",
  "GHA": "Gana",
  "PAN": "Panamá",
  // códigos alternativos que possam existir no banco
  "ESP": "Espanha",
  "ITA": "Itália",
  "DEN": "Dinamarca",
  "POL": "Polônia",
  "URU": "Uruguai",
  "CHI": "Chile",
  "VEN": "Venezuela",
  "IRE": "Irlanda",
  "SRB": "Sérvia",
  "WAL": "Gales",
  "HON": "Honduras",
  "CRC": "Costa Rica",
  "CMR": "Camerões",
  "NGR": "Nigéria",
  "SAU": "Arábia Saudita",
  "UKR": "Ucrânia",
  "UKR": "Ucrânia",
  // legados do PR anterior
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
}

export function getSectionLabel(section: string): string {
  return sectionLabels[section] ?? section
}

/**
 * Ordena um array de seções respeitando SECTION_ORDER.
 * Seções não previstas ficam ao final, mantendo a ordem relativa entre elas.
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
