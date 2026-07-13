'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, card, cardHeader, colors, h3, inputStyle, listRow } from './uiStyles';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const load = async () => {
    const { data } = await supabase.from('todos').select('*').order('done').order('created_at', { ascending: false });
    setTodos(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    await supabase.from('todos').insert({ title });
    setTitle('');
    load();
  };

  const toggle = async (id, done) => {
    await supabase.from('todos').update({ done: !done }).eq('id', id);
    load();
  };

  const remove = async (id) => {
    await supabase.from('todos').delete().eq('id', id);
    load();
  };

  return (
    <div style={{ ...card, background: '#e6d6ff' }}>
      <div style={cardHeader}>
        <h3 style={h3}>To-Do & Reminders</h3>
        <span style={{ color: colors.muted, fontSize: 13 }}>{todos.filter((t) => !t.done).length} open</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="New task..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={add} style={button('primary')}>Add</button>
      </div>
      {todos.map((t) => (
        <div key={t.id} style={listRow}>
          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id, t.done)} style={{ accentColor: colors.accent }} />
          <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? colors.faint : colors.text }}>{t.title}</span>
          <button onClick={() => remove(t.id)} style={{ ...button('quiet'), minHeight: 32, width: 32, padding: 0, color: colors.danger }} aria-label={`Delete ${t.title}`}>×</button>
        </div>
      ))}
    </div>
  );
}
