'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const todayStr = () => new Date().toISOString().slice(0, 10);
const DAILY_LIMIT = 12;

export default function ReceiptTracker() {
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [todayReceipts, setTodayReceipts] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data: today } = await supabase.from('receipts').select('*').eq('log_date', todayStr());
    setTodayReceipts(today || []);

    const monthStart = todayStr().slice(0, 7) + '-01';
    const { data: month } = await supabase.from('receipts').select('amount').gte('log_date', monthStart);
    setMonthTotal((month || []).reduce((s, r) => s + Number(r.amount), 0));
  };

  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!amount) return;
    setUploading(true);
    let photo_url = null;

    if (file) {
      const path = `${todayStr()}-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('receipts').upload(path, file);
      if (!error) {
        const { data: pub } = supabase.storage.from('receipts').getPublicUrl(path);
        photo_url = pub.publicUrl;
      }
    }

    await supabase.from('daily_log').upsert({ log_date: todayStr() }, { onConflict: 'log_date', ignoreDuplicates: true });
    await supabase.from('receipts').insert({ log_date: todayStr(), amount: Number(amount), photo_url });

    setAmount('');
    setFile(null);
    setUploading(false);
    load();
  };

  const todayTotal = todayReceipts.reduce((s, r) => s + Number(r.amount), 0);
  const over = todayTotal > DAILY_LIMIT;

  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 12px' }}>Lunch Receipt</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          type="number"
          step="0.01"
          placeholder="Amount €"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ ...inputStyle, width: 110 }}
        />
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files[0])} style={{ color: '#eee' }} />
        <button onClick={upload} disabled={uploading} style={btn}>{uploading ? 'Saving...' : 'Add'}</button>
      </div>

      <div style={{ fontSize: 14, color: over ? '#f66' : '#8f8' }}>
        Today: €{todayTotal.toFixed(2)} / €{DAILY_LIMIT} {over && '⚠️ over limit'}
      </div>
      <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
        This month: €{monthTotal.toFixed(2)}
      </div>
    </div>
  );
}

const card = { background: '#1a1a2e', borderRadius: 12, padding: 20, marginBottom: 16 };
const inputStyle = { padding: 10, borderRadius: 8, border: '1px solid #333', background: '#0f0f1a', color: '#eee' };
const btn = { background: '#4a86e8', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' };
