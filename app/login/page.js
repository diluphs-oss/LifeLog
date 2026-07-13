'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { button, card, colors, inputStyle } from '../../components/uiStyles';

const RESEND_SECONDS = 60;
const authErrorMessage = (error) => {
  const raw = typeof error === 'string' ? error : error?.message || error?.error_description || '';
  const message = typeof raw === 'string' ? raw : '';
  const lower = message.toLowerCase();

  if (lower.includes('rate limit')) {
    return 'Too many codes were requested. Wait a bit, then try again. If a recent email arrived, use that code instead of requesting another.';
  }
  if (lower.includes('smtp') || lower.includes('email')) {
    return 'Email could not be sent. Check the SMTP host, port, username, and app password in Supabase.';
  }
  if (!message || message === '{}') {
    return 'Email could not be sent. Your SMTP settings may be incomplete or rejected by the provider.';
  }
  return message;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!resendIn) return undefined;
    const timer = setTimeout(() => setResendIn((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (error) setError(authErrorMessage(error));
    else {
      setSent(true);
      setResendIn(RESEND_SECONDS);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email',
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
        <p style={{ color: colors.muted, margin: '10px 0 24px', fontSize: 14 }}>Sign in from your email and return to your personal ledger.</p>
        {sent ? (
          <form onSubmit={handleVerify}>
            <p style={{ color: colors.success, margin: '0 0 14px', fontWeight: 750 }}>Enter the 6-digit code from your email.</p>
            <input
              type="text"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{ ...inputStyle, marginBottom: 12, textAlign: 'center', fontSize: 24, letterSpacing: 6, fontWeight: 850 }}
            />
            <button type="submit" disabled={loading || code.length !== 6} style={{ ...button('primary'), width: '100%', opacity: loading || code.length !== 6 ? 0.62 : 1 }}>
              {loading ? 'Checking...' : 'Verify code'}
            </button>
            <button type="button" onClick={handleLogin} disabled={loading || resendIn > 0} style={{ ...button('quiet'), width: '100%', marginTop: 10, opacity: loading || resendIn > 0 ? 0.62 : 1 }}>
              {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
            </button>
            {error && <p style={{ color: colors.danger, margin: '10px 0 0', fontSize: 13 }}>{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...inputStyle, marginBottom: 12 }}
            />
            <button type="submit" disabled={loading} style={{ ...button('primary'), width: '100%', opacity: loading ? 0.62 : 1 }}>
              {loading ? 'Sending...' : 'Send 6-digit code'}
            </button>
            {error && <p style={{ color: colors.danger, margin: '10px 0 0', fontSize: 13 }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
