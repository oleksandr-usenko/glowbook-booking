export interface CreateBookingRequest {
  masterId: string
  serviceId: number
  date: string
  time: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  notes?: string
}

export interface Booking {
  id: string
  masterId: string
  serviceId: number
  date: string
  time: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface CreateBookingResponse {
  message: string
  booking: Booking
}
