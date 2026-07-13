'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { button, card, cardHeader, colors, h3, inputStyle, listRow } from './uiStyles';

function SimpleList({ table, title, fields, renderItem }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(Object.fromEntries(fields.map(f => [f.key, ''])));

  const load = async () => {
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form[fields[0].key]) return;
    await supabase.from(table).insert(form);
    setForm(Object.fromEntries(fields.map(f => [f.key, ''])));
    load();
  };

  const remove = async (id) => {
    await supabase.from(table).delete().eq('id', id);
    load();
  };

  return (
    <div style={{ ...card, background: '#ffffff' }}>
      <div style={cardHeader}>
        <h3 style={h3}>{title}</h3>
        <span style={{ color: colors.muted, fontSize: 13 }}>{items.length}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {fields.map((f) => (
          <input
            key={f.key}
            placeholder={f.label}
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            style={{ ...inputStyle, width: f.width || 140 }}
          />
        ))}
        <button onClick={add} style={button('primary')}>Add</button>
      </div>
      {items.map((item) => (
        <div key={item.id} style={listRow}>
          <span style={{ flex: 1 }}>{renderItem(item)}</span>
          <button onClick={() => remove(item.id)} style={{ ...button('quiet'), minHeight: 32, width: 32, padding: 0, color: colors.danger }} aria-label="Delete item">×</button>
        </div>
      ))}
    </div>
  );
}

export default function Extras() {
  return (
    <>
      <SimpleList
        table="wishlist"
        title="Love to Buy (Amazon)"
        fields={[
          { key: 'title', label: 'Item name', width: 160 },
          { key: 'url', label: 'Amazon link', width: 200 },
          { key: 'price', label: 'Price €', width: 80 },
        ]}
        renderItem={(i) => (
          <>
            {i.title} {i.price ? `— €${i.price}` : ''} {i.url && <a href={i.url} target="_blank" rel="noreferrer"> (link)</a>}
          </>
        )}
      />
      <SimpleList
        table="movies"
        title="Movies Watched"
        fields={[
          { key: 'title', label: 'Movie title', width: 200 },
          { key: 'rating', label: 'Rating /10', width: 90 },
        ]}
        renderItem={(i) => `${i.title} ${i.rating ? `— ${i.rating}/10` : ''}`}
      />
      <SimpleList
        table="links"
        title="YouTube / Learning Links"
        fields={[
          { key: 'title', label: 'Title', width: 160 },
          { key: 'url', label: 'URL', width: 220 },
        ]}
        renderItem={(i) => (
          <a href={i.url} target="_blank" rel="noreferrer">{i.title}</a>
        )}
      />
      <SimpleList
        table="documents"
        title="Documents"
        fields={[
          { key: 'title', label: 'Document name', width: 160 },
          { key: 'file_url', label: 'File URL (Drive link)', width: 220 },
          { key: 'category', label: 'Category', width: 100 },
        ]}
        renderItem={(i) => (
          <>{i.title} {i.file_url && <a href={i.file_url} target="_blank" rel="noreferrer"> (open)</a>}</>
        )}
      />
    </>
  );
}
