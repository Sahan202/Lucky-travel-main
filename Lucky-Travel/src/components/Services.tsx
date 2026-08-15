import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Compass, Headphones, Hotel, Route, ShieldCheck, Sparkles } from "lucide-react";
import ella from "../assets/Beautiful view from Nuwara Eliya, Sri Lanka.jpg";
import coast from "../assets/Secret Beach Mirissa Sri Lanka.jpg";
import culture from "../assets/promodhya-abeysekara-gjd-7_3Ek_w-unsplash.jpg";
import wildlife from "../assets/tommaso-delton-_sFOJHDmO6A-unsplash.jpg";

interface Service { _id: string; title: string; description: string; details?: string[]; }

const visuals = [
  { image: ella, eyebrow: "Highland soul", icon: Route },
  { image: coast, eyebrow: "Indian Ocean", icon: Compass },
  { image: culture, eyebrow: "Living heritage", icon: Hotel },
  { image: wildlife, eyebrow: "Untamed island", icon: ShieldCheck },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then(response => response.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(error => console.error("Error fetching services:", error));
  }, []);

  const service = services[active];
  const visual = visuals[active % visuals.length];

  return <section id="services" className="relative isolate overflow-hidden bg-[#061018] py-24 text-white sm:py-32">
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:72px_72px]" />
    <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[130px]" />
    <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-[130px]" />

    <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.34em] text-cyan-300"><Sparkles size={14} /> The Lucky Travel atelier</p>
          <h2 className="mt-5 text-5xl font-black leading-[.92] tracking-[-.055em] sm:text-6xl lg:text-7xl">Not services.<br /><span className="font-serif font-normal italic text-cyan-200">Signature care.</span></h2>
        </div>
        <div className="lg:pb-1"><p className="max-w-2xl text-lg leading-8 text-slate-300">Every detail is quietly handled by people who know this island by heart—from the road less travelled to the room with the unforgettable view.</p><div className="mt-6 flex flex-wrap gap-5 text-[10px] font-bold uppercase tracking-[.18em] text-white/55"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-cyan-300" /> Personally vetted</span><span className="flex items-center gap-2"><Headphones size={15} className="text-cyan-300" /> Here when needed</span><span className="flex items-center gap-2"><Compass size={15} className="text-cyan-300" /> Entirely your own</span></div></div>
      </div>

      {service ? <div className="mt-12 grid gap-7 lg:grid-cols-[1.35fr_.65fr]">
        <div className="group relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-[0_35px_100px_rgba(0,0,0,.35)] sm:min-h-[590px]">
          <img key={service._id} src={visual.image} alt={service.title} className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,13,.08),rgba(2,8,13,.22)_42%,rgba(2,8,13,.96))]" />
          <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur-xl sm:left-8 sm:top-8"><visual.icon size={22} /></div>
          <div className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[9px] font-bold uppercase tracking-[.22em] backdrop-blur-xl sm:right-8 sm:top-8">{visual.eyebrow}</div>
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[.28em] text-cyan-300">Signature {String(active + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.035em] sm:text-5xl">{service.title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">{service.description}</p>
            <a href="#contact" className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[.14em] text-slate-950 transition hover:bg-cyan-300">Design this with us <ArrowUpRight size={16} /></a>
          </div>
        </div>

        <div className="flex flex-col rounded-[2rem] border border-white/10 bg-white/[.045] p-5 backdrop-blur sm:p-7">
          <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-white/45">Explore our craft</p><span className="font-serif text-2xl italic text-cyan-200">{active + 1}/{services.length}</span></div>
          <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {services.map((item, index) => <button key={item._id} type="button" onClick={() => setActive(index)} className={`group flex w-full items-center gap-4 py-4 text-left transition sm:py-5 ${active === index ? "text-white" : "text-white/40 hover:text-white/75"}`}><span className={`text-[9px] font-bold ${active === index ? "text-cyan-300" : ""}`}>{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1 truncate text-sm font-bold sm:text-base">{item.title}</span><span className={`h-8 w-8 rounded-full border transition ${active === index ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/15"}`}><ArrowUpRight size={13} className="m-auto mt-[8px]" /></span></button>)}
          </div>
          <div className="mt-7"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">Thoughtful inclusions</p><ul className="mt-4 space-y-3">{(service.details?.length ? service.details : ["Tailored to your pace", "Trusted local specialists", "Support throughout your journey"]).slice(0, 5).map(detail => <li key={detail} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-300"><Check size={12} /></span>{detail}</li>)}</ul></div>
          <div className="mt-auto pt-8"><div className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="text-xs leading-6 text-white/55">No fixed template. Every service adapts to your dates, interests and travel style.</p></div></div>
        </div>
      </div> : <div className="mt-12 grid gap-5 md:grid-cols-3">{[0,1,2].map(item => <div key={item} className="h-80 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />)}</div>}
    </div>
  </section>;
}
