'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculatePrice, formatCurrency, PRICE_TIERS } from '@/lib/pricing'
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from './AuthProvider'

interface BulkMatchEntry {
  id: string
  date: string
  team_home: string
  team_away: string
  duration_minutes: number
}

export function BulkMatchForm() {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()

  const createEmptyEntry = (): BulkMatchEntry => ({
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    team_home: '',
    team_away: '',
    duration_minutes: 90,
  })

  const [entries, setEntries] = useState<BulkMatchEntry[]>([
    createEmptyEntry(),
    createEmptyEntry(),
    createEmptyEntry(),
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addEntry = () => {
    setEntries([...entries, createEmptyEntry()])
  }

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((e) => e.id !== id))
    }
  }

  const updateEntry = (id: string, field: keyof BulkMatchEntry, value: string | number) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  const duplicateEntry = (entry: BulkMatchEntry) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    }
    const index = entries.findIndex((e) => e.id === entry.id)
    const newEntries = [...entries]
    newEntries.splice(index + 1, 0, newEntry)
    setEntries(newEntries)
  }

  const totalPrice = entries.reduce((sum, entry) => {
    if (entry.team_home && entry.duration_minutes > 0) {
      return sum + calculatePrice(entry.duration_minutes)
    }
    return sum
  }, 0)

  const validEntries = entries.filter(
    (e) => e.team_home.trim() && e.duration_minutes > 0
  )

  const handleSubmit = async () => {
    if (validEntries.length === 0) {
      setError('En az bir maç bilgisi girmelisiniz.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const matchData = validEntries.map((entry) => ({
        date: entry.date,
        team_home: entry.team_home,
        team_away: entry.team_away || null,
        duration_minutes: entry.duration_minutes,
        price: calculatePrice(entry.duration_minutes),
        screenshot_url: null,
        notes: null,
        user_id: user?.id,
      }))

      const { error: insertError } = await supabase
        .from('matches')
        .insert(matchData)

      if (insertError) throw insertError

      // Save teams to localStorage for future suggestions
      const savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
      const newTeams = new Set([...savedTeams])
      validEntries.forEach((entry) => {
        if (entry.team_home) newTeams.add(entry.team_home)
        if (entry.team_away) newTeams.add(entry.team_away)
      })
      localStorage.setItem('savedTeams', JSON.stringify([...newTeams]))

      setSuccess(`${validEntries.length} maç başarıyla eklendi!`)
      
      setTimeout(() => {
        router.push('/matches')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 sm:col-span-2 lg:col-span-5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                {index + 1}
              </span>
              <span>Maç #{index + 1}</span>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => duplicateEntry(entry)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Kopyala
                </button>
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tarih
              </label>
              <input
                type="date"
                value={entry.date}
                onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Ev Sahibi Takım *
              </label>
              <input
                type="text"
                value={entry.team_home}
                onChange={(e) => updateEntry(entry.id, 'team_home', e.target.value)}
                placeholder="Takım adı"
                className="input"
                list="saved-teams"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Deplasman Takımı
              </label>
              <input
                type="text"
                value={entry.team_away}
                onChange={(e) => updateEntry(entry.id, 'team_away', e.target.value)}
                placeholder="Opsiyonel"
                className="input"
                list="saved-teams"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Süre (dk)
              </label>
              <input
                type="number"
                value={entry.duration_minutes}
                onChange={(e) =>
                  updateEntry(entry.id, 'duration_minutes', parseInt(e.target.value) || 0)
                }
                min="1"
                max="120"
                className="input"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full rounded-lg bg-emerald-50 p-3 text-center">
                <span className="text-xs text-emerald-600">Ücret</span>
                <div className="text-lg font-bold text-emerald-700">
                  {entry.team_home && entry.duration_minutes > 0
                    ? formatCurrency(calculatePrice(entry.duration_minutes))
                    : '₺0'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Teams Datalist */}
      <datalist id="saved-teams">
        {(() => {
          if (typeof window !== 'undefined') {
            const savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
            return savedTeams.map((team: string) => (
              <option key={team} value={team} />
            ))
          }
          return null
        })()}
      </datalist>

      {/* Add More Button */}
      <button
        type="button"
        onClick={addEntry}
        className="w-full rounded-xl border-2 border-dashed border-slate-300 p-4 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
      >
        <Plus className="h-5 w-5 mx-auto mb-1" />
        <span className="text-sm font-medium">Yeni Satır Ekle</span>
      </button>

      {/* Summary & Submit */}
      <div className="card bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600">
              <span className="font-medium">{validEntries.length}</span> geçerli maç
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              Toplam: {formatCurrency(totalPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || validEntries.length === 0}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Tümünü Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
