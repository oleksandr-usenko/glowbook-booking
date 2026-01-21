import { TimeRange, TimeSlot } from '@/types/schedule'

/**
 * Converts "HH:MM" time string to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Converts minutes since midnight to "HH:MM" format
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Generates available time slots based on master's schedule and service duration
 *
 * @param ranges - Master's available time ranges for the day
 * @param durationMinutes - Service duration in minutes
 * @returns Array of available time slots
 */
export function generateTimeSlots(
  ranges: TimeRange[],
  durationMinutes: number
): TimeSlot[] {
  const slots: TimeSlot[] = []
  if (!ranges) return [];

  for (const range of ranges) {
    const rangeStart = timeToMinutes(range.start)
    const rangeEnd = timeToMinutes(range.end)

    // Generate slots within this range
    let currentStart = rangeStart
    const step = 10;

    while (currentStart + durationMinutes <= rangeEnd) {
      const slotEnd = currentStart + durationMinutes

      const startTime = minutesToTime(currentStart)
      const endTime = minutesToTime(slotEnd)

      slots.push({
        start: startTime,
        end: endTime,
        label: `${startTime} - ${endTime}`,
      })

      // Move to next slot (no overlap, start next slot where previous ended)
      currentStart = currentStart + step
    }
  }

  return slots
}

/**
 * Formats date to YYYY-MM-DD format for API calls
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
