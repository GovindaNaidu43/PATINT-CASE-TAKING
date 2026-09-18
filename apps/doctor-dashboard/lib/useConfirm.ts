import { useState } from 'react'

export function useConfirm(sessionId: string) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const confirm = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsConfirmed(true)
    setIsLoading(false)
  }

  return { confirm, isConfirmed, isLoading }
}
