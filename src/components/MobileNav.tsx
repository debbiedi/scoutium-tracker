'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, List, PlusCircle, Calendar, Layers, LogOut, User, Menu, X, Trophy } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/matches', label: 'Maçlar', icon: List },
  { href: '/matches/new', label: 'Yeni Maç', icon: PlusCircle },
  { href: '/matches/bulk', label: 'Toplu Ekle', icon: Layers },
  { href: '/calendar', label: 'Takvim', icon: Calendar },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const userEmail = user?.email || ''
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0]

  return (
    <>
      {/* Mobile Header */}
      <header 
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4"
        style={{ 
          background: 'var(--sidebar-bg)',
          borderBottom: '1px solid var(--sidebar-border)'
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-xl shadow-lg shadow-emerald-500/30">
            ⚽
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>SCOUTIUM</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" style={{ color: 'var(--foreground)' }} />
            ) : (
              <Menu className="h-6 w-6" style={{ color: 'var(--foreground)' }} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed top-16 right-0 bottom-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          background: 'var(--sidebar-bg)',
          borderLeft: '1px solid var(--sidebar-border)'
        }}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                      : 'hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  style={!isActive ? { 
                    color: 'var(--sidebar-text)',
                  } : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1 min-h-8" />

          {/* User Info & Logout */}
          <div 
            className="rounded-xl p-3 mb-3"
            style={{ 
              background: 'var(--price-bg)',
              border: '1px solid var(--sidebar-border)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{userName}</p>
                <p className="text-xs truncate" style={{ color: 'var(--sidebar-text)' }}>{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>

          {/* Ücret Tablosu */}
          <div 
            className="rounded-xl p-4 transition-colors duration-200"
            style={{ 
              background: 'var(--price-bg)',
              border: '1px solid var(--sidebar-border)'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--sidebar-text)' }}>Ücret Tablosu</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div 
                className="flex justify-between items-center p-2 rounded-lg"
                style={{ background: 'var(--sidebar-hover)' }}
              >
                <span style={{ color: 'var(--sidebar-text)' }}>0-25</span>
                <span className="font-bold text-emerald-500">₺120</span>
              </div>
              <div 
                className="flex justify-between items-center p-2 rounded-lg"
                style={{ background: 'var(--sidebar-hover)' }}
              >
                <span style={{ color: 'var(--sidebar-text)' }}>25-45</span>
                <span className="font-bold text-emerald-500">₺240</span>
              </div>
              <div 
                className="flex justify-between items-center p-2 rounded-lg"
                style={{ background: 'var(--sidebar-hover)' }}
              >
                <span style={{ color: 'var(--sidebar-text)' }}>45-70</span>
                <span className="font-bold text-emerald-500">₺360</span>
              </div>
              <div 
                className="flex justify-between items-center p-2 rounded-lg"
                style={{ background: 'var(--sidebar-hover)' }}
              >
                <span style={{ color: 'var(--sidebar-text)' }}>70-90</span>
                <span className="font-bold text-emerald-500">₺480</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
