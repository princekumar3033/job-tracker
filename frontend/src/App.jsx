import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: '#b0aabf',
          backgroundColor: '#0a0914'
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(157, 78, 221, 0.1)',
            borderTopColor: 'var(--primary, #9d4edd)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1.5rem'
          }}
        ></div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#fff' }}>
          CareerPulse
        </h2>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Syncing secure workspace...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginRegister />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
