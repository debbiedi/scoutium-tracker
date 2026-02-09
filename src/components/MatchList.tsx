'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, calculatePrice } from '@/lib/pricing'
import { formatDate } from '@/lib/utils'
import { Trash2, Edit, Copy, Loader2 } from 'lucide-react'
import { useAuth } from './AuthProvider'
import type { Match } from '@/types/database'

interface MatchListProps {
  matches: Match[]
}

export function MatchList({ matches }: MatchListProps) {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copyingId, setCopyingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Bu maçı silmek istediğinize emin misiniz?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase.from('matches').delete().eq('id', id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Silme işlemi başarısız oldu')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopy = async (match: Match) => {
    setCopyingId(match.id)
    try {
      const newMatch = {
        date: new Date().toISOString().split('T')[0], // Today's date
        team_home: match.team_home,
        team_away: match.team_away,
        duration_minutes: match.duration_minutes,
        price: calculatePrice(match.duration_minutes),
        notes: match.notes,
        user_id: user?.id,
      }

      const { error } = await supabase.from('matches').insert(newMatch)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error('Copy error:', err)
      alert('Kopyalama işlemi başarısız oldu')
    } finally {
      setCopyingId(null)
    }
  }

  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-lg font-medium">Henüz maç kaydı yok</p>
        <p className="mt-1 text-sm">Yeni maç ekleyerek başlayın</p>
        <Link href="/matches/new" className="btn btn-primary mt-4">
          İlk Maçı Ekle
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {matches.map((match) => (
          <div 
            key={match.id} 
            className="rounded-xl p-4 transition-colors"
            style={{ 
              background: 'var(--card)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{match.team_home}</div>
                {match.team_away && (
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    vs {match.team_away}
                  </div>
                )}
              </div>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(match.price)}
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span>{formatDate(match.date)}</span>
              <span className="badge badge-primary">
                {match.duration_minutes} dk
              </span>
            </div>
            
            <div className="flex justify-end gap-1 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => handleCopy(match)}
                disabled={copyingId === match.id}
                className="rounded-md p-2 text-blue-500 transition-colors hover:bg-blue-50"
                title="Maçı Kopyala"
              >
                {copyingId === match.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <Link
                href={`/matches/${match.id}`}
                className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                title="Düzenle"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(match.id)}
                disabled={deletingId === match.id}
                className="rounded-md p-2 text-[var(--destructive)] transition-colors hover:bg-red-50"
                title="Sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Maç</th>
            <th>Süre</th>
            <th>Ücret</th>
            <th className="text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="whitespace-nowrap">{formatDate(match.date)}</td>
              <td>
                <div className="font-medium">{match.team_home}</div>
                {match.team_away && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    vs {match.team_away}
                  </div>
                )}
              </td>
              <td>
                <span className="badge badge-primary">
                  {match.duration_minutes} dk
                </span>
              </td>
              <td>
                <span className="font-semibold text-[var(--success)]">
                  {formatCurrency(match.price)}
                </span>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => handleCopy(match)}
                    disabled={copyingId === match.id}
                    className="rounded-md p-2 text-blue-500 transition-colors hover:bg-blue-50"
                    title="Maçı Kopyala"
                  >
                    {copyingId === match.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <Link
                    href={`/matches/${match.id}`}
                    className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(match.id)}
                    disabled={deletingId === match.id}
                    className="rounded-md p-2 text-[var(--destructive)] transition-colors hover:bg-red-50"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  )
}
