import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, MessageCircle, Moon, Sparkles, Sun, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../assets/image.png";

const links = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "tours", label: "Tours" },
  { id: "ai-planner", label: "AI Journey" },
  { id: "gallery", label: "Moments" },
  { id: "contact", label: "Contact" },
];

export default function TourismNavbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 36);
      const position = window.scrollY + 180;
      for (const link of links) {
        const element = document.getElementById(link.id);
        if (element && position >= element.offsetTop && position < element.offsetTop + element.offsetHeight) { setActive(link.id); break; }
      }
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, []);

  return <nav aria-label="Primary navigation" className={`fixed inset-x-0 z-50 px-3 transition-all duration-500 sm:px-5 ${scrolled ? "top-2" : "top-3 sm:top-5"}`}>
    <div className={`relative mx-auto transition-all duration-500 ${scrolled ? "max-w-6xl" : "max-w-[1320px]"}`}>
      <div className={`relative flex items-center justify-between overflow-hidden rounded-[1.4rem] border px-3 shadow-[0_18px_70px_rgba(0,0,0,.3)] transition-all duration-500 sm:px-4 ${scrolled ? "h-[62px] bg-[#02080d]/88 backdrop-blur-2xl" : "h-[70px] bg-[#02080d]/58 backdrop-blur-xl"} ${active === "home" ? "border-transparent" : "border-white/15"}`}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(34,211,238,.08),transparent_28%,transparent_72%,rgba(37,99,235,.08))]" />
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />

        <a href="#home" className="group relative z-10 flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/95 p-1 shadow-lg"><img src={Logo} alt="Lucky Travel" className="h-full w-full rounded-full object-contain transition duration-500 group-hover:rotate-6 group-hover:scale-105" /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#061018] bg-emerald-400" /></span>
          <span className="hidden sm:block"><span className="block text-base font-black leading-none tracking-[-.02em] text-white">Lucky Travel</span><span className="mt-1.5 flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[.25em] text-cyan-200/70"><Sparkles size={9} /> Sri Lanka, privately</span></span>
        </a>

        <div className="relative z-10 hidden items-center rounded-full border border-white/10 bg-black/20 p-1.5 lg:flex">
          {links.map(link => <a key={link.id} href={`#${link.id}`} className={`relative rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-300 xl:px-5 ${active === link.id ? "bg-cyan-300 text-slate-950 shadow-[0_8px_25px_rgba(34,211,238,.22)]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}><span className="relative z-10">{link.label}</span>{link.id === "ai-planner" && active !== link.id && <span className="absolute right-2 top-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />}</a>)}
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button type="button" onClick={toggleTheme} aria-label="Toggle color theme" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:rotate-12 hover:border-cyan-300/50 hover:text-cyan-200">{theme === "light" ? <Moon size={17} /> : <Sun size={17} className="text-amber-300" />}</button>
          <a href="https://wa.me/94741105548" target="_blank" rel="noreferrer" className="group hidden items-center gap-2 rounded-full bg-white py-2.5 pl-4 pr-3 text-[10px] font-black uppercase tracking-[.12em] text-slate-950 transition hover:bg-cyan-300 sm:flex"><MessageCircle size={15} />Let's talk<span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:rotate-45"><ArrowUpRight size={12} /></span></a>
          <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-cyan-300 lg:hidden">{open ? <X size={19} /> : <Menu size={20} />}</button>
        </div>
      </div>

      <div className={`absolute inset-x-0 top-[calc(100%+8px)] origin-top overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#030b12]/95 shadow-[0_30px_90px_rgba(0,0,0,.5)] backdrop-blur-2xl transition-all duration-500 lg:hidden ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-3 scale-[.98] opacity-0"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.12),transparent_35%)]" />
        <div className="relative p-5 sm:p-7"><div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-[8px] font-black uppercase tracking-[.28em] text-cyan-300">Explore the island</p><p className="mt-1 font-serif text-lg italic text-white/70">Where would you like to begin?</p></div><span className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Local team online</span></div>
          <div className="grid gap-2 sm:grid-cols-2">{links.map((link, index) => <a key={link.id} href={`#${link.id}`} onClick={() => setOpen(false)} className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition ${active === link.id ? "border-cyan-300/40 bg-cyan-300/10 text-white" : "border-transparent bg-white/[.035] text-white/65 hover:border-white/10 hover:text-white"}`}><span className="flex items-center gap-3"><span className="text-[8px] font-bold text-cyan-300">0{index + 1}</span><span className="text-sm font-bold">{link.label}</span></span><ArrowUpRight size={14} className="transition group-hover:rotate-45" /></a>)}</div>
          <a href="https://wa.me/94741105548" target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-300 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950"><MessageCircle size={17} /> Plan with a local expert</a>
        </div>
      </div>
    </div>
  </nav>;
}
