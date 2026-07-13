export default function StickerFace({ color = '#a6f47b', mood = 'happy', size = 52, label }) {
  const eye = {
    position: 'absolute',
    top: size * 0.31,
    width: size * 0.09,
    height: size * 0.09,
    borderRadius: '50%',
    background: '#111',
  };

  const mouth = {
    position: 'absolute',
    left: size * 0.31,
    top: mood === 'sleepy' ? size * 0.58 : size * 0.54,
    width: size * 0.38,
    height: mood === 'angry' ? 0 : size * 0.16,
    borderBottom: mood === 'sad' ? 'none' : '4px solid #111',
    borderTop: mood === 'sad' ? '4px solid #111' : 'none',
    borderRadius: mood === 'neutral' ? 0 : '0 0 999px 999px',
    transform: mood === 'angry' ? 'rotate(-8deg)' : 'none',
    background: mood === 'angry' ? '#111' : 'transparent',
  };

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 6 }}>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: mood === 'angry' ? 14 : '50%',
          background: color,
          border: '2px solid #111',
          transform: mood === 'angry' ? 'rotate(-8deg)' : 'none',
          boxShadow: '0 4px 0 rgba(17,17,17,.14)',
        }}
      >
        <span style={{ ...eye, left: size * 0.29 }} />
        <span style={{ ...eye, right: size * 0.29 }} />
        <span style={mouth} />
      </div>
      {label && <span style={{ fontSize: 11, fontWeight: 900 }}>{label}</span>}
    </div>
  );
}
