"use client"

import { User } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UserSelectorProps {
  users: User[]
  selectedUser: User | null
  onSelectUser: (user: User) => void
}

export function UserSelector({ users, selectedUser, onSelectUser }: UserSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base",
            selectedUser?.id === user.id
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-card text-card-foreground border border-border hover:border-primary hover:bg-muted"
          )}
        >
          {user.name}
        </button>
      ))}
    </div>
  )
}
