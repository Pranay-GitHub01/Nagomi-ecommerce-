import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const initialMedia = [
  { id: 'img1', type: 'image', url: '/sample1.jpg' },
  { id: 'img2', type: 'image', url: '/sample2.jpg' },
  { id: 'vid1', type: 'video', url: '/sample1.mp4' },
];

const MediaManagement: React.FC = () => {
  const [media, setMedia] = useState(initialMedia);
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');

  const addMedia = () => {
    if (newUrl.trim()) {
      setMedia([...media, { id: `media-${Date.now()}`, type: newType, url: newUrl }]);
      setShowModal(false);
      setNewUrl('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold text-primary-700 mb-6">Media Management</h1>
      <div className="mb-6">
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Upload Media
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {media.map((item) => (
          <motion.div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            {item.type === 'image' ? (
              <img src={item.url} alt="media" className="w-full h-32 object-cover rounded mb-2" />
            ) : (
              <video src={item.url} controls className="w-full h-32 rounded mb-2" />
            )}
            <span className="text-xs text-gray-500">{item.type}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold mb-4">Upload Media</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Media Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value as 'image' | 'video')} className="w-full border rounded px-3 py-2">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Media URL</label>
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Paste image or video URL" />
              </div>
              <button onClick={addMedia} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors w-full">Add Media</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MediaManagement; 