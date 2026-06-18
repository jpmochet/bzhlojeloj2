'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { AdminConfig } from '@/lib/types'
import { defaultConfig } from '@/lib/data/config'

interface ConfigContextValue {
  config: AdminConfig
  updateConfig: (updates: Partial<AdminConfig>) => void
  resetConfig: () => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AdminConfig>(defaultConfig)

  const updateConfig = (updates: Partial<AdminConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
