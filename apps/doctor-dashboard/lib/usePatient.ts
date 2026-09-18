import useSWR from 'swr'
import { mockPatientRecord } from './mockPatientRecord'

export function usePatient(id: string) {
  const fetcher = async () => {
    return new Promise<typeof mockPatientRecord>((resolve) => {
      setTimeout(() => resolve(mockPatientRecord), 500)
    })
  }
  
  return useSWR(`api/patient/${id}`, fetcher)
}
