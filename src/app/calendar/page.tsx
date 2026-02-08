import { createClient } from '@/lib/supabase/server'
import { CalendarView } from '@/components/CalendarView'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
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
      <div>
        <h1 className="text-2xl font-bold">Takvim</h1>
        <p className="text-[var(--muted-foreground)]">
          Aylık maç görünümü ve kazanç takibi
        </p>
      </div>

      {/* Calendar */}
      <CalendarView matches={matches || []} />
    </div>
  )
}
