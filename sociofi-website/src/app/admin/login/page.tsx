'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #0C0C1D;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .login-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(58,88,158,0.18) 0%, transparent 70%);
    top: -100px; left: -100px;
  }
  .login-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(89,163,146,0.12) 0%, transparent 70%);
    bottom: -50px; right: -80px;
  }

  .login-card {
    position: relative;
    width: 100%;
    max-width: 400px;
    background: rgba(17,17,40,0.8);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 24px;
    padding: 40px;
    backdrop-filter: blur(16px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.4);
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-logo {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }

  .login-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 24px;
    color: #E2E8F0;
    letter-spacing: -0.025em;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 13px;
    color: #6B7B9E;
    line-height: 1.5;
  }

  .login-form { display: flex; flex-direction: column; gap: 16px; }

  .login-field { display: flex; flex-direction: column; gap: 6px; }

  .login-label {
    font-size: 12px;
    font-weight: 600;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Manrope', sans-serif;
  }

  .login-input-wrap { position: relative; }

  .login-input {
    width: 100%;
    height: 48px;
    background: rgba(12,12,29,0.7);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 12px;
    padding: 0 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #E2E8F0;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-input::placeholder { color: #4A5578; }
  .login-input:focus {
    border-color: rgba(58,88,158,0.5);
    box-shadow: 0 0 0 3px rgba(58,88,158,0.15);
  }
  .login-input.has-toggle { padding-right: 44px; }

  .login-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #4A5578; display: flex; align-items: center;
    transition: color 0.2s;
  }
  .login-toggle:hover { color: #94A3B8; }

  .login-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: #FCA5A5;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .login-btn {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #3A589E, #4A6CB8);
    border: none;
    border-radius: 12px;
    color: white;
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: -0.01em;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 24px rgba(58,88,158,0.35);
    margin-top: 4px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(58,88,158,0.5);
  }
  .login-btn:active:not(:disabled) { transform: translateY(0); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .login-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .login-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 12px;
    color: #4A5578;
    line-height: 1.6;
  }
  .login-footer a {
    color: #6B7B9E;
    text-decoration: none;
    transition: color 0.2s;
  }
  .login-footer a:hover { color: #94A3B8; }
`;

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message || 'Sign-in failed. Check your credentials.');
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="login-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="login-orb login-orb-1" aria-hidden="true" />
      <div className="login-orb login-orb-2" aria-hidden="true" />

      <div className="login-card" role="main">
        <div className="login-header">
          <div className="login-logo" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 8l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 14l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="login-title">SocioFi Admin</h1>
          <p className="login-subtitle">
            Internal operations panel<br />Authorized access only
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email" className="login-label">Email address</label>
            <div className="login-input-wrap">
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="you@sociofitechnology.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <div className="login-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input has-toggle"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          Forgot your password?{' '}
          <a href="mailto:hello@sociofitechnology.com">Contact the team</a>
        </div>
      </div>
    </div>
  );
}
