import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => useContext(ThemeContext)

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('cv-theme') || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const saved = localStorage.getItem('cv-theme') || 'system'
    return saved === 'system' ? getSystemTheme() : saved
  })

  useEffect(() => {
    const resolved = mode === 'system' ? getSystemTheme() : mode
    setResolvedTheme(resolved)
    document.documentElement.setAttribute('data-theme', resolved)
    localStorage.setItem('cv-theme', mode)
  }, [mode])

  // Listen for system theme changes when in system mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (mode === 'system') {
        const resolved = getSystemTheme()
        setResolvedTheme(resolved)
        document.documentElement.setAttribute('data-theme', resolved)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const value = {
    mode,       // 'light' | 'dark' | 'system'
    theme: resolvedTheme,  // actual applied theme: 'light' | 'dark'
    setMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
