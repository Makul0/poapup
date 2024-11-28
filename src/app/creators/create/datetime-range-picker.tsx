'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

interface DateTimeRangePickerProps {
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
}

export function DateTimeRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateTimeRangePickerProps) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (dayjs(endDate).isBefore(startDate)) {
      setError('End date must be after start date')
    } else {
      setError(null)
    }
  }, [startDate, endDate])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={dayjs(startDate).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => onStartDateChange(new Date(e.target.value))}
            min={dayjs().format('YYYY-MM-DDTHH:mm')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={dayjs(endDate).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => onEndDateChange(new Date(e.target.value))}
            min={dayjs(startDate).format('YYYY-MM-DDTHH:mm')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}