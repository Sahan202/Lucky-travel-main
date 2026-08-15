import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const statuses = ['all', 'collecting', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'];
const statusStyles = {
  collecting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  contacted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  completed: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
};

const requireLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};

export default function ChatbotBookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chatbot-bookings?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        requireLogin();
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load bookings');
      setBookings(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, [status]);

  const updateStatus = async (booking, nextStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chatbot-bookings/${booking._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.status === 401 || response.status === 403) {
        requireLogin();
        return;
      }
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.message || 'Unable to update status');
      setBookings(previous => previous.map(item => item._id === booking._id ? updated : item));
      setSelected(previous => previous?._id === booking._id ? updated : previous);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const summary = useMemo(() => ({
    total: bookings.length,
    ready: bookings.filter(item => item.status === 'pending').length,
    confirmed: bookings.filter(item => item.status === 'confirmed').length,
    collecting: bookings.filter(item => item.status === 'collecting').length
  }), [bookings]);

  const formatDate = value => value ? new Date(value).toLocaleString() : '—';
  const detail = (booking, key) => booking.bookingDetails?.[key] || 'Not provided';
  const whatsapp = booking => {
    const phone = String(booking.bookingDetails?.phone || '').replace(/\D/g, '');
    return phone ? `https://wa.me/${phone.replace(/^0/, '94')}` : `https://wa.me/94741105548`;
  };

  return <div className="manager-page mx-auto max-w-7xl">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Chatbot Bookings</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Customer booking requests collected by the AI travel assistant.</p></div>
      <button onClick={loadBookings} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900">Refresh</button>
    </div>

    <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[['Visible leads', summary.total, 'text-gray-900 dark:text-white'], ['Ready to contact', summary.ready, 'text-blue-600'], ['Collecting details', summary.collecting, 'text-amber-600'], ['Confirmed', summary.confirmed, 'text-emerald-600']].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"><p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p></div>)}
    </div>

    <div className="mb-5 flex gap-2 overflow-x-auto pb-2">{statuses.map(item => <button key={item} onClick={() => setStatus(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize ${status === item ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>{item}</button>)}</div>
    {error && <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>}

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {loading ? <div className="p-12 text-center text-gray-500">Loading chatbot bookings...</div> : bookings.length === 0 ? <div className="p-12 text-center"><div className="text-4xl">💬</div><p className="mt-3 font-semibold text-gray-700 dark:text-gray-200">No chatbot bookings found</p><p className="mt-1 text-sm text-gray-500">A record appears when a visitor asks the chatbot to book.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900/50 dark:text-gray-400"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Destination / Package</th><th className="px-5 py-4">Travel</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{bookings.map(booking => <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40"><td className="px-5 py-4"><p className="font-semibold text-gray-900 dark:text-white">{detail(booking, 'name')}</p><p className="mt-1 text-xs text-gray-500">{detail(booking, 'phone')}</p></td><td className="px-5 py-4"><p className="font-medium text-gray-800 dark:text-gray-200">{booking.bookingDetails?.destination || booking.recommendedPackage?.name || booking.bookingDetails?.package || 'Not selected'}</p><p className="mt-1 text-xs text-gray-500">{booking.bookingDetails?.destination && booking.recommendedPackage?.name ? `Package: ${booking.recommendedPackage.name}` : booking.recommendedPackage?.price || ''}</p></td><td className="px-5 py-4 text-gray-600 dark:text-gray-300"><p>{detail(booking, 'travelDate')}</p><p className="mt-1 text-xs">{detail(booking, 'travellers')} travellers</p></td><td className="px-5 py-4"><select value={booking.status} onChange={event => updateStatus(booking, event.target.value)} className={`rounded-full border-0 px-3 py-2 text-xs font-semibold capitalize outline-none ${statusStyles[booking.status] || statusStyles.collecting}`}>{statuses.filter(item => item !== 'all').map(item => <option key={item} value={item}>{item}</option>)}</select></td><td className="px-5 py-4 text-xs text-gray-500">{formatDate(booking.updatedAt)}</td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => setSelected(booking)} className="rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">View</button><a href={whatsapp(booking)} target="_blank" rel="noreferrer" className="rounded-lg bg-green-500 px-3 py-2 font-medium text-white hover:bg-green-600">WhatsApp</a></div></td></tr>)}</tbody>
      </table></div>}
    </div>

    {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}><div onClick={event => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800 sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Chatbot booking</p><h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{detail(selected, 'name')}</h3></div><button onClick={() => setSelected(null)} className="rounded-full bg-gray-100 px-3 py-2 dark:bg-gray-700">✕</button></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">{[['Phone', detail(selected, 'phone')], ['Email', detail(selected, 'email')], ['Destination', detail(selected, 'destination')], ['Travel date', detail(selected, 'travelDate')], ['Travellers', detail(selected, 'travellers')], ['Package', selected.recommendedPackage?.name || detail(selected, 'package')], ['Language', selected.language]].map(([label, value]) => <div key={label} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 font-medium text-gray-900 dark:text-white">{value}</p></div>)}</div>
      <h4 className="mt-7 font-bold text-gray-900 dark:text-white">Conversation</h4><div className="mt-3 max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/50">{selected.messages?.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>{message.content}</p></div>)}</div>
      <div className="mt-6 flex flex-wrap gap-3"><a href={whatsapp(selected)} target="_blank" rel="noreferrer" className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white">Contact on WhatsApp</a><select value={selected.status} onChange={event => updateStatus(selected, event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white">{statuses.filter(item => item !== 'all').map(item => <option key={item}>{item}</option>)}</select></div>
    </div></div>}
  </div>;
}
