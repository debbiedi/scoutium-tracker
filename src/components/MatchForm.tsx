'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculatePrice, formatCurrency, PRICE_TIERS } from '@/lib/pricing'
import { Loader2 } from 'lucide-react'
import { useAuth } from './AuthProvider'
import type { Match } from '@/types/database'

interface MatchFormProps {
  match?: Match
  mode: 'create' | 'edit'
}

export function MatchForm({ match, mode }: MatchFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    date: match?.date || new Date().toISOString().split('T')[0],
    team_home: match?.team_home || '',
    team_away: match?.team_away || '',
    duration_minutes: match?.duration_minutes || 90,
    notes: match?.notes || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedTeams, setSavedTeams] = useState<string[]>([])

  // Load saved teams from localStorage
  useEffect(() => {
    const teams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
    setSavedTeams(teams)
  }, [])

  // Save teams to localStorage
  const saveTeamsToStorage = () => {
    const newTeams = new Set([...savedTeams])
    if (formData.team_home) newTeams.add(formData.team_home)
    if (formData.team_away) newTeams.add(formData.team_away)
    localStorage.setItem('savedTeams', JSON.stringify([...newTeams]))
  }

  const calculatedPrice = calculatePrice(formData.duration_minutes)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const matchData = {
        date: formData.date,
        team_home: formData.team_home,
        team_away: formData.team_away || null,
        duration_minutes: formData.duration_minutes,
        price: calculatedPrice,
        notes: formData.notes || null,
      }

      if (mode === 'create') {
        const { error: insertError } = await supabase
          .from('matches')
          .insert({ ...matchData, user_id: user?.id })

        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from('matches')
          .update(matchData)
          .eq('id', match!.id)

        if (updateError) throw updateError
      }

      // Save teams to localStorage
      saveTeamsToStorage()

      router.push('/matches')
      router.refresh()
    } catch (err) {
      console.error('Submit error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tarih */}
        <div>
          <label className="label" htmlFor="date">
            Tarih *
          </label>
          <input
            type="date"
            id="date"
            className="input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Süre */}
        <div>
          <label className="label" htmlFor="duration">
            Süre (dakika) *
          </label>
          <input
            type="number"
            id="duration"
            className="input"
            min="1"
            max="120"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration_minutes: parseInt(e.target.value) || 0,
              })
            }
            required
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Hesaplanan Ücret:{' '}
            <span className="font-semibold text-[var(--success)]">
              {formatCurrency(calculatedPrice)}
            </span>
          </p>
        </div>

        {/* Ev Sahibi Takım */}
        <div>
          <label className="label" htmlFor="team_home">
            Ev Sahibi Takım *
          </label>
          <input
            type="text"
            id="team_home"
            className="input"
            placeholder="örn: Galatasaray"
            value={formData.team_home}
            onChange={(e) =>
              setFormData({ ...formData, team_home: e.target.value })
            }
            list="saved-teams-list"
            required
          />
        </div>

        {/* Deplasman Takım */}
        <div>
          <label className="label" htmlFor="team_away">
            Deplasman Takım
          </label>
          <input
            type="text"
            id="team_away"
            className="input"
            placeholder="örn: Fenerbahçe"
            value={formData.team_away}
            onChange={(e) =>
              setFormData({ ...formData, team_away: e.target.value })
            }
            list="saved-teams-list"
          />
        </div>
      </div>

      {/* Saved Teams Datalist */}
      <datalist id="saved-teams-list">
        {savedTeams.map((team) => (
          <option key={team} value={team} />
        ))}
      </datalist>

      {/* Notlar */}
      <div>
        <label className="label" htmlFor="notes">
          Notlar
        </label>
        <textarea
          id="notes"
          className="input min-h-[80px] resize-y"
          placeholder="Ek notlar (opsiyonel)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      {/* Ücret Tablosu Bilgisi */}
      <div className="rounded-lg bg-[var(--muted)] p-4">
        <p className="mb-2 text-sm font-medium">Ücret Tablosu</p>
        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {PRICE_TIERS.map((tier) => (
            <div
              key={tier.label}
              className={`rounded-md p-2 text-center ${
                calculatedPrice === tier.price
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--card)]'
              }`}
            >
              <div className="font-medium">{tier.label}</div>
              <div className="text-xs opacity-80">
                {formatCurrency(tier.price)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : mode === 'create' ? (
            'Maç Ekle'
          ) : (
            'Güncelle'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          İptal
        </button>
      </div>
    </form>
  )
}
