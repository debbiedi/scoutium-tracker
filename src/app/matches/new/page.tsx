import { MatchForm } from '@/components/MatchForm'

export default function NewMatchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Yeni Maç Ekle</h1>
        <p className="text-[var(--muted-foreground)]">
          Yeni bir maç kaydı oluşturun
        </p>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <MatchForm mode="create" />
      </div>
    </div>
  )
}
