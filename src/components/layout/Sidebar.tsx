import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  GraduationCap, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface SubMenuProps {
  title: string;
  items: { path: string; label: string }[];
  icon: React.ReactNode;
}

function SubMenu({ title, items, icon }: SubMenuProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Auto-open submenu if current route matches any item
    if (items.some(item => location.pathname === item.path)) {
      setIsOpen(true);
    }
  }, [location.pathname, items]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors',
                  isActive && 'bg-blue-50 text-blue-700 font-medium'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">GTS</h1>
        <p className="text-sm text-gray-500">Graduate Thesis System</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors',
              isActive && 'bg-blue-50 text-blue-700 font-medium'
            )
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <SubMenu
          title="Master Data"
          icon={<Building2 className="h-5 w-5" />}
          items={[
            { path: '/master-data/universities', label: 'Universities' },
            { path: '/master-data/institutes', label: 'Institutes' },
            { path: '/master-data/people', label: 'People' },
            { path: '/master-data/subject-topics', label: 'Subject Topics' },
          ]}
        />

        <SubMenu
          title="Theses"
          icon={<GraduationCap className="h-5 w-5" />}
          items={[
            { path: '/theses/new', label: 'New Submission' },
            { path: '/theses/search', label: 'Search' },
          ]}
        />
      </nav>
    </div>
  );
}

