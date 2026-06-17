import React from 'react';
import { useCucms } from '../context/CucmsContext';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { 
  BookOpen, 
  Clock, 
  Wallet, 
  ListOrdered, 
  History, 
  BarChart3, 
  UtensilsCrossed, 
  FileSpreadsheet, 
  Users, 
  Settings2, 
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ onNavClick }) => {
  const { currentUser } = useCucms();

  if (!currentUser) return null;

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { path: '/student/menu', label: 'Menu Browser', icon: <BookOpen size={18} /> },
          { path: '/student/orders', label: 'Track Orders', icon: <Clock size={18} /> },
          { path: '/student/wallet', label: 'Prepaid Wallet', icon: <Wallet size={18} /> }
        ];
      case 'steward':
        return [
          { path: '/steward/queue', label: 'Steward Queue', icon: <ListOrdered size={18} /> },
          { path: '/steward/history', label: 'Order History', icon: <History size={18} /> }
        ];
      case 'manager':
        return [
          { path: '/manager/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
          { path: '/manager/menu', label: 'Menu Management', icon: <UtensilsCrossed size={18} /> },
          { path: '/manager/reports', label: 'Reports & Logs', icon: <FileSpreadsheet size={18} /> }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
          { path: '/admin/users', label: 'User Management', icon: <Users size={18} /> },
          { path: '/admin/reports', label: 'Reports & Logs', icon: <FileSpreadsheet size={18} /> },
          { path: '/admin/settings', label: 'Settings', icon: <Settings2 size={18} /> }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-sidebar-bg)',
      color: 'var(--color-sidebar-text)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 200,
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Brand Logo Header */}
      <div style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(0,0,0,0.15)'
      }}>
        <img 
          src={logo} 
          alt="CUCMS Logo" 
          style={{ width: '40px', height: '40px' }} 
        />
        <div>
          <h1 style={{
            fontSize: '18px',
            color: 'white',
            fontWeight: '600',
            lineHeight: 1.2
          }}>
            CUCMS
          </h1>
          <span style={{
            fontSize: '10px',
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.05em'
          }}>
            Cafeteria System
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{
        flex: 1,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? 'white' : 'var(--color-sidebar-text)',
                backgroundColor: isActive ? 'var(--color-covenant-blue)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                textDecoration: 'none'
              })}
              className="nav-item-btn"
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Institutional footer */}
      <div style={{
        padding: '20px',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>
        <GraduationCap size={16} style={{ margin: '0 auto 6px', display: 'block', color: 'var(--color-gold)' }} />
        <span>Covenant University</span>
        <br />
        <span>© 2026 Operations</span>
      </div>
    </aside>
  );
};

export default Sidebar;
