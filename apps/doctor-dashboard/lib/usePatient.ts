import useSWR from 'swr'
import { getConsultation, type ConsultationDetail } from './apiClient'

export function usePatient(consultationId: string) {
  return useSWR<ConsultationDetail>(
    consultationId ? `consultation/${consultationId}` : null,
    () => getConsultation(consultationId),
    { refreshInterval: 30_000 }  // re-fetch every 30 s for live status
  )
}
