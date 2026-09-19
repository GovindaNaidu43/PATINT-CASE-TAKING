import useSWR from 'swr'
import { getQueue, type QueueItem } from './apiClient'

export function useQueue() {
  return useSWR<QueueItem[]>('operations/queue', getQueue, {
    refreshInterval: 5_000,
  })
}
