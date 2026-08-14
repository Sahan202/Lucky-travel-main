import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Dashboard({ setCurrentPage }) {
  const [counts, setCounts] = useState({ packages: 0, services: 0, gallery: 0, reviews: 0 })
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const endpoints = ['packages', 'services', 'gallery', 'reviews']
        const results = await Promise.all(endpoints.map(async endpoint => { const response = await fetch(`${API_URL}/api/${endpoint}`); if (!response.ok) return []; const data = await response.json(); return Array.isArray(data) ? data : data.data || [] }))
        if (active) setCounts(Object.fromEntries(endpoints.map((key, i) => [key, results[i].length])))
        const token = localStorage.getItem('token')
        if (token) { const response = await fetch(`${API_URL}/api/chatbot-bookings?status=all`, { headers: { Authorization: `Bearer ${token}` } }); if (response.ok) { const data = await response.json(); if (active) setBookings(Array.isArray(data) ? data : data.data || []) } }
      } catch (error) { console.error('Unable to load dashboard overview:', error) } finally { if (active) setLoading(false) }
    }
    load(); return () => { active = false }
  }, [])

  const stats = [
    ['packages', 'Tour packages', 'Curated journeys', 'packages', 'from-cyan-400 to-blue-500'], ['services', 'Travel services', 'Guest experiences', 'services', 'from-teal-400 to-emerald-500'], ['gallery', 'Travel moments', 'Published images', 'gallery', 'from-violet-400 to-indigo-500'], ['reviews', 'Guest stories', 'Customer reviews', 'testimonials', 'from-amber-300 to-orange-500']
  ]
  const actions = [['packages', 'Create a tour package', 'Add a destination, itinerary and price'], ['chatbot-bookings', 'Review AI enquiries', 'Follow up customers ready to travel'], ['gallery', 'Update travel moments', 'Keep the website visual and current']]

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#071321] p-6 text-white shadow-2xl sm:p-8"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"/><div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-200">● &nbsp; Live website overview</span><h1 className="mt-5 max-w-2xl text-2xl font-bold sm:text-4xl">Shape unforgettable Sri Lankan journeys.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Manage the content customers discover, and turn AI travel enquiries into real bookings.</p></div><button onClick={() => setCurrentPage('chatbot-bookings')} className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">Open booking inbox &nbsp;→</button></div></section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([key, label, detail, page, colour]) => <button key={key} onClick={() => setCurrentPage(page)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl dark:border-white/[.07] dark:bg-[#081321]"><div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colour} text-lg text-white`}>✦</span><span className="text-slate-300 group-hover:text-cyan-400">→</span></div><p className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">{loading ? '—' : counts[key]}</p><p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></button>)}</section>

    <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[.07] dark:bg-[#081321] sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-300">Customer pipeline</p><h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Latest AI booking enquiries</h3></div><button onClick={() => setCurrentPage('chatbot-bookings')} className="text-xs font-semibold text-cyan-600 dark:text-cyan-300">View all →</button></div><div className="mt-5 space-y-2">{bookings.slice(0, 5).map(booking => <div key={booking._id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/[.05] dark:bg-white/[.025]"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-500">{(booking.customerName || booking.name || 'G')[0]}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{booking.customerName || booking.name || 'New traveller'}</p><p className="truncate text-xs text-slate-400">{booking.destination || booking.interests || 'Personalised Sri Lanka journey'}</p></div><span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold capitalize text-amber-600 dark:text-amber-300">{booking.status || 'new'}</span></div>)}{!loading && !bookings.length && <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center dark:border-white/10"><p className="text-sm font-medium text-slate-600 dark:text-slate-300">No AI enquiries yet</p><p className="mt-1 text-xs text-slate-400">New chatbot booking details will appear here.</p></div>}</div></div>
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[.07] dark:bg-[#081321] sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-600 dark:text-cyan-300">Quick actions</p><h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Keep the site fresh</h3><div className="mt-5 space-y-3">{actions.map(([page, label, description], index) => <button key={page} onClick={() => setCurrentPage(page)} className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 p-3 text-left hover:border-cyan-300 dark:border-white/[.06]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500 dark:bg-white/[.05]">0{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span><span className="block truncate text-xs text-slate-400">{description}</span></span><span className="text-slate-300 group-hover:text-cyan-400">→</span></button>)}</div></div></section>
  </div>
}
