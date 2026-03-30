"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface NamespaceContextValue {
  namespace: string
  setNamespace: (ns: string) => void
}

const NamespaceContext = createContext<NamespaceContextValue>({
  namespace: 'All Namespaces',
  setNamespace: () => {},
})

export function NamespaceProvider({ children }: { children: ReactNode }) {
  const [namespace, setNamespace] = useState('All Namespaces')
  return (
    <NamespaceContext.Provider value={{ namespace, setNamespace }}>
      {children}
    </NamespaceContext.Provider>
  )
}

export function useNamespace() {
  return useContext(NamespaceContext)
}
