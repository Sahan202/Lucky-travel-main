import { useState } from 'react';
import logo from '../assets/image.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(`Connection error: ${error.message}. Check if backend is running at ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020817] px-4">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="relative w-full max-w-md mx-4">
        <div className="mb-6 flex items-center justify-center gap-3 sm:hidden">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-cyan-200/20 bg-white p-1 shadow-xl shadow-cyan-500/10">
            <img src={logo} alt="Lucky Travel logo" className="h-full w-full rounded-xl object-contain" />
          </div>
          <div><p className="text-lg font-bold tracking-tight text-white">Lucky Travel</p><p className="text-[9px] font-bold uppercase tracking-[.2em] text-cyan-300">Journey studio</p></div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#081321]/95 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/[0.06] bg-gradient-to-b from-cyan-400/[0.06] to-transparent p-8 text-center">
            <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-cyan-200/25 bg-white p-2 shadow-2xl shadow-cyan-500/15">
              <span className="absolute -inset-2 -z-10 rounded-[2rem] bg-cyan-300/10 blur-lg" />
              <img src={logo} alt="Lucky Travel logo" className="h-full w-full rounded-2xl object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white">Lucky Travel</h1>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">Travel management studio</p>
            <p className="mx-auto mt-4 max-w-xs text-xs leading-5 text-slate-500">Curate remarkable Sri Lankan journeys and manage every traveller enquiry.</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-4 rounded-r-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 focus:border-transparent transition"
                    placeholder="admin@luckytravel.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="hidden">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">Demo Credentials</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="font-mono text-gray-900 dark:text-white">admin@luckytravel.com</span>
                  <span className="text-gray-400">•</span>
                  <span>Authorised administrators only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
