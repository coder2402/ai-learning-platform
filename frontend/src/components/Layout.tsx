'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Bot, BookOpen, FileSpreadsheet,
  Sliders, Clock, Target, Menu, Search, Sparkles, Bell
} from 'lucide-react'

const mainNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Bot, label: 'AI Doubts', path: '/doubts' },
  { icon: BookOpen, label: 'Theory & Modules', path: '/theory' },
  { icon: FileSpreadsheet, label: 'Formula Sheets', path: '/formula-sheet' },
  { icon: Target, label: 'PYQs', path: '/pyq' },
  { icon: BookOpen, label: 'Topics', path: '/topics' },
]

const testingNav = [
  { icon: Sliders, label: 'Test Generator', path: '/test-generator' },
  { icon: Clock, label: 'Mock Exam Room', path: '/test' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const NavLink = ({ icon: Icon, label, path }: { icon: typeof LayoutDashboard; label: string; path: string }) => {
    const active = pathname === path
    return (
      <Link
        href={path}
        onClick={() => setMobileOpen(false)}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? 'text-blue-600 bg-blue-50 font-semibold'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed md:relative z-30 flex flex-col bg-white border-r border-slate-200 h-full w-64 flex-shrink-0
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-5 border-b border-slate-200 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-500/20">
              Σ
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-tight">
                MathAI <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-semibold border border-purple-500/20">2.0</span>
              </span>
              <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">Competitive Platform</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Main Portal</span>
            {mainNav.map(item => <NavLink key={item.path} {...item} />)}
          </div>
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Testing & Analytics</span>
            {testingNav.map(item => <NavLink key={item.path} {...item} />)}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          <Link href="/profile" className="flex items-center space-x-3 hover:bg-slate-50 rounded-xl p-2 -m-2 transition-all">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">AS</div>
            <div className="flex flex-col text-xs min-w-0">
              <span className="font-semibold text-slate-900 truncate">Alex Sharma</span>
              <span className="text-slate-500 truncate">JEE Advanced 2026</span>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900 p-1">
            <Menu size={20} />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, formulas..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <Link
              href="/pricing"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
            >
              <Sparkles size={11} />
              Upgrade
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
