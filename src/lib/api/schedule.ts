import { apiClient } from './client'
import { ScheduleResponse } from '@/types/schedule'

export const scheduleApi = {
  getByMasterAndDate: async (masterId: string, date: string): Promise<ScheduleResponse> => {
    return apiClient.get<ScheduleResponse>(`/api/schedule/${masterId}/${date}`)
  },
}
