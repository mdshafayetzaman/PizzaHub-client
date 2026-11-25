'use client'

import { X } from 'lucide-react'

type Props = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {description ? <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white disabled:opacity-50">
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={loading} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-zinc-300 hover:bg-white/10 disabled:opacity-50">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-white disabled:opacity-60 ${
              tone === 'danger'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400'
            }`}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
