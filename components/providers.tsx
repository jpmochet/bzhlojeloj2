'use client'

import { ReactNode } from 'react'
import { ConfigProvider } from '@/lib/context/config-context'
import { ImpactProvider } from '@/lib/context/impact-context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider>
      <ImpactProvider>{children}</ImpactProvider>
    </ConfigProvider>
  )
}
