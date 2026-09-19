import { useState } from 'react'
import { confirmSummary } from './apiClient'

export function useConfirm(draftId: string) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const confirm = async () => {
    if (!draftId) return
    setIsLoading(true)
    setError('')
    try {
      await confirmSummary(draftId)
      setIsConfirmed(true)
    } catch {
      setError('Could not confirm summary. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return { confirm, isConfirmed, isLoading, error }
}
