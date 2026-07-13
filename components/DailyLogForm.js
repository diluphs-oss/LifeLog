'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, card, cardHeader, colors, h3, inputStyle, label as labelStyle } from './uiStyles';

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
      <label style={labelStyle}>{label}</label>
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
      <div style={cardHeader}>
        <h3 style={h3}>Daily Log</h3>
        {saved && <span style={{ color: colors.success, fontSize: 13, fontWeight: 750 }}>Saved</span>}
      </div>
      {field('woke_up_at', 'Woke up at', '', false)}
      {field('tasks', 'Tasks done today', 'One per line...')}
      {field('ideas', 'New ideas', 'One per line...')}
      {field('meals', 'Meals / what I ate', 'Breakfast, lunch, dinner...')}
      {field('notes', 'Notes', 'Anything else...')}
      <button onClick={save} style={{ ...button('primary'), width: '100%' }}>Save daily log</button>
    </div>
  );
}
