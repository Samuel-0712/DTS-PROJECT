import React, { useState } from 'react';
import { useCucms } from '../context/CucmsContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { KeyRound, Mail, School, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useCucms();
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cafeteria, setCafeteria] = useState('Cafeteria 1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const res = login(usernameOrEmail, password, cafeteria);
      setLoading(false);
      if (res.success) {
        const homePaths = {
          student: '/student/menu',
          steward: '/steward/queue',
          manager: '/manager/dashboard',
          admin: '/admin/dashboard'
        };
        navigate(homePaths[res.user.role] || '/login');
      } else {
        setError(res.message);
      }
    }, 600);
  };

  const fillCredentials = (username, pass, caf) => {
    setUsernameOrEmail(username);
    setPassword(pass);
    if (caf) setCafeteria(caf);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-warm-white)',
      padding: '20px'
    }}>
      <div className="card animate-slide" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 10px 25px -5px rgba(13, 43, 92, 0.1), 0 8px 10px -6px rgba(13, 43, 92, 0.05)',
        border: '1px solid var(--color-border)'
      }}>
        {/* Branding header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="CUCMS Logo" style={{ width: '64px', height: '64px', marginBottom: '8px' }} />
          <span className="eyebrow" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>Covenant University</span>
          <h1 style={{ fontSize: '20px', color: 'var(--color-deep-navy)', fontWeight: '600', margin: 0 }}>
            Cafeteria Management System
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Sign in to place orders, manage queues, or configure settings.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(211, 47, 47, 0.05)',
              border: '1px solid rgba(211, 47, 47, 0.2)',
              borderRadius: '6px',
              padding: '12px',
              color: 'var(--color-error-red)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Username/Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
              Matric No. / Staff ID / Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                placeholder="e.g. 21/1042 or student@stu.cu.edu.ng"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          </div>

          {/* Cafeteria Context Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
              Select Cafeteria Location
            </label>
            <div style={{ position: 'relative' }}>
              <School size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} />
              <select
                value={cafeteria}
                onChange={(e) => setCafeteria(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-text-primary)',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                <option value="Cafeteria 1">Cafeteria 1 (Selah Cafeteria)</option>
                <option value="Cafeteria 2">Cafeteria 2 (Hebron Cafeteria)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', height: '45px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Credentials Panel */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <span className="eyebrow" style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
            Quick Sandbox Login (Click to fill)
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            <button
              onClick={() => fillCredentials('student@stu.cu.edu.ng', 'password', 'Cafeteria 1')}
              style={{
                fontSize: '11px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                textAlign: 'left',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <strong style={{ color: 'var(--color-deep-navy)' }}>Student (Samuel)</strong>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '9px' }}>21/1042 · NGN 8.5k</span>
            </button>

            <button
              onClick={() => fillCredentials('steward@cu.edu.ng', 'password', 'Cafeteria 1')}
              style={{
                fontSize: '11px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                textAlign: 'left',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <strong style={{ color: 'var(--color-deep-navy)' }}>Steward (John)</strong>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '9px' }}>Staff ID: CU0123</span>
            </button>

            <button
              onClick={() => fillCredentials('manager@cu.edu.ng', 'password', 'Cafeteria 1')}
              style={{
                fontSize: '11px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                textAlign: 'left',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <strong style={{ color: 'var(--color-deep-navy)' }}>Manager (Elizabeth)</strong>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '9px' }}>Staff ID: MGR001</span>
            </button>

            <button
              onClick={() => fillCredentials('admin@cu.edu.ng', 'password', 'Cafeteria 1')}
              style={{
                fontSize: '11px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                textAlign: 'left',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <strong style={{ color: 'var(--color-deep-navy)' }}>Admin (Olumide)</strong>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '9px' }}>Staff ID: ADM001</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
