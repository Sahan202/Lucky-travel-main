import { useState } from "react";
import { ArrowUpRight, CheckCircle2, PenLine, Send, Star } from "lucide-react";

export default function ReviewForm() {
  const [form, setForm] = useState({ name: "", role: "", text: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSubmitting(true); setMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (response.ok) { setMessage("Thank you for your review! It will be visible after approval."); setForm({ name: "", role: "", text: "", rating: 5 }); }
      else setMessage(data.message || "Failed to submit review");
    } catch { setMessage("Error submitting review. Please try again."); }
    finally { setSubmitting(false); }
  };
  const field = "w-full border-b border-white/15 bg-transparent px-0 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300";

  return <section id="review" className="relative isolate overflow-hidden bg-[#061018] py-24 text-white sm:py-32">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,.1),transparent_28%)]" />
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:72px_72px]" />
    <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-16 lg:px-10">
      <div className="lg:pt-8"><p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.3em] text-cyan-300"><PenLine size={15} /> Add to our guest journal</p><h2 className="mt-5 text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-7xl">Your story<br /><span className="font-serif font-normal italic text-cyan-200">belongs here.</span></h2><p className="mt-7 max-w-md text-base leading-8 text-slate-300">A sunrise remembered. A guide who became a friend. A road you never expected to love. Tell future travellers what made Sri Lanka unforgettable.</p><div className="mt-9 space-y-4 text-xs text-white/55">{["Reviewed before publishing", "Your details stay protected", "Helps another traveller dream"].map(item => <p key={item} className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-300" />{item}</p>)}</div></div>

      <form onSubmit={submit} className="relative rounded-[2rem] border border-white/10 bg-white/[.055] p-6 shadow-[0_35px_100px_rgba(0,0,0,.3)] backdrop-blur-xl sm:p-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6"><div><p className="text-[9px] font-black uppercase tracking-[.25em] text-white/35">Private entry</p><p className="mt-2 font-serif text-2xl italic">Dear Lucky Travel...</p></div><span className="font-serif text-5xl italic text-white/[.08]">SL</span></div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2"><label className="text-[9px] font-bold uppercase tracking-[.2em] text-cyan-300">Your name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={field} placeholder="How should we remember you?" required /></label><label className="text-[9px] font-bold uppercase tracking-[.2em] text-cyan-300">Journey / country<input value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} className={field} placeholder="e.g. Honeymoon · Australia" /></label></div>
        <label className="mt-7 block text-[9px] font-bold uppercase tracking-[.2em] text-cyan-300">Your travel memory<textarea value={form.text} onChange={event => setForm({ ...form, text: event.target.value })} className={`${field} min-h-36 resize-none leading-7`} placeholder="Write the moment you will carry home..." required /></label>
        <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="mb-2 text-[9px] font-bold uppercase tracking-[.2em] text-white/35">Rate your journey</p><div className="flex gap-2">{[1,2,3,4,5].map(star => <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} aria-label={`${star} stars`} className="transition hover:-translate-y-1"><Star size={22} className={star <= form.rating ? "fill-amber-300 text-amber-300" : "text-white/15"} /></button>)}</div></div><button type="submit" disabled={submitting} className="group inline-flex items-center justify-center gap-3 rounded-full bg-cyan-300 px-7 py-4 text-xs font-black uppercase tracking-[.13em] text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Sending entry..." : "Sign the journal"}{submitting ? <Send size={16} className="animate-pulse" /> : <ArrowUpRight size={16} className="transition group-hover:rotate-45" />}</button></div>
        {message && <div role="status" className={`mt-6 rounded-xl border px-4 py-3 text-center text-xs ${message.startsWith("Thank") ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : "border-red-300/20 bg-red-300/10 text-red-200"}`}>{message}</div>}
      </form>
    </div>
  </section>;
}
