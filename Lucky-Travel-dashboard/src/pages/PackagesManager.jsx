import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PackagesManager() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', duration: '', places: '', price: '', image: '', backgroundImage: '', itinerary: '', accommodation: '', transportation: '', included: '', excluded: '' });
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch(`${API_URL}/api/packages`);
    const data = await res.json();
    setPackages(data);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setForm(prev => ({...prev, image: data.url}));
        alert('Main image uploaded successfully!');
      } else {
        console.error('Upload response:', data);
        alert(`Upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setForm(prev => ({...prev, backgroundImage: data.url}));
        alert('Background image uploaded successfully!');
      } else {
        console.error('Upload response:', data);
        alert(`Upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editing ? `${API_URL}/api/packages/${editing}` : `${API_URL}/api/packages`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ name: '', description: '', duration: '', places: '', price: '', image: '', backgroundImage: '', itinerary: '', accommodation: '', transportation: '', included: '', excluded: '' });
    setEditing(null);
    fetchPackages();
  };

  const handleEdit = (pkg) => {
    setForm({
      name: pkg.name || '',
      description: pkg.description || '',
      duration: pkg.duration || '',
      places: pkg.places || '',
      price: pkg.price || '',
      image: pkg.image || '',
      backgroundImage: pkg.backgroundImage || '',
      itinerary: pkg.itinerary || '',
      accommodation: pkg.accommodation || '',
      transportation: pkg.transportation || '',
      included: pkg.included || '',
      excluded: pkg.excluded || ''
    });
    setEditing(pkg._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/packages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchPackages();
  };

  return (
    <div className="manager-page space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Tour Packages Manager</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Package Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="4" required />
          <input type="text" placeholder="Duration" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <input type="text" placeholder="Places" value={form.places} onChange={(e) => setForm({...form, places: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <input type="text" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" required />
          <textarea placeholder="Itinerary (Day by day plan)" value={form.itinerary} onChange={(e) => setForm({...form, itinerary: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="4" />
          <textarea placeholder="Accommodation" value={form.accommodation} onChange={(e) => setForm({...form, accommodation: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="2" />
          <textarea placeholder="Transportation" value={form.transportation} onChange={(e) => setForm({...form, transportation: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="2" />
          <textarea placeholder="Included (comma separated)" value={form.included} onChange={(e) => setForm({...form, included: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="2" />
          <textarea placeholder="Excluded (comma separated)" value={form.excluded} onChange={(e) => setForm({...form, excluded: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" rows="2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Main Image (Card Image)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading} 
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" 
              />
              {uploading && <p className="text-sm text-blue-600 mt-2">Uploading main image...</p>}
              {form.image && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">✓ Main image uploaded</p>
                  <img src={form.image} alt="Main preview" className="w-24 h-24 object-cover rounded mt-1" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Background Image (Detail Page)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleBackgroundImageUpload} 
                disabled={uploading} 
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base" 
              />
              {uploading && <p className="text-sm text-blue-600 mt-2">Uploading background image...</p>}
              {form.backgroundImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">✓ Background image uploaded</p>
                  <img src={form.backgroundImage} alt="Background preview" className="w-24 h-24 object-cover rounded mt-1" />
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 font-medium">{editing ? 'Update' : 'Add'} Package</button>
        </form>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {packages.map(pkg => (
          <div key={pkg._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {pkg.image && (
                <img src={pkg.image} alt={pkg.name} className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">{pkg.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Duration:</span> {pkg.duration} | 
                  <span className="font-semibold"> Places:</span> {pkg.places} | 
                  <span className="font-semibold"> Price:</span> {pkg.price}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button onClick={() => handleEdit(pkg)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition font-medium">Edit</button>
                  <button onClick={() => handleDelete(pkg._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
