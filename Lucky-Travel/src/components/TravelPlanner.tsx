import { FormEvent, useState } from 'react';
import { CalendarDays, Compass, Hotel, Lightbulb, LoaderCircle, MapPin, Navigation, Sparkles, Sun, Users } from 'lucide-react';
import SriLankaDestinationMap from './SriLankaDestinationMap';
import AIActivityFinder from './AIActivityFinder';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const interestOptions = ['Beaches', 'Nature', 'Wildlife', 'Culture'];

type PackageRecommendation = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: string[];
  morning?: string;
  afternoon?: string;
  evening?: string;
  transfer?: string;
  overnight?: string;
  nearbyIncluded?: string[];
};

type DestinationGuide = {
  location: string;
  recommendedDays: number;
  overview: string;
  activities: string[];
  nearbyPlaces: { name: string; distance: string; travelTime: string; whyVisit: string }[];
  bestTime: string;
  practicalTip: string;
};

type PlannerResult = {
  itinerary: {
    title: string;
    summary: string;
    estimatedCost: string;
    recommendedPackage?: PackageRecommendation | string | null;
    stays?: { location: string; nights: number; selectedPlaces?: string[] }[];
    destinationGuides?: DestinationGuide[];
    days: ItineraryDay[];
    note?: string;
  };
  recommendations: PackageRecommendation[];
  aiPowered: boolean;
};

export default function TravelPlanner() {
  const [form, setForm] = useState({
    budget: '', startDate: '', endDate: '', travellers: '2', preferredHotels: 'Comfort',
    startingLocation: 'Bandaranaike International Airport', language: 'English'
  });
  const [interests, setInterests] = useState<string[]>(['Beaches']);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(previous => ({ ...previous, [field]: value }));
  const toggleInterest = (interest: string) => setInterests([interest]);
  const toggleDestination = (destination: string) => setSelectedDestinations(previous =>
    previous.includes(destination) ? previous.filter(item => item !== destination) : [...previous, destination]
  );
  const toggleActivity = (activity: string) => setSelectedActivities(previous => previous.includes(activity) ? previous.filter(item => item !== activity) : [...previous, activity]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/api/ai/planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, interests, selectedDestinations, selectedActivities, travellers: Number(form.travellers), budget: Number(form.budget) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to create your itinerary.');
      setResult(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create your itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-planner" className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <span className="mb-5 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-cyan-300">
            <span className="h-px w-9 bg-cyan-300/70" /><Sparkles size={14} /> AI Travel Planner<span className="h-px w-9 bg-cyan-300/70" />
          </span>
          <h2 className="text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-6xl md:text-7xl">Build your perfect<br /><span className="font-serif font-normal italic text-cyan-200">Sri Lanka journey.</span></h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">Tell us what you love. We will match your preferences with Lucky Travel packages and create a day-by-day plan.</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {interestOptions.map(interest => (
            <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${interests.includes(interest) ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20' : 'border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'}`}>{interest}</button>
          ))}
        </div>

        <SriLankaDestinationMap activeInterests={interests} selected={selectedDestinations} onToggle={toggleDestination} onCategoryChange={category => setInterests([category])} />
        <AIActivityFinder destinations={selectedDestinations} selected={selectedActivities} onToggle={toggleActivity} onDestinationToggle={toggleDestination} language={form.language} />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-slate-200">Budget (USD)
                <input required min="50" type="number" value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="650" className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </label>
              <label className="text-sm text-slate-200">Travellers
                <div className="relative mt-2"><Users className="absolute left-3 top-3.5 text-slate-400" size={18} /><input required min="1" max="30" type="number" value={form.travellers} onChange={e => update('travellers', e.target.value)} className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400" /></div>
              </label>
              <label className="text-sm text-slate-200">Start date
                <div className="relative mt-2"><CalendarDays className="absolute left-3 top-3.5 text-slate-400" size={18} /><input required type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-3 text-white [color-scheme:dark] outline-none focus:border-cyan-400" /></div>
              </label>
              <label className="text-sm text-slate-200">End date
                <input required min={form.startDate} type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white [color-scheme:dark] outline-none focus:border-cyan-400" />
              </label>
              <label className="text-sm text-slate-200">Preferred hotel
                <select value={form.preferredHotels} onChange={e => update('preferredHotels', e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400">
                  <option>Budget</option><option>Comfort</option><option>Luxury</option><option>Boutique</option>
                </select>
              </label>
              <label className="text-sm text-slate-200">Response language
                <select value={form.language} onChange={e => update('language', e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400">
                  <option>English</option><option>Sinhala</option><option>Tamil</option>
                </select>
              </label>
            </div>
            <label className="mt-5 block text-sm text-slate-200">Starting location
              <div className="relative mt-2"><MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} /><input required value={form.startingLocation} onChange={e => update('startingLocation', e.target.value)} className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400" /></div>
            </label>
            {error && <p className="mt-5 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">{error}</p>}
            <button disabled={loading || interests.length === 0 || selectedDestinations.length === 0} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 font-bold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><LoaderCircle className="animate-spin" size={19} /> Creating your journey...</> : <><Sparkles size={19} /> Generate itinerary</>}
            </button>
            {selectedDestinations.length === 0 && <p className="mt-2 text-center text-xs text-slate-400">Select at least one destination from the map.</p>}
          </form>

          <div className={`relative min-h-[500px] overflow-hidden rounded-3xl border p-6 shadow-2xl transition-colors duration-500 md:p-8 ${result ? 'border-white/10 bg-white text-slate-800' : 'border-cyan-300/20 bg-[#071521] text-white'}`}>
            {!result && <div className="relative flex h-full min-h-[430px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[.035] p-6 text-left sm:p-8"><div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:52px_52px]" /><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/15 blur-[90px]" />
              <div className="relative"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[.25em] text-cyan-300"><Sparkles size={13} /> AI journey canvas</span><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Ready to design</span></div><div className="mt-9 flex items-start gap-5"><span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200"><MapPin size={27} /><span className="absolute inset-[-7px] animate-pulse rounded-full border border-cyan-300/10" /></span><div><h3 className="text-3xl font-black leading-tight tracking-[-.035em]">Your itinerary<br /><span className="font-serif font-normal italic text-cyan-200">will unfold here.</span></h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-400">Choose your dates and destinations. AI will transform them into a practical Sri Lankan route.</p></div></div></div>
              <div className="relative my-7 flex items-center px-4"><span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.8)]" /><span className="h-px flex-1 bg-gradient-to-r from-cyan-300 via-cyan-300/40 to-white/15" /><span className="h-3 w-3 rounded-full border border-white/35 bg-slate-900" /><span className="h-px flex-1 border-t border-dashed border-white/20" /><span className="h-3 w-3 rounded-full border border-white/20 bg-slate-900" /></div>
              <div className="relative grid gap-3 sm:grid-cols-3">{[['01','Route','Day-by-day'],['02','Stays','Nights planned'],['03','Budget','Cost estimate']].map(([number,title,detail]) => <div key={number} className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur"><p className="text-[9px] font-bold text-cyan-300">{number}</p><p className="mt-2 text-sm font-bold">{title}</p><p className="mt-1 text-[10px] text-white/35">{detail}</p></div>)}</div>
              <p className="relative mt-6 border-t border-white/10 pt-4 text-center text-[9px] font-bold uppercase tracking-[.18em] text-white/30">Complete the form · Select places · Generate your journey</p>
            </div>}
            {result && <div>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">Personalized journey</p><h3 className="mt-1 text-3xl font-bold">{result.itinerary.title}</h3></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{result.aiPowered ? 'AI generated' : 'Smart match'}</span></div>
              <p className="mt-3 text-slate-600">{result.itinerary.summary}</p>
              <div className="my-6 rounded-2xl bg-slate-950 p-5 text-white"><p className="text-sm text-slate-400">Estimated cost</p><p className="mt-1 text-2xl font-bold text-cyan-300">{result.itinerary.estimatedCost}</p></div>
              {result.itinerary.stays && result.itinerary.stays.length > 0 && <div className="mb-7"><h4 className="text-lg font-bold">Your overnight plan</h4><div className="mt-3 grid gap-3 sm:grid-cols-2">{result.itinerary.stays.map(stay => <div key={stay.location} className="rounded-xl border border-cyan-100 bg-cyan-50 p-4"><div className="flex items-center justify-between"><span className="font-bold text-slate-900">{stay.location}</span><span className="rounded-full bg-cyan-600 px-3 py-1 text-xs font-bold text-white">{stay.nights} {stay.nights === 1 ? 'night' : 'nights'}</span></div>{stay.selectedPlaces && stay.selectedPlaces.length > 0 && <p className="mt-2 text-xs text-slate-500">For: {stay.selectedPlaces.join(', ')}</p>}</div>)}</div></div>}
              {result.itinerary.destinationGuides && result.itinerary.destinationGuides.length > 0 && <div className="mb-8"><div className="flex items-center gap-2"><Compass className="text-cyan-600" size={21} /><h4 className="text-lg font-bold">Explore each destination</h4></div><p className="mt-1 text-sm text-slate-500">Activities, nearby attractions and the ideal time to spend at every selected place.</p><div className="mt-4 space-y-4">{result.itinerary.destinationGuides.map(guide => <article key={guide.location} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-5 py-4 text-white"><div className="flex items-center gap-2"><MapPin className="text-cyan-300" size={18} /><h5 className="font-bold">{guide.location}</h5></div><span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">{guide.recommendedDays} {guide.recommendedDays === 1 ? 'day' : 'days'} recommended</span></div><div className="p-5"><p className="text-sm leading-6 text-slate-600">{guide.overview}</p>{guide.activities?.length > 0 && <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Things to do</p><div className="mt-2 flex flex-wrap gap-2">{guide.activities.map(activity => <span key={activity} className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800">{activity}</span>)}</div></div>}{guide.nearbyPlaces?.length > 0 && <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nearby places worth adding</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{guide.nearbyPlaces.map(place => <div key={`${guide.location}-${place.name}`} className="rounded-xl border border-slate-200 bg-white p-3"><p className="font-bold text-slate-800">{place.name}</p><p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-cyan-700"><Navigation size={12} />{place.distance} · {place.travelTime}</p><p className="mt-2 text-xs leading-5 text-slate-500">{place.whyVisit}</p></div>)}</div></div>}<div className="mt-4 grid gap-2 sm:grid-cols-2"><p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900"><Sun className="shrink-0" size={16} />{guide.bestTime}</p><p className="flex gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-900"><Lightbulb className="shrink-0" size={16} />{guide.practicalTip}</p></div></div></article>)}</div></div>}
              <div><div className="mb-4 flex items-center gap-2"><CalendarDays className="text-cyan-600" size={21} /><h4 className="text-lg font-bold">Your day-by-day route</h4></div><div className="space-y-4">{result.itinerary.days?.map(day => <div key={day.day} className="relative rounded-2xl border border-slate-200 bg-white p-5 pl-8 shadow-sm"><span className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white shadow">{day.day}</span><h4 className="text-lg font-bold">Day {day.day} — {day.title}</h4>{day.transfer && <p className="mt-2 flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800"><Navigation size={14} />{day.transfer}</p>}<div className="mt-3 grid gap-2"><p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-slate-700"><strong>Morning:</strong> {day.morning || day.activities?.[0]}</p><p className="rounded-lg bg-cyan-50 px-3 py-2 text-sm text-slate-700"><strong>Afternoon:</strong> {day.afternoon || day.activities?.[1]}</p><p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-slate-700"><strong>Evening:</strong> {day.evening || day.activities?.[2]}</p></div>{day.nearbyIncluded && day.nearbyIncluded.length > 0 && <p className="mt-3 text-xs text-slate-500"><strong>Nearby included:</strong> {day.nearbyIncluded.join(', ')}</p>}{day.overnight && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-cyan-700"><Hotel size={14} />Overnight: {day.overnight}</p>}</div>)}</div></div>
              {result.recommendations.length > 0 && <div className="mt-7"><h4 className="text-lg font-bold">Recommended packages</h4><div className="mt-3 grid gap-3 sm:grid-cols-2">{result.recommendations.slice(0, 2).map(item => <a key={item.id} href={`/tour/${item.id}`} className="rounded-xl border border-slate-200 p-4 transition hover:border-cyan-400"><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-cyan-700">{item.duration} · {item.price}</p></a>)}</div></div>}
              {result.itinerary.note && <p className="mt-6 text-xs text-slate-500">{result.itinerary.note}</p>}
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
