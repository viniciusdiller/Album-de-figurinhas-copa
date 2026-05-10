export interface User {
  id: string
  name: string
  created_at: string
}

export interface Sticker {
  id: number
  section: string
  code: string
  name: string
  is_special: boolean
}

// Estado global do álbum compartilhado (sem user_id)
export interface AlbumSticker {
  id: string
  sticker_id: number
  obtained: boolean
  updated_at: string
}

// Contribuições de cada usuário (quantas figurinhas ele trouxe)
export interface UserSticker {
  id: string
  user_id: string
  sticker_id: number
  contributed_count: number
  updated_at: string
}

export interface StickerWithStatus extends Sticker {
  obtained: boolean           // do álbum compartilhado
  album_sticker_id?: string   // id em album_stickers
  contributed_count: number   // do usuário selecionado
  user_sticker_id?: string    // id em user_stickers para o usuário selecionado
}

export interface SectionStats {
  section: string
  total: number
  obtained: number
  percentage: number
}

export interface UserStats {
  user: User
  totalStickers: number
  obtainedStickers: number     // total do álbum
  contributedStickers: number  // quantas esse usuário trouxe
  percentage: number
  sectionStats: SectionStats[]
}

export interface UserContribution {
  user: User
  contributedCount: number
}
