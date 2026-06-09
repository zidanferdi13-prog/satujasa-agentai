import { useEffect } from 'react'
import { authStore } from '../stores/auth'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    authStore.getState().restore()
  }, [])

  return <>{children}</>
}
