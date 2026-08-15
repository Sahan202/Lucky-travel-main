import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const statuses = ['all', 'collecting', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'];
const statusStyles = {
  collecting: { shell: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200', dot: 'bg-amber-500' },
  pending: { shell: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-200', dot: 'bg-blue-500' },
  contacted: { shell: 'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950/60 dark:text-violet-200', dot: 'bg-violet-500' },
  confirmed: { shell: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200', dot: 'bg-emerald-500' },
  completed: { shell: 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200', dot: 'bg-slate-500' },
  cancelled: { shell: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-200', dot: 'bg-rose-500' }
};
const statusLabels = { collecting: 'Collecting details', pending: 'Pending review', contacted: 'Customer contacted', confirmed: 'Booking confirmed', completed: 'Tour completed', cancelled: 'Booking cancelled' };

const requireLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};

function StatusDropdown({ booking, onChange, wide = false }) {
  const style = statusStyles[booking.status] || statusStyles.collecting;
  return <div className={`relative inline-flex items-center overflow-hidden rounded-xl border shadow-sm transition focus-within:ring-2 focus-within:ring-cyan-400/40 ${style.shell} ${wide ? 'min-w-[220px]' : 'min-w-[180px]'}`}><span className={`pointer-events-none absolute left-3 h-2.5 w-2.5 rounded-full ring-4 ring-white/60 dark:ring-black/20 ${style.dot}`} /><select aria-label="Booking status" value={booking.status} onChange={event => onChange(booking, event.target.value)} className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pl-8 pr-9 text-xs font-bold outline-none sm:text-sm">{statuses.filter(item => item !== 'all').map(item => <option key={item} value={item} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{statusLabels[item]}</option>)}</select><svg className="pointer-events-none absolute right-3 h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg></div>;
}

export default function ChatbotBookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
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
      setNotice('');
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
      setNotice(updated.emailNotification?.sent ? `Status updated and email sent to ${booking.bookingDetails?.email}.` : `Status updated. ${updated.emailNotification?.reason || 'No email notification was sent.'}`);
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
    {notice && <div className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-200">{notice}</div>}

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {loading ? <div className="p-12 text-center text-gray-500">Loading chatbot bookings...</div> : bookings.length === 0 ? <div className="p-12 text-center"><div className="text-4xl">💬</div><p className="mt-3 font-semibold text-gray-700 dark:text-gray-200">No chatbot bookings found</p><p className="mt-1 text-sm text-gray-500">A record appears when a visitor asks the chatbot to book.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900/50 dark:text-gray-400"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Destination / Package</th><th className="px-5 py-4">Travel</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{bookings.map(booking => <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40"><td className="px-5 py-4"><p className="font-semibold text-gray-900 dark:text-white">{detail(booking, 'name')}</p><p className="mt-1 text-xs text-gray-500">{detail(booking, 'phone')}</p></td><td className="px-5 py-4"><p className="font-medium text-gray-800 dark:text-gray-200">{booking.bookingDetails?.destination || booking.recommendedPackage?.name || booking.bookingDetails?.package || 'Not selected'}</p><p className="mt-1 text-xs text-gray-500">{booking.bookingDetails?.destination && booking.recommendedPackage?.name ? `Package: ${booking.recommendedPackage.name}` : booking.recommendedPackage?.price || ''}</p></td><td className="px-5 py-4 text-gray-600 dark:text-gray-300"><p>{detail(booking, 'travelDate')}</p><p className="mt-1 text-xs">{detail(booking, 'travellers')} travellers</p></td><td className="px-5 py-4"><StatusDropdown booking={booking} onChange={updateStatus} /></td><td className="px-5 py-4 text-xs text-gray-500">{formatDate(booking.updatedAt)}</td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => setSelected(booking)} className="rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">View</button><a href={whatsapp(booking)} target="_blank" rel="noreferrer" className="rounded-lg bg-green-500 px-3 py-2 font-medium text-white hover:bg-green-600">WhatsApp</a></div></td></tr>)}</tbody>
      </table></div>}
    </div>

    {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}><div onClick={event => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800 sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Chatbot booking</p><h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{detail(selected, 'name')}</h3></div><button onClick={() => setSelected(null)} className="rounded-full bg-gray-100 px-3 py-2 dark:bg-gray-700">✕</button></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">{[['Phone', detail(selected, 'phone')], ['Email', detail(selected, 'email')], ['Destination', detail(selected, 'destination')], ['Travel date', detail(selected, 'travelDate')], ['Travellers', detail(selected, 'travellers')], ['Package', selected.recommendedPackage?.name || detail(selected, 'package')], ['Language', selected.language]].map(([label, value]) => <div key={label} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 font-medium text-gray-900 dark:text-white">{value}</p></div>)}</div>
      <h4 className="mt-7 font-bold text-gray-900 dark:text-white">Conversation</h4><div className="mt-3 max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/50">{selected.messages?.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>{message.content}</p></div>)}</div>
      <div className="mt-6 flex flex-wrap items-center gap-3"><a href={whatsapp(selected)} target="_blank" rel="noreferrer" className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white">Contact on WhatsApp</a><StatusDropdown booking={selected} onChange={updateStatus} wide /></div>
    </div></div>}
  </div>;
}
