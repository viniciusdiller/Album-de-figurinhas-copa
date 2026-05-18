"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { User, Sticker, StickerWithStatus, UserStats, AlbumSticker, UserContribution } from "@/lib/types"
import { UserSelector } from "./user-selector"
import { StatsCard } from "./stats-card"
import { StickerGrid } from "./sticker-grid"
import { SectionFilter, getSectionLabel } from "./section-filter"
import { ContributionsBoard } from "./contributions-board"

const supabase = createClient()

async function callIncrementContribution(userId: string, stickerId: number, delta: number) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/increment_contribution`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    body: JSON.stringify({ p_user_id: userId, p_sticker_id: stickerId, p_delta: delta }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`RPC error: ${err}`)
  }
}

async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("name")
  if (error) throw error
  return data || []
}

async function fetchStickers(): Promise<Sticker[]> {
  // Ordenado diretamente pelo banco usando a coluna section_order
  const { data, error } = await supabase
    .from("stickers")
    .select("*")
    .order("section_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true })
  if (error) throw error
  return data || []
}

async function fetchAlbumStickers(): Promise<AlbumSticker[]> {
  const { data, error } = await supabase.from("album_stickers").select("*")
  if (error) throw error
  return data || []
}

async function fetchUserStickers(userId: string) {
  const { data, error } = await supabase
    .from("user_stickers")
    .select("sticker_id, contributed_count")
    .eq("user_id", userId)
  if (error) throw error
  return data || []
}

async function fetchAllUserStickers() {
  const { data, error } = await supabase
    .from("user_stickers")
    .select("user_id, contributed_count")
  if (error) throw error
  return data || []
}

export function AlbumManager() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const sectionsInitialized = useRef(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: users = [] } = useSWR("users", fetchUsers)
  const { data: stickers = [], isLoading: stickersLoading } = useSWR("stickers", fetchStickers)

  const { data: albumStickers = [], mutate: mutateAlbum } = useSWR(
    "album-stickers",
    fetchAlbumStickers,
    { refreshInterval: 5000 }
  )

  const { data: userStickers = [], mutate: mutateUserStickers } = useSWR(
    selectedUser ? `user-stickers-${selectedUser.id}` : null,
    () => selectedUser ? fetchUserStickers(selectedUser.id) : [],
    { refreshInterval: 3000 }
  )

  const { data: allUserStickers = [], mutate: mutateAll } = useSWR(
    "all-user-stickers",
    fetchAllUserStickers,
    { refreshInterval: 3000 }
  )

  // Seções únicas mantendo a ordem que veio do banco (já ordenada por section_order)
  const sections = [...new Set(stickers.map((s) => s.section))]

  useEffect(() => {
    if (stickers.length > 0 && !sectionsInitialized.current) {
      sectionsInitialized.current = true
      setSelectedSections([...new Set(stickers.map((s) => s.section))])
    }
  }, [stickers])

  const stickersWithStatus: StickerWithStatus[] = stickers.map((sticker) => {
    const albumEntry = albumStickers.find((a) => a.sticker_id === sticker.id)
    const userEntry = (userStickers as any[]).find((us) => us.sticker_id === sticker.id)
    return {
      ...sticker,
      obtained: albumEntry?.obtained ?? false,
      album_sticker_id: albumEntry?.id,
      contributed_count: Number(userEntry?.contributed_count) || 0,
      user_sticker_id: userEntry?.id,
    }
  })

  const contributions: UserContribution[] = users.map((user) => {
    const total = (allUserStickers as any[]).reduce((acc: number, row: any) => {
      return String(row.user_id) === String(user.id)
        ? acc + (Number(row.contributed_count) || 0)
        : acc
    }, 0)
    return { user, contributedCount: total }
  })

  const stats: UserStats | null = selectedUser ? {
    user: selectedUser,
    totalStickers: stickers.length,
    obtainedStickers: stickersWithStatus.filter((s) => s.obtained).length,
    contributedStickers: stickersWithStatus.reduce((acc, s) => acc + s.contributed_count, 0),
    percentage: stickers.length > 0
      ? (stickersWithStatus.filter((s) => s.obtained).length / stickers.length) * 100
      : 0,
    sectionStats: sections.map((section) => {
      const ss = stickersWithStatus.filter((s) => s.section === section)
      const obtained = ss.filter((s) => s.obtained).length
      return { section, total: ss.length, obtained, percentage: ss.length > 0 ? (obtained / ss.length) * 100 : 0 }
    }),
  } : null

  const handleToggleObtained = useCallback(async (sticker: StickerWithStatus) => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("album_stickers")
        .upsert(
          { sticker_id: sticker.id, obtained: !sticker.obtained, updated_at: new Date().toISOString() },
          { onConflict: "sticker_id" }
        )
      if (error) throw error
      await mutateAlbum()
    } catch (err) {
      console.error("Erro ao atualizar álbum:", err)
    } finally {
      setIsUpdating(false)
    }
  }, [isUpdating, mutateAlbum])

  const handleIncrementContributed = useCallback(async (sticker: StickerWithStatus) => {
    if (!selectedUser || isUpdating || !sticker.obtained) return
    setIsUpdating(true)
    try {
      await callIncrementContribution(selectedUser.id, sticker.id, 1)
      await mutateUserStickers()
      await mutateAll()
    } catch (err) {
      console.error("Erro ao incrementar:", err)
    } finally {
      setIsUpdating(false)
    }
  }, [selectedUser, isUpdating, mutateUserStickers, mutateAll])

  const handleDecrementContributed = useCallback(async (sticker: StickerWithStatus) => {
    if (!selectedUser || isUpdating || !sticker.obtained || sticker.contributed_count === 0) return
    setIsUpdating(true)
    try {
      await callIncrementContribution(selectedUser.id, sticker.id, -1)
      await mutateUserStickers()
      await mutateAll()
    } catch (err) {
      console.error("Erro ao decrementar:", err)
    } finally {
      setIsUpdating(false)
    }
  }, [selectedUser, isUpdating, mutateUserStickers, mutateAll])

  const handleToggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const handleClearAll = () => setSelectedSections([])
  const handleSelectAll = () => setSelectedSections([...sections])

  if (stickersLoading) {
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
      <div className="text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Quem está usando? 🎴</h2>
        <UserSelector users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
        <p className="text-xs text-muted-foreground">
          💡 O álbum é compartilhado — qualquer um pode marcar figurinhas!
        </p>
      </div>

      {selectedUser && <StatsCard stats={stats} />}

      {selectedUser && (
        <>
          <div className="bg-card rounded-xl p-4 border border-border">
            <SectionFilter
              sections={sections}
              selectedSections={selectedSections}
              onToggleSection={handleToggleSection}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </div>

          {selectedSections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSections.map((section) => (
                <StickerGrid
                  key={section}
                  section={section}
                  stickers={stickersWithStatus}
                  onToggleObtained={handleToggleObtained}
                  onIncrementContributed={handleIncrementContributed}
                  onDecrementContributed={handleDecrementContributed}
                  isLoading={isUpdating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-medium">Nenhuma seleção escolhida</p>
              <p className="text-sm mt-1">Clique em uma seleção acima para ver as figurinhas</p>
            </div>
          )}
        </>
      )}

      {users.length > 0 && (
        <ContributionsBoard
          contributions={contributions}
          totalObtained={stickersWithStatus.filter((s) => s.obtained).length}
          totalStickers={stickers.length}
        />
      )}
    </div>
  )
}
