"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { User, Sticker, StickerWithStatus, UserStats } from "@/lib/types"
import { UserSelector } from "./user-selector"
import { StatsCard } from "./stats-card"
import { StickerGrid } from "./sticker-grid"
import { SectionFilter } from "./section-filter"

const supabase = createClient()

async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name")
  
  if (error) throw error
  return data || []
}

async function fetchStickers(): Promise<Sticker[]> {
  const { data, error } = await supabase
    .from("stickers")
    .select("*")
    .order("id")
  
  if (error) throw error
  return data || []
}

async function fetchUserStickers(userId: string) {
  const { data, error } = await supabase
    .from("user_stickers")
    .select("*")
    .eq("user_id", userId)
  
  if (error) throw error
  return data || []
}

export function AlbumManager() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: users = [], isLoading: usersLoading } = useSWR("users", fetchUsers)
  const { data: stickers = [], isLoading: stickersLoading } = useSWR("stickers", fetchStickers)
  
  const { 
    data: userStickers = [], 
    mutate: mutateUserStickers,
    isLoading: userStickersLoading 
  } = useSWR(
    selectedUser ? `user-stickers-${selectedUser.id}` : null,
    () => selectedUser ? fetchUserStickers(selectedUser.id) : []
  )

  // Seções únicas
  const sections = [...new Set(stickers.map((s) => s.section))]

  // Inicializa todas as seções selecionadas quando os stickers carregam
  useEffect(() => {
    if (stickers.length > 0 && selectedSections.length === 0) {
      const uniqueSections = [...new Set(stickers.map((s) => s.section))]
      setSelectedSections(uniqueSections)
    }
  }, [stickers, selectedSections.length])

  // Combina figurinhas com status do usuário
  const stickersWithStatus: StickerWithStatus[] = stickers.map((sticker) => {
    const userSticker = userStickers.find((us) => us.sticker_id === sticker.id)
    return {
      ...sticker,
      obtained: userSticker?.obtained || false,
      repeated_count: userSticker?.repeated_count || 0,
      user_sticker_id: userSticker?.id,
    }
  })

  // Calcula estatísticas
  const stats: UserStats | null = selectedUser
    ? {
        user: selectedUser,
        totalStickers: stickers.length,
        obtainedStickers: stickersWithStatus.filter((s) => s.obtained).length,
        repeatedStickers: stickersWithStatus.reduce((acc, s) => acc + s.repeated_count, 0),
        percentage: stickers.length > 0
          ? (stickersWithStatus.filter((s) => s.obtained).length / stickers.length) * 100
          : 0,
        sectionStats: sections.map((section) => {
          const sectionStickers = stickersWithStatus.filter((s) => s.section === section)
          const obtained = sectionStickers.filter((s) => s.obtained).length
          return {
            section,
            total: sectionStickers.length,
            obtained,
            percentage: sectionStickers.length > 0 ? (obtained / sectionStickers.length) * 100 : 0,
          }
        }),
      }
    : null

  const handleToggleObtained = useCallback(async (sticker: StickerWithStatus) => {
    if (!selectedUser || isUpdating) return

    setIsUpdating(true)
    
    try {
      if (sticker.user_sticker_id) {
        await supabase
          .from("user_stickers")
          .update({ 
            obtained: !sticker.obtained,
            repeated_count: !sticker.obtained ? sticker.repeated_count : 0,
            updated_at: new Date().toISOString()
          })
          .eq("id", sticker.user_sticker_id)
      } else {
        await supabase
          .from("user_stickers")
          .insert({
            user_id: selectedUser.id,
            sticker_id: sticker.id,
            obtained: true,
            repeated_count: 0,
          })
      }
      
      await mutateUserStickers()
    } catch (error) {
      console.error("Erro ao atualizar figurinha:", error)
    } finally {
      setIsUpdating(false)
    }
  }, [selectedUser, isUpdating, mutateUserStickers])

  const handleIncrementRepeated = useCallback(async (sticker: StickerWithStatus) => {
    if (!selectedUser || isUpdating || !sticker.obtained) return

    setIsUpdating(true)
    
    try {
      if (sticker.user_sticker_id) {
        await supabase
          .from("user_stickers")
          .update({ 
            repeated_count: sticker.repeated_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", sticker.user_sticker_id)
      }
      
      await mutateUserStickers()
    } catch (error) {
      console.error("Erro ao incrementar repetidas:", error)
    } finally {
      setIsUpdating(false)
    }
  }, [selectedUser, isUpdating, mutateUserStickers])

  const handleDecrementRepeated = useCallback(async (sticker: StickerWithStatus) => {
    if (!selectedUser || isUpdating || !sticker.obtained || sticker.repeated_count === 0) return

    setIsUpdating(true)
    
    try {
      if (sticker.user_sticker_id) {
        await supabase
          .from("user_stickers")
          .update({ 
            repeated_count: sticker.repeated_count - 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", sticker.user_sticker_id)
      }
      
      await mutateUserStickers()
    } catch (error) {
      console.error("Erro ao decrementar repetidas:", error)
    } finally {
      setIsUpdating(false)
    }
  }, [selectedUser, isUpdating, mutateUserStickers])

  const handleToggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const handleSelectAllSections = () => {
    setSelectedSections(sections)
  }

  // Limpar = desmarcar todas as seções (para facilitar selecionar só 1)
  const handleClearAllSections = () => {
    setSelectedSections([])
  }

  const isLoading = usersLoading || stickersLoading || userStickersLoading

  if (isLoading && !selectedUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando álbum... ⚽</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Seleção de jogador */}
      <div className="text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Quem está jogando? 🎴
        </h2>
        <UserSelector
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      {selectedUser && (
        <>
          {/* Estatísticas */}
          <StatsCard stats={stats} />

          {/* Filtro de Seções */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <SectionFilter
              sections={sections}
              selectedSections={selectedSections}
              onToggleSection={handleToggleSection}
              onSelectAll={handleSelectAllSections}
              onClearAll={handleClearAllSections}
            />
          </div>

          {/* Grades de Figurinhas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedSections.map((section) => (
              <StickerGrid
                key={section}
                section={section}
                stickers={stickersWithStatus}
                onToggleObtained={handleToggleObtained}
                onIncrementRepeated={handleIncrementRepeated}
                onDecrementRepeated={handleDecrementRepeated}
                isLoading={isUpdating}
              />
            ))}
          </div>

          {selectedSections.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Selecione pelo menos uma seleção para ver as figurinhas 🌍
            </div>
          )}
        </>
      )}
    </div>
  )
}
