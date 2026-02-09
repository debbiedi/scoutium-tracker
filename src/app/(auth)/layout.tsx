'use client'

import { useEffect } from 'react'

const lightTheme = {
  '--background': '#f8fafc',
  '--foreground': '#1e293b',
  '--card': '#ffffff',
  '--card-foreground': '#1e293b',
  '--secondary': '#f1f5f9',
  '--secondary-foreground': '#475569',
  '--muted': '#f1f5f9',
  '--muted-foreground': '#64748b',
  '--accent': '#ecfdf5',
  '--accent-foreground': '#065f46',
  '--border': '#e2e8f0',
  '--input': '#e2e8f0',
  '--sidebar-bg': '#ffffff',
  '--sidebar-text': '#475569',
  '--sidebar-hover': '#f1f5f9',
  '--sidebar-border': '#e2e8f0',
  '--price-bg': '#f8fafc',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Apply light theme by default for auth pages
    const root = document.documentElement
    Object.entries(lightTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [])

  return <>{children}</>
}
