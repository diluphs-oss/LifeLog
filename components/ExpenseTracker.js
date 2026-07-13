'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, card, cardHeader, colors, h3, inputStyle, listRow, metric } from './uiStyles';

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
      <div style={cardHeader}>
        <h3 style={h3}>Expenses & Salary</h3>
        <span style={{ color: income - expense >= 0 ? colors.success : colors.danger, fontSize: 13, fontWeight: 800 }}>
          Net €{(income - expense).toFixed(2)}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 8, marginBottom: 12 }}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        <input type="number" step="0.01" placeholder="Amount €" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
        <button onClick={add} style={button('primary')}>Add</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 10 }}>
        <div style={metric}>
          <div style={{ fontSize: 12, color: colors.muted }}>Income</div>
          <div style={{ color: colors.success, fontSize: 22, fontWeight: 850 }}>€{income.toFixed(2)}</div>
        </div>
        <div style={metric}>
          <div style={{ fontSize: 12, color: colors.muted }}>Expenses</div>
          <div style={{ color: colors.danger, fontSize: 22, fontWeight: 850 }}>€{expense.toFixed(2)}</div>
        </div>
      </div>
      {entries.slice(0, 8).map((e) => (
        <div key={e.id} style={listRow}>
          <span style={{ color: colors.muted }}>{e.entry_date} · <span style={{ color: colors.text }}>{e.category || e.type}</span></span>
          <span style={{ color: e.type === 'income' ? colors.success : colors.danger, fontWeight: 800 }}>{e.type === 'income' ? '+' : '-'}€{Number(e.amount).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
