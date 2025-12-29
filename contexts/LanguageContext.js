'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '@/lib/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('fr')

  useEffect(() => {
    const saved = localStorage.getItem('missaLanguage')
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguage(saved)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr'
    setLanguage(newLang)
    localStorage.setItem('missaLanguage', newLang)
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.fr[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
