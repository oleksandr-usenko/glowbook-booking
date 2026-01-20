import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '@/lib/api/services'
import { queryKeys } from '@/lib/api/query-keys'

export function useServices(masterId: string) {
  return useQuery({
    queryKey: queryKeys.services.byMaster(masterId),
    queryFn: () => servicesApi.getByMasterId(masterId),
    enabled: !!masterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
