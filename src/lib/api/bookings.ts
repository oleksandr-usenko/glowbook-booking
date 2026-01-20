import { apiClient } from './client'
import { CreateBookingRequest, CreateBookingResponse } from '@/types/booking'

export const bookingsApi = {
  create: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    return apiClient.post<CreateBookingResponse, CreateBookingRequest>('/api/bookings', data)
  },
}
