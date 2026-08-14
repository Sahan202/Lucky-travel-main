import { useEffect } from 'react';
import Lenis from 'lenis';
import Hero from './Hero';
import Services from './Services';
import TourPackages from './TourPackages';
import Gallery from './Gallery';
import Testimonial from './Testimonial';
import ReviewForm from './ReviewForm';
import TravelPlanner from './TravelPlanner';
import Footer from './Footer';

export default function LuxuryTourismHome() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors">
      <Hero />
      <Services />
      <TourPackages />
      <TravelPlanner />
      <Gallery />
      <Testimonial />
      <ReviewForm />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
}
