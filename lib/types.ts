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

export interface UserSticker {
  id: string
  user_id: string
  sticker_id: number
  obtained: boolean
  repeated_count: number
  updated_at: string
}

export interface StickerWithStatus extends Sticker {
  obtained: boolean
  repeated_count: number
  user_sticker_id?: string
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
  obtainedStickers: number
  repeatedStickers: number
  percentage: number
  sectionStats: SectionStats[]
}
