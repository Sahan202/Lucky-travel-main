import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TestimonialsManager() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5, image: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await fetch(`${API_URL}/api/reviews`);
    const data = await res.json();
    setReviews(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editing ? `${API_URL}/api/reviews/${editing}` : `${API_URL}/api/reviews`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ name: '', role: '', text: '', rating: 5, image: '' });
    setEditing(null);
    fetchReviews();
  };

  const handleEdit = (review) => {
    setForm(review);
    setEditing(review._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/reviews/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchReviews();
  };

  return (
    <div className="manager-page space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Testimonials Manager</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <input type="text" placeholder="Role" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <textarea placeholder="Review Text" value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="4" required />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rating</label>
            <select value={form.rating} onChange={(e) => setForm({...form, rating: parseInt(e.target.value)})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 font-medium">{editing ? 'Update' : 'Add'} Review</button>
        </form>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {reviews.map(review => (
          <div key={review._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <div className="flex gap-3 sm:gap-4">
              {review.image ? (
                <img src={review.image} alt={review.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0">
                  {review.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{review.name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{review.role}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2 italic text-sm sm:text-base">"{review.text}"</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button onClick={() => handleEdit(review)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition font-medium">Edit</button>
                  <button onClick={() => handleDelete(review._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
