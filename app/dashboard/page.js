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
import DashboardOverview from '../../components/DashboardOverview';
import DesktopStage from '../../components/DesktopStage';
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
    <>
    <DesktopStage />
    <main style={shell}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div>
          <p style={{ margin: '0 0 5px', color: colors.muted, fontSize: 12, fontWeight: 900, letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Welcome back
          </p>
          <h1 style={{ fontSize: 42, lineHeight: 1, margin: 0, letterSpacing: 0, fontWeight: 950 }}>LifeLog</h1>
        </div>
        <button onClick={() => supabase.auth.signOut()} aria-label="Sign out" style={{ ...button('quiet'), minHeight: 48, width: 48, padding: 0, flex: '0 0 auto', borderRadius: '50%', boxShadow: 'none' }}>
          Off
        </button>
      </div>

      <EveningReport />

      {tab === 'Today' && (
        <>
          <DashboardOverview />
          <PunchClock />
          <ReceiptTracker />
          <DailyLogForm />
          <PdfExport />
        </>
      )}
      {tab === 'Tasks' && <TodoList />}
      {tab === 'Money' && <ExpenseTracker />}
      {tab === 'Extras' && <Extras />}

      <nav style={{
        position: 'fixed',
        left: '50%',
        bottom: 14,
        transform: 'translateX(-50%)',
        width: 'min(calc(100% - 28px), 430px)',
        background: '#111',
        border: '2px solid #111',
        borderRadius: 28,
        padding: 6,
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 6,
        boxShadow: '0 10px 30px rgba(17,17,17,.2)',
      }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              minHeight: 46,
              borderRadius: 22,
              border: 'none',
              background: tab === t ? colors.accent : 'transparent',
              color: tab === t ? '#111' : '#fff',
              fontWeight: 950,
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </nav>
    </main>
    </>
  );
}
