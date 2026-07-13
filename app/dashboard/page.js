'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import PunchClock from '../../components/PunchClock';
import DailyLogForm from '../../components/DailyLogForm';
import ReceiptTracker from '../../components/ReceiptTracker';
import TodoList from '../../components/TodoList';
import ExpenseTracker from '../../components/ExpenseTracker';
import Extras from '../../components/Extras';
import PdfExport from '../../components/PdfExport';
import EveningReport from '../../components/EveningReport';
import { button, colors, shell } from '../../components/uiStyles';

const TABS = ['Today', 'Tasks', 'Money', 'Extras'];

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState('Today');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) router.replace('/login');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) router.replace('/login');
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (session === undefined) return null;

  return (
    <main style={shell}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
        <div>
          <p style={{ margin: '0 0 5px', color: colors.accent, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
            Private daily ledger
          </p>
          <h1 style={{ fontSize: 34, lineHeight: 1, margin: 0, letterSpacing: 0, fontWeight: 850 }}>LifeLog</h1>
          <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 14 }}>Today, money, memories, and the small proofs of a life in motion.</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{ ...button('quiet'), minHeight: 38, padding: '8px 12px', flex: '0 0 auto' }}>
          Sign out
        </button>
      </div>

      <EveningReport />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, marginBottom: 14, position: 'sticky', top: 10, zIndex: 3 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 8px',
              borderRadius: 8,
              border: tab === t ? '1px solid rgba(216, 166, 74, 0.55)' : '1px solid var(--line)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: tab === t ? 'rgba(216, 166, 74, 0.18)' : 'rgba(20, 24, 18, 0.82)',
              color: tab === t ? colors.text : colors.muted,
              fontWeight: 750,
              backdropFilter: 'blur(16px)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Today' && (
        <>
          <PunchClock />
          <ReceiptTracker />
          <DailyLogForm />
          <PdfExport />
        </>
      )}
      {tab === 'Tasks' && <TodoList />}
      {tab === 'Money' && <ExpenseTracker />}
      {tab === 'Extras' && <Extras />}
    </main>
  );
}
