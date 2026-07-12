'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 360, width: '100%' }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>LifeLog</h1>
        <p style={{ color: '#999', marginBottom: 24, fontSize: 14 }}>Sign in with a magic link — no password needed.</p>
        {sent ? (
          <p>Check your email for the login link.</p>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#1a1a2e', color: '#eee', marginBottom: 12 }}
            />
            <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#4a86e8', color: '#fff', fontWeight: 600 }}>
              Send magic link
            </button>
            {error && <p style={{ color: '#f66', marginTop: 8 }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
