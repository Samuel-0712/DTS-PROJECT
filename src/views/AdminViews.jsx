import React, { useState } from 'react';
import { useCucms } from '../context/CucmsContext';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Settings2, 
  Clock, 
  ShieldCheck, 
  Save, 
  Unlock,
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const AdminViews = ({ subView }) => {
  const { 
    users, 
    systemConfig, 
    setSystemConfig, 
    addStaffOrUser, 
    deleteUser 
  } = useCucms();

  // User management states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('password');
  const [newRole, setNewRole] = useState('steward');
  const [newCafeteria, setNewCafeteria] = useState('Cafeteria 1');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Settings config states
  const [hoursStart, setHoursStart] = useState(systemConfig.activeHoursStart);
  const [hoursEnd, setHoursEnd] = useState(systemConfig.activeHoursEnd);
  const [capacity, setCapacity] = useState(systemConfig.maxQueueCapacity);
  const [cashEnabled, setCashEnabled] = useState(systemConfig.cashEnabled);
  const [posEnabled, setPosEnabled] = useState(systemConfig.posEnabled);
  const [bankEnabled, setBankEnabled] = useState(systemConfig.bankTransferEnabled);
  const [walletEnabled, setWalletEnabled] = useState(systemConfig.prepaidWalletEnabled);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const handleAddUser = (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess(false);

    if (!newUsername || !newName || !newEmail) {
      setAddError('All fields are required.');
      return;
    }

    const res = addStaffOrUser({
      username: newUsername,
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      cafeteria: newRole === 'student' ? 'Cafeteria 1' : newCafeteria
    });

    if (res.success) {
      setAddSuccess(true);
      setNewUsername('');
      setNewName('');
      setNewEmail('');
      setNewPassword('password');
      setTimeout(() => setAddSuccess(false), 3000);
    } else {
      setAddError(res.message);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSystemConfig({
      ...systemConfig,
      activeHoursStart: hoursStart,
      activeHoursEnd: hoursEnd,
      maxQueueCapacity: parseInt(capacity) || 50,
      cashEnabled,
      posEnabled,
      bankTransferEnabled: bankEnabled,
      prepaidWalletEnabled: walletEnabled
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  if (subView === 'user-management') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Security Desk</span>
            <h1>User & Staff Management</h1>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            <UserPlus size={16} />
            <span>Register New User</span>
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="card animate-slide">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Register Account</h3>
            
            {addError && (
              <div style={{
                color: 'var(--color-error-red)', backgroundColor: 'rgba(211,47,47,0.05)',
                padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px'
              }}>
                {addError}
              </div>
            )}

            {addSuccess && (
              <div style={{
                color: 'var(--color-teal-success)', backgroundColor: 'rgba(29,158,117,0.05)',
                padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px'
              }}>
                User registered successfully!
              </div>
            )}

            <form onSubmit={handleAddUser} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'end'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Matric Number / Staff ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. 21/1042 or CU0123"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. name@cu.edu.ng"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>System Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'white' }}
                >
                  <option value="student">Student</option>
                  <option value="steward">Steward / Staff</option>
                  <option value="manager">Cafeteria Manager</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {newRole !== 'student' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px' }}>Assigned Cafeteria</label>
                  <select 
                    value={newCafeteria}
                    onChange={(e) => setNewCafeteria(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'white' }}
                  >
                    <option value="Cafeteria 1">Cafeteria 1</option>
                    <option value="Cafeteria 2">Cafeteria 2</option>
                    <option value="Both">Both Cafeterias</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Register</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* User database table */}
        <div className="card">
          <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Registered System Accounts</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '12px 6px' }}>Matric/ID</th>
                  <th style={{ padding: '12px 6px' }}>Name</th>
                  <th style={{ padding: '12px 6px' }}>Email</th>
                  <th style={{ padding: '12px 6px' }}>Role</th>
                  <th style={{ padding: '12px 6px' }}>Location</th>
                  <th style={{ padding: '12px 6px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 6px', fontWeight: '500' }}>{user.username}</td>
                    <td style={{ padding: '12px 6px' }}>{user.name}</td>
                    <td style={{ padding: '12px 6px', color: 'var(--color-text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '12px 6px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px',
                        backgroundColor: user.role === 'admin' ? 'rgba(13,43,92,0.1)' : (user.role === 'manager' ? 'rgba(239,159,39,0.1)' : 'rgba(24,95,165,0.1)'),
                        color: user.role === 'admin' ? 'var(--color-deep-navy)' : (user.role === 'manager' ? 'var(--color-gold)' : 'var(--color-covenant-blue)')
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 6px', color: 'var(--color-text-secondary)' }}>{user.cafeteria}</td>
                    <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                      {user.id !== 'u4' && ( // Don't delete master admin
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete account for ${user.name}?`)) {
                              deleteUser(user.id);
                            }
                          }} 
                          style={{ color: 'var(--color-error-red)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (subView === 'settings') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Configuration Panel</span>
          <h1>Global System Settings</h1>
        </div>

        {settingsSuccess && (
          <div style={{
            color: 'var(--color-teal-success)', backgroundColor: 'rgba(29,158,117,0.05)',
            padding: '8px 12px', borderRadius: '6px', fontSize: '12px', border: '1px solid rgba(29, 158, 117, 0.2)'
          }}>
            Settings updated successfully! Changes applied globally.
          </div>
        )}

        <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Active Hours and Capacity Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              <span>Cafeteria Operating Schedule</span>
            </h3>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Start Time</label>
                <input 
                  type="time" 
                  value={hoursStart}
                  onChange={(e) => setHoursStart(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'white' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>End Time</label>
                <input 
                  type="time" 
                  value={hoursEnd}
                  onChange={(e) => setHoursEnd(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'white' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <label style={{ fontSize: '12px' }}>Maximum Queue Capacity Limit</label>
              <input 
                type="number" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
              />
              <span className="metadata" style={{ fontSize: '11px' }}>
                Prevents students from placing orders if the kitchen queue exceeds this value.
              </span>
            </div>
          </div>

          {/* Payment Settings Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} />
              <span>Available Payment Channels</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>Prepaid Wallet Integration</strong>
                  <span className="metadata" style={{ fontSize: '11px' }}>Deduct balance directly from student CUCMS account</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setWalletEnabled(!walletEnabled)}
                  style={{ color: walletEnabled ? 'var(--color-covenant-blue)' : 'var(--color-text-secondary)' }}
                >
                  {walletEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>Bank Transfer</strong>
                  <span className="metadata" style={{ fontSize: '11px' }}>Students upload proof of transfer slips online</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setBankEnabled(!bankEnabled)}
                  style={{ color: bankEnabled ? 'var(--color-covenant-blue)' : 'var(--color-text-secondary)' }}
                >
                  {bankEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>POS / Card Terminal</strong>
                  <span className="metadata" style={{ fontSize: '11px' }}>Process cards physically at pickup counters</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setPosEnabled(!posEnabled)}
                  style={{ color: posEnabled ? 'var(--color-covenant-blue)' : 'var(--color-text-secondary)' }}
                >
                  {posEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>Cash Handling</strong>
                  <span className="metadata" style={{ fontSize: '11px' }}>Cash deposits processed at ticket desks</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setCashEnabled(!cashEnabled)}
                  style={{ color: cashEnabled ? 'var(--color-covenant-blue)' : 'var(--color-text-secondary)' }}
                >
                  {cashEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              <Save size={16} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
};
