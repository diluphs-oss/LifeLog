'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function DailyLogForm() {
  const [form, setForm] = useState({ tasks: '', ideas: '', meals: '', notes: '', woke_up_at: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('daily_log').select('*').eq('log_date', todayStr()).maybeSingle();
      if (data) {
        setForm({
          tasks: data.tasks || '',
          ideas: data.ideas || '',
          meals: data.meals || '',
          notes: data.notes || '',
          woke_up_at: data.woke_up_at || '',
        });
      }
    })();
  }, []);

  const save = async () => {
    await supabase.from('daily_log').upsert(
      { log_date: todayStr(), ...form },
      { onConflict: 'log_date' }
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const field = (key, label, placeholder, textarea = true) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: '#999', display: 'block', marginBottom: 4 }}>{label}</label>
      {textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          rows={2}
          style={inputStyle}
        />
      ) : (
        <input
          type="time"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={inputStyle}
        />
      )}
    </div>
  );

  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 12px' }}>Daily Log</h3>
      {field('woke_up_at', 'Woke up at', '', false)}
      {field('tasks', 'Tasks done today', 'One per line...')}
      {field('ideas', 'New ideas', 'One per line...')}
      {field('meals', 'Meals / what I ate', 'Breakfast, lunch, dinner...')}
      {field('notes', 'Notes', 'Anything else...')}
      <button onClick={save} style={btn}>Save</button>
      {saved && <span style={{ marginLeft: 12, color: '#8f8' }}>Saved ✓</span>}
    </div>
  );
}

const card = { background: '#1a1a2e', borderRadius: 12, padding: 20, marginBottom: 16 };
const inputStyle = { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#0f0f1a', color: '#eee', boxSizing: 'border-box', fontFamily: 'inherit' };
const btn = { background: '#4a86e8', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' };
