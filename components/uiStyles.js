export const colors = {
  text: 'var(--text)',
  muted: 'var(--muted)',
  faint: 'var(--faint)',
  panel: 'var(--panel)',
  panelStrong: 'var(--panel-strong)',
  line: 'var(--line)',
  lineStrong: 'var(--line-strong)',
  accent: 'var(--accent)',
  accent2: 'var(--accent-2)',
  danger: 'var(--danger)',
  success: 'var(--success)',
  blue: 'var(--blue)',
  pink: 'var(--pink)',
  lilac: 'var(--lilac)',
  orange: 'var(--orange)',
};

export const shell = {
  width: 'min(100%, 430px)',
  margin: '0 auto',
  padding: '24px 14px 98px',
};

export const card = {
  background: 'var(--panel)',
  border: '2px solid var(--line)',
  borderRadius: 26,
  padding: 18,
  marginBottom: 14,
  boxShadow: 'var(--shadow)',
};

export const cardHeader = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14,
};

export const h3 = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.2,
  letterSpacing: 0,
  color: 'var(--text)',
  fontWeight: 900,
};

export const eyebrow = {
  margin: 0,
  fontSize: 11,
  lineHeight: 1.3,
  textTransform: 'uppercase',
  letterSpacing: 1.4,
  color: 'var(--muted)',
  fontWeight: 900,
};

export const label = {
  fontSize: 12,
  color: 'var(--muted)',
  display: 'block',
  marginBottom: 6,
  fontWeight: 850,
};

export const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 18,
  border: '2px solid var(--line-strong)',
  background: '#ffffff',
  color: 'var(--text)',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontWeight: 750,
};

export const button = (variant = 'primary') => {
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#111111',
      border: '2px solid #111111',
    },
    teal: {
      background: 'var(--accent-2)',
      color: '#111111',
      border: '2px solid #111111',
    },
    danger: {
      background: 'var(--danger)',
      color: '#111111',
      border: '2px solid #111111',
    },
    quiet: {
      background: '#ffffff',
      color: 'var(--text)',
      border: '2px solid #111111',
    },
  };

  return {
    ...variants[variant],
    padding: '11px 16px',
    borderRadius: 999,
    fontWeight: 900,
    cursor: 'pointer',
    minHeight: 46,
    boxShadow: '0 4px 0 rgba(17, 17, 17, 0.16)',
    transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
  };
};

export const listRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '12px 0',
  borderBottom: '2px solid rgba(17, 17, 17, 0.08)',
  fontSize: 13,
};

export const metric = {
  background: '#f6f1ff',
  border: '2px solid var(--line)',
  borderRadius: 22,
  padding: 12,
};
