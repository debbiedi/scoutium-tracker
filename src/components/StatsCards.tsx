'use client'

import { useMemo } from 'react'
import { Trophy, Target, TrendingUp, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/pricing'
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns'
import type { Match } from '@/types/database'

interface StatsCardsProps {
  matches: Match[]
}

export function StatsCards({ matches }: StatsCardsProps) {
  const stats = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)

    const weekMatches = matches.filter((match) => {
      const matchDate = new Date(match.date)
      return isWithinInterval(matchDate, { start: weekStart, end: weekEnd })
    })

    const monthMatches = matches.filter((match) => {
      const matchDate = new Date(match.date)
      return isWithinInterval(matchDate, { start: monthStart, end: monthEnd })
    })

    const totalEarnings = matches.reduce((sum, match) => sum + match.price, 0)
    const weeklyEarnings = weekMatches.reduce(
      (sum, match) => sum + match.price,
      0
    )
    const monthlyEarnings = monthMatches.reduce(
      (sum, match) => sum + match.price,
      0
    )
    const totalMatches = matches.length
    const avgDuration =
      totalMatches > 0
        ? Math.round(
            matches.reduce((sum, match) => sum + match.duration_minutes, 0) /
              totalMatches
          )
        : 0

    return {
      totalEarnings,
      weeklyEarnings,
      monthlyEarnings,
      totalMatches,
      weeklyMatches: weekMatches.length,
      monthlyMatches: monthMatches.length,
      avgDuration,
    }
  }, [matches])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Toplam Kazanç */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Toplam Kazanç</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(stats.totalEarnings)}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          {stats.totalMatches} maç toplam
        </p>
      </div>

      {/* Bu Ay */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bu Ay</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(stats.monthlyEarnings)}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          {stats.monthlyMatches} maç bu ay
        </p>
      </div>

      {/* Bu Hafta */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bu Hafta</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(stats.weeklyEarnings)}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-200">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          {stats.weeklyMatches} maç bu hafta
        </p>
      </div>

      {/* Ortalama Süre */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ort. Süre</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.avgDuration} dk</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-200">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Maç başına ortalama
        </p>
      </div>
    </div>
  )
}
