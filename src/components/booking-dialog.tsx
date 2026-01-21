import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Service } from '@/types/service'
import { useSchedule } from '@/hooks/use-schedule'
import { useCreateBooking } from '@/hooks/use-create-booking'
import { generateTimeSlots, formatDateForApi } from '@/lib/time-slots'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SmartImage } from '@/components/smart-image'
import { cn } from '@/lib/utils'
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";

const bookingFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingFormSchema>

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
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const createBooking = useCreateBooking()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  })

  useEffect(() => {
    if (open && !selectedDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      setSelectedDate(today)
    }
  }, [open, selectedDate])

  const formattedDate = selectedDate ? formatDateForApi(selectedDate) : ''

  const { data: scheduleData, isLoading: scheduleLoading } = useSchedule(
    masterId,
    formattedDate
  )

  const timeSlots = selectedDate && scheduleData && service
    ? generateTimeSlots(scheduleData.ranges, service.duration)
    : []

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTimeSlot(undefined)
  }

  const handleClose = () => {
    setSelectedDate(undefined)
    setSelectedTimeSlot(undefined)
    setBookingSuccess(false)
    reset()
    onOpenChange(false)
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTimeSlot || !service) return

    try {
      await createBooking.mutateAsync({
        masterId,
        serviceId: service.id,
        date: formattedDate,
        time: selectedTimeSlot,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || undefined,
        notes: data.notes || undefined,
      })
      setBookingSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Failed to create booking:', error)
    }
  }

  if (!service) return null

  const validImages = service.media?.filter(
    (item) => item.mimeType?.startsWith('image/') && isValidImageUrl(item.uri)
  ) || []

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-3xl max-h-[90vh] sm:max-w-100 overflow-y-auto">
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
          <div className="flex flex-col items-center md:items-start gap-6 w-full md:flex-row">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-3">Select a date</h3>
              <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  className="inline-flex"
              />
            </div>
            {/*<Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              className="rounded-md border"
            />*/}

            {selectedDate && (
                <div className="flex-1">
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
          </div>

          {selectedDate && selectedTimeSlot && !bookingSuccess && (
            <form onSubmit={handleSubmit(onSubmit)} className="border-t pt-6">
              <h3 className="text-sm font-medium mb-4">Your information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="John Doe"
                    {...register('customerName')}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="+1234567890"
                    {...register('customerPhone')}
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-destructive">
                      {errors.customerPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email (optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="john@example.com"
                    {...register('customerEmail')}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-destructive">
                      {errors.customerEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Any special requests or notes..."
                    {...register('notes')}
                  />
                </div>
              </div>

              {createBooking.isError && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Booking failed</p>
                    <p className="text-muted-foreground">
                      {createBooking.error instanceof Error
                        ? createBooking.error.message
                        : 'Please try again or contact support'}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={createBooking.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          )}

          {/* Success Message */}
          {bookingSuccess && (
            <div className="border-t pt-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Booking confirmed!</h3>
                <p className="text-sm text-muted-foreground">
                  Your booking has been successfully created. You will receive a
                  confirmation shortly.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
