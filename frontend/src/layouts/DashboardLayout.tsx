import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Factory, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Productions', path: '/production', icon: Factory },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-30 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-20 lg:w-64'}
        `}
      >
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 text-purple-900">
          <div className="flex items-center gap-3">
            <Factory className="w-8 h-8 shrink-0" />
            <h1 className={`font-bold text-xl tracking-tight leading-tight ${!isMobileMenuOpen ? 'md:hidden lg:block' : ''}`}>
              Shree Radha<br/><span className="text-sm font-medium text-purple-600">Studio ERP</span>
            </h1>
          </div>
          {/* Close button for mobile inside sidebar */}
          <button className="md:hidden text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg" onClick={closeMenu}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith('/production') && item.path === '/production');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={item.name}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-700' : 'text-gray-500 group-hover:text-gray-900'}`} />
                <span className={`whitespace-nowrap ${!isMobileMenuOpen ? 'md:hidden lg:block' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button 
            className="flex items-center gap-3 px-3 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 w-full rounded-xl transition-colors group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-600" />
            <span className={`whitespace-nowrap ${!isMobileMenuOpen ? 'md:hidden lg:block' : ''}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50 relative flex flex-col min-w-0">
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 min-h-[64px] h-16 flex flex-shrink-0 items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight truncate">
              Production Control
            </h2>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200 shadow-sm text-sm">
              PM
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
