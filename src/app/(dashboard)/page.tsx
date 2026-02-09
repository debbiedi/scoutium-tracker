import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/StatsCards'
import { formatCurrency } from '@/lib/pricing'
import { formatDate } from '@/lib/utils'
import { PlusCircle, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .eq('user_id', user?.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching matches:', error)
  }

  const allMatches = matches || []
  const recentMatches = allMatches.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--muted-foreground)' }}>
            Maç takip ve kazanç özeti
          </p>
        </div>
        <Link href="/matches/new" className="btn btn-primary w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          Yeni Maç Ekle
        </Link>
      </div>

      {/* Stats */}
      <StatsCards matches={allMatches} />

      {/* Recent Matches */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Son Maçlar</h2>
          <Link
            href="/matches"
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentMatches.length > 0 ? (
          <div className="space-y-3">
            {recentMatches.map((match, index) => (
              <div
                key={match.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg p-4 transition-all gap-3"
                style={{ 
                  border: '1px solid var(--border)',
                  background: 'var(--card)'
                }}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>{match.team_home}</div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      <span>{formatDate(match.date)}</span>
                      {match.team_away && <span className="hidden sm:inline">• vs {match.team_away}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-11 sm:pl-0">
                  <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
                    {match.duration_minutes} dk
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatCurrency(match.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚽</div>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>Henüz maç kaydı yok</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>İlk maçınızı ekleyerek başlayın!</p>
            <Link href="/matches/new" className="btn btn-primary mt-6">
              <PlusCircle className="h-4 w-4" />
              İlk Maçı Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
