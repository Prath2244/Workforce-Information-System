import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'fa-home' },
  { path: '/employees', label: 'Employees', icon: 'fa-users' },
  { path: '/leaves', label: 'Leave Management', icon: 'fa-calendar' },
  { path: '/payroll', label: 'Payroll', icon: 'fa-wallet' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center">
            <i className="fas fa-shield-halved text-sm"></i>
          </div>
          <span className="font-bold text-lg"> Enterprise HRMS</span>
        </div>

        <div className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  active
                    ? 'bg-amber-50 text-amber-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="px-2 mb-2">
            <div className="font-semibold text-sm">{user?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i> Sign Out
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">{children}</main>
    </div>
  );
}