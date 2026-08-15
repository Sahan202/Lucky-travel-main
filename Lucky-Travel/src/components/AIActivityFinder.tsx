import { useState } from 'react';
import { Activity, Check, Clock3, LoaderCircle, MapPin, Plus, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const activityTypes = ['Adventure', 'Surfing', 'Diving', 'Hiking', 'Wildlife', 'Food', 'Culture', 'Wellness', 'Cycling', 'Scenic'];

type Recommendation = { activity: string; location: string; type: string; why: string; duration: string; bestTime: string };
type Props = { destinations: string[]; selected: string[]; onToggle: (activity: string) => void; onDestinationToggle: (location: string) => void; language: string };

export default function AIActivityFinder({ destinations, selected, onToggle, onDestinationToggle, language }: Props) {
  const [types, setTypes] = useState<string[]>(['Adventure', 'Culture']);
  const [travellerStyle, setTravellerStyle] = useState('First-time visitor');
  const [intensity, setIntensity] = useState('Moderate');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleType = (type: string) => setTypes(previous => previous.includes(type) ? previous.filter(item => item !== type) : [...previous, type]);
  const findActivities = async () => {
    setLoading(true); setError(''); setRecommendations([]);
    try {
      const response = await fetch(`${API_URL}/api/ai/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedDestinations: destinations, activityTypes: types, travellerStyle, intensity, language }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to find activities.');
      const validRecommendations = (Array.isArray(data.recommendations) ? data.recommendations : [])
        .map((item: Partial<Recommendation> & { name?: string; places?: string }) => ({
          activity: item.activity || item.name || 'Sri Lanka experience',
          location: item.location || item.places || 'Sri Lanka',
          type: item.type || 'Experience',
          why: item.why || 'Recommended for your selected interests and route.',
          duration: item.duration || 'Half day',
          bestTime: item.bestTime || 'Confirm for your travel date'
        }));
      setRecommendations(validRecommendations);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to find activities.');
    } finally { setLoading(false); }
  };

  return <section className="mb-10 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-blue-500/10 via-white/5 to-cyan-400/10 shadow-2xl">
    <div className="border-b border-white/10 p-6 md:p-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950"><Activity size={25} /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Separate AI experience engine</p><h3 className="mt-1 text-2xl font-bold">What would you love to do?</h3><p className="mt-2 text-sm text-slate-300">Choose activities and AI will match them with your selected locations, plus nearby experiences you may enjoy.</p></div></div></div>
    <div className="grid gap-7 p-6 lg:grid-cols-[0.85fr_1.15fr] md:p-8">
      <div><p className="mb-3 text-sm font-semibold text-white">Select your interests</p><div className="flex flex-wrap gap-2">{activityTypes.map(type => <button key={type} type="button" onClick={() => toggleType(type)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${types.includes(type) ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}>{type}</button>)}</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs text-slate-400">Traveller style<select value={travellerStyle} onChange={event => setTravellerStyle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white"><option>First-time visitor</option><option>Couple</option><option>Family</option><option>Solo traveller</option><option>Senior traveller</option></select></label><label className="text-xs text-slate-400">Physical intensity<select value={intensity} onChange={event => setIntensity(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white"><option>Relaxed</option><option>Moderate</option><option>Active</option><option>Challenging</option></select></label></div>
        <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">AI discovery mode</p><p className="mt-2 text-sm text-slate-300">{destinations.length ? `Prioritizing your route: ${destinations.join(' · ')}` : 'No place selected yet — AI will show the best Sri Lankan locations for your chosen activities.'}</p></div>
        <button type="button" onClick={findActivities} disabled={loading || !types.length} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <><LoaderCircle className="animate-spin" size={18} /> Finding experiences...</> : <><Sparkles size={18} /> Find activities & places with AI</>}</button>{error && <p className="mt-3 rounded-lg bg-red-500/15 p-3 text-sm text-red-200">{error}</p>}
      </div>
      <div className="min-h-[310px]">{!recommendations.length && !loading && <div className="flex min-h-[310px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/30 p-8 text-center"><Sparkles className="text-cyan-300" size={34} /><h4 className="mt-4 font-bold">Your activity matches will appear here</h4><p className="mt-2 max-w-sm text-slate-400">Select locations on the map, choose what you enjoy, and let the activity AI create recommendations.</p></div>}
        {recommendations.length > 0 && <div className="grid gap-3 sm:grid-cols-2">{recommendations.map(item => { const key = `${item.activity} — ${item.location}`; const chosen = selected.includes(key); const placeChosen = destinations.includes(item.location); return <article key={key} className={`rounded-2xl border p-4 ${chosen ? 'border-cyan-300 bg-cyan-400/10' : 'border-white/10 bg-slate-950/50'}`}><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">{item.type}</span><button type="button" title="Add activity to itinerary" onClick={() => onToggle(key)} className={`flex h-8 w-8 items-center justify-center rounded-full ${chosen ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white'}`}>{chosen ? <Check size={16} /> : <Plus size={16} />}</button></div><h4 className="mt-3 font-bold text-white">{item.activity}</h4><p className="mt-2 flex items-center gap-1 text-xs font-semibold text-cyan-300"><MapPin size={13} />{item.location}</p><p className="mt-3 text-xs leading-5 text-slate-400">{item.why}</p><div className="mt-3 flex gap-3 border-t border-white/10 pt-3 text-[11px] text-slate-400"><span className="flex items-center gap-1"><Clock3 size={12} />{item.duration}</span><span>{item.bestTime}</span></div><button type="button" onClick={() => onDestinationToggle(item.location)} className={`mt-3 w-full rounded-lg border px-3 py-2 text-xs font-bold transition ${placeChosen ? 'border-emerald-300 bg-emerald-400/15 text-emerald-200' : 'border-white/10 bg-white/5 text-white hover:border-cyan-300'}`}>{placeChosen ? '✓ Place added to route' : `+ Add ${item.location} to route`}</button></article> })}</div>}
      </div>
    </div>
    {selected.length > 0 && <div className="border-t border-white/10 bg-cyan-400/10 px-6 py-4 text-sm text-cyan-100"><strong>{selected.length}</strong> activities added to your final AI itinerary.</div>}
  </section>;
}
