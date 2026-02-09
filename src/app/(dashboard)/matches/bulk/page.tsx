import { BulkMatchForm } from '@/components/BulkMatchForm'

export const dynamic = 'force-dynamic'

export default function BulkMatchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Toplu Maç Ekle</h1>
        <p className="text-slate-500">
          Birden fazla maçı tek seferde ekleyin
        </p>
      </div>

      {/* Form */}
      <BulkMatchForm />
    </div>
  )
}
