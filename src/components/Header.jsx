import React, { useState } from 'react';
import { useCucms } from '../context/CucmsContext';
import { Bell, LogOut, Wallet, User, Menu, Coffee, Shield } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { currentUser, logout, orders } = useCucms();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return null;

  // Active notifications (Ready orders for students, Placed orders for stewards/managers)
  const activeNotifications = (() => {
    if (currentUser.role === 'student') {
      return orders.filter(o => o.studentMatric === currentUser.username && o.status === 'Ready for Pickup');
    } else if (currentUser.role === 'steward') {
      return orders.filter(o => o.cafeteria === currentUser.cafeteria && o.status === 'Placed');
    } else {
      return orders.filter(o => o.status === 'Placed').slice(0, 3);
    }
  })();

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Mobile Toggle & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onMenuClick} 
          style={{ display: 'none', color: 'var(--color-deep-navy)' }}
          className="mobile-menu-btn"
        >
          <Menu size={24} />
        </button>
        
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>CUCMS Operations</span>
          <h2 style={{ fontSize: '15px', color: 'var(--color-deep-navy)', margin: 0, fontWeight: '600' }}>
            {currentUser.cafeteria}
          </h2>
        </div>
      </div>

      {/* Right Side Widgets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Student Wallet Widget */}
        {currentUser.role === 'student' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--color-deep-navy)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '9999px',
            border: '1px solid var(--color-gold)'
          }}>
            <Wallet size={16} style={{ color: 'var(--color-gold)' }} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Balance:</span>
            <strong style={{ color: 'var(--color-gold)', fontSize: '14px' }}>
              ₦{currentUser.walletBalance?.toLocaleString()}
            </strong>
          </div>
        )}

        {/* Staff Role Badge */}
        {currentUser.role !== 'student' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(239, 159, 39, 0.1)',
            color: 'var(--color-gold)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Shield size={12} />
            {currentUser.role}
          </div>
        )}

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-warm-white)',
              color: 'var(--color-deep-navy)',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {activeNotifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-error-red)'
              }} className="animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="card animate-slide" style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '320px',
              padding: '16px',
              zIndex: 200,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', margin: 0 }}>Notifications</h3>
                <span className="metadata">{activeNotifications.length} active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {activeNotifications.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '12px 0' }}>
                    No pending alerts
                  </p>
                ) : (
                  activeNotifications.map((n, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-warm-white)',
                      borderLeft: '3px solid var(--color-gold)',
                      fontSize: '12px'
                    }}>
                      {currentUser.role === 'student' ? (
                        <p style={{ margin: 0 }}>
                          Your order <strong>{n.id}</strong> is ready for pickup!
                        </p>
                      ) : (
                        <p style={{ margin: 0 }}>
                          New order <strong>{n.id}</strong> placed in {n.cafeteria} (₦{n.total.toLocaleString()})
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown & logout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '16px',
          borderLeft: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-deep-navy)' }}>{currentUser.name}</span>
            <span className="metadata" style={{ fontSize: '11px' }}>{currentUser.username}</span>
          </div>
          <button 
            onClick={logout}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-error-red)',
              backgroundColor: 'rgba(211, 47, 47, 0.05)'
            }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
