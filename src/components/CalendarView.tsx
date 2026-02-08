'use client'

import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { tr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/pricing'
import type { Match } from '@/types/database'

interface CalendarViewProps {
  matches: Match[]
}

export function CalendarView({ matches }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
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

  const monthlyTotal = useMemo(() => {
    return matches
      .filter((match) => {
        const matchDate = new Date(match.date)
        return isSameMonth(matchDate, currentDate)
      })
      .reduce((sum, match) => sum + match.price, 0)
  }, [matches, currentDate])

  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <div className="card">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="rounded-md p-2 hover:bg-[var(--muted)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: tr })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="rounded-md p-2 hover:bg-[var(--muted)]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Week days header */}
          <div className="calendar-grid mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-[var(--muted-foreground)]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="calendar-grid">
            {calendarDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const dayMatches = matchesByDate.get(dateKey) || []
              const hasMatch = dayMatches.length > 0
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(day)}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                    isToday(day) ? 'today' : ''
                  } ${hasMatch && !isToday(day) ? 'has-match' : ''} ${
                    isSelected ? 'ring-2 ring-[var(--primary)]' : ''
                  }`}
                >
                  <span>{format(day, 'd')}</span>
                  {hasMatch && (
                    <span className="mt-0.5 text-[10px]">
                      {dayMatches.length} maç
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Monthly total */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--muted)] p-3">
            <span className="text-sm font-medium">Bu Ay Toplam:</span>
            <span className="text-lg font-bold text-[var(--success)]">
              {formatCurrency(monthlyTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Selected day details */}
      <div className="lg:col-span-1">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">
            {selectedDate
              ? format(selectedDate, 'd MMMM yyyy', { locale: tr })
              : 'Bir gün seçin'}
          </h3>

          {selectedDate ? (
            selectedDayMatches.length > 0 ? (
              <div className="space-y-3">
                {selectedDayMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-lg border border-[var(--border)] p-3"
                  >
                    <div className="font-medium">{match.team_home}</div>
                    {match.team_away && (
                      <div className="text-sm text-[var(--muted-foreground)]">
                        vs {match.team_away}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="badge badge-primary">
                        {match.duration_minutes} dk
                      </span>
                      <span className="font-semibold text-[var(--success)]">
                        {formatCurrency(match.price)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-[var(--border)] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Günlük Toplam:</span>
                    <span className="font-bold text-[var(--success)]">
                      {formatCurrency(
                        selectedDayMatches.reduce((sum, m) => sum + m.price, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state py-8">
                <p className="text-sm">Bu gün için kayıt yok</p>
              </div>
            )
          ) : (
            <div className="empty-state py-8">
              <p className="text-sm">Detayları görmek için bir gün seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
