'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, card, cardHeader, colors, eyebrow, h3, metric } from './uiStyles';

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
    <div style={{ ...card, background: '#dfffcf' }}>
      <div style={cardHeader}>
        <div>
          <p style={eyebrow}>Clock</p>
          <h3 style={h3}>Today</h3>
        </div>
        {entry?.punch_in && entry?.punch_out && (
          <span style={{ color: colors.success, fontSize: 13, fontWeight: 750 }}>Day logged</span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 14 }}>
        <div style={metric}>
          <div style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Punch in</div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>{fmt(entry?.punch_in)}</div>
        </div>
        <div style={metric}>
          <div style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Punch out</div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>{fmt(entry?.punch_out)}</div>
        </div>
      </div>
      {!entry?.punch_in && (
        <button onClick={punchIn} style={button('teal')}>Punch in</button>
      )}
      {entry?.punch_in && !entry?.punch_out && (
        <button onClick={punchOut} style={button('danger')}>Punch out</button>
      )}
    </div>
  );
}
