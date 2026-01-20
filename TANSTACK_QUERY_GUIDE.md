# TanStack Query Implementation Guide

This project uses TanStack Query (React Query) for all API interactions, providing automatic caching, background refetching, and optimistic updates.

## Architecture

```
src/
├── lib/
│   └── api/
│       ├── client.ts          # HTTP client with error handling
│       ├── services.ts        # Services API functions
│       ├── bookings.ts        # Bookings API functions
│       ├── query-keys.ts      # Centralized query key management
│       └── index.ts           # Exports
├── hooks/
│   ├── use-services.ts        # Query hook for fetching services
│   ├── use-create-booking.ts  # Mutation hook for creating bookings
│   └── index.ts               # Exports
└── types/
    ├── service.ts             # Service types
    └── booking.ts             # Booking types
```

## Usage Examples

### 1. Fetching Data (Queries)

Use the `useServices` hook to fetch services for a master:

```tsx
import { useServices } from '@/hooks/use-services'

function MyComponent() {
  const { data, isLoading, error } = useServices(masterId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  )
}
```

### 2. Mutations (Create/Update/Delete)

Use the `useCreateBooking` hook for creating bookings:

```tsx
import { useCreateBooking } from '@/hooks/use-create-booking'

function BookingForm() {
  const createBooking = useCreateBooking()

  const handleSubmit = () => {
    createBooking.mutate(
      {
        masterId: '1',
        serviceId: 123,
        date: '2024-01-20',
        time: '10:00',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
      },
      {
        onSuccess: (data) => {
          console.log('Booking created:', data)
        },
        onError: (error) => {
          console.error('Error:', error)
        },
      }
    )
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={createBooking.isPending}
    >
      {createBooking.isPending ? 'Creating...' : 'Book Now'}
    </button>
  )
}
```

## Adding New API Endpoints

### Step 1: Add API Function

Create or update a file in `src/lib/api/`:

```typescript
// src/lib/api/schedule.ts
import { apiClient } from './client'

export const scheduleApi = {
  getByDate: async (masterId: string, date: string) => {
    return apiClient.get(`/api/schedule/${masterId}/${date}`)
  },
}
```

### Step 2: Add Query Key

Update `src/lib/api/query-keys.ts`:

```typescript
export const queryKeys = {
  // ... existing keys
  schedule: {
    all: ['schedule'] as const,
    byDate: (masterId: string, date: string) =>
      ['schedule', masterId, date] as const,
  },
}
```

### Step 3: Create Custom Hook

Create a hook in `src/hooks/`:

```typescript
// src/hooks/use-schedule.ts
import { useQuery } from '@tanstack/react-query'
import { scheduleApi } from '@/lib/api/schedule'
import { queryKeys } from '@/lib/api/query-keys'

export function useSchedule(masterId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.schedule.byDate(masterId, date),
    queryFn: () => scheduleApi.getByDate(masterId, date),
    enabled: !!masterId && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
```

### Step 4: Use in Component

```tsx
import { useSchedule } from '@/hooks/use-schedule'

function ScheduleView({ masterId, date }) {
  const { data, isLoading } = useSchedule(masterId, date)
  // ... render schedule
}
```

## Advanced Features

### Optimistic Updates

```typescript
const updateBooking = useMutation({
  mutationFn: bookingsApi.update,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.bookings.all })

    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKeys.bookings.all)

    // Optimistically update
    queryClient.setQueryData(queryKeys.bookings.all, (old) => {
      // Update logic
    })

    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKeys.bookings.all, context?.previous)
  },
})
```

### Dependent Queries

```typescript
const { data: services } = useServices(masterId)
const selectedServiceId = services?.[0]?.id

const { data: schedule } = useSchedule(masterId, selectedServiceId, {
  enabled: !!selectedServiceId, // Only run if we have a service
})
```

### Infinite Queries

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

function useInfiniteServices(masterId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.services.byMaster(masterId),
    queryFn: ({ pageParam = 0 }) =>
      servicesApi.getByMasterId(masterId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })
}
```

## Configuration

Query client is configured in `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

## Best Practices

1. **Always use query keys from `query-keys.ts`** - Centralized management prevents typos
2. **Enable queries conditionally** - Use `enabled` option to prevent unnecessary requests
3. **Set appropriate stale times** - Balance between fresh data and unnecessary requests
4. **Handle loading and error states** - Always show feedback to users
5. **Use mutations for side effects** - Never mutate data with queries
6. **Invalidate queries after mutations** - Keep data in sync

## Error Handling

All API errors are wrapped in `ApiError` class with status and data:

```typescript
if (error instanceof ApiError) {
  console.log('Status:', error.status)
  console.log('Message:', error.message)
  console.log('Data:', error.data)
}
```

## DevTools

React Query DevTools are included in development:

- Press the floating React Query icon in the bottom corner
- View all queries, their status, and cached data
- Manually trigger refetches and mutations
- Debug query invalidation and updates
