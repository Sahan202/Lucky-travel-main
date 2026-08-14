import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../assets/image.png";

export default function TourismNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ["home", "services", "tours", "ai-planner", "gallery", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2 group">
            <img src={Logo} alt="Lucky Travel Logo" className="w-10 h-10 rounded-full group-hover:scale-110 transition-transform" style={{ filter: 'hue-rotate(200deg) saturate(1.5)' }} />
            <div>
              <div className="text-xl font-bold text-white">
                Lucky Travel
              </div>
              <div className="text-[10px] text-gray-300 -mt-1">Explore Sri Lanka</div>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 font-medium text-white">
            <a href="#home" className={`hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-400 after:transition-all ${activeSection === 'home' ? 'text-blue-400 after:w-full' : 'after:w-0 hover:after:w-full'}`}>Home</a>
            <a href="#services" className={`hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-400 after:transition-all ${activeSection === 'services' ? 'text-blue-400 after:w-full' : 'after:w-0 hover:after:w-full'}`}>Our Services</a>
            <a href="#tours" className={`hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-400 after:transition-all ${activeSection === 'tours' ? 'text-blue-400 after:w-full' : 'after:w-0 hover:after:w-full'}`}>Tours</a>
            <a href="#ai-planner" className={`hover:text-cyan-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-cyan-300 after:transition-all ${activeSection === 'ai-planner' ? 'text-cyan-300 after:w-full' : 'after:w-0 hover:after:w-full'}`}>AI Journey</a>
            <a href="#gallery" className={`hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-400 after:transition-all ${activeSection === 'gallery' ? 'text-blue-400 after:w-full' : 'after:w-0 hover:after:w-full'}`}>Travel Moments</a>
            <a href="#contact" className={`hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-400 after:transition-all ${activeSection === 'contact' ? 'text-blue-400 after:w-full' : 'after:w-0 hover:after:w-full'}`}>Contact</a>
          </div>

          {/* Theme Toggle & Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <a href="https://wa.link/kd1yc2" target="_blank" rel="noopener noreferrer">
              <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </a>
            <a href="https://t.me/your_telegram_username" target="_blank" rel="noopener noreferrer">
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span>Telegram</span>
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-white">
              {isOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/80 backdrop-blur-md shadow-md px-4 pb-4 space-y-3 text-white">
          <a href="#home" className="block" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#services" className="block" onClick={() => setIsOpen(false)}>Our Services</a>
          <a href="#tours" className="block" onClick={() => setIsOpen(false)}>Tours</a>
          <a href="#ai-planner" className="block text-cyan-300" onClick={() => setIsOpen(false)}>AI Journey Planner</a>
          <a href="#gallery" className="block" onClick={() => setIsOpen(false)}>Travel Moments</a>
          <a href="#contact" className="block" onClick={() => setIsOpen(false)}>Contact</a>
          <div className="flex gap-2">
            <a href="https://wa.link/kd1yc2" target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 rounded-full font-semibold shadow-lg flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </a>
            <a href="https://t.me/your_telegram_username" target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-full font-semibold shadow-lg flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span>Telegram</span>
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
