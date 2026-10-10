import { NavLink } from 'react-router-dom';
import { Target, LayoutDashboard, PenTool, BarChart3, RotateCcw, History } from 'lucide-react';

export default function TopNavigation() {
  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/practice', label: 'Practice', icon: PenTool },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/revisions', label: 'Revisions', icon: RotateCcw },
    { path: '/history', label: 'History', icon: History }
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/" className="brand-section">
          <div className="brand-icon">
            <Target size={20} />
          </div>
          <div>
            <div className="brand-title">Prep OS</div>
            <div className="brand-subtitle">DSA Practice Intelligence</div>
          </div>
        </NavLink>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
