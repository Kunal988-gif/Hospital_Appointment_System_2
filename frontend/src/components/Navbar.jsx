import React from 'react';

export default function Navbar({ user, onLogout, currentTab, setCurrentTab }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h2>Hospital Appointment System</h2>
      </div>

      {user && (
        <div className="navbar-menu">
          <div className="navbar-tabs">
            {user.role === 'User' && (
              <>
                <button
                  className={`tab-btn ${currentTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('appointments')}
                >
                  My Appointments
                </button>
                <button
                  className={`tab-btn ${currentTab === 'book' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('book')}
                >
                  Book Appointment
                </button>
              </>
            )}

            {user.role === 'Admin' && (
              <button
                className={`tab-btn ${currentTab === 'manage' ? 'active' : ''}`}
                onClick={() => setCurrentTab('manage')}
              >
                Manage All Appointments
              </button>
            )}
          </div>

          <div className="navbar-user">
            <span className="user-info">
              {user.name} <span className="user-role-badge">{user.role}</span>
            </span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
