"use client"

import { useState } from "react"
import { StickerWithStatus, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type ExportMode =
  | "repetidas"
  | "faltam"
  | "tenho"
  | "faltam_e_repetidas"

const modeLabels: Record<ExportMode, string> = {
  repetidas: "🔁 Repetidas",
  faltam: "❌ Faltam",
  tenho: "✅ Que tenho",
  faltam_e_repetidas: "📋 Faltam + Repetidas",
}

interface ExportWhatsappProps {
  stickers: StickerWithStatus[]
  user: User
}

function buildMessage(stickers: StickerWithStatus[], mode: ExportMode, userName: string): string {
  const lines: string[] = []

  if (mode === "repetidas") {
    const repeated = stickers.filter((s) => s.obtained && s.contributed_count >= 1)
    if (repeated.length === 0) return "Nenhuma figurinha repetida encontrada."
    lines.push(`🔁 *Figurinhas repetidas de ${userName}:*`)
    lines.push("")
    const bySectionMap = new Map<string, StickerWithStatus[]>()
    for (const s of repeated) {
      if (!bySectionMap.has(s.section)) bySectionMap.set(s.section, [])
      bySectionMap.get(s.section)!.push(s)
    }
    for (const [section, list] of bySectionMap) {
      lines.push(`*${section}*`)
      for (const s of list) {
        lines.push(`  • ${s.code} - ${s.name} (x${s.contributed_count})`)
      }
      lines.push("")
    }
  }

  if (mode === "faltam") {
    const missing = stickers.filter((s) => !s.obtained)
    if (missing.length === 0) return "Parabéns! Álbum completo! 🏆"
    lines.push(`❌ *Figurinhas que faltam (${missing.length}):*`)
    lines.push("")
    const bySectionMap = new Map<string, StickerWithStatus[]>()
    for (const s of missing) {
      if (!bySectionMap.has(s.section)) bySectionMap.set(s.section, [])
      bySectionMap.get(s.section)!.push(s)
    }
    for (const [section, list] of bySectionMap) {
      lines.push(`*${section}*`)
      lines.push(`  ${list.map((s) => s.code).join(", ")}`)
      lines.push("")
    }
  }

  if (mode === "tenho") {
    const have = stickers.filter((s) => s.obtained)
    if (have.length === 0) return "Nenhuma figurinha marcada ainda."
    lines.push(`✅ *Figurinhas que tenho (${have.length}):*`)
    lines.push("")
    const bySectionMap = new Map<string, StickerWithStatus[]>()
    for (const s of have) {
      if (!bySectionMap.has(s.section)) bySectionMap.set(s.section, [])
      bySectionMap.get(s.section)!.push(s)
    }
    for (const [section, list] of bySectionMap) {
      lines.push(`*${section}*`)
      lines.push(`  ${list.map((s) => s.code).join(", ")}`)
      lines.push("")
    }
  }

  if (mode === "faltam_e_repetidas") {
    const missing = stickers.filter((s) => !s.obtained)
    const repeated = stickers.filter((s) => s.obtained && s.contributed_count >= 1)

    lines.push(`📋 *Resumo do álbum de ${userName}:*`)
    lines.push("")

    if (missing.length > 0) {
      lines.push(`❌ *Faltam (${missing.length}):*`)
      const bySectionMap = new Map<string, StickerWithStatus[]>()
      for (const s of missing) {
        if (!bySectionMap.has(s.section)) bySectionMap.set(s.section, [])
        bySectionMap.get(s.section)!.push(s)
      }
      for (const [section, list] of bySectionMap) {
        lines.push(`*${section}*`)
        lines.push(`  ${list.map((s) => s.code).join(", ")}`)
        lines.push("")
      }
    } else {
      lines.push("❌ *Faltam:* Nenhuma! Álbum quase completo! 🎉")
      lines.push("")
    }

    if (repeated.length > 0) {
      lines.push(`🔁 *Repetidas (${repeated.length}):*`)
      const bySectionMap = new Map<string, StickerWithStatus[]>()
      for (const s of repeated) {
        if (!bySectionMap.has(s.section)) bySectionMap.set(s.section, [])
        bySectionMap.get(s.section)!.push(s)
      }
      for (const [section, list] of bySectionMap) {
        lines.push(`*${section}*`)
        for (const s of list) {
          lines.push(`  • ${s.code} - ${s.name} (x${s.contributed_count})`)
        }
        lines.push("")
      }
    } else {
      lines.push("🔁 *Repetidas:* Nenhuma por enquanto!")
    }
  }

  return lines.join("\n").trim()
}

export function ExportWhatsapp({ stickers, user }: ExportWhatsappProps) {
  const [open, setOpen] = useState(false)
  const [selectedMode, setSelectedMode] = useState<ExportMode>("faltam_e_repetidas")
  const [copied, setCopied] = useState(false)

  const message = buildMessage(stickers, selectedMode, user.name)

  const handleOpenWhatsapp = () => {
    const encoded = encodeURIComponent(message)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank", "noopener,noreferrer")
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = message
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 dark:text-green-400"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        Exportar para WhatsApp
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#25D366"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Exportar para WhatsApp
            </DialogTitle>
            <DialogDescription>
              Escolha o que deseja exportar e envie direto pelo WhatsApp.
            </DialogDescription>
          </DialogHeader>

          {/* Seletor de modo */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(Object.keys(modeLabels) as ExportMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedMode === mode
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-background border-border text-foreground hover:bg-muted"
                }`}
              >
                {modeLabels[mode]}
              </button>
            ))}
          </div>

          {/* Preview da mensagem */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Preview da mensagem:</p>
            <pre className="bg-muted rounded-lg p-3 text-xs whitespace-pre-wrap max-h-52 overflow-y-auto font-mono leading-relaxed">
              {message}
            </pre>
          </div>

          {/* Ações */}
          <div className="flex gap-2 mt-2">
            <Button
              className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center justify-center gap-2"
              onClick={handleOpenWhatsapp}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Abrir WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-600" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  Copiar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
