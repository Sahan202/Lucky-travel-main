import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUp, ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export default function Footer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setMessage("");
    try {
      await emailjs.sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID, formRef.current!, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      await emailjs.sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID, formRef.current!, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      setMessage("Message sent successfully!"); formRef.current?.reset();
    } catch (error) { console.error("EmailJS Error:", error); setMessage("Failed to send message. Please try again."); }
    finally { setLoading(false); }
  };
  const input = "w-full border-b border-white/15 bg-transparent py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300";

  return <footer id="contact" className="relative isolate overflow-hidden bg-[#02070c] text-slate-300">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(34,211,238,.11),transparent_28%)]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
    <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-10 lg:pt-28">
      <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
        <div><p className="text-[10px] font-black uppercase tracking-[.34em] text-cyan-300">Your island story starts here</p><h2 className="mt-6 text-5xl font-black leading-[.88] tracking-[-.06em] text-white sm:text-7xl lg:text-8xl">Sri Lanka<br /><span className="font-serif font-normal italic text-cyan-200">awaits.</span></h2><p className="mt-7 max-w-xl text-base leading-8 text-slate-400">Tell us the journey in your imagination. We will turn it into days, places and moments that feel entirely your own.</p><div className="mt-9 flex flex-wrap gap-3"><a href="https://wa.me/94741105548" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-cyan-300 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-white"><MessageCircle size={17} /> Start on WhatsApp</a><a href="mailto:luckytravel920@gmail.com" className="inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-cyan-300 hover:text-cyan-200"><Mail size={16} /> Email us</a></div></div>

        <form ref={formRef} onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl sm:p-8"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.24em] text-cyan-300">Quick enquiry</p><h3 className="mt-2 text-2xl font-black text-white">What are you dreaming of?</h3></div><Send className="text-white/15" size={34} /></div><div className="mt-7 space-y-4"><input name="from_name" className={input} placeholder="Your name" required /><input type="email" name="from_email" className={input} placeholder="Email address" required /><textarea name="message" rows={3} className={`${input} resize-none leading-6`} placeholder="A few words about your ideal trip" required /></div><button type="submit" disabled={loading} className="group mt-7 flex w-full items-center justify-between rounded-full bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[.12em] text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"><span>{loading ? "Sending..." : "Send my enquiry"}</span><ArrowUpRight size={16} className="transition group-hover:rotate-45" /></button>{message && <p className={`mt-4 text-center text-xs ${message.includes("success") ? "text-emerald-300" : "text-red-300"}`}>{message}</p>}</form>
      </div>

      <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_.7fr_1fr]">
        <div><a href="#home" className="inline-flex items-center gap-3 text-2xl font-black text-white"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-xs text-cyan-200">LT</span>Lucky Travel</a><p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">Privately crafted journeys across Sri Lanka, shaped by local knowledge and genuine hospitality.</p></div>
        <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-white/35">Explore</p><nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{[["Home","#home"],["Services","#services"],["Tours","#tours"],["AI Journey","#ai-planner"],["Moments","#gallery"],["Reviews","#review"]].map(([label,href]) => <a key={label} href={href} className="transition hover:translate-x-1 hover:text-cyan-300">{label}</a>)}</nav></div>
        <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-white/35">Find us in Sri Lanka</p><div className="mt-5 space-y-4 text-sm"><a href="mailto:luckytravel920@gmail.com" className="flex items-center gap-3 transition hover:text-cyan-300"><Mail size={15} className="text-cyan-300" />luckytravel920@gmail.com</a><a href="tel:+94741105548" className="flex items-center gap-3 transition hover:text-cyan-300"><Phone size={15} className="text-cyan-300" />+94 74 110 5548</a><p className="flex items-start gap-3"><MapPin size={15} className="mt-1 shrink-0 text-cyan-300" />No. 73, Hakmana Road, Matara</p></div></div>
      </div>

      <div className="flex flex-col gap-5 border-t border-white/10 pt-7 text-[10px] uppercase tracking-[.14em] text-white/30 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Lucky Travel · Crafted in Sri Lanka</p><div className="flex items-center gap-5"><span>Private journeys · Local soul</span><a href="#home" aria-label="Back to top" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950"><ArrowUp size={15} /></a></div></div>
    </div>
  </footer>;
}
