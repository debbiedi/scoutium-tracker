import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MatchList } from '@/components/MatchList'
import { PlusCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MatchesPage() {
  const supabase = await createClient()

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching matches:', error)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maçlar</h1>
          <p className="text-[var(--muted-foreground)]">
            Tüm etiketlenen maçların listesi
          </p>
        </div>
        <Link href="/matches/new" className="btn btn-primary">
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
