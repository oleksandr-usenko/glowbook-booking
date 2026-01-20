import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Service } from '@/types/service'
import { useSchedule } from '@/hooks/use-schedule'
import { generateTimeSlots, formatDateForApi } from '@/lib/time-slots'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SmartImage } from '@/components/smart-image'
import { cn } from '@/lib/utils'

function isValidImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

interface BookingDialogProps {
  masterId: string
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDialog({
  masterId,
  service,
  open,
  onOpenChange,
}: BookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>()

  // Format date for API call
  const formattedDate = selectedDate ? formatDateForApi(selectedDate) : ''

  // Fetch schedule for selected date
  const { data: scheduleData, isLoading: scheduleLoading } = useSchedule(
    masterId,
    formattedDate
  )

  // Generate time slots based on schedule and service duration
  const timeSlots = selectedDate && scheduleData && service
    ? generateTimeSlots(scheduleData.ranges, service.duration)
    : []

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTimeSlot(undefined) // Reset time slot when date changes
  }

  const handleClose = () => {
    setSelectedDate(undefined)
    setSelectedTimeSlot(undefined)
    onOpenChange(false)
  }

  if (!service) return null

  const validImages = service.media?.filter(
    (item) => item.mimeType?.startsWith('image/') && isValidImageUrl(item.uri)
  ) || []

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
          <DialogDescription>
            {service.description && <span>{service.description} • </span>}
            {service.duration} minutes • {service.currency}{' '}
            {(service.price / 100).toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Service Images Carousel */}
          {validImages.length === 1 && (
            <div className="aspect-video relative rounded-md overflow-hidden">
              <SmartImage
                src={validImages[0].uri}
                alt={validImages[0].fileName || service.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Calendar Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select a date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              className="rounded-md border"
            />
          </div>

          {/* Time Slots Section */}
          {selectedDate && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4" />
                <h3 className="text-sm font-medium">
                  Available times for {format(selectedDate, 'PPP')}
                </h3>
              </div>

              {scheduleLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No available time slots for this date
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.start}
                      variant={
                        selectedTimeSlot === slot.start ? 'default' : 'outline'
                      }
                      className={cn(
                        'text-sm',
                        selectedTimeSlot === slot.start && 'ring-2 ring-primary'
                      )}
                      onClick={() => setSelectedTimeSlot(slot.start)}
                    >
                      {slot.start}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customer Info Form - shown when time slot is selected */}
          {selectedDate && selectedTimeSlot && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium mb-4">Your information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">Confirm Booking</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
