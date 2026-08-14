import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function HeroManager() {
  const [hero, setHero] = useState({ title: '', subtitle: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hero`);
      const data = await res.json();
      setHero(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(hero)
      });
      alert('Hero section updated!');
    } catch (error) {
      alert('Error updating hero section');
    }
    setLoading(false);
  };

  return (
    <div className="manager-page bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Hero Section Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" value={hero.title} onChange={(e) => setHero({...hero, title: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 text-base" placeholder="Luxury Travel Experiences" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subtitle</label>
          <input type="text" value={hero.subtitle} onChange={(e) => setHero({...hero, subtitle: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 text-base" placeholder="Across Sri Lanka" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
          <textarea value={hero.description} onChange={(e) => setHero({...hero, description: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 text-base" rows="4" placeholder="Premium tours, private transfers..." />
        </div>
        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors font-medium">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
