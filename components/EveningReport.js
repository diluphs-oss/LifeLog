'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, cardHeader, colors, h3 } from './uiStyles';

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
    <div style={{ background: 'linear-gradient(135deg, rgba(216, 166, 74, 0.20), rgba(95, 183, 164, 0.14))', borderRadius: 8, padding: 18, marginBottom: 14, border: '1px solid rgba(216, 166, 74, 0.28)', boxShadow: 'var(--shadow)' }}>
      <div style={cardHeader}>
        <h3 style={h3}>Send today's report?</h3>
        <span style={{ color: colors.accent, fontSize: 12, fontWeight: 800 }}>Evening</span>
      </div>
      <p style={{ fontSize: 13, color: colors.muted, margin: '0 0 12px' }}>Wrap the day into a PDF and send it where you will actually see it.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => buildAndSend(true, false)} style={button('primary')}>Email it</button>
        <button onClick={() => buildAndSend(false, true)} style={button('teal')}>Telegram it</button>
        <button onClick={() => buildAndSend(true, true)} style={button('primary')}>Both</button>
        <button onClick={() => setDismissed(true)} style={button('quiet')}>Not now</button>
      </div>
      {status && <p style={{ fontSize: 12, color: colors.success, margin: '10px 0 0' }}>{status}</p>}
    </div>
  );
}
