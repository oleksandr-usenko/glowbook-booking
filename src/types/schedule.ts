export interface TimeRange {
  id: number
  start: string // "HH:MM" format
  end: string   // "HH:MM" format
}

export interface ScheduleResponse {
  ranges: TimeRange[]
}

export interface TimeSlot {
  start: string // "HH:MM" format
  end: string   // "HH:MM" format
  label: string // Display label like "10:00 - 11:00"
}
