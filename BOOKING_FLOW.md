# Booking Flow Implementation

This document explains how the booking flow works in the Glowbook booking application.

## User Flow

1. **Service Selection**: User clicks "Book Now" on any service card
2. **Date Selection**: Calendar dialog opens, user selects a date
3. **Time Slot Selection**: Available time slots are displayed based on:
   - Master's schedule for that date
   - Service duration
4. **Customer Information**: User fills in their details
5. **Confirmation**: Booking is submitted to the server

## Technical Implementation

### Components

#### `BookingDialog` (`src/components/booking-dialog.tsx`)

The main booking dialog component that handles the entire booking flow.

**Props:**
- `masterId`: Master's ID for fetching schedule
- `service`: Selected service object
- `open`: Dialog open state
- `onOpenChange`: Callback to control dialog visibility

**Features:**
- Date picker (disables past dates)
- Dynamic time slot generation
- Customer information form
- Responsive layout

### API Integration

#### Schedule Endpoint

**URL**: `GET /api/schedule/:id/:date`

**Parameters:**
- `:id` - Master's user ID
- `:date` - Date in YYYY-MM-DD format

**Response:**
```json
{
  "ranges": [
    {
      "id": 1,
      "start": "09:00",
      "end": "12:00"
    },
    {
      "id": 2,
      "start": "14:00",
      "end": "18:00"
    }
  ]
}
```

### Time Slot Calculation

The `generateTimeSlots` function in `src/lib/time-slots.ts` converts master's availability ranges into bookable time slots:

**Algorithm:**
1. Parse each time range (e.g., "09:00 - 12:00")
2. Generate slots within the range based on service duration
3. Slots don't overlap (next slot starts when previous ends)

**Example:**

Given:
- Range: "09:00 - 12:00"
- Service duration: 60 minutes

Generated slots:
- 09:00 - 10:00
- 10:00 - 11:00
- 11:00 - 12:00

**Code:**
```typescript
generateTimeSlots([
  { id: 1, start: "09:00", end: "12:00" }
], 60)
// Returns: [
//   { start: "09:00", end: "10:00", label: "09:00 - 10:00" },
//   { start: "10:00", end: "11:00", label: "10:00 - 11:00" },
//   { start: "11:00", end: "12:00", label: "11:00 - 12:00" }
// ]
```

### Data Flow

```
User clicks "Book Now"
    ↓
BookingDialog opens with selected service
    ↓
User selects date
    ↓
useSchedule hook fetches master's schedule
    GET /api/schedule/:id/:date
    ↓
generateTimeSlots() calculates available slots
    Input: schedule ranges + service duration
    Output: array of bookable time slots
    ↓
Display time slots as buttons
    ↓
User selects time slot
    ↓
Show customer information form
    ↓
User fills form and submits
    ↓
POST /api/bookings (to be implemented)
```

### State Management

**Page Level** (`MasterBooking.tsx`):
```typescript
const [selectedService, setSelectedService] = useState<Service | null>(null)
const [dialogOpen, setDialogOpen] = useState(false)
```

**Dialog Level** (`BookingDialog.tsx`):
```typescript
const [selectedDate, setSelectedDate] = useState<Date>()
const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>()
```

### TanStack Query Integration

**Schedule Query:**
```typescript
const { data, isLoading } = useSchedule(masterId, formattedDate)
```

**Features:**
- Automatic caching (2 minutes stale time)
- Conditional fetching (only when masterId and date are set)
- Loading states
- Error handling

**Query Key:**
```typescript
['schedule', 'master', masterId, 'date', date]
```

## File Structure

```
src/
├── components/
│   └── booking-dialog.tsx          # Main booking dialog
├── hooks/
│   └── use-schedule.ts             # Schedule query hook
├── lib/
│   ├── api/
│   │   └── schedule.ts             # Schedule API functions
│   └── time-slots.ts               # Time slot calculation logic
├── types/
│   └── schedule.ts                 # Schedule type definitions
└── pages/
    └── MasterBooking.tsx           # Page with service cards
```

## Styling

The dialog uses shadcn/ui components for consistent styling:
- `Dialog` - Modal container
- `Calendar` - Date picker
- `Button` - Time slot buttons and actions

**Responsive:**
- Calendar: Full width on mobile
- Time slots: 3 columns on mobile, 4 on desktop
- Dialog: Max height with scroll on mobile

## Future Enhancements

### TODO:
1. **Form Integration**:
   - Connect form to `useCreateBooking` mutation
   - Add form validation
   - Show success/error messages

2. **Booking Confirmation**:
   - Add confirmation step
   - Send confirmation email/SMS
   - Show booking details

3. **Time Zone Support**:
   - Display times in user's local timezone
   - Store bookings in UTC

4. **Conflict Prevention**:
   - Check for existing bookings
   - Disable already booked slots
   - Real-time availability updates

5. **Multiple Services**:
   - Allow booking multiple services
   - Calculate combined duration
   - Find available slots for all services

## Testing

### Manual Testing Steps

1. **Start the server**:
   ```bash
   cd D:\go\booking-server
   go run .
   ```

2. **Add test data** (PostgreSQL):
   ```sql
   -- Create a test user
   INSERT INTO users (email, password)
   VALUES ('test@example.com', 'hashedpassword')
   RETURNING id;

   -- Create test services
   INSERT INTO services (name, description, price, duration, user_id, currency)
   VALUES
     ('Haircut', 'Professional haircut', 3000, 60, 1, 'UAH'),
     ('Hair Coloring', 'Full hair coloring', 5000, 120, 1, 'UAH');

   -- Create test schedule
   INSERT INTO schedules (user_id, date, start_time, end_time)
   VALUES
     (1, '2024-01-25', '09:00', '12:00'),
     (1, '2024-01-25', '14:00', '18:00');
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```

4. **Test the flow**:
   - Visit `http://localhost:5173/1`
   - Click "Book Now" on a service
   - Select date: 2024-01-25
   - Verify time slots appear based on service duration
   - Select a time slot
   - Verify form appears

### Expected Results

**60-minute service (Haircut)**:
- Morning: 09:00, 10:00, 11:00
- Afternoon: 14:00, 15:00, 16:00, 17:00

**120-minute service (Hair Coloring)**:
- Morning: 09:00, 10:00
- Afternoon: 14:00, 15:00, 16:00

## Error Handling

**No schedule for date:**
- Shows message: "No available time slots for this date"

**Loading state:**
- Shows spinner while fetching schedule

**API errors:**
- Caught by TanStack Query
- Can be displayed in error boundary or toast

## Performance Considerations

- **Caching**: Schedule data cached for 2 minutes
- **Conditional fetching**: Only fetch when date is selected
- **Memoization**: Time slots recalculated only when schedule or duration changes
- **Debouncing**: Not needed as date changes are user-triggered (not typed)
