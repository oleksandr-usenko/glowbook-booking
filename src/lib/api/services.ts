import { apiClient } from './client'
import { Service } from '@/types/service'

export const servicesApi = {
  getByMasterId: async (masterId: string): Promise<Service[]> => {
    return apiClient.get<Service[]>(`/api/services/${masterId}`)
  },
}
