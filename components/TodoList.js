'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    <div style={card}>
      <h3 style={{ margin: '0 0 12px' }}>To-Do & Reminders</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="New task..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={add} style={btn}>Add</button>
      </div>
      {todos.map((t) => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #222' }}>
          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id, t.done)} />
          <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#666' : '#eee' }}>{t.title}</span>
          <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: '#f66', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
    </div>
  );
}

const card = { background: '#1a1a2e', borderRadius: 12, padding: 20, marginBottom: 16 };
const inputStyle = { padding: 10, borderRadius: 8, border: '1px solid #333', background: '#0f0f1a', color: '#eee' };
const btn = { background: '#4a86e8', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' };
