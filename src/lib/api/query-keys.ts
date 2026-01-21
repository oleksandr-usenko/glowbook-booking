export const queryKeys = {
  services: {
    all: ['services'] as const,
    byMaster: (masterId: string) => ['services', 'master', masterId] as const,
  },
  schedule: {
    all: ['schedule'] as const,
    byMaster: (masterId: string) => ['schedule', 'master', masterId] as const,
    byDate: (masterId: string, date: string) => ['schedule', 'master', masterId, 'date', date] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    byId: (bookingId: string) => ['bookings', bookingId] as const,
  },
}
