import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/lib/api/bookings'
import { CreateBookingRequest } from '@/types/booking'
import { queryKeys } from '@/lib/api/query-keys'

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch schedule queries
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })
    },
  })
}
