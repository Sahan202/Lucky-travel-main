import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Camera, Expand, MapPin, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
interface GalleryImage { _id: string; url: string; }
const frameClasses = [
  "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-3",
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const perPage = 5;
  const pages = Math.ceil(images.length / perPage);
  const visible = images.slice(page * perPage, (page + 1) * perPage);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gallery`).then(response => response.json()).then(data => setImages(Array.isArray(data) ? data : [])).catch(error => console.error("Gallery:", error));
  }, []);
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => gsap.from(".moments-heading", { y: 55, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 72%" } }), sectionRef);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (!gridRef.current || !visible.length) return;
    const ctx = gsap.context(() => gsap.fromTo(".moment-frame", { opacity: 0, y: 28, scale: .98 }, { opacity: 1, y: 0, scale: 1, stagger: .08, duration: .7, ease: "power3.out" }), gridRef);
    return () => ctx.revert();
  }, [page, images]);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [selected]);

  const move = (direction: number) => setPage(current => Math.min(Math.max(current + direction, 0), Math.max(pages - 1, 0)));

  return <section ref={sectionRef} id="gallery" className="relative isolate overflow-hidden bg-[#e8e1d4] py-24 text-slate-950 sm:py-32">
    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(15,23,42,.18)_0.7px,transparent_0.7px)] [background-size:7px_7px]" />
    <div className="absolute -right-20 top-20 font-serif text-[18rem] leading-none text-slate-950/[.025] sm:text-[28rem]">L</div>
    <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
      <div className="moments-heading grid gap-8 border-y border-slate-950/15 py-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-cyan-800"><Camera size={15} /> Postcards from the island</p><h2 className="mt-4 text-5xl font-black leading-[.88] tracking-[-.065em] sm:text-7xl lg:text-[6.5rem]">Travel<br /><span className="font-serif font-normal italic text-cyan-800">moments.</span></h2></div>
        <div className="max-w-md lg:pb-2"><p className="font-serif text-xl italic leading-8 text-slate-700 sm:text-2xl">“The best journeys leave you with stories no itinerary could have predicted.”</p><div className="mt-6 flex items-center gap-3 text-[9px] font-black uppercase tracking-[.25em] text-slate-500"><span className="h-px w-12 bg-slate-500" /> Captured across Sri Lanka</div></div>
      </div>

      {visible.length ? <>
        <div ref={gridRef} className="mt-10 grid auto-rows-[190px] grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-2 sm:auto-rows-[230px] lg:auto-rows-[270px]">
          {visible.map((item, index) => <button key={item._id} type="button" onClick={() => setSelected(item)} className={`moment-frame group relative overflow-hidden bg-slate-900 text-left ${frameClasses[index]}`}>
            <img src={item.url} alt={`Sri Lanka travel moment ${page * perPage + index + 1}`} loading={index ? "lazy" : "eager"} className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-70 transition group-hover:opacity-95" />
            <span className="absolute left-4 top-4 text-[9px] font-bold tracking-[.22em] text-white/70">FRAME {String(page * perPage + index + 1).padStart(2, "0")}</span>
            {index === 0 && <div className="absolute bottom-0 left-0 p-5 sm:p-7"><p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.22em] text-cyan-200"><MapPin size={12} /> Somewhere beautiful, Sri Lanka</p><p className="mt-2 font-serif text-2xl italic text-white sm:text-4xl">A story worth keeping</p></div>}
            <span className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100"><Expand size={15} /></span>
          </button>)}
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-slate-950/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><span className="font-serif text-3xl italic text-cyan-900">{String(page + 1).padStart(2, "0")}</span><div className="h-px w-16 bg-slate-950/25 sm:w-28"><div className="h-px bg-cyan-700 transition-all duration-500" style={{ width: `${((page + 1) / pages) * 100}%` }} /></div><span className="text-[10px] font-black tracking-[.2em] text-slate-500">{String(pages).padStart(2, "0")}</span></div>
          <div className="flex gap-2"><button type="button" onClick={() => move(-1)} disabled={!page} aria-label="Previous moments" className="flex h-12 w-16 items-center justify-center rounded-full border border-slate-950/20 transition hover:border-cyan-800 hover:bg-cyan-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"><ArrowLeft size={18} /></button><button type="button" onClick={() => move(1)} disabled={page >= pages - 1} aria-label="Next moments" className="flex h-12 w-24 items-center justify-center gap-2 rounded-full bg-slate-950 text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-25"><span className="text-[9px] font-bold uppercase tracking-wider">Next</span><ArrowRight size={17} /></button></div>
        </div>
      </> : <div className="mt-10 grid h-[540px] animate-pulse grid-cols-2 gap-3 md:grid-cols-12"><div className="col-span-2 bg-slate-950/10 md:col-span-5" /><div className="col-span-2 bg-slate-950/10 md:col-span-7" /></div>}
    </div>

    {selected && <div role="dialog" aria-modal="true" aria-label="Travel moment preview" onClick={() => setSelected(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02070c]/95 p-4 backdrop-blur-xl sm:p-10">
      <button type="button" onClick={() => setSelected(null)} aria-label="Close preview" className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:rotate-90 hover:bg-white hover:text-slate-950 sm:right-8 sm:top-8"><X size={20} /></button>
      <div onClick={event => event.stopPropagation()} className="relative max-h-[84vh] max-w-6xl"><img src={selected.url} alt="Selected Sri Lanka travel moment" className="max-h-[78vh] w-auto max-w-full object-contain shadow-[0_40px_120px_rgba(0,0,0,.6)]" /><div className="mt-4 flex items-center justify-between text-white"><p className="font-serif text-lg italic">A Lucky Travel memory</p><p className="text-[9px] font-bold uppercase tracking-[.25em] text-white/45">Press ESC to close</p></div></div>
    </div>}
  </section>;
}
