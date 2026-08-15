import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock3, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Ella from '../assets/ella.jpg';
import Sigiriya from '../assets/Sigiriya.jpg';
import Mirissa from '../assets/Secret Beach Mirissa Sri Lanka.jpg';
import Yala from '../assets/tommaso-delton-_sFOJHDmO6A-unsplash.jpg';
import Galle from '../assets/chathura-indika-LAj-XlHP6Rs-unsplash.jpg';
import Polonnaruwa from '../assets/birendra-padmaperuma-NjELNF_q4UY-unsplash.jpg';
import Nuwara from '../assets/Beautiful view from Nuwara Eliya, Sri Lanka.jpg';
import Kandy from '../assets/promodhya-abeysekara-gjd-7_3Ek_w-unsplash.jpg';
import Jaffna from '../assets/Nallur Kovil.jpg';

gsap.registerPlugin(ScrollTrigger);

const bgVideo = 'https://res.cloudinary.com/dwgykuwgq/video/upload/f_mp4,vc_h264,q_auto:good/v1786773679/SRI_LANKA_Cinematic_Travel_Film_1.mp4';

type Tour = { _id: string; name: string; description?: string; duration?: string; places?: string; price?: string; image?: string; imageSource?: string };

const defaultImages: Record<string, string> = {
  Ella, 'Yala National Park': Yala, Mirissa, Sigiriya, 'Galle City': Galle,
  Polonnaruwa, 'Nuwara Eliya': Nuwara, Kandy, Jaffna
};

const tourWikiTitles: Record<string, string> = {
  Sigiriya: 'Sigiriya', Jaffna: 'Jaffna', Ella: 'Ella, Sri Lanka', 'Galle City': 'Galle Fort',
  'Nuwara Eliya': 'Nuwara Eliya', 'Yala National Park': 'Yala National Park', Mirissa: 'Mirissa',
  Polonnaruwa: 'Polonnaruwa', Kandy: 'Temple of the Tooth', 'Trincomalee Coast': 'Trincomalee',
  'Anuradhapura Heritage': 'Anuradhapura', 'Bentota Escape': 'Bentota', 'Udawalawe Safari': 'Udawalawe National Park',
  'Dambulla & Cultural Triangle': 'Dambulla cave temple', 'Arugam Bay Surf Adventure': 'Arugam Bay'
};

const tourPhotoCache = new Map<string, { url: string; source: string }>();

function SmartTourImage({ tour, fallback }: { tour: Tour; fallback: string }) {
  const [photo, setPhoto] = useState<{ url: string; source: string } | null>(tourPhotoCache.get(tour.name) || null);

  useEffect(() => {
    const cached = tourPhotoCache.get(tour.name);
    if (cached) { setPhoto(cached); return; }
    const controller = new AbortController();
    const title = tourWikiTitles[tour.name] || tour.name;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('No location image')))
      .then(data => {
        const url = data.originalimage?.source || data.thumbnail?.source;
        if (!url) return;
        const match = { url, source: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}` };
        tourPhotoCache.set(tour.name, match);
        setPhoto(match);
      })
      .catch(error => { if (error.name !== 'AbortError') setPhoto(null); });
    return () => controller.abort();
  }, [tour.name]);

  const src = photo?.url || tour.image || fallback;
  return <><img src={src} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = fallback; }} alt={`${tour.name} location`} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />{photo && <a href={photo.source} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()} className="absolute bottom-4 right-4 z-20 rounded bg-black/65 px-2 py-1 text-[10px] text-white/80 hover:text-white">Location photo: Wikipedia</a>}</>;
}

export default function TourPackages() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/packages`)
      .then(response => response.json())
      .then(data => setTours(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const playVideo = () => { void video.play().catch(() => setVideoReady(false)); };
    playVideo();
    document.addEventListener('visibilitychange', playVideo);
    window.addEventListener('focus', playVideo);
    return () => {
      document.removeEventListener('visibilitychange', playVideo);
      window.removeEventListener('focus', playVideo);
    };
  }, []);

  useEffect(() => {
    if (!titleRef.current || !cardsRef.current || !tours.length) return;
    const context = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: titleRef.current, start: 'top 85%' } });
      gsap.fromTo(cardsRef.current!.querySelectorAll('.tour-card'), { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' } });
    });
    return () => context.revert();
  }, [tours]);

  const bookOnWhatsApp = (tour: Tour) => {
    const message = `Hello Lucky Travel! I am interested in the ${tour.name} tour.\nDuration: ${tour.duration}\nPlaces: ${tour.places}\nPrice: ${tour.price}\nPlease share availability and booking details.`;
    window.open(`https://wa.me/94741105548?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return <section id="tours" className="relative isolate overflow-hidden bg-[#020711] py-24 text-white">
    <img src={Sigiriya} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 blur-[2px]" />
    <video ref={videoRef} autoPlay loop muted playsInline preload="metadata" poster={Sigiriya} onCanPlay={() => setVideoReady(true)} onPlaying={() => setVideoReady(true)} onError={() => setVideoReady(false)} className={`absolute inset-x-0 top-0 h-[100svh] w-full object-contain object-top transition-opacity duration-1000 md:inset-0 md:h-full md:object-cover md:object-center ${videoReady ? 'opacity-100' : 'opacity-0'}`}><source src={bgVideo} type="video/mp4" /></video>
    <div className="absolute inset-0 bg-gradient-to-b from-[#020711]/20 via-[#020711]/65 to-[#020711] md:bg-[linear-gradient(180deg,rgba(2,7,17,.38),rgba(2,7,17,.66)_52%,rgba(2,7,17,.92))]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(34,211,238,.16),transparent_32%),radial-gradient(circle_at_85%_55%,rgba(37,99,235,.13),transparent_34%)]" />
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
    <div className="relative z-10 mx-auto max-w-7xl px-6">
      <div className="mx-auto mb-16 max-w-4xl text-center">
        <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-cyan-300"><span className="h-px w-9 bg-cyan-300/70" /><Sparkles size={14} /> Handpicked Sri Lanka experiences<span className="h-px w-9 bg-cyan-300/70" /></span>
        <h2 ref={titleRef} className="mt-5 text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-6xl md:text-7xl">Featured <span className="font-serif font-normal italic text-cyan-200">tours.</span></h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">Explore our most-loved journeys with clear routes, authentic highlights and flexible private travel.</p>
      </div>

      <div ref={cardsRef} className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {tours.map(tour => {
          const fallback = defaultImages[tour.name] || Sigiriya;
          const places = String(tour.places || '').split(',').map(place => place.trim()).filter(Boolean);
          return <article key={tour._id} className="tour-card group flex overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-cyan-300/50">
            <div className="flex w-full flex-col">
              <div role="button" tabIndex={0} onClick={() => navigate(`/tour/${tour._id}`)} onKeyDown={event => { if (event.key === 'Enter') navigate(`/tour/${tour._id}`); }} className="relative h-64 cursor-pointer overflow-hidden text-left">
                <SmartTourImage tour={tour} fallback={fallback} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"><Clock3 size={13} />{tour.duration || 'Flexible'}</span>
                <span className="absolute right-4 top-4 rounded-full bg-cyan-400 px-3 py-1.5 text-sm font-bold text-slate-950">{tour.price || 'Request quote'}</span>
                <div className="absolute bottom-4 left-5 right-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Explore {tour.name}</p><h3 className="mt-1 text-2xl font-bold text-white">{tour.name}</h3></div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-400">{tour.description || `Discover the highlights of ${tour.name} with a private Lucky Travel experience.`}</p>
                <div className="mt-4"><p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500"><MapPin size={13} />Tour highlights</p><div className="flex flex-wrap gap-2">{places.slice(0, 4).map(place => <span key={place} className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1.5 text-xs font-semibold text-cyan-100">{place}</span>)}</div></div>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-6"><button type="button" onClick={() => navigate(`/tour/${tour._id}`)} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">View Tour <ArrowRight size={16} /></button><button type="button" onClick={() => bookOnWhatsApp(tour)} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-emerald-300 hover:bg-emerald-400/10"><MessageCircle size={16} /> WhatsApp</button></div>
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
