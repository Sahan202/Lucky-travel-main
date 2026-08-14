const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'

const sections = {
  hero: { number: '01', tag: 'First impression', title: 'Create a hero that inspires travel', text: 'Keep the headline short, visual and focused on the feeling of discovering Sri Lanka.', hint: 'Recommended: one clear promise and a short supporting description.' },
  services: { number: '02', tag: 'Guest experience', title: 'Present every service with clarity', text: 'Explain the value for the traveller and keep each service easy to scan.', hint: 'Use benefit-led titles such as Private Transfers or Local Guides.' },
  packages: { number: '03', tag: 'Tour collection', title: 'Build packages travellers can trust', text: 'Complete the destination, duration, pricing, itinerary and imagery before publishing.', hint: 'High-quality location images improve package discovery.' },
  gallery: { number: '04', tag: 'Visual library', title: 'Show the real beauty of Sri Lanka', text: 'Use sharp, authentic landscape images that match your tours and activities.', hint: 'Landscape images with consistent proportions work best.' },
  testimonials: { number: '05', tag: 'Social proof', title: 'Turn guest stories into confidence', text: 'Publish genuine reviews with a name, traveller role and accurate star rating.', hint: 'Short, specific reviews are easier for visitors to trust.' },
  'chatbot-bookings': { number: '06', tag: 'AI sales pipeline', title: 'Convert conversations into journeys', text: 'Review new travel requests, update their status and contact ready customers quickly.', hint: 'Respond to ready leads through WhatsApp as soon as possible.' },
  settings: { number: '07', tag: 'Account security', title: 'Keep your admin account protected', text: 'Use a unique password and update it regularly to protect customer and website data.', hint: 'Use at least 12 characters with letters, numbers and symbols.' }
}

export default function SectionBanner({ page }) {
  const section = sections[page]
  if (!section) return null
  return <section className="section-banner relative mb-6 overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#071321] px-5 py-5 text-white sm:px-7 sm:py-6">
    <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
      <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xs font-bold text-cyan-200">{section.number}</span><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">{section.tag}</p><h2 className="mt-1 text-xl font-bold sm:text-2xl">{section.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{section.text}</p></div></div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"><div className="max-w-sm rounded-xl border border-white/[.06] bg-white/[.035] px-4 py-3 text-xs leading-5 text-slate-400"><span className="font-bold text-teal-300">Pro tip · </span>{section.hint}</div>{page !== 'settings' && <a href={SITE_URL} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300">Preview website <span>↗</span></a>}</div>
    </div>
  </section>
}
