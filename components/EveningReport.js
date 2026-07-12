'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const todayStr = () => new Date().toISOString().slice(0, 10);
const isEvening = () => new Date().getHours() >= 17;

export default function EveningReport() {
  const [status, setStatus] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (!isEvening() || dismissed) return null;

  const buildAndSend = async (sendEmail, sendTelegram) => {
    setStatus('Building PDF...');
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const { data: log } = await supabase.from('daily_log').select('*').eq('log_date', todayStr()).maybeSingle();
    const { data: receipts } = await supabase.from('receipts').select('*').eq('log_date', todayStr());

    let y = 20;
    doc.setFontSize(18); doc.text(`LifeLog — ${todayStr()}`, 20, y); y += 14;
    doc.setFontSize(11);
    doc.text(`Punch in: ${log?.punch_in ? new Date(log.punch_in).toLocaleTimeString() : '-'}`, 20, y); y += 8;
    doc.text(`Punch out: ${log?.punch_out ? new Date(log.punch_out).toLocaleTimeString() : '-'}`, 20, y); y += 8;
    const total = (receipts || []).reduce((s, r) => s + Number(r.amount), 0);
    doc.text(`Lunch total: EUR ${total.toFixed(2)} / EUR 12`, 20, y); y += 12;
    doc.text('Tasks:', 20, y); y += 8;
    doc.text(doc.splitTextToSize(log?.tasks || '-', 170), 20, y);

    const pdfBase64 = doc.output('datauristring').split(',')[1];
    const filename = `lifelog-${todayStr()}.pdf`;

    setStatus('Sending...');
    const res = await fetch('/api/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, filename, sendEmail, sendTelegram }),
    });
    const data = await res.json();
    setStatus(`Done: ${JSON.stringify(data)}`);
  };

  return (
    <div style={{ background: '#26264a', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid #4a4a8a' }}>
      <h3 style={{ margin: '0 0 8px' }}>Send today's report?</h3>
      <p style={{ fontSize: 13, color: '#bbb', margin: '0 0 12px' }}>It's evening — want me to send today's PDF log?</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => buildAndSend(true, false)} style={btn}>Email it</button>
        <button onClick={() => buildAndSend(false, true)} style={btn}>Telegram it</button>
        <button onClick={() => buildAndSend(true, true)} style={btn}>Both</button>
        <button onClick={() => setDismissed(true)} style={{ ...btn, background: '#333' }}>Not now</button>
      </div>
      {status && <p style={{ fontSize: 12, color: '#8f8', marginTop: 10 }}>{status}</p>}
    </div>
  );
}

const btn = { background: '#4a86e8', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' };
