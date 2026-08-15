import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Quote, ShieldCheck, Star } from "lucide-react";
import bgImage from "../assets/hendrik-cornelissen-jpTT_SAU034-unsplash.jpg";

gsap.registerPlugin(ScrollTrigger);
interface TestimonialItem { _id?: string; name: string; role: string; text: string; rating: number; }

export default function Testimonial() {
  const root = useRef<HTMLElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews`).then(response => response.json()).then(data => setReviews(Array.isArray(data) ? data : [])).catch(error => console.error("Reviews:", error)).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => gsap.from(".review-reveal", { opacity: 0, y: 50, stagger: .12, duration: .9, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%" } }), root);
    return () => ctx.revert();
  }, [loading]);
  useEffect(() => {
    if (reviews.length < 2) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % reviews.length), 7000);
    return () => clearInterval(timer);
  }, [reviews.length]);
  useEffect(() => {
    if (!story.current || !reviews.length) return;
    gsap.fromTo(story.current, { opacity: .2, y: 18 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out" });
  }, [active, reviews.length]);

  const move = (direction: number) => setActive(value => (value + direction + reviews.length) % reviews.length);
  const current = reviews[active];
  const average = reviews.length ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length : 0;

  return <section ref={root} className="relative isolate overflow-hidden bg-[#02080d] py-24 text-white sm:py-32">
    <img src={bgImage} alt="Sri Lanka landscape" className="absolute inset-0 h-full w-full object-cover opacity-20" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,13,.98),rgba(2,8,13,.82)_55%,rgba(2,8,13,.68))]" />
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:80px_80px]" />
    <div className="absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-[130px]" />

    <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
      <div className="review-reveal flex flex-col gap-7 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-cyan-300"><Quote size={15} /> Voices of the island</p><h2 className="mt-4 text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-7xl">Stories carried<br /><span className="font-serif font-normal italic text-cyan-200">home.</span></h2></div>
        <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"><div><div className="flex gap-1">{[1,2,3,4,5].map(star => <Star key={star} size={14} className={star <= Math.round(average) ? "fill-amber-300 text-amber-300" : "text-white/20"} />)}</div><p className="mt-2 text-[9px] font-bold uppercase tracking-[.2em] text-white/45">Verified traveller stories</p></div><span className="h-10 w-px bg-white/10" /><span className="font-serif text-4xl italic text-white">{average ? average.toFixed(1) : "—"}</span></div>
      </div>

      {loading ? <div className="mt-12 h-[500px] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" /> : current ? <div className="mt-12 grid gap-7 lg:grid-cols-[1fr_320px]">
        <div ref={story} className="review-reveal relative flex min-h-[470px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.055] p-7 shadow-[0_35px_100px_rgba(0,0,0,.35)] backdrop-blur-xl sm:min-h-[520px] sm:p-12">
          <Quote className="absolute -right-5 -top-12 h-56 w-56 rotate-12 text-white/[.035] sm:h-72 sm:w-72" />
          <div className="relative"><div className="flex items-center justify-between"><span className="font-serif text-2xl italic text-cyan-200">Journal entry {String(active + 1).padStart(2, "0")}</span><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.2em] text-emerald-300"><ShieldCheck size={14} /> Genuine journey</span></div><blockquote className="mt-12 max-w-4xl font-serif text-3xl italic leading-[1.25] tracking-[-.025em] text-slate-100 sm:text-4xl lg:text-5xl">“{current.text}”</blockquote></div>
          <div className="relative mt-12 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-lg font-black text-cyan-200">{current.name.slice(0, 2).toUpperCase()}</span><div><p className="text-lg font-black">{current.name}</p><p className="mt-1 text-xs uppercase tracking-[.18em] text-white/40">{current.role || "Lucky Travel guest"}</p></div></div><div className="flex gap-1">{[1,2,3,4,5].map(star => <Star key={star} size={17} className={star <= current.rating ? "fill-amber-300 text-amber-300" : "text-white/15"} />)}</div></div>
        </div>

        <aside className="review-reveal flex flex-col rounded-[2rem] border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[.24em] text-white/45">Guest journal</p><p className="font-serif text-xl italic text-cyan-200">{active + 1}/{reviews.length}</p></div>
          <div className="mt-5 max-h-[350px] space-y-2 overflow-y-auto pr-1 lg:max-h-none">{reviews.map((review, index) => <button key={review._id || `${review.name}-${index}`} type="button" onClick={() => setActive(index)} className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${index === active ? "border-cyan-300/40 bg-cyan-300/10" : "border-transparent hover:border-white/10 hover:bg-white/5"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${index === active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white/60"}`}>{review.name.slice(0,2).toUpperCase()}</span><span className="min-w-0"><span className={`block truncate text-sm font-bold ${index === active ? "text-white" : "text-white/55"}`}>{review.name}</span><span className="mt-1 block truncate text-[9px] uppercase tracking-wider text-white/30">{review.role || "Traveller"}</span></span></button>)}</div>
          <div className="mt-auto flex gap-2 border-t border-white/10 pt-5"><button type="button" onClick={() => move(-1)} aria-label="Previous review" className="flex h-12 flex-1 items-center justify-center rounded-full border border-white/15 transition hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950"><ArrowLeft size={17} /></button><button type="button" onClick={() => move(1)} aria-label="Next review" className="flex h-12 flex-[1.6] items-center justify-center gap-2 rounded-full bg-cyan-300 text-[9px] font-black uppercase tracking-wider text-slate-950 transition hover:bg-white">Next story <ArrowRight size={16} /></button></div>
        </aside>
      </div> : <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-16 text-center"><Quote className="mx-auto text-cyan-300" /><h3 className="mt-5 text-2xl font-black">The guest journal is opening soon.</h3><p className="mt-2 text-slate-400">Be the first to share a Lucky Travel story.</p></div>}
    </div>
  </section>;
}
