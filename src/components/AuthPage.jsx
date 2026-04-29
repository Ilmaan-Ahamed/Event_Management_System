import React, { useState } from 'react';
import styles from '../styles/AuthPage.module.css';

const AuthPage = ({
  authMode,
  setAuthMode,
  onLogin,
  onSignUp,
  authError,
  theme,
  toggleTheme,
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (authMode === 'login') {
      onLogin({ email: formState.email.trim(), password: formState.password });
    } else {
      onSignUp({
        name: formState.name.trim(),
        email: formState.email.trim(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
      });
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div>
            <h1>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p>
              {authMode === 'login'
                ? 'Sign in to manage your events with Eventora.'
                : 'Sign up to start creating and tracking your events.'}
            </p>
            {authMode === 'login' && (
              <p className={styles.demoHint}>
                Demo: demo@example.com / demo1234
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {authMode === 'signup' && (
            <label className={styles.field} htmlFor="name">
              Full Name
              <input
                id="name"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className={styles.input}
              />
            </label>
          )}

          <label className={styles.field} htmlFor="email">
            Email address
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={styles.input}
            />
          </label>

          <label className={styles.field} htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
              required
              className={styles.input}
            />
          </label>

          {authMode === 'signup' && (
            <label className={styles.field} htmlFor="confirmPassword">
              Confirm password
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className={styles.input}
              />
            </label>
          )}

          {authError && <p className={styles.error}>{authError}</p>}

          <button type="submit" className={styles.submitButton}>
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.switchBox}>
          <span>
            {authMode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
          </span>
          <button
            type="button"
            className={styles.switchButton}
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
            }}
          >
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
