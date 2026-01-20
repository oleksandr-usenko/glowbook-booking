import { useQuery } from '@tanstack/react-query'
import { scheduleApi } from '@/lib/api/schedule'
import { queryKeys } from '@/lib/api/query-keys'

export function useSchedule(masterId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.schedule.byDate(masterId, date),
    queryFn: () => scheduleApi.getByMasterAndDate(masterId, date),
    enabled: !!masterId && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
