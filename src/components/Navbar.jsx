import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', shortLabel: 'Overview', icon: '▦', end: true },
  { to: '/check-in', label: 'Stress Check', shortLabel: 'Assessment', icon: '◉' },
  { to: '/companion', label: 'AI Companion', shortLabel: 'Companion', icon: '✧' },
  { to: '/trends', label: 'Daily Trends', shortLabel: 'Trends', icon: '⌁' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeLink = links.find((link) => link.to === pathname) || links[0];

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      <aside className="sidebar">
        <NavLink className="brand sidebar-brand" to="/dashboard" aria-label="StressIQ dashboard">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>Stress <em>IQ</em></span>
        </NavLink>
        <span className="sidebar-caption">WORKSPACE</span>
        <nav className="sidebar-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <span className="sidebar-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="restorative-card">
          <span className="status-dot" />
          <div><strong>Restorative status</strong><small>Take a moment for yourself.</small></div>
        </div>
        <div className="sidebar-profile">
          <span className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          <div className="profile-details"><strong>{user?.name}</strong><button className="btn-link" onClick={handleLogout}>Log out</button></div>
          <button className="logout-icon" onClick={handleLogout} aria-label="Log out">↗</button>
        </div>
      </aside>
      <header className="topbar">
        <nav className="topbar-links" aria-label="Page navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>{link.shortLabel}</NavLink>
          ))}
        </nav>
        <div className="topbar-greeting"><span className="status-dot" />Good to see you, {user?.name}</div>
      </header>
    </>
  );
}
