import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SectionBanner from './components/SectionBanner'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import HeroManager from './pages/HeroManager'
import ServicesManager from './pages/ServicesManager'
import PackagesManager from './pages/PackagesManager'
import GalleryManager from './pages/GalleryManager'
import TestimonialsManager from './pages/TestimonialsManager'
import SettingsManager from './pages/SettingsManager'
import ChatbotBookingsManager from './pages/ChatbotBookingsManager'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [currentPage, setCurrentPage] = useState('overview')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020817]">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} searchQuery={searchQuery} />
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            <Header onSearch={setSearchQuery} currentPage={currentPage} />
            <main className="dashboard-main flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 bg-slate-50 dark:bg-[#020817]">
              {currentPage === 'overview' && <Dashboard setCurrentPage={setCurrentPage} />}
              {currentPage !== 'overview' && <SectionBanner page={currentPage} />}
              {currentPage === 'hero' && <HeroManager />}
              {currentPage === 'services' && <ServicesManager />}
              {currentPage === 'packages' && <PackagesManager />}
              {currentPage === 'gallery' && <GalleryManager />}
              {currentPage === 'testimonials' && <TestimonialsManager />}
              {currentPage === 'chatbot-bookings' && <ChatbotBookingsManager />}
              {currentPage === 'settings' && <SettingsManager />}
            </main>
          </div>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
