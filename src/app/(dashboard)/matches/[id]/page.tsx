import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MatchForm } from '@/components/MatchForm'

export const dynamic = 'force-dynamic'

interface EditMatchPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single()

  if (error || !match) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Maç Düzenle</h1>
        <p className="text-[var(--muted-foreground)]">
          {match.team_home} {match.team_away ? `vs ${match.team_away}` : ''}
        </p>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <MatchForm match={match} mode="edit" />
      </div>
    </div>
  )
}
