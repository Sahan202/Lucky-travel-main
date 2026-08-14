const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';  
import { useState, useEffect } from 'react';

// Beautiful Success Message Component
const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-400/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">{message}</p>
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div className="bg-white h-1 rounded-full animate-progress"></div>
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await fetch(`${API_URL}/api/gallery`);
    const data = await res.json();
    setGallery(data);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
        setSelectedFile(null);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/gallery`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url: imageUrl })
    });
    setImageUrl('');
    fetchGallery();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this image?')) {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/gallery/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchGallery();
    }
  };

  return (
    <div className="manager-page space-y-4 sm:space-y-6">
      {showSuccess && (
        <SuccessMessage 
          message="🎉 Background image uploaded successfully!" 
          onClose={() => setShowSuccess(false)} 
        />
      )}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Gallery Manager</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Upload Image</label>
            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600"
                required
              />
              <button 
                type="submit" 
                disabled={uploading}
                className="bg-gray-900 dark:bg-gray-700 text-white px-4 sm:px-6 py-2.5 sm:py-2 text-base rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image URL</label>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 text-base"
                placeholder="Image URL"
                required
              />
              <button type="submit" className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2.5 sm:py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {gallery.map(img => (
          <div key={img._id} className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
            <img src={img.url} alt="Gallery" className="w-full h-40 sm:h-48 object-cover" />
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-2 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition font-semibold shadow-lg flex items-center gap-1 text-xs sm:text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
