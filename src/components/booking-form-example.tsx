import { useState } from 'react'
import { useCreateBooking } from '@/hooks/use-create-booking'
import { Button } from '@/components/ui/button'
import { Service } from '@/types/service'

interface BookingFormProps {
  masterId: string
  service: Service
}

/**
 * Example component showing how to use TanStack Query mutations
 * This is a reference implementation - customize as needed
 */
export function BookingFormExample({ masterId, service }: BookingFormProps) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  const createBooking = useCreateBooking()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createBooking.mutate(
      {
        masterId,
        serviceId: service.id,
        date: '2024-01-20', // Replace with actual date selection
        time: '10:00', // Replace with actual time selection
        customerName,
        customerPhone,
      },
      {
        onSuccess: (data) => {
          console.log('Booking created:', data)
          // Show success message, reset form, etc.
        },
        onError: (error) => {
          console.error('Booking failed:', error)
          // Show error message
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <Button
        type="submit"
        disabled={createBooking.isPending}
        className="w-full"
      >
        {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
      </Button>

      {createBooking.isError && (
        <p className="text-sm text-destructive">
          Error: {createBooking.error.message}
        </p>
      )}

      {createBooking.isSuccess && (
        <p className="text-sm text-green-600">
          Booking confirmed!
        </p>
      )}
    </form>
  )
}
