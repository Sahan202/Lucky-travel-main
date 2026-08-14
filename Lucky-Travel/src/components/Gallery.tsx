import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  _id: string;
  url: string;
}

export default function Gallery() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const imagesPerPage = 12;

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
      const data = await res.json();
      setAllImages(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const totalPages = Math.ceil(allImages.length / imagesPerPage);
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (!titleRef.current || !imagesRef.current || allImages.length === 0) return;

    const ctx = gsap.context(() => {
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

      const images = imagesRef.current!.querySelectorAll('.gallery-item');
      images.forEach((img, index) => {
        const isEven = index % 2 === 0;
        gsap.fromTo(
          img,
          { opacity: 0, x: isEven ? -100 : 100 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              end: "top 60%",
              scrub: 1
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [currentPage, allImages]);
  return (
    <section id="gallery" className="relative overflow-hidden bg-slate-900 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_35%)]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cyan-300 font-semibold text-sm uppercase tracking-wider">Gallery</span>
          <h2 ref={titleRef} className="text-5xl font-bold mt-2 text-white">Travel Moments</h2>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">Explore our collection of unforgettable moments captured during our luxury tours</p>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur overflow-hidden">
          <div className="overflow-hidden rounded-2xl">
            <div 
              ref={imagesRef}
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="min-w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allImages.slice(pageIndex * imagesPerPage, (pageIndex + 1) * imagesPerPage).map((item) => (
                    <div key={item._id} className="gallery-item relative group overflow-hidden rounded-xl">
                      <img
                        src={item.url}
                        alt="Travel moment"
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-800 dark:text-white hover:text-white font-semibold p-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-800 dark:text-white hover:text-white font-semibold p-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPage 
                  ? 'bg-blue-600 w-12' 
                  : 'bg-gray-300 dark:bg-gray-600 w-2 hover:w-6 hover:bg-blue-400'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-6">
          <span className="text-slate-400 font-medium text-sm">
            {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>
    </section>
  );
}
