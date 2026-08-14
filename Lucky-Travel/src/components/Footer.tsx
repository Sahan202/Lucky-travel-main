import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Footer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setMessage("Message sent successfully!");
      formRef.current?.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setMessage("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#050b18] py-16 text-slate-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_32%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded"></span>
                About Us
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Luxury tourism experiences crafted for unforgettable journeys across Sri Lanka.</p>
            </div>
            
            <div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded"></span>
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Home
                </a></li>
                <li><a href="#services" className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Services
                </a></li>
                <li><a href="#tours" className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Tours
                </a></li>
                <li><a href="#gallery" className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Gallery
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded"></span>
                Contact Info
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:luckytravel920@gmail.com" className="hover:text-blue-400 transition">luckytravel920@gmail.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+94741105548" className="hover:text-blue-400 transition">+94 74 110 5548</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>No 73, Hakmana Road, Matara</span>
                </li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="mailto:lakinduvitharana@gmail.com" className="w-8 h-8 bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg">
            <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded"></span>
              Quick Message
            </h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="from_name"
                placeholder="Name"
                required
                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <input
                type="email"
                name="from_email"
                placeholder="Email"
                required
                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <textarea
                name="message"
                placeholder="Message"
                required
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {message && (
                <p className={`text-xs text-center ${message.includes("success") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 dark:text-gray-500">&copy; 2025/26 Lucky Tours. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-500">
            <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
