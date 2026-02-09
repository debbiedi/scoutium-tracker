'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isSameWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isToday,
  getWeek,
} from 'date-fns'
import { tr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Clock, TrendingUp, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/pricing'
import type { Match } from '@/types/database'

type ViewMode = 'month' | 'week'

interface CalendarViewProps {
  matches: Match[]
}

export function CalendarView({ matches }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('month')

  // Month view calculations
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  // Week view calculations
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: viewMode === 'month' ? calendarStart : weekStart,
    end: viewMode === 'month' ? calendarEnd : weekEnd,
  })

  const matchesByDate = useMemo(() => {
    const map = new Map<string, Match[]>()
    matches.forEach((match) => {
      const dateKey = match.date
      const existing = map.get(dateKey) || []
      map.set(dateKey, [...existing, match])
    })
    return map
  }, [matches])

  const selectedDayMatches = selectedDate
    ? matchesByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : []

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const monthMatches = matches.filter((match) => {
      const matchDate = new Date(match.date)
      return isSameMonth(matchDate, currentDate)
    })
    return {
      total: monthMatches.reduce((sum, match) => sum + match.price, 0),
      count: monthMatches.length,
      avgDuration: monthMatches.length > 0 
        ? Math.round(monthMatches.reduce((sum, m) => sum + m.duration_minutes, 0) / monthMatches.length)
        : 0
    }
  }, [matches, currentDate])

  // Weekly stats
  const weeklyStats = useMemo(() => {
    const weekMatches = matches.filter((match) => {
      const matchDate = new Date(match.date)
      return isSameWeek(matchDate, currentDate, { weekStartsOn: 1 })
    })
    return {
      total: weekMatches.reduce((sum, match) => sum + match.price, 0),
      count: weekMatches.length,
      avgDuration: weekMatches.length > 0 
        ? Math.round(weekMatches.reduce((sum, m) => sum + m.duration_minutes, 0) / weekMatches.length)
        : 0,
      matches: weekMatches
    }
  }, [matches, currentDate])

  // Daily stats for selected day
  const dailyStats = useMemo(() => {
    if (!selectedDate) return null
    const dayMatches = matchesByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    return {
      total: dayMatches.reduce((sum, m) => sum + m.price, 0),
      count: dayMatches.length,
      totalDuration: dayMatches.reduce((sum, m) => sum + m.duration_minutes, 0),
      matches: dayMatches
    }
  }, [selectedDate, matchesByDate])

  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
  const weekDaysFull = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle & Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'month'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Aylık
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Haftalık
          </button>
        </div>
        <button
          onClick={goToToday}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Bugün
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="rounded-md p-2 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-800">
                {viewMode === 'month'
                  ? format(currentDate, 'MMMM yyyy', { locale: tr })
                  : `${format(weekStart, 'd MMM', { locale: tr })} - ${format(weekEnd, 'd MMM yyyy', { locale: tr })}`}
              </h2>
              <button
                onClick={handleNext}
                className="rounded-md p-2 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Week days header */}
            <div className={viewMode === 'month' ? 'calendar-grid mb-2' : 'grid grid-cols-7 gap-2 mb-2'}>
              {(viewMode === 'month' ? weekDays : weekDaysFull).map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-slate-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {viewMode === 'month' ? (
              <div className="calendar-grid">
                {calendarDays.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd')
                  const dayMatches = matchesByDate.get(dateKey) || []
                  const hasMatch = dayMatches.length > 0
                  const dayTotal = dayMatches.reduce((sum, m) => sum + m.price, 0)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(day)}
                      className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                        isToday(day) ? 'today' : ''
                      } ${hasMatch && !isToday(day) ? 'has-match' : ''} ${
                        isSelected ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    >
                      <span>{format(day, 'd')}</span>
                      {hasMatch && (
                        <span className="mt-0.5 text-[10px] font-medium text-emerald-600">
                          {formatCurrency(dayTotal)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Week View - Detailed */
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd')
                  const dayMatches = matchesByDate.get(dateKey) || []
                  const hasMatch = dayMatches.length > 0
                  const dayTotal = dayMatches.reduce((sum, m) => sum + m.price, 0)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(day)}
                      className={`flex flex-col rounded-xl p-3 min-h-[120px] transition-all ${
                        isToday(day)
                          ? 'bg-emerald-50 border-2 border-emerald-500'
                          : hasMatch
                          ? 'bg-emerald-50/50 border border-emerald-200'
                          : 'bg-slate-50 border border-slate-200'
                      } ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2' : ''} hover:shadow-md`}
                    >
                      <span className={`text-lg font-bold ${isToday(day) ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {format(day, 'd')}
                      </span>
                      {hasMatch ? (
                        <div className="mt-auto space-y-1">
                          <span className="text-xs text-slate-500">{dayMatches.length} maç</span>
                          <span className="block text-sm font-bold text-emerald-600">
                            {formatCurrency(dayTotal)}
                          </span>
                        </div>
                      ) : (
                        <span className="mt-auto text-xs text-slate-400">Kayıt yok</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Stats Summary */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-emerald-50 p-3 text-center">
                <div className="text-xs text-emerald-600 font-medium">
                  {viewMode === 'month' ? 'Aylık' : 'Haftalık'} Toplam
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {formatCurrency(viewMode === 'month' ? monthlyStats.total : weeklyStats.total)}
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <div className="text-xs text-blue-600 font-medium">Maç Sayısı</div>
                <div className="text-lg font-bold text-blue-700">
                  {viewMode === 'month' ? monthlyStats.count : weeklyStats.count}
                </div>
              </div>
              <div className="rounded-lg bg-violet-50 p-3 text-center">
                <div className="text-xs text-violet-600 font-medium">Ort. Süre</div>
                <div className="text-lg font-bold text-violet-700">
                  {viewMode === 'month' ? monthlyStats.avgDuration : weeklyStats.avgDuration} dk
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="lg:col-span-1 space-y-4">
          {/* Daily Summary Card */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {selectedDate
                ? format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })
                : 'Bir gün seçin'}
            </h3>

            {selectedDate && dailyStats ? (
              dailyStats.count > 0 ? (
                <div className="space-y-4">
                  {/* Daily Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-emerald-50 p-3">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-medium">Kazanç</span>
                      </div>
                      <div className="mt-1 text-xl font-bold text-emerald-700">
                        {formatCurrency(dailyStats.total)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium">Süre</span>
                      </div>
                      <div className="mt-1 text-xl font-bold text-blue-700">
                        {dailyStats.totalDuration} dk
                      </div>
                    </div>
                  </div>

                  {/* Match List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-600">
                      Maçlar ({dailyStats.count})
                    </h4>
                    {dailyStats.matches.map((match) => (
                      <Link
                        href={`/matches/${match.id}`}
                        key={match.id}
                        className="block rounded-lg border border-slate-200 p-3 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-slate-800 group-hover:text-emerald-700">
                              {match.team_home}
                            </div>
                            {match.team_away && (
                              <div className="text-sm text-slate-500">
                                vs {match.team_away}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {match.duration_minutes} dk
                          </span>
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(match.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">Bu gün için kayıt yok</p>
                  <Link
                    href="/matches/new"
                    className="mt-3 inline-block text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    + Yeni maç ekle
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">Detayları görmek için bir gün seçin</p>
              </div>
            )}
          </div>

          {/* Week Overview (only in week view) */}
          {viewMode === 'week' && weeklyStats.count > 0 && (
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold text-slate-600">Hafta Özeti</h3>
              <div className="space-y-2">
                {weeklyStats.matches
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between text-sm rounded-lg bg-slate-50 p-2"
                    >
                      <div>
                        <span className="text-slate-500">
                          {format(new Date(match.date), 'EEE', { locale: tr })}
                        </span>
                        <span className="mx-2 text-slate-800">{match.team_home}</span>
                      </div>
                      <span className="font-medium text-emerald-600">
                        {formatCurrency(match.price)}
                      </span>
                    </div>
                  ))}
                {weeklyStats.count > 5 && (
                  <p className="text-xs text-slate-400 text-center pt-1">
                    +{weeklyStats.count - 5} daha fazla maç
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
