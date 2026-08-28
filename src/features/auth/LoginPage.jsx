import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginArt from '../../assets/images/login-art.svg';
import { useLoginMutation } from './authApi';
import './login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login({ username, password }).unwrap();
      navigate('/catalog');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__left">
        <div className="login-form">
          <div className="login-form__intro">
            <h1 className="login-form__title">Welcome Back 👋</h1>
            <p className="login-form__subtitle">
              Today is a new day. It&apos;s your day. You shape it. Sign in to start managing your projects.
            </p>
          </div>

          <form className="login-form__form" onSubmit={handleSubmit}>
            <div className="login-form__field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="e.g. emilys"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="login-form__field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && <p className="login-form__error" role="alert">{error}</p>}

            <button type="submit" className="login-form__submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>

      <div className="login-page__art">
        <img src={loginArt} alt="" className="login-page__art-image" loading="lazy" decoding="async" fetchPriority="low" />
      </div>
    </div>
  );
}