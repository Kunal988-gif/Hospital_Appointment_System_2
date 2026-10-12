import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import BookAppointment from './components/BookAppointment';
import AppointmentList from './components/AppointmentList';
import { getAppointments } from './services/api';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  const [appointments, setAppointments] = useState([]);
  const [currentTab, setCurrentTab] = useState('appointments');
  const [loading, setLoading] = useState(false);

  const fetchUserAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAppointments(token);
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserAppointments();
    }
  }, [token, user]);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);

    if (userData.role === 'Admin') {
      setCurrentTab('manage');
    } else {
      setCurrentTab('appointments');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setAppointments([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <div className="app-container">
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <main className="main-content">
        {!user ? (
          <div className="auth-wrapper">
            <AuthForm onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div className="content-wrapper">
            {currentTab === 'book' && user.role === 'User' && (
              <BookAppointment
                user={user}
                token={token}
                onAppointmentCreated={() => {
                  fetchUserAppointments();
                  setCurrentTab('appointments');
                }}
              />
            )}

            {(currentTab === 'appointments' || currentTab === 'manage') && (
              <>
                {loading ? (
                  <p className="loading-text">Loading appointments...</p>
                ) : (
                  <AppointmentList
                    appointments={appointments}
                    user={user}
                    token={token}
                    onRefresh={fetchUserAppointments}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
