'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function PunchClock({ onChange }) {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('daily_log').select('*').eq('log_date', todayStr()).maybeSingle();
    setEntry(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const punchIn = async () => {
    const { data, error } = await supabase
      .from('daily_log')
      .upsert({ log_date: todayStr(), punch_in: new Date().toISOString() }, { onConflict: 'log_date' })
      .select()
      .single();
    if (!error) { setEntry(data); onChange?.(); }
  };

  const punchOut = async () => {
    const { data, error } = await supabase
      .from('daily_log')
      .update({ punch_out: new Date().toISOString() })
      .eq('log_date', todayStr())
      .select()
      .single();
    if (!error) { setEntry(data); onChange?.(); }
  };

  if (loading) return null;

  const fmt = (t) => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 12px' }}>Today</h3>
      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#999' }}>Punch in</div>
          <div style={{ fontSize: 20 }}>{fmt(entry?.punch_in)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#999' }}>Punch out</div>
          <div style={{ fontSize: 20 }}>{fmt(entry?.punch_out)}</div>
        </div>
      </div>
      {!entry?.punch_in && (
        <button onClick={punchIn} style={btn('#4a86e8')}>Punch In</button>
      )}
      {entry?.punch_in && !entry?.punch_out && (
        <button onClick={punchOut} style={btn('#e8734a')}>Punch Out</button>
      )}
      {entry?.punch_in && entry?.punch_out && (
        <span style={{ color: '#8f8' }}>Day logged ✓</span>
      )}
    </div>
  );
}

const card = { background: '#1a1a2e', borderRadius: 12, padding: 20, marginBottom: 16 };
const btn = (bg) => ({ background: bg, border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' });
