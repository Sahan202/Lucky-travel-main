import { useEffect, useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://lucky-travel-website.vercel.app'
const Arrow = () => <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6"/></svg>

export default function Dashboard({ setCurrentPage }) {
  const [counts, setCounts] = useState({ packages: 0, services: 0, gallery: 0, reviews: 0 })
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const endpoints = ['packages', 'services', 'gallery', 'reviews']
        const results = await Promise.all(endpoints.map(async endpoint => {
          const response = await fetch(`${API_URL}/api/${endpoint}`)
          if (!response.ok) return []
          const data = await response.json()
          return Array.isArray(data) ? data : data.data || []
        }))
        if (active) setCounts(Object.fromEntries(endpoints.map((key, index) => [key, results[index].length])))
        const token = localStorage.getItem('token')
        if (token) {
          const response = await fetch(`${API_URL}/api/chatbot-bookings?status=all`, { headers: { Authorization: `Bearer ${token}` } })
          if (response.ok) { const data = await response.json(); if (active) setBookings(Array.isArray(data) ? data : data.data || []) }
        }
      } catch (error) { console.error('Unable to load dashboard overview:', error) }
      finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [])

  const pipeline = useMemo(() => {
    const totals = { new: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    bookings.forEach(item => { const status = String(item.status || 'new').toLowerCase(); if (status in totals) totals[status] += 1; else totals.new += 1 })
    return totals
  }, [bookings])
  const activeLeads = pipeline.new + pipeline.pending
  const wonLeads = pipeline.confirmed + pipeline.completed
  const conversion = bookings.length ? Math.round((wonLeads / bookings.length) * 100) : 0
  const totalContent = Object.values(counts).reduce((sum, value) => sum + value, 0)
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const stats = [
    { key: 'packages', label: 'Tour collection', detail: 'Journeys ready to book', page: 'packages', number: '01' },
    { key: 'services', label: 'Travel services', detail: 'Curated guest experiences', page: 'services', number: '02' },
    { key: 'gallery', label: 'Travel moments', detail: 'Images shaping your story', page: 'gallery', number: '03' },
    { key: 'reviews', label: 'Guest stories', detail: 'Published social proof', page: 'testimonials', number: '04' },
  ]
  const readiness = [['Tour collection', counts.packages, 8, 'packages'], ['Service catalogue', counts.services, 6, 'services'], ['Visual journal', counts.gallery, 12, 'gallery'], ['Guest confidence', counts.reviews, 8, 'testimonials']]

  return <div className="dashboard-overview mx-auto max-w-[1540px] space-y-5 pb-8">
    <section className="command-hero relative overflow-hidden rounded-[2rem] border border-white/[.08] p-6 text-white shadow-2xl sm:p-8 lg:p-10">
      <div className="command-grid absolute inset-0 opacity-40"/><div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-cyan-400/[.13] blur-3xl"/>
      <div className="relative grid gap-8 xl:grid-cols-[1.4fr_.6fr] xl:items-end">
        <div><div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-cyan-200"><span className="rounded-full border border-cyan-300/20 bg-cyan-300/[.08] px-3 py-1.5">Live operations</span><span className="text-slate-500">{date}</span></div><h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl lg:text-6xl">Your island journeys,<br/><span className="bg-gradient-to-r from-cyan-200 via-white to-amber-100 bg-clip-text text-transparent">beautifully orchestrated.</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">One premium workspace to curate the website, follow AI travel enquiries and turn Sri Lanka inspiration into confirmed journeys.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => setCurrentPage('chatbot-bookings')} className="flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-[#04101a] shadow-xl shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-200">Open concierge inbox <Arrow/></button><a href={SITE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl border border-white/[.12] bg-white/[.05] px-5 py-3 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[.09]">Explore live website <Arrow/></a></div></div>
        <div className="grid grid-cols-2 gap-3">{[['Active leads', activeLeads, 'Needs attention'], ['Conversion', `${conversion}%`, 'Confirmed + complete'], ['Total enquiries', bookings.length, 'AI concierge'], ['Published assets', totalContent, 'Across the website']].map(([label, value, note]) => <div key={label} className="rounded-2xl border border-white/[.08] bg-[#06111e]/70 p-4 backdrop-blur-xl"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-white">{loading ? '—' : value}</p><p className="mt-1 text-[10px] text-slate-500">{note}</p></div>)}</div>
      </div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(item => <button key={item.key} onClick={() => setCurrentPage(item.page)} className="premium-stat group relative overflow-hidden rounded-3xl border border-white/[.07] bg-[#081321] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/25"><div className="flex items-start justify-between"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300/70">Collection {item.number}</span><span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[.07] text-slate-500 transition group-hover:border-cyan-300/20 group-hover:text-cyan-200"><Arrow/></span></div><p className="mt-8 text-4xl font-semibold tracking-[-.05em] text-white">{loading ? '—' : counts[item.key]}</p><p className="mt-2 text-sm font-bold text-slate-200">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p></button>)}</section>

    <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <div className="premium-panel rounded-[1.75rem] border border-white/[.07] bg-[#081321] p-5 sm:p-6"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">AI concierge pipeline</p><h3 className="mt-2 text-xl font-semibold tracking-tight text-white">Latest booking enquiries</h3></div><button onClick={() => setCurrentPage('chatbot-bookings')} className="flex items-center gap-2 text-xs font-bold text-cyan-300">View all <Arrow/></button></div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{[['New', pipeline.new, 'cyan'], ['Pending', pipeline.pending, 'amber'], ['Confirmed', pipeline.confirmed, 'emerald'], ['Completed', pipeline.completed, 'violet']].map(([label, value, tone]) => <div key={label} className={`pipeline-${tone} rounded-2xl border border-white/[.06] bg-white/[.025] px-4 py-3`}><p className="text-[9px] font-bold uppercase tracking-[.16em] text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-white">{loading ? '—' : value}</p></div>)}</div>
        <div className="mt-4 space-y-2">{bookings.slice(0, 5).map(booking => <button key={booking._id} onClick={() => setCurrentPage('chatbot-bookings')} className="flex w-full items-center gap-3 rounded-2xl border border-white/[.055] bg-white/[.018] p-3 text-left transition hover:border-cyan-300/20 hover:bg-cyan-300/[.03]"><div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/20 to-teal-400/10 text-sm font-black text-cyan-200">{(booking.customerName || booking.name || 'G')[0].toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-100">{booking.customerName || booking.name || 'New traveller'}</p><p className="truncate text-xs text-slate-500">{booking.destination || booking.packageName || booking.interests || 'Personalised Sri Lanka journey'}</p></div><div className="hidden text-right sm:block"><p className="text-[10px] text-slate-500">{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Date flexible'}</p><span className="mt-1 inline-block rounded-full bg-amber-300/[.09] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200">{booking.status || 'new'}</span></div></button>)}{!loading && !bookings.length && <div className="rounded-2xl border border-dashed border-white/[.09] px-4 py-12 text-center"><p className="text-sm font-semibold text-slate-300">Your concierge inbox is clear</p><p className="mt-1 text-xs text-slate-500">New AI booking requests will appear here.</p></div>}</div>
      </div>
      <div className="space-y-5"><div className="premium-panel rounded-[1.75rem] border border-white/[.07] bg-[#081321] p-5 sm:p-6"><p className="eyebrow">Website readiness</p><h3 className="mt-2 text-xl font-semibold tracking-tight text-white">Content health</h3><div className="mt-6 space-y-5">{readiness.map(([label, value, target, page]) => { const progress = Math.min(100, Math.round((value / target) * 100)); return <button key={label} onClick={() => setCurrentPage(page)} className="block w-full text-left"><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-300">{label}</span><span className="text-slate-500">{value}/{target}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[.05]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 transition-all duration-700" style={{ width: `${progress}%` }}/></div></button> })}</div></div><div className="rounded-[1.75rem] border border-amber-200/[.11] bg-gradient-to-br from-amber-200/[.07] to-cyan-300/[.035] p-5"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-amber-200">Studio note</p><p className="mt-3 text-sm font-semibold leading-6 text-white">Fresh imagery and complete itineraries build traveller confidence.</p><button onClick={() => setCurrentPage('packages')} className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-200">Curate tours <Arrow/></button></div></div>
    </section>
  </div>
}
