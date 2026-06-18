'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Booking } from '@/lib/types'

interface ReservationCalendarProps {
  checkIn: Date | null
  checkOut: Date | null
  onCheckInChange: (date: Date) => void
  onCheckOutChange: (date: Date) => void
  existingBookings: Booking[]
}

export function ReservationCalendar({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  existingBookings,
}: ReservationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [editMode, setEditMode] = useState<'start' | 'end'>('start')

  const reservedDates = useMemo(() => {
    const dates = new Set<string>()
    existingBookings.forEach((booking) => {
      const start = new Date(booking.checkIn)
      const end = new Date(booking.checkOut)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.add(d.toISOString().split('T')[0])
      }
    })
    return dates
  }, [existingBookings])

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateReserved = (date: Date) => {
    return reservedDates.has(date.toISOString().split('T')[0])
  }

  const isDateInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false
    const start = checkOut < checkIn ? checkOut : checkIn
    const end = checkOut < checkIn ? checkIn : checkOut
    return date >= start && date <= end
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (isDateReserved(selectedDate)) return

    // Si on clique sur une date déjà sélectionnée, basculer le mode d'édition
    if (checkIn && selectedDate.toDateString() === checkIn.toDateString() && editMode === 'start') {
      setEditMode('end')
      return
    }
    if (checkOut && selectedDate.toDateString() === checkOut.toDateString() && editMode === 'end') {
      setEditMode('start')
      return
    }

    if (!checkIn) {
      onCheckInChange(selectedDate)
      setEditMode('end')
    } else if (editMode === 'start') {
      onCheckInChange(selectedDate)
      setEditMode('end')
    } else {
      // Mode fin
      if (selectedDate >= checkIn) {
        if (selectedDate.getTime() !== checkIn.getTime()) {
          onCheckOutChange(selectedDate)
        }
      } else {
        onCheckInChange(selectedDate)
        setEditMode('end')
      }
    }
  }

  const days = []
  const firstDay = firstDayOfMonth(currentMonth)
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  for (let i = 1; i <= daysInMonth(currentMonth); i++) {
    days.push(i)
  }

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Arrivée</Label>
          <Input
            type="date"
            value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                const date = new Date(e.target.value + 'T00:00:00')
                onCheckInChange(date)
                setEditMode('end')
              }
            }}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Départ</Label>
          <Input
            type="date"
            value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                const date = new Date(e.target.value + 'T00:00:00')
                onCheckOutChange(date)
              }
            }}
            className="text-sm"
            min={checkIn ? checkIn.toISOString().split('T')[0] : ''}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-muted rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-semibold capitalize">{monthName}</h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-muted rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
          <div key={idx} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day.substring(0, 1)}
          </div>
        ))}
        {days.map((day, idx) => (
          <div key={idx}>
            {day ? (
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isDateReserved(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                className={cn(
                  'w-full aspect-square rounded text-sm font-medium transition-colors',
                  isDateReserved(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : isDateInRange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                    ? 'bg-primary text-primary-foreground'
                    : checkIn && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === checkIn.toDateString()
                    ? 'bg-primary text-primary-foreground'
                    : checkOut && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === checkOut.toDateString()
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                {day}
              </button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>

      {checkIn && checkOut && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            {checkOut < checkIn
              ? `${checkOut.toLocaleDateString('fr-FR')} → ${checkIn.toLocaleDateString('fr-FR')}`
              : `${checkIn.toLocaleDateString('fr-FR')} → ${checkOut.toLocaleDateString('fr-FR')}`
            }
            ({Math.ceil(Math.abs((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))} nuits)
          </div>
          <div className="text-xs text-primary">
            Cliquez sur {editMode === 'start' ? 'la date d\'arrivée' : 'la date de départ'} pour modifier
          </div>
        </div>
      )}
    </div>
  )
}
