import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useCucms } from './context/CucmsContext';
import Login from './views/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { StudentViews } from './views/StudentViews';
import { StewardViews } from './views/StewardViews';
import { ManagerViews } from './views/ManagerViews';
import { AdminViews } from './views/AdminViews';

// Route Redirector for Root path '/'
const RootRedirect = () => {
  const { currentUser } = useCucms();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const homePaths = {
    student: '/student/menu',
    steward: '/steward/queue',
    manager: '/manager/dashboard',
    admin: '/admin/dashboard'
  };

  return <Navigate to={homePaths[currentUser.role] || '/login'} replace />;
};

// Route Redirector for Login path '/login'
const LoginRedirect = () => {
  const { currentUser } = useCucms();

  if (currentUser) {
    const homePaths = {
      student: '/student/menu',
      steward: '/steward/queue',
      manager: '/manager/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={homePaths[currentUser.role] || '/login'} replace />;
  }

  return <Login />;
};

// Role Guard Component
const RoleGuard = ({ allowedRoles, children }) => {
  const { currentUser } = useCucms();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const homePaths = {
      student: '/student/menu',
      steward: '/steward/queue',
      manager: '/manager/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={homePaths[currentUser.role] || '/login'} replace />;
  }

  return children;
};

// Main Layout Wrapper
const MainLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <div className={`sidebar-wrapper ${mobileSidebarOpen ? 'open' : ''}`}>
        <Sidebar onNavClick={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Main Panel Content Area */}
      <div className="main-content">
        <Header onMenuClick={toggleMobileSidebar} />
        
        <main className="content-pane">
          {children}
        </main>
      </div>

      {/* Mobile background overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 150
          }}
          className="mobile-overlay-dimmer"
        />
      )}

      {/* Responsive layout styles helper */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 260px;
            transform: translateX(-100%);
            z-index: 210;
            transition: transform 0.3s ease;
          }
          .sidebar-wrapper.open {
            transform: translateX(0);
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Root & Login routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRedirect />} />

      {/* Student views */}
      <Route 
        path="/student/menu" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <MainLayout>
              <StudentViews subView="menu-browser" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/student/orders" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <MainLayout>
              <StudentViews subView="order-tracker" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/student/wallet" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <MainLayout>
              <StudentViews subView="prepaid-wallet" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route path="/student/*" element={<Navigate to="/student/menu" replace />} />

      {/* Steward views */}
      <Route 
        path="/steward/queue" 
        element={
          <RoleGuard allowedRoles={['steward']}>
            <MainLayout>
              <StewardViews subView="steward-queue" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/steward/history" 
        element={
          <RoleGuard allowedRoles={['steward']}>
            <MainLayout>
              <StewardViews subView="order-history" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route path="/steward/*" element={<Navigate to="/steward/queue" replace />} />

      {/* Manager views */}
      <Route 
        path="/manager/dashboard" 
        element={
          <RoleGuard allowedRoles={['manager']}>
            <MainLayout>
              <ManagerViews subView="dashboard" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/manager/menu" 
        element={
          <RoleGuard allowedRoles={['manager']}>
            <MainLayout>
              <ManagerViews subView="menu-management" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/manager/reports" 
        element={
          <RoleGuard allowedRoles={['manager']}>
            <MainLayout>
              <ManagerViews subView="reports-logs" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route path="/manager/*" element={<Navigate to="/manager/dashboard" replace />} />

      {/* Admin views */}
      <Route 
        path="/admin/dashboard" 
        element={
          <RoleGuard allowedRoles={['admin']}>
            <MainLayout>
              <ManagerViews subView="dashboard" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <RoleGuard allowedRoles={['admin']}>
            <MainLayout>
              <AdminViews subView="user-management" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <RoleGuard allowedRoles={['admin']}>
            <MainLayout>
              <ManagerViews subView="reports-logs" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <RoleGuard allowedRoles={['admin']}>
            <MainLayout>
              <AdminViews subView="settings" />
            </MainLayout>
          </RoleGuard>
        } 
      />
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Fallback wildcard redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
