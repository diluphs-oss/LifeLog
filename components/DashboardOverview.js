'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import StickerFace from './StickerFace';
import { colors } from './uiStyles';

const todayStr = () => new Date().toISOString().slice(0, 10);
const monthKey = () => todayStr().slice(0, 7);

export default function DashboardOverview() {
  const [log, setLog] = useState(null);
  const [todos, setTodos] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [monthLogs, setMonthLogs] = useState([]);

  useEffect(() => {
    (async () => {
      const today = todayStr();
      const monthStart = `${monthKey()}-01`;
      const [logRes, todoRes, receiptRes, monthRes] = await Promise.all([
        supabase.from('daily_log').select('*').eq('log_date', today).maybeSingle(),
        supabase.from('todos').select('*').eq('done', false),
        supabase.from('receipts').select('*').eq('log_date', today),
        supabase.from('daily_log').select('log_date,punch_in,punch_out,tasks,notes').gte('log_date', monthStart),
      ]);

      setLog(logRes.data);
      setTodos(todoRes.data || []);
      setReceipts(receiptRes.data || []);
      setMonthLogs(monthRes.data || []);
    })();
  }, []);

  const lunchTotal = receipts.reduce((sum, item) => sum + Number(item.amount), 0);
  const loggedDays = useMemo(() => new Set(monthLogs.map((item) => item.log_date)), [monthLogs]);
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <>
      <section style={{ background: '#ffffff', border: '2px solid #111', borderRadius: 28, padding: 18, marginBottom: 14, boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: colors.muted, fontWeight: 900 }}>Today, {today.toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
            <h2 style={{ margin: 0, fontSize: 30, lineHeight: 1.02, fontWeight: 950 }}>How are you feeling today?</h2>
          </div>
          <StickerFace color={colors.accent2} mood={log?.punch_in ? 'happy' : 'sleepy'} size={62} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, marginTop: 16 }}>
          <StickerFace color={colors.accent2} mood="happy" size={44} label="Good" />
          <StickerFace color={colors.orange} mood="neutral" size={44} label="Busy" />
          <StickerFace color={colors.blue} mood="sleepy" size={44} label="Slow" />
          <StickerFace color={colors.pink} mood="sad" size={44} label="Tired" />
          <StickerFace color={colors.danger} mood="angry" size={44} label="Stress" />
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 14 }}>
        <SummaryCard title="Clock" value={log?.punch_in ? 'In' : 'Open'} detail={log?.punch_out ? 'Day closed' : 'Ready'} color="#bff7ff" />
        <SummaryCard title="Lunch" value={`€${lunchTotal.toFixed(2)}`} detail="€12 limit" color="#ffe2bf" />
        <SummaryCard title="Tasks" value={String(todos.length)} detail="Open" color="#e6d6ff" />
        <SummaryCard title="Notes" value={log?.notes ? 'Saved' : 'Blank'} detail="Daily log" color="#dfffcf" />
      </section>

      <section style={{ background: '#111', color: '#fff', border: '2px solid #111', borderRadius: 28, padding: 16, marginBottom: 14, boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: '#bdbdbd', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2 }}>Month map</p>
            <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.1 }}>Life calendar</h3>
          </div>
          <span style={{ fontSize: 12, fontWeight: 900 }}>{loggedDays.size}/{daysInMonth}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6 }}>
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const key = `${monthKey()}-${String(day).padStart(2, '0')}`;
            const active = loggedDays.has(key);
            const isToday = day === today.getDate();
            return (
              <div
                key={key}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: 10,
                  display: 'grid',
                  placeItems: 'center',
                  background: active ? colors.accent2 : isToday ? colors.accent : '#2b2b2b',
                  color: active || isToday ? '#111' : '#a9a9a9',
                  fontSize: 12,
                  fontWeight: 950,
                  border: '1px solid rgba(255,255,255,.18)',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function SummaryCard({ title, value, detail, color }) {
  return (
    <div style={{ background: color, border: '2px solid #111', borderRadius: 24, padding: 14, minHeight: 118, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 0 rgba(17,17,17,.08)' }}>
      <div style={{ fontSize: 12, color: colors.muted, fontWeight: 900 }}>{title}</div>
      <div>
        <div style={{ fontSize: 30, lineHeight: 1, fontWeight: 950 }}>{value}</div>
        <div style={{ fontSize: 12, color: colors.muted, fontWeight: 800, marginTop: 4 }}>{detail}</div>
      </div>
    </div>
  );
}
