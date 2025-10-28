import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart2, Layers, Image, Users, Settings } from 'lucide-react';

const adminNav = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  // { name: 'Abandoned Carts', to: '/admin/abandoned-carts', icon: ShoppingCart },
  // { name: 'Product Insights', to: '/admin/insights', icon: BarChart2 },
  // { name: 'Arrange Products', to: '/admin/arrange', icon: Layers },
  { name: 'Upload image', to: '/admin/uploadimg', icon: Image },
  // { name: 'User Access', to: '/admin/access', icon: Users },
  // { name: 'Analytics', to: '/admin/analytics', icon: Settings },
];

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-lg flex flex-col py-8 px-4">
        <div className="mb-10 flex items-center gap-2">
          <img src="/logo.png" alt="Nagomi Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-xl text-primary-600 tracking-wide">Nagomi Admin</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 hover:bg-primary-50 hover:text-primary-700 ${
                  isActive ? 'bg-primary-100 text-primary-700' : ''
                }`
              }
              end={item.to === '/admin'}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 