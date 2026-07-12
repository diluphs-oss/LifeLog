'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function ExpenseTracker() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ type: 'expense', category: '', amount: '', note: '' });

  const load = async () => {
    const monthStart = todayStr().slice(0, 7) + '-01';
    const { data } = await supabase.from('expenses').select('*').gte('entry_date', monthStart).order('entry_date', { ascending: false });
    setEntries(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.amount) return;
    await supabase.from('expenses').insert({ ...form, amount: Number(form.amount), entry_date: todayStr() });
    setForm({ type: 'expense', category: '', amount: '', note: '' });
    load();
  };

  const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 12px' }}>Expenses & Salary</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, width: 110 }} />
        <input type="number" step="0.01" placeholder="Amount €" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={{ ...inputStyle, width: 100 }} />
        <button onClick={add} style={btn}>Add</button>
      </div>
      <div style={{ fontSize: 14, marginBottom: 12 }}>
        This month — Income: <span style={{ color: '#8f8' }}>€{income.toFixed(2)}</span> · Expenses: <span style={{ color: '#f88' }}>€{expense.toFixed(2)}</span> · Net: €{(income - expense).toFixed(2)}
      </div>
      {entries.slice(0, 8).map((e) => (
        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #222', fontSize: 13 }}>
          <span>{e.entry_date} · {e.category || e.type}</span>
          <span style={{ color: e.type === 'income' ? '#8f8' : '#f88' }}>{e.type === 'income' ? '+' : '-'}€{Number(e.amount).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

const card = { background: '#1a1a2e', borderRadius: 12, padding: 20, marginBottom: 16 };
const inputStyle = { padding: 10, borderRadius: 8, border: '1px solid #333', background: '#0f0f1a', color: '#eee' };
const btn = { background: '#4a86e8', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' };
