import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Star } from 'lucide-react';
import Homebg from "../assets/matt-dany-ePAa2c9XbtE-unsplash.jpg";
import Dalada from "../assets/dalada.jpg";
import Budda from "../assets/buddh.jpg";
import Sigiri2 from "../assets/sigiriya22.jpg";    

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: Homebg, title: "Discover Sri Lanka", subtitle: "Paradise Island" },
  { src: Dalada, title: "Sacred Temple", subtitle: "Temple of the Tooth" },
  { src: Budda, title: "Ancient Heritage", subtitle: "Buddhist Culture" },
  { src: Sigiri2, title: "Sigiriya Rock", subtitle: "8th Wonder of the World" }
];

export default function Hero() {
  const bgRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDetails, setImageDetails] = useState({ title: images[0].title, subtitle: images[0].subtitle });
  const [heroData, setHeroData] = useState({
    title: 'Luxury Travel Experiences',
    subtitle: 'Across Sri Lanka',
    description: 'Premium tours, private transfers, handpicked destinations and unforgettable journeys tailored for discerning travelers.'
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/hero`)
      .then(res => res.json())
      .then(data => {
        if (data.title) setHeroData(data);
      })
      .catch(err => console.error('Error fetching hero data:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bgRef.current && detailsRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.3,
          duration: 0.8,
          ease: "power2.in"
        });
        gsap.to(detailsRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            setCurrentImageIndex(nextIndex);
            setImageDetails({ title: images[nextIndex].title, subtitle: images[nextIndex].subtitle });
            gsap.fromTo(bgRef.current, 
              { scale: 1.3, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
            );
            gsap.fromTo(detailsRef.current,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
            );
          }
        });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  useEffect(() => {
    if (!bgRef.current) return;

    const scrollTween = gsap.to(bgRef.current, {
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    return () => scrollTween.scrollTrigger?.kill();
  }, []);
  const selectSlide = (index: number) => {
    if (!bgRef.current || !detailsRef.current || index === currentImageIndex) return;
    gsap.to([bgRef.current, detailsRef.current], { opacity: 0, duration: 0.35, onComplete: () => {
      setCurrentImageIndex(index);
      setImageDetails({ title: images[index].title, subtitle: images[index].subtitle });
      gsap.fromTo(bgRef.current, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' });
      gsap.to(detailsRef.current, { opacity: 1, duration: 0.7, delay: 0.2 });
    } });
  };

  return <section id="home" className="relative isolate flex min-h-[760px] items-center overflow-hidden bg-slate-950 text-white lg:min-h-screen">
    <img ref={bgRef} src={images[currentImageIndex].src} alt={imageDetails.title} className="absolute inset-0 h-[112%] w-full object-cover object-center" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,.94)_0%,rgba(2,7,17,.76)_44%,rgba(2,7,17,.28)_78%,rgba(2,7,17,.5)_100%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,17,.35),transparent_35%,rgba(2,7,17,.88))]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(8,145,178,.2),transparent_33%)]" />
    <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:80px_80px]" />

    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-44 pt-32 sm:px-8 md:pb-36 lg:px-10 lg:pt-40">
      <div className="max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-cyan-100 backdrop-blur"><ShieldCheck size={15} />Private journeys · Local expertise</span>
        <h1 className="mt-6 text-4xl font-black leading-[1.03] tracking-[-.035em] sm:text-6xl lg:text-[78px]"><span className="block">{heroData.title}</span><span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">{heroData.subtitle}</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{heroData.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#tours" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 font-black text-slate-950 shadow-2xl shadow-cyan-950/50 transition hover:-translate-y-0.5 hover:brightness-110">Explore journeys <ArrowRight size={18} className="transition group-hover:translate-x-1" /></a><a href="#ai-planner" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/15"><MapPin size={18} />Build my journey</a></div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-300">{['Private air-conditioned travel', 'Flexible itineraries', 'Human support'].map(item => <span key={item} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-300" />{item}</span>)}</div>
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/55 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-5 sm:px-8 lg:px-10"><div ref={detailsRef} className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">Now exploring · {imageDetails.subtitle}</p><h3 className="mt-1 truncate text-lg font-bold sm:text-xl">{imageDetails.title}</h3></div><div className="hidden items-center gap-3 md:flex"><div className="mr-3 flex items-center gap-2 text-xs text-slate-300"><Star size={15} className="fill-amber-300 text-amber-300" /><span>Tailor-made in Sri Lanka</span></div>{images.map((image, index) => <button key={image.title} type="button" onClick={() => selectSlide(index)} aria-label={`Show ${image.title}`} className={`relative h-14 w-20 overflow-hidden rounded-lg border transition ${currentImageIndex === index ? 'border-cyan-300 ring-2 ring-cyan-300/20' : 'border-white/15 opacity-60 hover:opacity-100'}`}><img src={image.src} alt="" className="h-full w-full object-cover" /></button>)}</div><div className="flex gap-1.5 md:hidden">{images.map((image, index) => <button key={image.title} type="button" onClick={() => selectSlide(index)} aria-label={`Show ${image.title}`} className={`h-2 rounded-full transition-all ${currentImageIndex === index ? 'w-7 bg-cyan-300' : 'w-2 bg-white/35'}`} />)}</div></div></div>
  </section>;
}
