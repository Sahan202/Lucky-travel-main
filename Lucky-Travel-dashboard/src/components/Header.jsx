import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://lucky-travel-website.vercel.app'
const pages = {
  overview: ['Journey command center', 'Website performance and booking activity'],
  hero: ['Hero experience', 'Manage the first impression of your website'],
  services: ['Travel services', 'Curate the experiences you offer'],
  packages: ['Tour collection', 'Manage destinations, pricing and itineraries'],
  gallery: ['Travel moments', 'Shape the visual story of Sri Lanka'],
  testimonials: ['Guest stories', 'Review and publish traveller experiences'],
  'chatbot-bookings': ['AI booking concierge', 'Manage enquiries captured by the travel assistant'],
  settings: ['Studio settings', 'Manage administration preferences'],
}

export default function Header({ onSearch, currentPage }) {
  const { isDark, toggleTheme } = useTheme()
  const [user, setUser] = useState({ username: 'Admin' })
  const [search, setSearch] = useState('')
  const [title, subtitle] = pages[currentPage] || pages.overview

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('user')) || { username: 'Admin' }) } catch { /* keep fallback */ }
  }, [])

  const updateSearch = (event) => { setSearch(event.target.value); onSearch(event.target.value) }

  return (
    <header className="dashboard-header relative z-20 border-b border-white/[0.06] bg-[#050b14]/90 backdrop-blur-2xl">
      <div className="flex min-h-[88px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="ml-14 min-w-0 lg:ml-0">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.24em] text-cyan-300"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/><span className="relative h-2 w-2 rounded-full bg-emerald-400"/></span>Lucky Travel studio</div>
          <h2 className="mt-1 truncate text-lg font-semibold tracking-[-.03em] text-white sm:text-2xl">{title}</h2>
          <p className="hidden text-xs text-slate-500 md:block">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="relative hidden md:block"><input value={search} onChange={updateSearch} placeholder="Search workspace" className="w-48 rounded-2xl border border-white/[.08] bg-white/[.045] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-white/[.07] focus:ring-4 focus:ring-cyan-400/[.06] lg:w-60"/><svg className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <a href={SITE_URL} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/[.08] px-4 py-2.5 text-xs font-bold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/[.13] sm:flex">Preview site<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M8 7h9v9"/></svg></a>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[.08] bg-white/[.045] text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200">{isDark ? <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg> : <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>}</button>
          <div className="flex items-center gap-3 border-l border-white/[.08] pl-3"><div className="hidden text-right xl:block"><p className="text-sm font-semibold text-white">{user.username || 'Admin'}</p><p className="text-[10px] uppercase tracking-[.15em] text-slate-500">Administrator</p></div><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-teal-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/10">{user.username?.charAt(0).toUpperCase() || 'A'}</div></div>
        </div>
      </div>
    </header>
  )
}
