import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgImage from "../assets/hendrik-cornelissen-jpTT_SAU034-unsplash.jpg";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialItem {
  _id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading reviews:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const cardWidth = 352;
    scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const cardWidth = 352;
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!scrollRef.current || testimonials.length === 0) return;

    const scrollContainer = scrollRef.current;
    let animationId: number;
    const scrollSpeed = 0.5;

    const smoothScroll = () => {
      const singleSetWidth = (scrollContainer.scrollWidth / 3);
      
      if (scrollContainer.scrollLeft >= singleSetWidth * 2) {
        scrollContainer.scrollLeft = singleSetWidth;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }
      animationId = requestAnimationFrame(smoothScroll);
    };

    animationId = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationId);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="relative overflow-hidden py-32 bg-gray-900">
        <div className="text-center text-white text-xl">Loading reviews...</div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="relative overflow-hidden py-32 bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Traveler Reviews</h2>
          <p>No reviews available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-32">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          backgroundAttachment: "fixed"
        }}
      />
      <div className="absolute inset-0 bg-black/70 z-10" />

      <div className="relative z-20 text-white text-center px-6 max-w-7xl mx-auto">
        <p className="text-orange-400 mb-2">
          What our customers say about us
        </p>

        <h2 ref={titleRef} className="text-5xl font-bold mb-16">
          Traveler Reviews 
        </h2>

        <div className="relative max-w-6xl mx-auto">
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                {testimonial.name.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-300 mb-6">
                  {testimonial.role}
                </p>
                <p className="text-lg opacity-90">
                  "{testimonial.text}"
                </p>
                {testimonial.rating && (
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/20 hover:bg-white/30 p-2 md:p-3 rounded-full transition backdrop-blur-sm"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/20 hover:bg-white/30 p-2 md:p-3 rounded-full transition backdrop-blur-sm"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
