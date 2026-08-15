import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Compass, MapPin, Sparkles } from "lucide-react";
import coast from "../assets/matt-dany-ePAa2c9XbtE-unsplash.jpg";
import kandy from "../assets/dalada.jpg";
import heritage from "../assets/buddh.jpg";
import sigiriya from "../assets/sigiriya22.jpg";
import ella from "../assets/ella.jpg";
import mirissa from "../assets/Secret Beach Mirissa Sri Lanka.jpg";

gsap.registerPlugin(ScrollTrigger);
const scenes = [
  { src: coast, place: "Southern coast", label: "Wild shores", no: "01" },
  { src: kandy, place: "Kandy", label: "Sacred stories", no: "02" },
  { src: heritage, place: "Ancient cities", label: "Living heritage", no: "03" },
  { src: sigiriya, place: "Sigiriya", label: "Above the clouds", no: "04" },
  { src: ella, place: "Ella", label: "Tea country trails", no: "05" },
  { src: mirissa, place: "Mirissa", label: "Secret coves", no: "06" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null), image = useRef<HTMLImageElement>(null), content = useRef<HTMLDivElement>(null), glow = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [data, setData] = useState({ title: "Luxury Travel Experiences", subtitle: "Across Sri Lanka", description: "Private journeys through an island that feels like many worlds." });

  useEffect(() => { fetch(`${import.meta.env.VITE_API_URL}/api/hero`).then(r => r.json()).then(d => d.title && setData(d)).catch(console.error); }, []);
  useEffect(() => {
    if (!root.current || !image.current) return;
    const ctx = gsap.context(() => {
      gsap.from(content.current, { opacity: 0, y: 55, duration: 1.2, ease: "power3.out" });
      gsap.to(image.current, { yPercent: 14, scale: 1.12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);
  useEffect(() => { const timer = window.setInterval(() => change((active + 1) % scenes.length), 6500); return () => clearInterval(timer); }, [active]);

  const change = (index: number) => {
    if (index === active || !image.current) return;
    gsap.to(image.current, { opacity: 0, scale: 1.08, duration: .4, onComplete: () => { setActive(index); gsap.fromTo(image.current, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.35, ease: "power3.out" }); } });
  };
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    gsap.to(image.current, { x: x * 22, y: y * 14, duration: 1.4 });
    gsap.to(glow.current, { x: x * -45, y: y * -35, duration: 1.7 });
  };

  return <section ref={root} id="home" onPointerMove={move} className="relative isolate min-h-[760px] overflow-hidden bg-[#03080d] text-white lg:min-h-screen">
    <div className="absolute inset-[-3%] overflow-hidden"><img ref={image} src={scenes[active].src} alt={scenes[active].place} className="h-full w-full object-cover object-center will-change-transform" /></div>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,7,12,.94),rgba(1,7,12,.58)_52%,rgba(1,7,12,.15)_78%,rgba(1,7,12,.5))]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,7,12,.5),transparent_35%,rgba(1,7,12,.94))]" />
    <div ref={glow} className="absolute left-[42%] top-[34%] h-72 w-72 rounded-full bg-cyan-300/15 blur-[110px]" />
    <div className="absolute inset-y-0 left-[8%] hidden w-px bg-white/15 lg:block" /><div className="absolute inset-y-0 right-[8%] hidden w-px bg-white/15 lg:block" />
    <div className="absolute left-[8%] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold uppercase tracking-[.45em] text-white/45 lg:block">Island of a thousand journeys</div>

    <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1500px] items-center px-6 pb-36 pt-32 sm:px-10 lg:min-h-screen lg:px-[12%] lg:pb-40">
      <div ref={content} className="max-w-5xl">
        <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.32em] text-cyan-200 sm:text-xs"><span className="h-px w-10 bg-cyan-300" /><Sparkles size={14} /> Bespoke island expeditions</div>
        <h1 className="max-w-5xl text-[clamp(3.2rem,8.4vw,8.3rem)] font-black leading-[.82] tracking-[-.065em]"><span className="block">Beyond</span><span className="block bg-gradient-to-r from-cyan-200 via-white to-amber-100 bg-clip-text pb-3 text-transparent">the ordinary.</span></h1>
        <div className="mt-7 grid max-w-3xl gap-7 border-l border-cyan-300/50 pl-5 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-7">
          <div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan-300">{data.title} · {data.subtitle}</p><p className="mt-3 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">{data.description}</p></div>
          <a href="#ai-planner" aria-label="Plan your Sri Lanka escape" className="group relative flex h-28 w-28 shrink-0 items-center justify-center self-start overflow-hidden rounded-full border border-white/30 bg-slate-950/35 text-white shadow-[0_18px_55px_rgba(0,0,0,.28)] backdrop-blur-xl transition duration-500 hover:scale-105 hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950 sm:h-32 sm:w-32 sm:self-auto">
            <span className="absolute inset-2 rounded-full border border-white/10 transition group-hover:border-slate-950/15" />
            <span className="relative text-center text-[10px] font-black uppercase leading-[1.45] tracking-[.16em]">Plan your<br /><span className="text-cyan-300 transition group-hover:text-slate-950">escape</span></span>
            <ArrowUpRight size={15} className="absolute right-5 top-5 transition duration-500 group-hover:rotate-45 sm:right-6 sm:top-6" />
          </a>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 inset-x-0 z-20 border-t border-white/10 bg-black/20 backdrop-blur-md"><div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto] items-stretch px-6 sm:px-10 lg:grid-cols-[1fr_1.4fr_auto] lg:px-[8%]">
      <div className="flex items-center gap-4 py-5 lg:py-6"><div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20"><Compass className="text-cyan-300" size={22} /><span className="absolute inset-1 animate-pulse rounded-full border border-cyan-300/20" /></div><div><p className="text-[9px] font-bold uppercase tracking-[.25em] text-white/45">Current chapter</p><p className="mt-1 font-bold">{scenes[active].place} <span className="font-normal text-white/50">— {scenes[active].label}</span></p></div></div>
      <div className="hidden items-center justify-center gap-2 border-x border-white/10 px-8 lg:flex">{scenes.map((s, i) => <button key={s.place} onClick={() => change(i)} className={`group flex items-center gap-3 px-3 py-6 ${active === i ? "text-white" : "text-white/35 hover:text-white/70"}`}><span className="text-[10px] font-bold">{s.no}</span><span className={`h-px transition-all duration-500 ${active === i ? "w-14 bg-cyan-300" : "w-5 bg-white/30 group-hover:w-8"}`} /></button>)}</div>
      <a href="#tours" className="flex items-center gap-3 py-5 pl-5 text-xs font-black uppercase tracking-[.18em] hover:text-cyan-300 lg:py-6 lg:pl-9">Explore <ArrowDown size={16} /></a>
    </div></div>

    <div className="absolute right-[3%] top-[29%] z-20 hidden xl:block">
      <button type="button" onClick={() => change((active + 1) % scenes.length)} className="group relative w-52 text-left 2xl:w-60">
        <div className="absolute -inset-3 translate-x-2 translate-y-3 rounded-[2rem] border border-white/10 bg-white/5 transition duration-500 group-hover:translate-x-3 group-hover:translate-y-4" />
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-black/35 p-2.5 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <div className="relative h-24 overflow-hidden rounded-[1.25rem] 2xl:h-28"><img src={scenes[(active + 1) % scenes.length].src} alt={scenes[(active + 1) % scenes.length].place} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" /><span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[8px] font-bold uppercase tracking-[.18em] backdrop-blur">Next story</span></div>
          <div className="flex items-center justify-between px-2 pb-2 pt-3"><div><p className="text-[8px] font-bold uppercase tracking-[.24em] text-cyan-300">Curated discovery</p><p className="mt-1 text-sm font-bold">{scenes[(active + 1) % scenes.length].place} <span className="font-normal text-white/45">· {scenes[(active + 1) % scenes.length].label}</span></p></div><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 transition group-hover:border-cyan-300 group-hover:bg-cyan-300 group-hover:text-slate-950"><MapPin size={14} /></span></div>
        </div>
        <p className="mt-5 flex items-center justify-end gap-2 text-[8px] font-bold uppercase tracking-[.25em] text-white/45"><span className="h-px w-8 bg-cyan-300/60" /> Click to explore</p>
      </button>
    </div>
  </section>;
}
