import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/StatsCards'
import { formatCurrency } from '@/lib/pricing'
import { formatDate } from '@/lib/utils'
import { PlusCircle, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching matches:', error)
  }

  const allMatches = matches || []
  const recentMatches = allMatches.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">
            Maç takip ve kazanç özeti
          </p>
        </div>
        <Link href="/matches/new" className="btn btn-primary">
          <PlusCircle className="h-4 w-4" />
          Yeni Maç Ekle
        </Link>
      </div>

      {/* Stats */}
      <StatsCards matches={allMatches} />

      {/* Recent Matches */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Son Maçlar</h2>
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
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatDate(match.date)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{match.team_home}</div>
                    {match.team_away && (
                      <div className="text-sm text-slate-500">
                        vs {match.team_away}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
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
            <p className="text-slate-600 font-medium">Henüz maç kaydı yok</p>
            <p className="text-sm text-slate-400 mt-1">İlk maçınızı ekleyerek başlayın!</p>
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
