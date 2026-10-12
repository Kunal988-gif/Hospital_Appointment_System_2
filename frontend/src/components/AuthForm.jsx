import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function AuthForm({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser({ name, email, password, role });
        if (res.user) {
          const loginRes = await loginUser({ email, password });
          if (loginRes.token) {
            onLoginSuccess(loginRes.user, loginRes.token);
          } else {
            setIsRegister(false);
            setError('Registration successful! Please login.');
          }
        } else {
          setError(res.message || 'Registration failed');
        }
      } else {
        const res = await loginUser({ email, password });
        if (res.token) {
          onLoginSuccess(res.user, res.token);
        } else {
          setError(res.message || 'Login failed');
        }
      }
    } catch (err) {
      setError('Network error. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h3>{isRegister ? 'Register' : 'Login'}</h3>

      {error && <div className="alert-box error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        {isRegister && (
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {isRegister && (
          <div className="form-group">
            <label>Account Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="auth-toggle">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <button className="link-btn" onClick={() => setIsRegister(false)}>
              Login here
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button className="link-btn" onClick={() => setIsRegister(true)}>
              Register here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
