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
};

export const shell = {
  width: 'min(100%, 920px)',
  margin: '0 auto',
  padding: '22px 16px 96px',
};

export const card = {
  background: 'linear-gradient(180deg, rgba(36, 40, 31, 0.92), rgba(24, 28, 22, 0.88))',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: 18,
  marginBottom: 14,
  boxShadow: 'var(--shadow)',
  backdropFilter: 'blur(18px)',
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
  fontSize: 15,
  lineHeight: 1.2,
  letterSpacing: 0,
  color: 'var(--text)',
};

export const eyebrow = {
  margin: 0,
  fontSize: 11,
  lineHeight: 1.3,
  textTransform: 'uppercase',
  letterSpacing: 0.9,
  color: 'var(--faint)',
  fontWeight: 700,
};

export const label = {
  fontSize: 12,
  color: 'var(--muted)',
  display: 'block',
  marginBottom: 6,
  fontWeight: 650,
};

export const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 8,
  border: '1px solid var(--line-strong)',
  background: 'rgba(10, 12, 10, 0.52)',
  color: 'var(--text)',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export const button = (variant = 'primary') => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #e0b25d, #c78c32)',
      color: '#17130b',
      border: '1px solid rgba(255, 229, 172, 0.32)',
    },
    teal: {
      background: 'linear-gradient(135deg, #6fcab7, #3c9788)',
      color: '#071613',
      border: '1px solid rgba(169, 255, 237, 0.28)',
    },
    danger: {
      background: 'linear-gradient(135deg, #ea806f, #bd4f43)',
      color: '#190a08',
      border: '1px solid rgba(255, 184, 170, 0.25)',
    },
    quiet: {
      background: 'rgba(255, 255, 255, 0.04)',
      color: 'var(--muted)',
      border: '1px solid var(--line-strong)',
    },
  };

  return {
    ...variants[variant],
    padding: '10px 14px',
    borderRadius: 8,
    fontWeight: 750,
    cursor: 'pointer',
    minHeight: 42,
    transition: 'transform 120ms ease, border-color 120ms ease, opacity 120ms ease',
  };
};

export const listRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 0',
  borderBottom: '1px solid var(--line)',
  fontSize: 13,
};

export const metric = {
  background: 'rgba(255, 255, 255, 0.035)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: 12,
};
