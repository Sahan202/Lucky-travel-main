import { useState, useEffect } from 'react';

interface Service {
  _id: string;
  title: string;
  description: string;
  details?: string[];
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  return (
    <section id="services" className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-6 text-white">
          Our Services
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Discover exceptional travel experiences crafted just for you
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div 
            key={service._id} 
            className="h-[400px] perspective-1000 group cursor-pointer"
          >
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
              {/* Front */}
              <div className="absolute inset-0 p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 backface-hidden">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              {/* Back */}
              <div className="absolute inset-0 p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 backface-hidden rotate-y-180">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.details?.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
