import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', details: [''] });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch(`${API_URL}/api/services`);
    const data = await res.json();
    setServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editing ? `${API_URL}/api/services/${editing}` : `${API_URL}/api/services`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ title: '', description: '', details: [''] });
    setEditing(null);
    fetchServices();
  };

  const handleEdit = (service) => {
    setForm(service);
    setEditing(service._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchServices();
  };

  return (
    <div className="manager-page space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Services Manager</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Service Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="4" required />
          <button type="submit" className="w-full sm:w-auto bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 font-medium">{editing ? 'Update' : 'Add'} Service</button>
        </form>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {services.map(service => (
          <div key={service._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">{service.description}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button onClick={() => handleEdit(service)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition font-medium">Edit</button>
              <button onClick={() => handleDelete(service._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
