"use client"

import { User } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UserSelectorProps {
  users: User[]
  selectedUser: User | null
  onSelectUser: (user: User) => void
}

// Emoji de bandeira por nome do usuário (personalizável)
const userEmojis: Record<string, string> = {
  "Arthur Nunes": "⚽",
  "Miguel Ramalho": "🏆",
  "Pedro Pessanha": "🎴",
}

function getUserEmoji(name: string): string {
  return userEmojis[name] ?? "👤"
}

export function UserSelector({ users, selectedUser, onSelectUser }: UserSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={cn(
            "px-6 py-3 rounded-xl font-bold transition-all duration-200 text-sm md:text-base flex items-center gap-2",
            selectedUser?.id === user.id
              ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-secondary ring-offset-2"
              : "bg-card text-card-foreground border-2 border-border hover:border-primary hover:bg-muted"
          )}
        >
          <span>{getUserEmoji(user.name)}</span>
          <span>{user.name}</span>
        </button>
      ))}
    </div>
  )
}
