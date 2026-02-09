import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MatchList } from '@/components/MatchList'
import { PlusCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MatchesPage() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Maçlar</h1>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
            Tüm etiketlenen maçların listesi
          </p>
        </div>
        <Link href="/matches/new" className="btn btn-primary w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          Yeni Maç Ekle
        </Link>
      </div>

      {/* Match List */}
      <div className="card">
        <MatchList matches={matches || []} />
      </div>
    </div>
  )
}
