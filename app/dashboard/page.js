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
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>LifeLog</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: '1px solid #333', color: '#999', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          Sign out
        </button>
      </div>

      <EveningReport />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: tab === t ? '#4a86e8' : '#1a1a2e', color: '#fff', fontWeight: 600,
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
    </div>
  );
}
