import React, { useState } from 'react';
import { motion } from 'framer-motion';

const mockUsers = [
  { id: 'U001', name: 'John Doe', email: 'john@example.com', role: 'admin', featured: true },
  { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', role: 'editor', featured: false },
  { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', role: 'viewer', featured: false },
];

const UserAccessControl: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);

  const toggleRole = (id: string) => {
    setUsers(users => users.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'editor' : u.role === 'editor' ? 'viewer' : 'admin' } : u));
  };
  const toggleFeatured = (id: string) => {
    setUsers(users => users.map(u => u.id === id ? { ...u, featured: !u.featured } : u));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold text-primary-700 mb-6">User Access Control</h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">User ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Featured Content</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-primary-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{user.id}</td>
                <td className="py-3 px-4 text-gray-900">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleRole(user.id)} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors">
                    {user.role}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleFeatured(user.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.featured ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`}>
                    {user.featured ? 'Featured' : 'Set as Featured'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UserAccessControl; 