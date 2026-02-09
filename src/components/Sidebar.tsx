'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List, PlusCircle, Calendar, Trophy, Layers } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/matches', label: 'Maçlar', icon: List },
  { href: '/matches/new', label: 'Yeni Maç', icon: PlusCircle },
  { href: '/matches/bulk', label: 'Toplu Ekle', icon: Layers },
  { href: '/calendar', label: 'Takvim', icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f172a] p-4 shadow-2xl">
      {/* Logo Bölümü */}
      <div className="mb-8 p-4 text-center">
        <Link href="/" className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl shadow-lg shadow-emerald-500/30">
            ⚽
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">SCOUTIUM</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Maç Takip</p>
          </div>
        </Link>
      </div>

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
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Tema</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Ücret Tablosu */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">Ücret Tablosu</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/50">
              <span className="text-slate-400">0-25 dk</span>
              <span className="font-bold text-emerald-400">₺120</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/50">
              <span className="text-slate-400">25-45 dk</span>
              <span className="font-bold text-emerald-400">₺240</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/50">
              <span className="text-slate-400">45-70 dk</span>
              <span className="font-bold text-emerald-400">₺360</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/50">
              <span className="text-slate-400">70-90 dk</span>
              <span className="font-bold text-emerald-400">₺480</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
