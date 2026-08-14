import { useTheme } from '../context/ThemeContext'
import { useEffect, useState } from 'react'

const pages = {
  overview: ['Command center', 'A live view of your Lucky Travel website'], hero: ['Hero section', 'Manage the first impression of your website'], services: ['Travel services', 'Update the experiences you offer'], packages: ['Tour packages', 'Curate destinations, prices and itineraries'], gallery: ['Travel moments', 'Manage the visual story of Sri Lanka'], testimonials: ['Guest stories', 'Review and publish customer experiences'], 'chatbot-bookings': ['AI booking inbox', 'Follow up enquiries captured by the chatbot'], settings: ['Settings', 'Manage your administration preferences']
}

export default function Header({ onSearch, currentPage }) {
  const { isDark, toggleTheme } = useTheme()
  const [user, setUser] = useState({ username: 'Admin' })
  const [search, setSearch] = useState('')
  const [title, subtitle] = pages[currentPage] || pages.overview
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => { try { setUser(JSON.parse(localStorage.getItem('user')) || user) } catch { /* fallback */ } }, [])
  const updateSearch = (event) => { setSearch(event.target.value); onSearch(event.target.value) }

  return <header className="relative z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#050c18]/90">
    <div className="flex min-h-[82px] items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-8">
      <div className="ml-14 min-w-0 sm:ml-12 lg:ml-0"><p className="truncate text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-300">● &nbsp;{date}</p><h2 className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{title}</h2><p className="hidden text-xs text-slate-500 dark:text-slate-400 md:block">{subtitle}</p></div>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="relative hidden md:block"><input value={search} onChange={updateSearch} placeholder="Find a section..." className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15 dark:border-white/10 dark:bg-white/[.04] dark:text-white lg:w-60"/><svg className="absolute left-3 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
        <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:border-cyan-400 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-300">{isDark ? '☀' : '☾'}</button>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-white/10"><div className="hidden text-right lg:block"><p className="text-sm font-semibold text-slate-900 dark:text-white">{user.username || 'Admin'}</p><p className="text-[11px] text-slate-500">Administrator</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-teal-500 text-sm font-bold text-slate-950">{user.username?.charAt(0).toUpperCase() || 'A'}</div></div>
      </div>
    </div>
  </header>
}
