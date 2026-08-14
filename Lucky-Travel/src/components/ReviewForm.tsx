import { useState } from 'react';

export default function ReviewForm() {
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for your review! It will be visible after approval.');
        setForm({ name: '', role: '', text: '', rating: 5 });
      } else {
        setMessage(data.message || 'Failed to submit review');
      }
    } catch (error) {
      setMessage('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="review" className="relative overflow-hidden bg-slate-950 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.16),transparent_42%)]" />
      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">Share Your Experience</h3>
          <p className="text-sm text-slate-300">We value your feedback</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur min-h-[400px] flex items-center justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center"
                placeholder="Your Name *"
                required
              />
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center"
                placeholder="Your Role (Optional)"
              />
            </div>

            <textarea
              value={form.text}
              onChange={(e) => setForm({...form, text: e.target.value})}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center"
              rows={5}
              placeholder="Share your experience... *"
              required
            />

            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({...form, rating: star})}
                      className="text-xl transition-transform hover:scale-110"
                    >
                      <span className={star <= form.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg hover:shadow-xl"
              >
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm text-center ${
                message.includes('Thank you') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
