'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { button, card, colors, inputStyle } from '../../components/uiStyles';

const authErrorMessage = (error) => {
  const raw = typeof error === 'string' ? error : error?.message || error?.error_description || '';
  const message = typeof raw === 'string' ? raw : '';
  const lower = message.toLowerCase();

  if (lower.includes('invalid login')) {
    return 'That email or password is not right. Check the password saved in Supabase.';
  }
  if (!message) {
    return 'Sign in failed. Check your email and password.';
  }
  return message;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(authErrorMessage(error));
    else window.location.href = '/dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ ...card, maxWidth: 390, width: '100%', marginBottom: 0 }}>
        <p style={{ margin: '0 0 5px', color: colors.accent, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>Private access</p>
        <h1 style={{ fontSize: 34, lineHeight: 1, margin: 0, fontWeight: 850 }}>LifeLog</h1>
        <p style={{ color: colors.muted, margin: '10px 0 24px', fontSize: 14 }}>Sign in with your private password and return to your personal ledger.</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <button type="submit" disabled={loading} style={{ ...button('primary'), width: '100%', opacity: loading ? 0.62 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <p style={{ color: colors.danger, margin: '10px 0 0', fontSize: 13 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
