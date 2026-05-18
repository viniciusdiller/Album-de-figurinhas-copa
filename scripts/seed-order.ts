/**
 * Script para atualizar a ordem das seleções no banco de dados Supabase.
 * Ordem definida conforme os grupos do álbum da Copa do Mundo.
 *
 * Execução:
 *   npx tsx scripts/seed-order.ts
 *
 * Requer variáveis de ambiente:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Ordem EXATA das seleções por grupo
// Grupo H: ESP, CPV, KSA, URU ainda não existem no banco — adicionar manualmente se necessário
const SELECOES_ORDEM: { section: string; group: string; section_order: number }[] = [
  // Grupo A
  { section: 'MEX', group: 'A', section_order: 1 },
  { section: 'RSA', group: 'A', section_order: 2 },
  { section: 'KOR', group: 'A', section_order: 3 },
  { section: 'CZE', group: 'A', section_order: 4 },
  // Grupo B
  { section: 'CAN', group: 'B', section_order: 5 },
  { section: 'BIH', group: 'B', section_order: 6 },
  { section: 'QAT', group: 'B', section_order: 7 },
  { section: 'SUI', group: 'B', section_order: 8 },
  // Grupo C
  { section: 'BRA', group: 'C', section_order: 9 },
  { section: 'MAR', group: 'C', section_order: 10 },
  { section: 'HAI', group: 'C', section_order: 11 },
  { section: 'SCO', group: 'C', section_order: 12 },
  // Grupo D
  { section: 'USA', group: 'D', section_order: 13 },
  { section: 'PAR', group: 'D', section_order: 14 },
  { section: 'AUS', group: 'D', section_order: 15 },
  { section: 'TUR', group: 'D', section_order: 16 },
  // Grupo E
  { section: 'GER', group: 'E', section_order: 17 },
  { section: 'CUW', group: 'E', section_order: 18 },
  { section: 'CIV', group: 'E', section_order: 19 },
  { section: 'ECU', group: 'E', section_order: 20 },
  // Grupo F
  { section: 'NED', group: 'F', section_order: 21 },
  { section: 'JPN', group: 'F', section_order: 22 },
  { section: 'TUN', group: 'F', section_order: 23 },
  { section: 'SWE', group: 'F', section_order: 24 },
  // Grupo G
  { section: 'BEL', group: 'G', section_order: 25 },
  { section: 'EGY', group: 'G', section_order: 26 },
  { section: 'IRN', group: 'G', section_order: 27 },
  { section: 'NZL', group: 'G', section_order: 28 },
  // Grupo H — ⚠️ ESP, CPV, KSA, URU NÃO existem no banco ainda!
  // { section: 'ESP', group: 'H', section_order: 29 }, // Espanha
  // { section: 'CPV', group: 'H', section_order: 30 }, // Cabo Verde
  // { section: 'KSA', group: 'H', section_order: 31 }, // Arábia Saudita
  // { section: 'URU', group: 'H', section_order: 32 }, // Uruguai
  // Grupo I
  { section: 'FRA', group: 'I', section_order: 33 },
  { section: 'SEN', group: 'I', section_order: 34 },
  { section: 'NOR', group: 'I', section_order: 35 },
  { section: 'IRQ', group: 'I', section_order: 36 },
  // Grupo J
  { section: 'ARG', group: 'J', section_order: 37 },
  { section: 'AUT', group: 'J', section_order: 38 },
  { section: 'ALG', group: 'J', section_order: 39 },
  { section: 'JOR', group: 'J', section_order: 40 },
  // Grupo K
  { section: 'POR', group: 'K', section_order: 41 },
  { section: 'COL', group: 'K', section_order: 42 },
  { section: 'UZB', group: 'K', section_order: 43 },
  { section: 'COD', group: 'K', section_order: 44 },
  // Grupo L
  { section: 'ENG', group: 'L', section_order: 45 },
  { section: 'CRO', group: 'L', section_order: 46 },
  { section: 'GHA', group: 'L', section_order: 47 },
  { section: 'PAN', group: 'L', section_order: 48 },
]

async function main() {
  console.log('🔄 Atualizando order das seleções...')

  for (const { section, group, section_order } of SELECOES_ORDEM) {
    const { error } = await supabase
      .from('stickers')
      .update({ section_order })
      .eq('section', section)

    if (error) {
      console.error(`❌ Erro ao atualizar ${section} (Grupo ${group}):`, error.message)
    } else {
      console.log(`✅ ${section} (Grupo ${group}) → section_order: ${section_order}`)
    }
  }

  console.log('\n✨ Concluído!')
  console.log('⚠️  ATENÇÃO: As seleções do Grupo H (ESP, CPV, KSA, URU) não existem no banco.')
  console.log('   Adicione-as manualmente ou via migration SQL antes de reexecutar.')
}

main()
