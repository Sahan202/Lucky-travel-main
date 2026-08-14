import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

    gsap.to(bgRef.current, {
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <img
        ref={bgRef}
        src={images[currentImageIndex].src}
        alt="Hero background"
        className="absolute w-full h-[120%] object-cover top-0 left-0"
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-black/70 to-black/40" />

      {/* Image Details Overlay */}
      <div ref={detailsRef} className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 z-20 text-white text-center sm:text-left">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-300 mb-1">{imageDetails.subtitle}</p>
        <h3 className="text-lg sm:text-3xl font-bold drop-shadow-2xl">{imageDetails.title}</h3>
      </div>

      {/* Thumbnail Navigation */}
      <div className="hidden md:flex absolute bottom-8 right-8 z-20 flex-col gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => {
              if (bgRef.current && detailsRef.current) {
                gsap.to(bgRef.current, {
                  scale: 1.3,
                  duration: 0.6,
                  ease: "power2.in"
                });
                gsap.to(detailsRef.current, {
                  opacity: 0,
                  y: -50,
                  duration: 0.4,
                  ease: "power2.in",
                  onComplete: () => {
                    setCurrentImageIndex(index);
                    setImageDetails({ title: images[index].title, subtitle: images[index].subtitle });
                    gsap.fromTo(bgRef.current,
                      { scale: 1.3, opacity: 0 },
                      { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
                    );
                    gsap.fromTo(detailsRef.current,
                      { opacity: 0, y: 50 },
                      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
                    );
                  }
                });
              }
            }}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              currentImageIndex === index
                ? 'border-blue-500 scale-110 shadow-xl'
                : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative z-10 text-white max-w-5xl px-4 sm:px-6">
        <div className="mb-4 sm:mb-6">
          <span className="inline-block px-3 py-1.5 sm:px-5 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
            Premium Travel Services
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight">
          <span className="block text-white">
            {heroData.title}
          </span>
          <span className="block mt-1 sm:mt-2">
            <span className="text-blue-400">{heroData.subtitle}</span>
          </span>
        </h1>
        <p className="mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
          {heroData.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            Explore Packages
          </button>
          <a href="tel:+94741105548" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Contact Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
