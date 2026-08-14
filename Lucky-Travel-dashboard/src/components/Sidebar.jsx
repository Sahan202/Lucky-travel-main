import { useState, useEffect } from 'react';
import logo from '../assets/image.png';

export default function Sidebar({ currentPage, setCurrentPage, searchQuery }) {
  const [user, setUser] = useState({ username: 'Admin', email: 'admin@luckytravel.com' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    },
    { 
      id: 'hero', 
      label: 'Hero Section', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'packages', 
      label: 'Tour Packages', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'testimonials', 
      label: 'Testimonials', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    },
    {
      id: 'chatbot-bookings',
      label: 'Chatbot Bookings',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.82L3 20l1.35-3.6A7.39 7.39 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
      isLogout: true
    },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-cyan-400 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-3/4 sm:w-80 lg:w-72 bg-[#07111f] border-r border-cyan-400/10 flex flex-col h-screen transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo */}
      <div className="p-5 sm:p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-cyan-300/30 shadow-lg shadow-cyan-500/10">
            <img src={logo} alt="Lucky Travel" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-white">Lucky Travel</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Admin studio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
        <div className="space-y-1">
          {filteredMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.isLogout) {
                  handleLogout();
                } else {
                  setCurrentPage(item.id);
                  setIsMobileMenuOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                item.isLogout
                  ? 'text-rose-300 hover:bg-rose-500/10'
                  : currentPage === item.id 
                  ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/15' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="px-4 pb-3">
        <a href={import.meta.env.VITE_SITE_URL || 'http://localhost:5173'} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-gradient-to-r from-cyan-300/[0.08] to-teal-300/[0.03] px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.12]">
          <span className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/10">◉</span><span><span className="block text-xs">View website</span><span className="block text-[10px] font-normal text-slate-500">Open public site</span></span></span><span className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </a>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-300 to-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-sm flex-shrink-0">
              {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email || 'admin@luckytravel.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
