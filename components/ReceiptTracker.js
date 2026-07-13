'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, card, cardHeader, colors, h3, inputStyle, metric } from './uiStyles';

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
      <div style={cardHeader}>
        <h3 style={h3}>Lunch Receipt</h3>
        <span style={{ color: over ? colors.danger : colors.success, fontSize: 13, fontWeight: 800 }}>
          {over ? 'Over limit' : 'On track'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input
          type="number"
          step="0.01"
          placeholder="Amount €"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files[0])} style={{ ...inputStyle, color: colors.muted, padding: '9px 10px' }} />
        <button onClick={upload} disabled={uploading} style={{ ...button('primary'), opacity: uploading ? 0.66 : 1 }}>{uploading ? 'Saving...' : 'Add'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        <div style={metric}>
          <div style={{ fontSize: 12, color: colors.muted }}>Today</div>
          <div style={{ color: over ? colors.danger : colors.success, fontSize: 22, fontWeight: 850 }}>€{todayTotal.toFixed(2)} <span style={{ color: colors.faint, fontSize: 13 }}>/ €{DAILY_LIMIT}</span></div>
        </div>
        <div style={metric}>
          <div style={{ fontSize: 12, color: colors.muted }}>This month</div>
          <div style={{ fontSize: 22, fontWeight: 850 }}>€{monthTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
