'use client';
import { supabase } from '../lib/supabaseClient';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function PdfExport() {
  const generate = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const { data: log } = await supabase.from('daily_log').select('*').eq('log_date', todayStr()).maybeSingle();
    const { data: receipts } = await supabase.from('receipts').select('*').eq('log_date', todayStr());
    const { data: todos } = await supabase.from('todos').select('*').eq('done', false);

    let y = 20;
    const line = (text, size = 11, gap = 8) => {
      doc.setFontSize(size);
      const split = doc.splitTextToSize(text, 170);
      doc.text(split, 20, y);
      y += gap * split.length;
    };

    line(`LifeLog — ${todayStr()}`, 18, 12);
    y += 4;

    line(`Punch in: ${log?.punch_in ? new Date(log.punch_in).toLocaleTimeString() : '—'}`, 12);
    line(`Punch out: ${log?.punch_out ? new Date(log.punch_out).toLocaleTimeString() : '—'}`, 12);
    line(`Woke up at: ${log?.woke_up_at || '—'}`, 12);
    y += 4;

    line('Tasks done:', 13, 8);
    line(log?.tasks || '—');
    y += 2;

    line('Ideas:', 13, 8);
    line(log?.ideas || '—');
    y += 2;

    line('Meals:', 13, 8);
    line(log?.meals || '—');
    y += 2;

    const total = (receipts || []).reduce((s, r) => s + Number(r.amount), 0);
    line(`Lunch receipt total: €${total.toFixed(2)} / €12 allowance`, 12);
    y += 4;

    line('Open to-dos:', 13, 8);
    (todos || []).slice(0, 10).forEach((t) => line(`- ${t.title}`, 11, 6));

    if (log?.notes) {
      y += 4;
      line('Notes:', 13, 8);
      line(log.notes);
    }

    doc.save(`lifelog-${todayStr()}.pdf`);
  };

  return (
    <button onClick={generate} style={btn}>
      Download today's PDF
    </button>
  );
}

const btn = { background: '#2ecc71', border: 'none', color: '#0a0a0a', padding: '12px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', width: '100%' };
