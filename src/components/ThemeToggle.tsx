'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

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
}

const darkTheme = {
  '--background': '#0f172a',
  '--foreground': '#f1f5f9',
  '--card': '#1e293b',
  '--card-foreground': '#f1f5f9',
  '--secondary': '#334155',
  '--secondary-foreground': '#e2e8f0',
  '--muted': '#334155',
  '--muted-foreground': '#94a3b8',
  '--accent': '#064e3b',
  '--accent-foreground': '#ecfdf5',
  '--border': '#334155',
  '--input': '#334155',
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  const applyTheme = (dark: boolean) => {
    const theme = dark ? darkTheme : lightTheme
    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)
    
    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newValue = !isDark
    setIsDark(newValue)
    applyTheme(newValue)
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  }

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-slate-700/50">
        <div className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
      title={isDark ? 'Açık moda geç' : 'Karanlık moda geç'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-300" />
      )}
    </button>
  )
}
