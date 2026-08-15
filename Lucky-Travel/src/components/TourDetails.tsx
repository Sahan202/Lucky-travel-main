import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BedDouble, CalendarDays, Check, ChevronRight, Clock3, MapPin, MessageCircle, Route, ShieldCheck, Sparkles, Star, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const WHATSAPP_NUMBER = '94741105548';
type Tour = { _id: string; name: string; description?: string; duration?: string; places?: string; price?: string; image?: string; backgroundImage?: string; itinerary?: string; accommodation?: string; transportation?: string; included?: string; excluded?: string };
type GalleryPhoto = { name: string; url: string; source: string };
type BookingStatus = 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
const wikiAliases: Record<string, string> = { Sigiriya: 'Sigiriya', Ella: 'Ella, Sri Lanka', Mirissa: 'Mirissa', Kandy: 'Temple of the Tooth', Jaffna: 'Jaffna', 'Galle City': 'Galle Fort', 'Nuwara Eliya': 'Nuwara Eliya', 'Yala National Park': 'Yala National Park', Polonnaruwa: 'Polonnaruwa', Trincomalee: 'Trincomalee', Anuradhapura: 'Anuradhapura', Bentota: 'Bentota', Udawalawe: 'Udawalawe National Park', Dambulla: 'Dambulla cave temple', 'Arugam Bay': 'Arugam Bay' };
const splitList = (value?: string) => String(value || '').split(/,|\n|•/).map(item => item.trim()).filter(Boolean);

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [trackingToken, setTrackingToken] = useState(() => localStorage.getItem(`luckyTourTracking:${id}`) || '');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', travelDate: '', travellers: '2', hotelPreference: 'Comfort' });

  useEffect(() => { fetch(`${API_URL}/api/packages`).then(res => res.json()).then(data => setTour((Array.isArray(data) ? data : []).find((item: Tour) => item._id === id) || null)).catch(() => setTour(null)).finally(() => setLoading(false)); }, [id]);
  const places = useMemo(() => splitList(tour?.places), [tour?.places]);
  const itinerary = useMemo(() => splitList(tour?.itinerary), [tour?.itinerary]);

  useEffect(() => {
    if (!tour) return;
    const controller = new AbortController();
    const names = [...new Set([tour.name, ...places])].slice(0, 5);
    Promise.all(names.map(async name => {
      const alias = Object.entries(wikiAliases).find(([key]) => name.toLowerCase().includes(key.toLowerCase()))?.[1] || name;
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(alias)}`, { signal: controller.signal });
      if (!response.ok) return null;
      const data = await response.json();
      const url = data.originalimage?.source || data.thumbnail?.source;
      return url ? { name, url, source: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(alias)}` } : null;
    })).then(items => setGallery(items.filter(Boolean) as GalleryPhoto[])).catch(() => undefined);
    return () => controller.abort();
  }, [tour, places]);

  useEffect(() => {
    if (!trackingToken) return;
    let active = true;
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/booking-status/${encodeURIComponent(trackingToken)}`);
        if (!response.ok || !active) return;
        const data = await response.json();
        if (data.found && ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(data.status)) setBookingStatus(data.status);
      } catch { /* Keep the booking form usable during a temporary status check failure. */ }
    };
    void checkStatus();
    const interval = window.setInterval(checkStatus, 10000);
    return () => { active = false; window.clearInterval(interval); };
  }, [trackingToken]);

  const update = (field: string, value: string) => setForm(previous => ({ ...previous, [field]: value }));
  const bookingMessage = () => `Hello Lucky Travel! I would like to book ${tour?.name}.\nTravel date: ${form.travelDate}\nTravellers: ${form.travellers}\nHotel: ${form.hotelPreference}\nName: ${form.name}\nPhone: ${form.phone}`;
  const submitBooking = async (event: FormEvent) => {
    event.preventDefault(); setSubmitting(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`${API_URL}/api/tour-bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, travellers: Number(form.travellers), packageId: tour?._id, packageName: tour?.name, destination: tour?.places, price: tour?.price, duration: tour?.duration }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to submit booking.');
      setSuccess(data.emailNotification?.sent ? 'Booking request received! A confirmation email has been sent to you.' : `Booking request received! Our team will contact you shortly.${data.emailNotification?.reason ? ` (${data.emailNotification.reason})` : ''}`);
      if (data.trackingToken) {
        localStorage.setItem(`luckyTourTracking:${id}`, data.trackingToken);
        setTrackingToken(data.trackingToken);
        setBookingStatus(data.status || 'pending');
      }
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to submit booking.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#020711] text-white"><Sparkles className="mr-3 animate-pulse text-cyan-300" />Loading your journey...</div>;
  if (!tour) return <div className="flex min-h-screen flex-col items-center justify-center bg-[#020711] text-white"><h1 className="text-2xl font-bold">Tour not found</h1><button onClick={() => navigate('/')} className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Return home</button></div>;
  const heroImage = tour.backgroundImage || gallery[0]?.url || tour.image;

  return <main className="min-h-screen bg-[#020711] text-white">
    <section className="relative min-h-[72vh] overflow-hidden"><img src={heroImage} alt={tour.name} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#020711] via-[#020711]/50 to-black/30" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(34,211,238,.13),transparent_35%)]" /><button onClick={() => navigate('/')} className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2.5 text-sm font-semibold backdrop-blur md:left-10 md:top-8"><ArrowLeft size={17} />Home</button><div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-end px-6 pb-14 pt-28"><div className="max-w-4xl"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-cyan-200"><Sparkles size={14} />Handpicked private journey</span><h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">{tour.name}</h1><p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-xl">{tour.description}</p><div className="mt-7 flex flex-wrap gap-3"><span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm font-semibold backdrop-blur"><Clock3 size={16} className="text-cyan-300" />{tour.duration || 'Flexible'}</span><span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm font-semibold backdrop-blur"><MapPin size={16} className="text-cyan-300" />{tour.places || 'Sri Lanka'}</span><span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm font-semibold backdrop-blur"><Star size={16} className="text-cyan-300" />{tour.price || 'Request quote'}</span></div></div></div></section>

    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6"><div className="grid gap-10 lg:grid-cols-[1fr_380px]"><div className="space-y-8">
      {gallery.length > 0 && <section><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Location gallery</p><h2 className="mt-2 text-3xl font-bold">A glimpse of your journey</h2><div className="mt-5 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px]">{gallery.slice(0, 4).map((photo, index) => <a key={photo.url} href={photo.source} target="_blank" rel="noreferrer" className={`group relative overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2 sm:row-span-2 sm:col-span-1' : ''}`}><img src={photo.url} alt={photo.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" referrerPolicy="no-referrer" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><p className="absolute bottom-3 left-4 text-sm font-bold">{photo.name}</p></a>)}</div><p className="mt-2 text-[10px] text-slate-500">Location imagery sourced from Wikipedia/Wikimedia pages.</p></section>}
      <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6 sm:p-8"><div className="flex items-center gap-3"><Route className="text-cyan-300" /><h2 className="text-2xl font-bold">Journey highlights</h2></div><div className="mt-6 space-y-4">{(itinerary.length ? itinerary : places.map(place => `Explore ${place} with your private guide`)).map((item, index) => <div key={`${item}-${index}`} className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-slate-950">{index + 1}</span><p className="pt-1.5 text-sm leading-6 text-slate-200">{item}</p></div>)}</div></section>
      <div className="grid gap-5 sm:grid-cols-2"><InfoCard icon={<BedDouble />} title="Accommodation" text={tour.accommodation || 'Handpicked stays matched to your preferred comfort level.'} /><InfoCard icon={<Route />} title="Private transportation" text={tour.transportation || 'Comfortable air-conditioned transport with an experienced driver.'} /></div>
      <div className="grid gap-5 sm:grid-cols-2"><ListCard included title="What's included" items={splitList(tour.included).length ? splitList(tour.included) : ['Private transport', 'Tour planning support', 'Experienced local assistance']} /><ListCard title="Not included" items={splitList(tour.excluded).length ? splitList(tour.excluded) : ['Personal expenses', 'Optional activities', 'Items not mentioned as included']} /></div>
    </div>

    <aside className="lg:sticky lg:top-6 lg:self-start"><form onSubmit={submitBooking} className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-b from-[#0b1c31] to-[#06101e] shadow-2xl shadow-cyan-950/30"><div className="border-b border-white/10 p-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Reserve this experience</p><div className="mt-2 flex items-end justify-between gap-3"><h2 className="text-2xl font-bold">Plan your tour</h2><span className="text-lg font-black text-cyan-300">{tour.price}</span></div><p className="mt-2 text-xs text-slate-400">No payment now. Our team confirms availability and the final quotation.</p></div><div className="space-y-4 p-6">{bookingStatus && <StatusReply status={bookingStatus} />}<Field label="Full name" required value={form.name} onChange={value => update('name', value)} placeholder="Your name" /><div className="grid grid-cols-2 gap-3"><Field label="Phone" required value={form.phone} onChange={value => update('phone', value)} placeholder="WhatsApp" /><Field label="Travellers" required type="number" min="1" max="30" value={form.travellers} onChange={value => update('travellers', value)} /></div><Field label="Email (optional)" type="email" value={form.email} onChange={value => update('email', value)} placeholder="you@example.com" /><label className="block text-xs font-semibold text-slate-300">Preferred travel date<div className="relative mt-2"><CalendarDays className="absolute left-3 top-3.5 text-cyan-300" size={17} /><input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.travelDate} onChange={event => update('travelDate', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[.06] py-3 pl-10 pr-3 text-sm text-white outline-none [color-scheme:dark] focus:border-cyan-300" /></div></label><label className="block text-xs font-semibold text-slate-300">Hotel preference<select value={form.hotelPreference} onChange={event => update('hotelPreference', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1828] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"><option>Budget</option><option>Comfort</option><option>Luxury</option><option>Boutique</option></select></label>{error && <p className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-200">{error}</p>}{success && <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm font-semibold text-emerald-200">{success}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 font-black text-slate-950 transition hover:brightness-110 disabled:opacity-60">{submitting ? 'Sending request...' : <>Request booking <ChevronRight size={18} /></>}</button><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage())}`} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-200"><MessageCircle size={17} />Ask on WhatsApp</a><div className="flex items-start gap-2 border-t border-white/10 pt-4 text-[11px] leading-5 text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-400" />Your request is saved securely and appears in the Lucky Travel booking dashboard.</div></div></form></aside>
    </div></section>
  </main>;
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[.07] to-transparent p-6"><span className="text-cyan-300">{icon}</span><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></section> }
function ListCard({ included = false, title, items }: { included?: boolean; title: string; items: string[] }) { return <section className={`rounded-3xl border p-6 ${included ? 'border-emerald-400/15 bg-emerald-400/[.06]' : 'border-rose-400/15 bg-rose-400/[.05]'}`}><h3 className="flex items-center gap-2 text-xl font-bold">{included ? <Check className="text-emerald-300" /> : <X className="text-rose-300" />}{title}</h3><ul className="mt-4 space-y-3">{items.map(item => <li key={item} className="flex gap-2 text-sm text-slate-300">{included ? <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" /> : <X size={16} className="mt-0.5 shrink-0 text-rose-300" />}{item}</li>)}</ul></section> }
function Field({ label, value, onChange, type = 'text', required = false, placeholder, min, max }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string; min?: string; max?: string }) { return <label className="block text-xs font-semibold text-slate-300">{label}<input required={required} type={type} min={min} max={max} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300" /></label> }
function StatusReply({ status }: { status: BookingStatus }) { const copy: Record<BookingStatus, string> = { pending: 'Your booking request is being reviewed by our travel team.', contacted: 'Our team has started following up. Please check your phone, WhatsApp and email.', confirmed: 'Great news! Your tour booking has been confirmed.', completed: 'Your tour booking has been completed. Thank you for choosing Lucky Travel!', cancelled: 'This booking has been cancelled. Contact us if you would like a new arrangement.' }; const color = status === 'confirmed' || status === 'completed' ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100' : status === 'cancelled' ? 'border-rose-300/25 bg-rose-400/10 text-rose-100' : 'border-cyan-300/25 bg-cyan-400/10 text-cyan-100'; return <div className={`rounded-2xl border p-4 ${color}`}><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.16em]">Booking status</p><span className="rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase">{status}</span></div><p className="mt-2 text-sm leading-6">{copy[status]}</p></div> }
